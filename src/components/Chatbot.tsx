import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { callChatbot } from "@/integrations/firebase/data";

// Tipe data untuk pesan
interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Assalamu'alaikum! Saya asisten AI resmi PC IPNU IPPNU Kota Bekasi. Ada yang bisa saya bantu hari ini?",
      sender: "ai",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll ke bawah setiap ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    // 1. Tambahkan pesan user ke UI
    const userMsg: Message = { id: Date.now().toString(), text: textToSend, sender: "user" };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // 2. Format riwayat chat untuk dikirim ke Edge Function lu
      // (Backend lu minta array of {role, content})
      const apiMessages = newMessages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      // 3. Panggil Firebase Function 'chatbot'
      const data = await callChatbot(apiMessages);

      // 4. Tangkap balasan dari AI
      if (data && data.reply) {
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), text: data.reply, sender: "ai" },
        ]);
      } else if (data && data.error) {
        // Kalau kena rate limit / kuota habis dari backend lu
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), text: data.error, sender: "ai" },
        ]);
      }
    } catch (err) {
      console.error("Error memanggil AI:", err);
      setMessages((prev) => [
        ...prev,
        { 
          id: (Date.now() + 1).toString(), 
          text: "Maaf, sistem AI kami sedang sibuk atau ada gangguan jaringan. Silakan hubungi kami via WhatsApp di 0895330152658.", 
          sender: "ai" 
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Kotak Chat */}
      {isOpen && (
        <div className="bg-white rounded-xl shadow-2xl w-[320px] sm:w-[380px] h-[500px] flex flex-col mb-4 border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6" />
              <div>
                <h3 className="font-bold text-sm">Asisten AI IPNU IPPNU</h3>
                <p className="text-[10px] text-primary-foreground/80">
                  {isLoading ? "Sedang mengetik..." : "Online"}
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-black/20 p-1 rounded-full transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Area Pesan */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 max-w-[85%] ${msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === "user" ? "bg-primary/20 text-primary" : "bg-gold text-white"}`}>
                  {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`p-3 rounded-2xl text-sm shadow-sm ${msg.sender === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-white border border-gray-100 text-gray-800 rounded-tl-none whitespace-pre-wrap"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Animasi Loading kalau AI lagi mikir */}
            {isLoading && (
              <div className="flex gap-2 max-w-[85%] self-start">
                <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-gold text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="p-3 rounded-2xl text-sm shadow-sm bg-white border border-gray-100 text-gray-800 rounded-tl-none flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  <span className="text-gray-400 text-xs">AI sedang memikirkan jawaban...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* FAQ Buttons (Quick Replies) */}
          <div className="px-3 pt-2 pb-1 bg-white border-t border-gray-100">
            <p className="text-[10px] text-gray-400 mb-1.5 ml-1">Pertanyaan sering diajukan:</p>
            <div className="flex flex-wrap gap-1.5">
              <button 
                onClick={() => handleSend("Bagaimana cara daftar anggota IPNU IPPNU?")}
                disabled={isLoading}
                className="text-[11px] bg-primary/10 text-primary px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors border border-primary/20 disabled:opacity-50"
              >
                Cara Daftar Anggota
              </button>
              <button 
                onClick={() => handleSend("Dimana lokasi sekretariat PC IPNU IPPNU Kota Bekasi?")}
                disabled={isLoading}
                className="text-[11px] bg-primary/10 text-primary px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors border border-primary/20 disabled:opacity-50"
              >
                Lokasi Sekretariat
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                placeholder="Ketik pesan..."
                className="flex-1 bg-gray-100 text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="bg-primary text-primary-foreground h-10 w-10 rounded-full flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition"
              >
                <Send className="h-4 w-4 -ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tombol Floating untuk Buka Chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gold text-white h-14 w-14 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform hover:shadow-gold/50 hover:shadow-2xl"
        >
          <MessageCircle className="h-7 w-7" />
        </button>
      )}
    </div>
  );
};
