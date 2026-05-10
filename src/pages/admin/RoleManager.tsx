import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { deleteDocument, listCollection, upsertDocument } from "@/integrations/firebase/data";
import { AlertCircle, Loader2, RefreshCw, ShieldCheck, Trash2, UserCog, Users } from "lucide-react";
import { toast } from "sonner";

type Role = "admin" | "editor" | "user";

type ProfileRow = {
  id: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  updated_at?: string;
};

type RoleRow = {
  id: string;
  user_id?: string;
  role?: Role;
  updated_at?: string;
};

type AccountRow = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: Role;
  updatedAt?: string;
  hasProfile: boolean;
  hasRoleRecord: boolean;
};

const roleLabels: Record<Role, string> = {
  admin: "Admin",
  editor: "Editor",
  user: "User",
};

const roleDescriptions: Record<Role, string> = {
  admin: "Akses penuh ke dashboard, role, dan konten.",
  editor: "Bisa mengelola konten redaksi.",
  user: "Akses dashboard dicabut.",
};

export const RoleManager = () => {
  const { user, role } = useAuth();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isAdmin = role === "admin";

  const rows = useMemo<AccountRow[]>(() => {
    const merged = new Map<string, AccountRow>();

    profiles.forEach((profile) => {
      merged.set(profile.id, {
        id: profile.id,
        fullName: profile.full_name || "Tanpa nama",
        email: profile.email || "-",
        avatarUrl: profile.avatar_url,
        role: "user",
        updatedAt: profile.updated_at,
        hasProfile: true,
        hasRoleRecord: false,
      });
    });

    roles.forEach((roleRow) => {
      const id = roleRow.user_id || roleRow.id;
      const current = merged.get(id);
      const nextRole = roleRow.role === "admin" || roleRow.role === "editor" ? roleRow.role : "user";
      merged.set(id, {
        id,
        fullName: current?.fullName || "Akun tanpa profil",
        email: current?.email || "-",
        avatarUrl: current?.avatarUrl,
        role: nextRole,
        updatedAt: roleRow.updated_at || current?.updatedAt,
        hasProfile: current?.hasProfile ?? false,
        hasRoleRecord: true,
      });
    });

    return Array.from(merged.values()).sort((a, b) => {
      const rank = (item: AccountRow) => {
        if (!item.hasRoleRecord) return 2;
        return ["admin", "editor", "pending", "user"].indexOf(item.role);
      };
      if (rank(a) !== rank(b)) return rank(a) - rank(b);
      return a.email.localeCompare(b.email);
    });
  }, [profiles, roles]);

  const stats = useMemo(
    () => ({
      total: rows.length,
      admin: rows.filter((item) => item.role === "admin").length,
      editor: rows.filter((item) => item.role === "editor").length,
      pending: rows.filter((item) => !item.hasRoleRecord).length,
      user: rows.filter((item) => item.hasRoleRecord && item.role === "user").length,
    }),
    [rows],
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileRows, roleRows] = await Promise.all([
        listCollection<ProfileRow>("profiles"),
        listCollection<RoleRow>("user_roles"),
      ]);
      setProfiles(profileRows);
      setRoles(roleRows);
    } catch (error) {
      toast.error("Gagal memuat role", {
        description: error instanceof Error ? error.message : "Periksa koneksi Firebase.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Role Management - IPNU IPPNU Bekasi";
    loadData();
  }, []);

  const updateRole = async (account: AccountRow, nextRole: Role) => {
    if (!isAdmin) {
      toast.error("Hanya admin yang bisa mengubah role.");
      return;
    }

    if (account.id === user?.id && nextRole !== "admin") {
      toast.error("Tidak bisa menurunkan role akun sendiri", {
        description: "Ini mencegah admin utama terkunci dari dashboard.",
      });
      return;
    }

    setSavingId(account.id);
    try {
      await upsertDocument("user_roles", account.id, {
        user_id: account.id,
        role: nextRole,
        updated_at: new Date().toISOString(),
      });
      toast.success(`Role ${account.email} diubah menjadi ${roleLabels[nextRole]}`);
      await loadData();
    } catch (error) {
      toast.error("Gagal mengubah role", {
        description: error instanceof Error ? error.message : "Periksa Firestore rules.",
      });
    } finally {
      setSavingId(null);
    }
  };

  const deleteAccountAccess = async (account: AccountRow) => {
    if (!isAdmin) {
      toast.error("Hanya admin yang bisa menghapus user.");
      return;
    }

    if (account.id === user?.id) {
      toast.error("Tidak bisa menghapus akun sendiri dari halaman ini.");
      return;
    }

    const label = account.email !== "-" ? account.email : account.fullName;
    const confirmed = window.confirm(
      `Hapus ${label} dari role management?\n\nProfil dan role Firestore akan dihapus. Akun Firebase Auth masih ada, tetapi tidak punya akses dashboard.`,
    );
    if (!confirmed) return;

    setDeletingId(account.id);
    try {
      await Promise.all([
        deleteDocument("user_roles", account.id),
        deleteDocument("profiles", account.id),
      ]);
      toast.success("User dihapus dari dashboard", {
        description: "Profil dan role sudah dihapus. Akses dashboard user dicabut.",
      });
      await loadData();
    } catch (error) {
      toast.error("Gagal menghapus user", {
        description: error instanceof Error ? error.message : "Periksa Firestore rules.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <AdminLayout title="Role Management">
        <div className="min-h-[50vh] flex items-center justify-center text-center">
          <div className="max-w-md">
            <AlertCircle className="h-10 w-10 text-breaking mx-auto mb-4" />
            <h2 className="font-display text-2xl font-black text-primary">Akses Admin Diperlukan</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Hanya akun dengan role admin yang bisa membuka dan mengubah role pengguna.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Role Management"
      action={
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-primary text-primary-foreground font-brand font-bold text-sm hover:opacity-95 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      }
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Akun", value: stats.total, icon: Users },
            { label: "Admin", value: stats.admin, icon: ShieldCheck },
            { label: "Editor", value: stats.editor, icon: UserCog },
            { label: "Menunggu Akses", value: stats.pending, icon: AlertCircle },
          ].map((item) => (
            <div key={item.label} className="bg-white border border-border rounded-sm p-5 shadow-sm">
              <div className="h-10 w-10 rounded-sm bg-primary/10 text-primary flex items-center justify-center mb-3">
                <item.icon className="h-5 w-5" />
              </div>
              <div className="font-display font-black text-3xl">{item.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-border rounded-sm shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-muted/20">
            <h2 className="font-brand font-extrabold text-base uppercase tracking-wide">Daftar Role Pengguna</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Data akun dibaca dari koleksi <span className="font-semibold">profiles</span> dan <span className="font-semibold">user_roles</span>.
            </p>
          </div>

          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : rows.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              Belum ada akun yang tercatat di Firestore.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left px-5 py-3 font-bold">Akun</th>
                    <th className="text-left px-3 py-3 font-bold">UID</th>
                    <th className="text-left px-3 py-3 font-bold">Status Akses</th>
                    <th className="text-left px-3 py-3 font-bold">Ubah Role</th>
                    <th className="text-left px-5 py-3 font-bold">Catatan</th>
                    <th className="text-right px-5 py-3 font-bold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((account) => (
                    <tr key={account.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                            {(account.email || account.fullName || "A").charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-primary truncate">{account.fullName}</div>
                            <div className="text-xs text-muted-foreground truncate">{account.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <code className="text-[11px] bg-muted px-2 py-1 rounded-sm break-all">{account.id}</code>
                      </td>
                      <td className="px-3 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-wider ${
                          !account.hasRoleRecord
                            ? "bg-amber-100 text-amber-800"
                            : account.role === "admin"
                            ? "bg-primary text-primary-foreground"
                            : account.role === "editor"
                              ? "bg-gold text-gold-foreground"
                              : "bg-muted text-foreground"
                        }`}>
                          {account.hasRoleRecord ? roleLabels[account.role] : "Menunggu Akses"}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <select
                          value={account.role}
                          disabled={savingId === account.id}
                          onChange={(event) => updateRole(account, event.target.value as Role)}
                          className="min-w-32 rounded-sm border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                        >
                          {(Object.keys(roleLabels) as Role[]).map((item) => (
                            <option key={item} value={item}>
                              {roleLabels[item]}
                            </option>
                          ))}
                        </select>
                        {savingId === account.id && <Loader2 className="inline ml-2 h-4 w-4 animate-spin text-primary" />}
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground max-w-xs">
                        {account.id === user?.id
                          ? "Akun Anda. Role sendiri tidak bisa diturunkan dari halaman ini."
                          : !account.hasRoleRecord
                            ? "Akun baru dari register. Pilih Editor atau Admin untuk memberi akses dashboard."
                          : account.hasProfile
                            ? roleDescriptions[account.role]
                            : "Role ada, tapi profile belum ditemukan."}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => deleteAccountAccess(account)}
                          disabled={deletingId === account.id || account.id === user?.id}
                          className="inline-flex items-center justify-center h-9 w-9 rounded-sm border border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-destructive transition-colors"
                          title={account.id === user?.id ? "Akun sendiri tidak bisa dihapus" : "Hapus user"}
                          aria-label="Hapus user"
                        >
                          {deletingId === account.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default RoleManager;
