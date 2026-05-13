type NewsletterRecipient = {
  email: string;
};

const SITE_NAME = "PC IPNU IPPNU Kota Bekasi";
const BOOTSTRAP_ADMIN_EMAIL = "jaelanisuryasaputra@gmail.com";

const json = (res: any, status: number, payload: Record<string, unknown>) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res.status(status).json(payload);
};

const parseBody = (body: unknown) => {
  if (typeof body === "string") return JSON.parse(body || "{}");
  return body && typeof body === "object" ? body : {};
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const uniqueEmails = (value: unknown) => {
  if (!Array.isArray(value)) return [];

  return [
    ...new Set(
      value
        .map((item) => String((item as NewsletterRecipient)?.email || item || "").trim().toLowerCase())
        .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
    ),
  ].slice(0, 500);
};

const verifyFirebaseUser = async (authorizationHeader: string | undefined) => {
  const token = authorizationHeader?.replace(/^Bearer\s+/i, "");
  const firebaseApiKey = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY;

  if (!token || !firebaseApiKey) {
    throw new Error("Token login tidak valid.");
  }

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token }),
  });
  const result = await response.json();

  if (!response.ok || !Array.isArray(result.users) || result.users.length === 0) {
    throw new Error("Sesi login tidak valid.");
  }

  return { token, user: result.users[0] };
};

const readUserRole = async (token: string, uid: string) => {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
  if (!projectId) return null;

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/user_roles/${uid}`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

  if (!response.ok) return null;
  const data = await response.json();
  return data?.fields?.role?.stringValue || null;
};

const requireEditor = async (authorizationHeader: string | undefined) => {
  const { token, user } = await verifyFirebaseUser(authorizationHeader);
  const email = String(user.email || "").toLowerCase();
  if (email === BOOTSTRAP_ADMIN_EMAIL) return;

  const role = await readUserRole(token, user.localId);
  if (role !== "admin" && role !== "editor") {
    throw new Error("Akses pengiriman email ditolak.");
  }
};

const buildEmailHtml = ({ title, message, actionUrl }: { title: string; message: string; actionUrl?: string }) => {
  const safeTitle = escapeHtml(title);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const safeActionUrl = actionUrl ? escapeHtml(actionUrl) : "";

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f5f7f5;font-family:Arial,sans-serif;color:#132016;">
    <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;">${safeTitle}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7f5;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid #dde6dd;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:#06451d;padding:26px 28px;color:#ffffff;">
                <div style="font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#ffd700;">Notifikasi Berita</div>
                <h1 style="margin:10px 0 0;font-size:24px;line-height:1.25;color:#ffffff;">${safeTitle}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;font-size:15px;line-height:1.75;color:#25352a;">
                <p style="margin:0 0 20px;">${safeMessage}</p>
                ${
                  safeActionUrl
                    ? `<p style="margin:26px 0;"><a href="${safeActionUrl}" style="display:inline-block;background:#0b6623;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:8px;">Buka Berita</a></p>`
                    : ""
                }
                <p style="margin:28px 0 0;color:#66736a;font-size:12px;">Email ini dikirim karena Anda berlangganan notifikasi ${SITE_NAME}.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

const sendEmail = async (recipient: string, subject: string, html: string, text: string) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NEWSLETTER_FROM_EMAIL || process.env.RESEND_FROM_EMAIL;
  const replyTo = process.env.NEWSLETTER_REPLY_TO || from;

  if (!apiKey) throw new Error("RESEND_API_KEY belum diisi di environment server.");
  if (!from) throw new Error("NEWSLETTER_FROM_EMAIL belum diisi di environment server.");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: recipient,
      reply_to: replyTo,
      subject,
      html,
      text,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const message = data?.message || data?.error?.message || data?.error || `HTTP ${response.status}`;
    throw new Error(String(message));
  }

  return data?.id;
};

export default async function handler(req: any, res: any) {
  if (req.method === "OPTIONS") return json(res, 204, {});

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return json(res, 405, { error: "Method not allowed" });
  }

  try {
    await requireEditor(req.headers.authorization);

    const body = parseBody(req.body);
    const recipients = uniqueEmails(body.recipients);
    const subject = String(body.subject || "").trim().slice(0, 140);
    const message = String(body.message || "").trim().slice(0, 4000);
    const actionUrl = String(body.actionUrl || "").trim().slice(0, 500);

    if (!recipients.length) return json(res, 400, { error: "Daftar penerima kosong." });
    if (!subject) return json(res, 400, { error: "Subjek email wajib diisi." });
    if (!message) return json(res, 400, { error: "Isi pesan email wajib diisi." });

    const html = buildEmailHtml({ title: subject, message, actionUrl });
    const text = `${subject}\n\n${message}${actionUrl ? `\n\nBuka berita: ${actionUrl}` : ""}`;

    const sent: string[] = [];
    const failed: Array<{ email: string; error: string }> = [];

    for (const recipient of recipients) {
      try {
        await sendEmail(recipient, subject, html, text);
        sent.push(recipient);
      } catch (error) {
        failed.push({ email: recipient, error: error instanceof Error ? error.message : "Gagal mengirim email." });
      }
    }

    return json(res, failed.length ? 207 : 200, {
      sent: sent.length,
      failed: failed.length,
      failures: failed.slice(0, 10),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengirim newsletter.";
    return json(res, 400, { error: message });
  }
}
