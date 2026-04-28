import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, role, roleLoading } = useAuth();

  if (loading || (user && roleLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin" replace />;
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
