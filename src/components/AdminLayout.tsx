import { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, FileText, PlusCircle, LogOut, Globe, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const AdminLayout = ({ children, title, action }: { children: ReactNode; title: string; action?: ReactNode }) => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    toast.success("Berhasil logout");
    navigate("/admin");
  };

  const links = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/news/new", icon: PlusCircle, label: "Tulis Berita" },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 lg:min-h-screen bg-primary-deep text-primary-foreground flex lg:flex-col">
        <div className="p-5 border-b border-white/10 hidden lg:block">
          <Logo variant="light" />
        </div>
        <nav className="flex lg:flex-col p-3 lg:p-4 gap-1 flex-1 overflow-x-auto">
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
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground font-brand font-semibold text-sm transition-colors whitespace-nowrap"
          >
            <Globe className="h-4 w-4" />
            Lihat Website
          </Link>
        </nav>
        <div className="hidden lg:block p-4 border-t border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-9 w-9 rounded-full bg-gold flex items-center justify-center text-gold-foreground font-bold text-sm shrink-0">
              {(user?.email ?? "A").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{user?.email}</div>
              <div className="text-[10px] uppercase tracking-wider text-gold flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> {role}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-sm bg-white/10 hover:bg-breaking text-sm font-semibold transition-colors"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="bg-background border-b border-border sticky top-0 z-10">
          <div className="flex items-center justify-between px-5 lg:px-8 h-16 gap-4">
            <h1 className="font-display font-bold text-xl lg:text-2xl truncate">{title}</h1>
            <div className="flex items-center gap-3">
              {action}
              <button
                onClick={handleLogout}
                className="lg:hidden p-2 rounded-sm hover:bg-muted"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>
        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
};
