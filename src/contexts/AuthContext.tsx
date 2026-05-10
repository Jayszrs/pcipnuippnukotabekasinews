import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/integrations/firebase/client";
import { getUserRole, upsertDocument } from "@/integrations/firebase/data";

type Role = "admin" | "editor" | "user";
interface AppUser {
  id: string;
  uid: string;
  email: string | null;
}

interface AuthCtx {
  user: AppUser | null;
  role: Role | null;
  loading: boolean;
  roleLoading: boolean;
  roleError: string | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);
  const roleRequestRef = useRef(0);

  const fetchRole = async (userId: string) => {
    const requestId = ++roleRequestRef.current;
    setRoleLoading(true);
    setRole(null);
    setRoleError(null);
    let lastError: unknown = null;

    for (const delay of [0, 800]) {
      if (delay) await wait(delay);

      try {
        const nextRole = (await getUserRole(userId)) as Role;
        if (requestId !== roleRequestRef.current) return;
        setRole(nextRole);
        setRoleLoading(false);
        return;
      } catch (error) {
        lastError = error;
        console.error("fetchRole error:", error);
      }
    }

    if (requestId === roleRequestRef.current) {
      setRole("user");
      setRoleError(
        lastError instanceof Error
          ? lastError.message
          : "Gagal memuat akses akun. Periksa konfigurasi Firebase/Firestore.",
      );
      setRoleLoading(false);
    }
  };

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setLoading(false);
      setRoleLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser ? { id: nextUser.uid, uid: nextUser.uid, email: nextUser.email } : null);
      if (nextUser) {
        setRoleLoading(true);
        fetchRole(nextUser.uid);
      } else {
        roleRequestRef.current += 1;
        setRole(null);
        setRoleError(null);
        setRoleLoading(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!auth || !isFirebaseConfigured) return { error: "Firebase belum dikonfigurasi di Vercel." };
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Login gagal" };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!auth || !isFirebaseConfigured) return { error: "Firebase belum dikonfigurasi di Vercel." };
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await upsertDocument("profiles", credential.user.uid, {
        full_name: fullName,
        email,
        updated_at: new Date().toISOString(),
      });
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Registrasi gagal" };
    }
  };

  const signOut = async () => {
    if (!auth || !isFirebaseConfigured) return;
    await firebaseSignOut(auth);
  };

  return (
    <Ctx.Provider value={{ user, role, loading, roleLoading, roleError, signIn, signUp, signOut }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
};
