type ChatRole = "system" | "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type ChatProvider = "auto" | "gemini" | "openai" | "copilot";

type ProviderResult = {
  provider: Exclude<ChatProvider, "auto">;
  model: string;
  reply: string;
};

const SYSTEM_PROMPT = [
  "Anda adalah AI Rekan Pelajar, asisten resmi PC IPNU IPPNU Kota Bekasi.",
  "Gunakan bahasa Indonesia yang ramah, sopan, jelas, dan mudah dipahami pelajar.",
  "Bantu pertanyaan umum, belajar, koding, dan informasi organisasi IPNU IPPNU.",
  "Untuk informasi resmi yang belum pasti, jelaskan bahwa pengguna sebaiknya konfirmasi ke pengurus atau WhatsApp admin.",
  "Jangan mengarang data sensitif, nomor rekening, keputusan organisasi, atau jadwal resmi jika tidak ada di percakapan.",
].join("\n");

const FALLBACK_ERROR =
  "Maaf, layanan AI belum aktif. Admin perlu mengisi API key Gemini, OpenAI, atau GitHub Models di environment server.";

const PROVIDERS: Array<Exclude<ChatProvider, "auto">> = ["gemini", "openai", "copilot"];

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

const sanitizeMessages = (value: unknown): ChatMessage[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const role = item?.role === "assistant" || item?.role === "system" ? item.role : "user";
      const content = String(item?.content || "").trim().slice(0, 4000);
      return content ? { role, content } : null;
    })
    .filter(Boolean)
    .slice(-14) as ChatMessage[];
};

const providerOrder = (provider: ChatProvider) => {
  if (provider !== "auto") return [provider];

  const configuredOrder = (process.env.CHATBOT_PROVIDER_ORDER || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item): item is Exclude<ChatProvider, "auto"> => PROVIDERS.includes(item as Exclude<ChatProvider, "auto">));

  return configuredOrder.length ? configuredOrder : PROVIDERS;
};

const fetchJson = async (url: string, init: RequestInit, timeoutMs = 30000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      const message = data?.error?.message || data?.error || data?.message || `HTTP ${response.status}`;
      throw new Error(String(message));
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
};

const textFromOpenAi = (content: unknown) => {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part?.text === "string" ? part.text : ""))
      .filter(Boolean)
      .join("\n")
      .trim();
  }
  return "";
};

const callOpenAi = async (messages: ChatMessage[]): Promise<ProviderResult> => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY belum diisi.");

  const model = process.env.OPENAI_MODEL || "chat-latest";
  const data = await fetchJson("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.4,
      max_completion_tokens: 900,
    }),
  });

  const reply = textFromOpenAi(data?.choices?.[0]?.message?.content);
  if (!reply) throw new Error("OpenAI tidak mengembalikan jawaban.");

  return { provider: "openai", model, reply };
};

const callGemini = async (messages: ChatMessage[]): Promise<ProviderResult> => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY belum diisi.");

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const contents = messages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

  const data = await fetchJson(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 900,
        },
      }),
    },
  );

  const reply = data?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text || "")
    .filter(Boolean)
    .join("\n")
    .trim();

  if (!reply) throw new Error("Gemini tidak mengembalikan jawaban.");

  return { provider: "gemini", model, reply };
};

const callCopilot = async (messages: ChatMessage[]): Promise<ProviderResult> => {
  const token = process.env.GITHUB_MODELS_TOKEN || process.env.COPILOT_API_KEY;
  if (!token) throw new Error("GITHUB_MODELS_TOKEN belum diisi.");

  const model = process.env.COPILOT_MODEL || process.env.GITHUB_MODELS_MODEL || "openai/gpt-4.1";
  const data = await fetchJson("https://models.github.ai/inference/chat/completions", {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2026-03-10",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.4,
      max_tokens: 900,
    }),
  });

  const reply = textFromOpenAi(data?.choices?.[0]?.message?.content);
  if (!reply) throw new Error("GitHub Models tidak mengembalikan jawaban.");

  return { provider: "copilot", model, reply };
};

const callProvider = (provider: Exclude<ChatProvider, "auto">, messages: ChatMessage[]) => {
  if (provider === "gemini") return callGemini(messages);
  if (provider === "openai") return callOpenAi(messages);
  return callCopilot(messages);
};

export default async function handler(req: any, res: any) {
  if (req.method === "OPTIONS") return json(res, 204, {});

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return json(res, 405, { error: "Method not allowed" });
  }

  const body = parseBody(req.body);
  const messages = sanitizeMessages(body.messages);
  const requestedProvider = String(body.provider || process.env.CHATBOT_PROVIDER || "auto").toLowerCase() as ChatProvider;
  const provider = requestedProvider && ["auto", ...PROVIDERS].includes(requestedProvider) ? requestedProvider : "auto";

  if (!messages.length) {
    return json(res, 400, { error: "Pesan chat kosong." });
  }

  const errors: string[] = [];

  for (const candidate of providerOrder(provider)) {
    try {
      const result = await callProvider(candidate, messages);
      return json(res, 200, result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Provider gagal dipanggil.";
      errors.push(`${candidate}: ${message}`);
    }
  }

  console.error("Chatbot provider errors:", errors);
  return json(res, 503, { error: FALLBACK_ERROR });
}
