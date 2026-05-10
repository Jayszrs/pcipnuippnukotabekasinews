import crypto from "node:crypto";

type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

const parseCloudinaryUrl = () => {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  if (!cloudinaryUrl) return {};

  try {
    const parsed = new URL(cloudinaryUrl);
    return {
      cloudName: parsed.hostname,
      apiKey: decodeURIComponent(parsed.username),
      apiSecret: decodeURIComponent(parsed.password),
    };
  } catch {
    return {};
  }
};

const getCloudinaryConfig = (): CloudinaryConfig => {
  const parsed = parseCloudinaryUrl();
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME || parsed.cloudName;
  const apiKey = process.env.CLOUDINARY_API_KEY || process.env.VITE_CLOUDINARY_API_KEY || parsed.apiKey;
  const apiSecret = process.env.CLOUDINARY_API_SECRET || parsed.apiSecret;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment belum lengkap.");
  }

  return { cloudName, apiKey, apiSecret };
};

const sanitizePath = (value: unknown, fallback: string) => {
  const input = String(value || fallback).replace(/\\/g, "/");
  const segments = input
    .split("/")
    .map((segment) =>
      segment
        .normalize("NFKD")
        .replace(/[^\w.-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80),
    )
    .filter(Boolean);

  return segments.length ? segments.join("/") : fallback;
};

const signParams = (params: Record<string, string | number>, apiSecret: string) => {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto.createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
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

  return result.users[0];
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await verifyFirebaseUser(req.headers.authorization);

    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const config = getCloudinaryConfig();
    const timestamp = Math.round(Date.now() / 1000);
    const folder = sanitizePath(body.folder, "ipnu-ippnu-bekasi/uploads");
    const publicId = sanitizePath(body.publicId, `${timestamp}`);
    const uploadParams = {
      folder,
      overwrite: "true",
      public_id: publicId,
      timestamp,
    };

    return res.status(200).json({
      apiKey: config.apiKey,
      cloudName: config.cloudName,
      folder,
      publicId,
      signature: signParams(uploadParams, config.apiSecret),
      timestamp,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal membuat signature Cloudinary.";
    return res.status(401).json({ error: message });
  }
}
