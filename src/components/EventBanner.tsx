import { Calendar, MapPin, ArrowRight } from "lucide-react";

export const EventBanner = () => {
  return (
    <section className="container-news py-10">
      <div className="relative overflow-hidden rounded-sm gradient-primary text-primary-foreground">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl" />
        <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center p-8 lg:p-12">
          <div>
            <span className="inline-block bg-gold text-gold-foreground text-xs font-brand font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm">
              Event Besar
            </span>
            <h3 className="mt-3 font-display font-black text-2xl lg:text-4xl text-balance leading-tight">
              Konferensi Cabang IX IPNU IPPNU Kota Bekasi
            </h3>
            <p className="mt-2 text-primary-foreground/80 max-w-2xl">
              Hadiri momentum bersejarah pelajar NU se-Kota Bekasi dalam menentukan arah organisasi 2026-2028.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary-foreground/90">
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gold" />25-27 April 2026</span>
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" />Aula Pemkot Bekasi</span>
            </div>
          </div>
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 bg-gold text-gold-foreground font-brand font-bold px-6 py-3 rounded-sm shadow-gold hover:bg-gold-soft transition-colors whitespace-nowrap"
          >
            Daftar Sekarang <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
