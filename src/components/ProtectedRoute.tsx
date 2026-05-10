import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, role, roleLoading, roleError } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin" replace />;
  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Memuat akses dashboard...</p>
        </div>
      </div>
    );
  }
  if (roleError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8 text-center">
        <div className="max-w-md">
          <AlertCircle className="h-10 w-10 text-breaking mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold mb-3">Dashboard Belum Siap</h1>
          <p className="text-muted-foreground">
            Akses akun belum bisa dimuat dari Firebase. Pastikan Cloud Firestore sudah aktif, lalu refresh halaman.
          </p>
          <p className="mt-4 text-xs text-muted-foreground break-words">{roleError}</p>
        </div>
      </div>
    );
  }
  if (role !== "admin" && role !== "editor") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8 text-center">
        <div>
          <h1 className="font-display text-3xl font-bold mb-3">Akses Ditolak</h1>
          <p className="text-muted-foreground">Akun Anda tidak memiliki akses redaksi.</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};
