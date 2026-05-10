import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

type Role = "admin" | "editor" | "user";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  role: Role | null;
  loading: boolean;
  roleLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);
  const roleRequestRef = useRef(0);

  const fetchRole = async (userId: string) => {
    const requestId = ++roleRequestRef.current;
    setRoleLoading(true);
    setRole(null);

    for (const delay of [0, 800]) {
      if (delay) await wait(delay);

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (requestId !== roleRequestRef.current) return;

      if (!error) {
        if (data && data.length > 0) {
          const roles = data.map((r) => r.role as Role);
          const best: Role = roles.includes("admin")
            ? "admin"
            : roles.includes("editor")
            ? "editor"
            : "user";
          setRole(best);
        } else {
          setRole("user");
        }
        setRoleLoading(false);
        return;
      }

      console.error("fetchRole error:", error);
    }

    if (requestId === roleRequestRef.current) setRoleLoading(false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setRoleLoading(false);
      return;
    }

    // Set up listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        setRoleLoading(true);
        // Defer Supabase call to avoid deadlock
        setTimeout(() => fetchRole(sess.user.id), 0);
      } else {
        roleRequestRef.current += 1;
        setRole(null);
        setRoleLoading(false);
      }
    });

    // THEN check existing session
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      setLoading(false);
      if (sess?.user) {
        fetchRole(sess.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) return { error: "Supabase belum dikonfigurasi di Vercel." };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured) return { error: "Supabase belum dikonfigurasi di Vercel." };
    const redirectUrl = `${window.location.origin}/admin/dashboard`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { full_name: fullName },
      },
    });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  };

  return (
    <Ctx.Provider value={{ user, session, role, loading, roleLoading, signIn, signUp, signOut }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
};
