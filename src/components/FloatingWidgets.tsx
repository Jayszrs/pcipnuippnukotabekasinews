import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Loader2 } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const WELCOME: Msg = {
  role: "assistant",
  content: `Assalamu'alaikum! Saya asisten AI ${SITE_CONFIG.organizationName}. Tanyakan tentang berita, kegiatan, atau organisasi kami. Untuk keluhan/saran lebih lanjut, silakan klik tombol WhatsApp.`,
};

export const FloatingWidgets = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const waUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(SITE_CONFIG.whatsappGreeting)}`;

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chatbot", {
        body: { messages: next },
      });
      if (error) throw error;
      if (data?.error) {
        if (data.error.includes("Rate")) {
          toast.error("Terlalu banyak permintaan, coba lagi sebentar.");
        } else if (data.error.includes("Payment")) {
          toast.error("Kuota AI habis. Silakan hubungi admin via WhatsApp.");
        } else {
          toast.error(data.error);
        }
        setMessages((m) => [...m, { role: "assistant", content: "Maaf, ada gangguan. Silakan coba lagi atau hubungi kami via WhatsApp." }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "..." }]);
      }
    } catch (e) {
      console.error(e);
      setMessages((m) => [...m, { role: "assistant", content: "Maaf, gagal menghubungi asisten. Silakan coba lagi atau hubungi kami via WhatsApp." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating buttons */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 items-end">
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            aria-label="Buka chatbot"
            className="h-14 w-14 rounded-full gradient-primary text-primary-foreground shadow-elevated flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Bot className="h-6 w-6" />
          </button>
        )}
        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat WhatsApp"
          className="h-14 w-14 rounded-full bg-[#25D366] text-white shadow-elevated flex items-center justify-center hover:scale-110 transition-transform"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      </div>

      {/* Chat panel */}
      {chatOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm h-[70vh] max-h-[560px] bg-background border border-border rounded-lg shadow-elevated flex flex-col overflow-hidden">
          <div className="gradient-primary text-primary-foreground p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-gold flex items-center justify-center">
                <Bot className="h-5 w-5 text-gold-foreground" />
              </div>
              <div>
                <div className="font-display font-bold text-sm">Asisten AI</div>
                <div className="text-[11px] text-primary-foreground/80">Customer Service · Online</div>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center"
              aria-label="Tutup"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-background border border-border rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-background border border-border rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-border bg-background">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="block text-center text-[11px] text-muted-foreground mb-2 hover:text-primary"
            >
              Butuh bantuan langsung? <span className="font-bold text-[#25D366]">Chat WhatsApp →</span>
            </a>
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tulis pesan..."
                disabled={loading}
                className="flex-1 px-3.5 py-2.5 rounded-full border border-input bg-muted focus:outline-none focus:ring-2 focus:ring-primary text-sm disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="h-10 w-10 rounded-full gradient-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:opacity-90 transition-opacity shrink-0"
                aria-label="Kirim"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
