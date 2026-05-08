import { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  LogOut, 
  Globe, 
  ShieldCheck,
  Users,
  Calendar,
  Star // <-- 1. IMPORT ICON STAR BARU DI SINI UNTUK MENU RATING
} from "lucide-react";
import { toast } from "sonner";

export const AdminLayout = ({ children, title, action }: { children: ReactNode; title: string; action?: ReactNode }) => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    toast.success("Berhasil logout");
    navigate("/admin");
  };

  // DAFTAR MENU SIDEBAR - Sudah disatukan dengan Menu Banner & Menu Rating Terbaru
  const links = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/news/new", icon: PlusCircle, label: "Tulis Berita" },
    { to: "/admin/cadres", icon: Users, label: "Struktural" }, 
    { to: "/admin/events", icon: Calendar, label: "Banner & Countdown" },
    { to: "/admin/ratings", icon: Star, label: "Rating & Langganan" }, // <-- 2. COPASTE MENU BARU MONITORING ULASAN LU DI SINI
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 lg:min-h-screen bg-primary-deep text-primary-foreground flex lg:flex-col shadow-xl z-20">
        <div className="p-5 border-b border-white/10 hidden lg:block">
          <Logo variant="light" />
        </div>
        
        {/* Navigasi Links */}
        <nav className="flex lg:flex-col p-3 lg:p-4 gap-1 flex-1 overflow-x-auto no-scrollbar">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-sm font-brand font-semibold text-sm transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-gold text-gold-foreground"
                    : "text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground"
                }`
              }
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </NavLink>
          ))}
          
          <div className="hidden lg:block my-2 border-t border-white/10"></div>
          
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground font-brand font-semibold text-sm transition-colors whitespace-nowrap"
          >
            <Globe className="h-4 w-4" />
            Lihat Website
          </Link>
        </nav>

        {/* User Profile & Logout (Desktop) */}
        <div className="hidden lg:block p-4 border-t border-white/10 bg-black/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gold flex items-center justify-center text-gold-foreground font-bold text-lg shrink-0 shadow-sm">
              {(user?.email ?? "A").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold truncate text-white">{user?.email || "Admin LPP"}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gold mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3" /> {role || "Administrator"}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-sm bg-white/10 hover:bg-breaking hover:text-white text-sm font-bold transition-all shadow-sm"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-border sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between px-5 lg:px-8 h-16 gap-4">
            <h1 className="font-display font-black text-xl lg:text-2xl text-primary truncate flex items-center gap-2">
              {title}
            </h1>
            <div className="flex items-center gap-3">
              {action}
              <button
                onClick={handleLogout}
                className="lg:hidden p-2 rounded-sm text-muted-foreground hover:bg-breaking hover:text-white transition-colors"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>
        <main className="p-5 lg:p-8 flex-1">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;