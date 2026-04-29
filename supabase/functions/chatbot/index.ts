// Edge function: chatbot (AI customer service)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Kamu adalah asisten AI customer service resmi PC IPNU IPPNU Kota Bekasi (Pimpinan Cabang Ikatan Pelajar Nahdlatul Ulama dan Ikatan Pelajar Putri Nahdlatul Ulama Kota Bekasi).

Aturan:
- Jawab dalam Bahasa Indonesia yang ramah, sopan, dan singkat (maksimal 4-5 kalimat).
- Mulai sapaan pertama (jika user belum disapa) dengan "Assalamu'alaikum".
- Jika user bertanya tentang berita, arahkan untuk membuka beranda website atau halaman kategori.
- Jika user mengajukan keluhan, kritik, atau saran serius, sarankan menghubungi customer service via tombol WhatsApp di pojok kanan bawah.
- Jangan mengarang fakta. Jika tidak tahu, akui dengan jujur dan sarankan menghubungi admin via WhatsApp.
- Jangan memberikan opini politik kontroversial.
- Topik yang relevan: kegiatan IPNU IPPNU Bekasi, organisasi NU, info pelajar, kaderisasi, cara bergabung, dan informasi umum.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.slice(-12), // limit context
        ],
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded, coba sebentar lagi." }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "Payment required, kuota habis." }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content ?? "Maaf, saya belum bisa menjawab.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chatbot error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
