import { useState, useEffect, useRef } from "react";
import { 
  Bot, MessageSquare, X, Send, Loader2, Sparkles, 
  RotateCcw, User, Phone, Check, Award, BookOpen, MapPin, Heart
} from "lucide-react";
import { callChatbot } from "@/integrations/firebase/data";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export const FloatingWidgets = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      sender: "ai",
      text: "Assalamualaikum, Rekan & Rekanwati! 🌟\n\nGue **AI Rekan Pelajar**, asisten pintar siap bantu jawab apa saja! Selain info organisasi **IPNU IPPNU**, gue juga bisa bantu lu belajar koding, ngerjain tugas sekolah, diskusi sejarah, atau hal umum lainnya. \n\nAda yang bisa gue bantu hari ini?",
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll ke pesan paling baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Nomor WA Lu yang Baru (Sesuai request)
  const myWhatsAppNumber = "62895330152658"; 
  const waUrl = `https://wa.me/${myWhatsAppNumber}?text=Halo%20Admin%20PC%20IPNU%20IPPNU%20Kota%20Bekasi%2C%20saya%20ingin%20bertanya%20mengenai...`;

  // --- LOGIKA UTAMA AI REKAN PELAJAR (INTELLIGENT KNOWLEDGE BASE) ---
  const generateAiResponse = (userQuery: string): string => {
    const q = userQuery.toLowerCase().trim();

    // 1. Sapaan & Obrolan Santai
    if (q.match(/(halo|hai|hi|p|oy|halo ai|helo|permisi)/)) {
      return "Hai juga, Rekan/Rekanwati! 👋 Senang bisa ngobrol sama lu. Ada tugas sekolah, pertanyaan organisasi, atau hal seru apa nih yang mau kita bahas sekarang?";
    }
    if (q.match(/(assalamualaikum|assalamu'alaikum|shalom|salam)/)) {
      return "Wa'alaikumsalam Warahmatullahi Wabarakatuh! 🙏 Salam sejahtera buat kita semua. Semoga hari lu menyenangkan! Ada hal apa nih yang bisa gue bantu hari ini?";
    }
    if (q.match(/(makasih|terima kasih|thanks|thank you|syukron)/)) {
      return "Sama-sama! Senang banget bisa bantu lu. Jangan ragu buat tanya-tanya hal lain ya, kuncinya tetap: **Belajar, Berjuang, Bertaqwa!** 🚀";
    }
    if (q.match(/(siapa dirimu|siapa kamu|kamu siapa|namamu)/)) {
      return "Gue adalah **AI Rekan Pelajar**, asisten virtual pintar PC IPNU IPPNU Kota Bekasi. Tugas gue adalah membantu pelajar, santri, dan masyarakat umum buat nyari informasi, belajar materi sekolah, diskusi IT/coding, atau sekadar tanya jawab seru!";
    }

    // 2. Kategori Pertanyaan IPNU / IPPNU Kota Bekasi
    if (q.includes("sejarah ipnu") || q.includes("sejarah ippnu") || q.includes("kapan berdiri")) {
      return "**Sejarah Singkat IPNU & IPPNU:**\n\n" +
        "🌿 **IPNU** didirikan pada **24 Februari 1954 (20 Jumadil Akhir 1373 H)** di Semarang saat Kongres LP Ma'arif NU. Salah satu tokoh pendirinya yang legendaris adalah Prof. Dr. KH. Tolchah Mansyur.\n\n" +
        "🌸 **IPPNU** didirikan pada **2 Maret 1955 (8 Rajab 1374 H)** di Solo, Jawa Tengah, dipelopori oleh tokoh santriwati hebat seperti Nyai Hj. Umroh Mahfudzah.\n\n" +
        "Kedua organisasi ini sekarang tegak berdiri sebagai Badan Otonom (Banom) resmi di bawah naungan Nahdlatul Ulama yang fokus membina pelajar, santri, dan remaja muda.";
    }
    if (q.includes("cara gabung") || q.includes("daftar anggota") || q.includes("kaderisasi") || q.includes("masuk ipnu")) {
      return "Wah, keputusan terbaik kalau lu mau gabung! Cara daftarnya gampang banget:\n\n" +
        "1. **Isi Formulir:** Lu bisa daftar langsung lewat halaman admin di website ini, atau hubungi PAC (Pimpinan Anak Cabang) di kecamatan terdekat lu.\n" +
        "2. **Ikut MAKESTA:** Pintu gerbang utama menjadi kader resmi adalah dengan mengikuti **MAKESTA** (Masa Kesetiaan Anggota) yang sering diadakan di tiap wilayah.\n\n" +
        "Mau langsung dikoordinasikan dengan pengurus kecamatan lu? Klik aja **tombol WhatsApp** di bawah obrolan ini, nanti biar langsung dihubungkan ya!";
    }
    if (q.includes("visi") || q.includes("misi") || q.includes("tujuan")) {
      return "**Visi Perjuangan PC IPNU IPPNU Kota Bekasi:**\n\n" +
        "Terwujudnya kader pelajar, santri, dan mahasiswa NU Kota Bekasi yang bertakwa kepada Allah SWT, berakhlakul karimah, unggul dalam intelektualitas, tangguh dalam organisasi, serta setia menjaga kedaulatan paham Aswaja dan NKRI.\n\n" +
        "**Misi Kami:**\n" +
        "• Membangun basis kaderisasi di sekolah, pesantren, dan kampus.\n" +
        "• Mendorong melek literasi teknologi dan cyber security bagi pemuda NU.\n" +
        "• Mengawal dakwah Islam yang ramah, santun, dan moderat.";
    }
    if (q.includes("alamat") || q.includes("sekretariat") || q.includes("kantor") || q.includes("lokasi")) {
      return "Kantor Sekretariat Bersama **PC IPNU IPPNU Kota Bekasi** berlokasi di:\n\n" +
        "📍 **Gedung PCNU Kota Bekasi**\n" +
        "Jl. Veteran, RT.005/RW.003, Marga Jaya, Kec. Bekasi Selatan, Kota Bekasi, Jawa Barat 17141.\n\n" +
        "Main-main ke sini yuk! Kita ngopi dan diskusi bareng pengurus harian lainnya.";
    }

    // 3. LOGIKA DETEKSI TANYA UMUM (Hal-hal di luar IPNU)
    if (q.match(/(koding|coding|html|css|javascript|react|php|database|sql|it|komputer|python)/)) {
      return "Wah, lu suka dunia IT juga? Tos dulu kita! 💻 Sebagai asisten yang juga mengerti pemrograman, ini sedikit tips buat lu:\n\n" +
        "• **HTML & CSS:** Kerangka dan hiasan utama web. Wajib khatam ini dulu.\n" +
        "• **Javascript/React.js:** Untuk bikin web lu interaktif, kayak sistem chat kita sekarang.\n" +
        "• **Database (Supabase/MySQL):** Tempat nyimpen data berita atau biodata pengurus.\n\n" +
        "Ada error kodingan atau logika program spesifik yang mau lu tanyakan? Tulis aja kodenya di sini, mari kita pecahkan bareng!";
    }
    if (q.match(/(tugas|sekolah|matematika|fisika|belajar|sejarah|ipa|ips|rumus|ujian|pr)/)) {
      return "Siap, asisten belajar lu siap membantu! 📚\n\n" +
        "Mau bahas materi sekolah atau mata kuliah apa nih? Apakah matematika dasar, rumus fisika, fakta sejarah Indonesia, atau butuh bantuan nulis artikel opini?\n\n" +
        "Coba jabarkan pertanyaan tugas lu secara detail di bawah, nanti kita bedah langkah-langkah penyelesaiannya bareng-bareng ya!";
    }
    if (q.match(/(puisi|pantun|buatkan|tuliskan)/)) {
      return "Sip! Ini sebuah pantun penyemangat khusus buat lu yang lagi berjuang:\n\n" +
        "*Pergi ke pasar beli kelapa,*\n" +
        "*Kelapa dikupas harum baunya.*\n" +
        "*Belajar berjuang dan bertaqwa,*\n" +
        "*Pelajar Bekasi pasti berjaya!* 💚⚡\n\n" +
        "Butuh dibuatkan puisi atau artikel dengan tema tertentu? Tulis aja ide pokoknya!";
    }
    if (q.match(/(curhat|pusing|lelah|stres|capek)/)) {
      return "Tarik napas dalam-dalam dulu, kawan... 🌿 Hidup sebagai pelajar atau mahasiswa emang kadang sepadat itu jadwalnya. Wajar banget kalau lu ngerasa capek.\n\n" +
        "Ingat, lu gak sendirian. Istirahat sejenak itu perlu. Jangan lupa ibadah, minum air putih, dan kalau butuh temen ngobrol, tumpahkan aja curhatan lu di sini. Gue siap dengerin kok!";
    }

    // 4. SMART DYNAMIC FALLBACK (Untuk Semua Pertanyaan Bebas Lainnya)
    return `Wah, pertanyaan lu tentang **"${userQuery}"** menarik banget nih! 🚀\n\n` +
      "Sebagai AI Rekan Pelajar yang serba bisa, gue siap banget bantu diskusiin hal ini bareng lu. Biar lebih terarah, coba lu spesifikasikan lagi:\n\n" +
      "• Apakah ini berkaitan dengan **tugas akademik** sekolah/kampus?\n" +
      "• Ataukah lu butuh bantuan membuat **konsep kodingan / logika pemograman**?\n" +
      "• Atau lu mau nanya soal program kerja dan silaturahmi kader di Bekasi?\n\n" +
      "Coba tanyakan lagi secara detail, kawan. Asisten belajar lu siap stand-by menjawab!";
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isThinking) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsThinking(true);

    try {
      const apiMessages = [...messages, userMsg].map((message) => ({
        role: message.sender === "user" ? "user" : "assistant",
        content: message.text,
      }));
      const response = await callChatbot(apiMessages);
      const aiReplyText = response.reply || response.error || generateAiResponse(text);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiReplyText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Gagal memanggil Firebase chatbot:", error);
      toast.warning("Chatbot Firebase belum aktif, memakai jawaban lokal sementara.");
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: generateAiResponse(text),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const clearChat = () => {
    if (window.confirm("Bersihkan seluruh riwayat obrolan?")) {
      setMessages([
        {
          id: "init-reset",
          sender: "ai",
          text: "Obrolan dibersihkan! 🧹\n\nAda materi pelajaran, tugas koding, atau info struktural IPNU IPPNU apa lagi nih yang mau kita bahas sekarang?",
          timestamp: new Date(),
        }
      ]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[1000] flex flex-col gap-3 items-end">
      
      {/* ================= CHAT DIALOG BOX (MAIN CHAT WINDOW) ================= */}
      {isOpen && (
        <div className="w-[320px] sm:w-[380px] h-[480px] sm:h-[550px] bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500 relative">
          
          {/* Header Chatbox */}
          <div className="bg-gradient-to-r from-[#03441b] to-[#022c12] text-white p-5 flex items-center justify-between border-b relative">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gold text-gold-foreground rounded-2xl shadow-lg border border-gold/20 animate-pulse">
                <Bot className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h3 className="font-brand font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                  AI Rekan Pelajar <Sparkles className="h-3 w-3 text-gold" />
                </h3>
                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest block mt-0.5 animate-pulse">● Online & Aktif</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={clearChat} 
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                title="Reset Chat"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Area Pesan Chat (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50 no-scrollbar">
            {messages.map((msg) => {
              const isAi = msg.sender === "ai";
              return (
                <div key={msg.id} className={`flex gap-2.5 ${isAi ? "justify-start" : "justify-end"}`}>
                  
                  {isAi && (
                    <div className="h-7 w-7 rounded-full bg-emerald-100 text-primary flex items-center justify-center shrink-0 border border-emerald-200/50">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}

                  <div className={`p-4 rounded-3xl max-w-[80%] text-xs leading-relaxed font-semibold shadow-sm border ${
                    isAi 
                      ? "bg-white text-slate-800 rounded-tl-none border-slate-100" 
                      : "bg-[#03441b] text-white rounded-tr-none border-emerald-900"
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className={`text-[8px] font-bold block text-right mt-1.5 ${isAi ? "text-slate-400" : "text-white/60"}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {!isAi && (
                    <div className="h-7 w-7 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0 border border-gold/20">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}

                </div>
              );
            })}

            {/* AI Sedang Berpikir Loader */}
            {isThinking && (
              <div className="flex gap-2.5 justify-start">
                <div className="h-7 w-7 rounded-full bg-emerald-100 text-primary flex items-center justify-center shrink-0 border">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="p-3.5 bg-white rounded-3xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-1.5">
                  <span className="h-2 w-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick reply chips */}
          <div className="px-5 py-2.5 bg-white border-t border-slate-50 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
            <button onClick={() => handleSendMessage("Sejarah IPNU IPPNU")} className="px-3 py-1.5 bg-slate-50 hover:bg-primary/5 hover:text-primary rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 transition-colors border">Sejarah 🌿</button>
            <button onClick={() => handleSendMessage("Cara Gabung Anggota")} className="px-3 py-1.5 bg-slate-50 hover:bg-primary/5 hover:text-primary rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 transition-colors border">Gabung ✨</button>
            <button onClick={() => handleSendMessage("Ajarin saya koding React.js")} className="px-3 py-1.5 bg-slate-50 hover:bg-primary/5 hover:text-primary rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 transition-colors border">Belajar Coding 💻</button>
            <button onClick={() => handleSendMessage("Bantu ngerjain tugas sekolah")} className="px-3 py-1.5 bg-slate-50 hover:bg-primary/5 hover:text-primary rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 transition-colors border">Tugas Sekolah 📚</button>
          </div>

          {/* Input Chat Box */}
          <div className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ketik pertanyaan / tugas kamu..."
              className="flex-1 px-4 py-3 bg-slate-50 rounded-2xl text-xs font-bold border-none outline-none focus:bg-white focus:ring-1 focus:ring-primary transition-all"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-3 bg-[#03441b] hover:bg-emerald-900 text-white rounded-2xl disabled:opacity-40 transition-all shadow-md active:scale-95 shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

        </div>
      )}

      {/* ================= BUTTONS LAYOUT TRIGGER MELAYANG ================= */}
      <div className="flex flex-col gap-3 items-end">
        
        {/* 1. Tombol Trigger Chatbot (Pulsing Glow) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Buka chatbot" 
          className="h-14 w-14 rounded-full bg-gradient-to-br from-[#03441b] to-[#022c12] text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-300 border border-emerald-500/20 group relative"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <>
              {/* Efek denyut pemanggil perhatian */}
              <span className="absolute inset-0 rounded-full bg-emerald-600/30 animate-ping pointer-events-none group-hover:hidden" />
              <Bot className="h-6 w-6 group-hover:rotate-12 transition-transform" />
            </>
          )}
        </button>

        {/* 2. Tombol WhatsApp (Sesuai dengan nomor lu: 0895330152658) */}
        <a 
          href={waUrl} 
          target="_blank" 
          rel="noreferrer" 
          aria-label="Chat WhatsApp" 
          className="h-14 w-14 rounded-full bg-[#25D366] text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-300 relative group"
        >
          <Phone className="h-5 w-5 fill-white text-white group-hover:rotate-12 transition-transform" />
        </a>

      </div>

    </div>
  );
};
