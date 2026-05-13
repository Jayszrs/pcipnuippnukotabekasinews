import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
  updatePassword,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/integrations/firebase/client";
import {
  addDocument,
  callChatbot,
  deleteDocument,
  getDocument,
  listCollection,
  uploadFile,
  upsertDocument,
} from "@/integrations/firebase/data";

type Response<T = unknown> = { data: T | null; error: Error | null };
type Filter = { field: string; op: "==" | ">="; value: unknown };
type Sort = { field: string; direction: "asc" | "desc" };

const uploadedUrls = new Map<string, string>();

class FirebaseQuery {
  private action: "select" | "insert" | "update" | "delete" | "upsert" = "select";
  private filters: Filter[] = [];
  private sorts: Sort[] = [];
  private maxRows?: number;
  private payload: Record<string, unknown> | Record<string, unknown>[] | null = null;

  constructor(private readonly collectionName: string) {}

  select() {
    this.action = this.action === "insert" ? "insert" : "select";
    return this;
  }

  insert(payload: Record<string, unknown> | Record<string, unknown>[]) {
    this.action = "insert";
    this.payload = payload;
    return this;
  }

  update(payload: Record<string, unknown>) {
    this.action = "update";
    this.payload = payload;
    return this;
  }

  upsert(payload: Record<string, unknown>) {
    this.action = "upsert";
    this.payload = payload;
    return this.execute();
  }

  delete() {
    this.action = "delete";
    return this;
  }

  eq(field: string, value: unknown) {
    this.filters.push({ field, op: "==", value });
    return this;
  }

  gte(field: string, value: unknown) {
    this.filters.push({ field, op: ">=", value });
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.sorts.push({ field, direction: options?.ascending === false ? "desc" : "asc" });
    return this;
  }

  limit(count: number) {
    this.maxRows = count;
    return this;
  }

  async maybeSingle() {
    const result = await this.execute<Record<string, unknown>[]>();
    return {
      data: Array.isArray(result.data) ? result.data[0] ?? null : result.data,
      error: result.error,
    };
  }

  async single() {
    return this.maybeSingle();
  }

  then<TResult1 = Response, TResult2 = never>(
    onfulfilled?: ((value: Response) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return this.execute().then(onfulfilled, onrejected);
  }

  private async findMatchingRows() {
    return listCollection<Record<string, unknown>>(this.collectionName, {
      filters: this.filters,
      order: this.sorts,
      limit: this.maxRows,
    });
  }

  private async execute<T = unknown>(): Promise<Response<T>> {
    try {
      if (!isFirebaseConfigured) throw new Error("Firebase belum dikonfigurasi.");

      if (this.action === "insert") {
        const items = Array.isArray(this.payload) ? this.payload : [this.payload ?? {}];
        const created = [];
        for (const item of items) {
          const payload = item ?? {};
          if (payload.id) {
            await upsertDocument(this.collectionName, String(payload.id), payload);
            created.push({ id: String(payload.id), ...payload });
          } else {
            created.push(await addDocument(this.collectionName, payload));
          }
        }
        return { data: created as T, error: null };
      }

      if (this.action === "upsert") {
        const item = (this.payload ?? {}) as Record<string, unknown>;
        const id = String(item.id ?? crypto.randomUUID());
        await upsertDocument(this.collectionName, id, item);
        return { data: { id, ...item } as T, error: null };
      }

      if (this.action === "update") {
        const idFilter = this.filters.find((filter) => filter.field === "id" && filter.op === "==");
        if (idFilter) {
          await upsertDocument(this.collectionName, String(idFilter.value), this.payload as Record<string, unknown>);
        } else {
          const rows = await this.findMatchingRows();
          for (const row of rows) await upsertDocument(this.collectionName, String(row.id), this.payload as Record<string, unknown>);
        }
        return { data: null as T, error: null };
      }

      if (this.action === "delete") {
        const idFilter = this.filters.find((filter) => filter.field === "id" && filter.op === "==");
        if (idFilter) {
          await deleteDocument(this.collectionName, String(idFilter.value));
        } else {
          const rows = await this.findMatchingRows();
          for (const row of rows) await deleteDocument(this.collectionName, String(row.id));
        }
        return { data: null as T, error: null };
      }

      const idFilter = this.filters.find((filter) => filter.field === "id" && filter.op === "==");
      if (idFilter && this.filters.length === 1) {
        const row = await getDocument(this.collectionName, String(idFilter.value));
        return { data: (row ? [row] : []) as T, error: null };
      }

      const rows = await this.findMatchingRows();
      return { data: rows as T, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error("Firebase operation failed") };
    }
  }
}

export const firebaseBackend = {
  from(name: string) {
    return new FirebaseQuery(name);
  },
  storage: {
    from(bucket: string) {
      return {
        async upload(path: string, file: File) {
          try {
            const publicUrl = await uploadFile(bucket, path, file);
            uploadedUrls.set(`${bucket}/${path}`, publicUrl);
            return { data: { path }, error: null };
          } catch (error) {
            return { data: null, error: error instanceof Error ? error : new Error("Upload gagal") };
          }
        },
        getPublicUrl(path: string) {
          return { data: { publicUrl: uploadedUrls.get(`${bucket}/${path}`) ?? path } };
        },
      };
    },
  },
  auth: {
    getUser: async () => ({
      data: {
        user: auth?.currentUser
          ? { ...auth.currentUser, id: auth.currentUser.uid, uid: auth.currentUser.uid, email: auth.currentUser.email }
          : null,
      },
      error: null,
    }),
    getSession: async () => ({
      data: {
        session: auth?.currentUser
          ? { user: { ...auth.currentUser, id: auth.currentUser.uid, uid: auth.currentUser.uid, email: auth.currentUser.email } }
          : null,
      },
      error: null,
    }),
    onAuthStateChange: (callback: (event: string, session?: unknown) => void) => {
      const unsubscribe = auth
        ? onAuthStateChanged(auth, (user) => callback(user ? "SIGNED_IN" : "SIGNED_OUT", user ? { user } : null))
        : () => undefined;
      return { data: { subscription: { unsubscribe } } };
    },
    resetPasswordForEmail: async (email: string) => {
      if (!auth) return { error: new Error("Firebase belum dikonfigurasi.") };
      try {
        await sendPasswordResetEmail(auth, email);
        return { error: null };
      } catch (error) {
        return { error: error instanceof Error ? error : new Error("Gagal mengirim reset password") };
      }
    },
    updateUser: async ({ password }: { password: string }) => {
      if (!auth?.currentUser) return { error: new Error("Sesi Firebase tidak ditemukan.") };
      try {
        await updatePassword(auth.currentUser, password);
        return { error: null };
      } catch (error) {
        return { error: error instanceof Error ? error : new Error("Gagal mengubah password") };
      }
    },
    signOut: async () => {
      if (auth) await signOut(auth);
    },
  },
  functions: {
    invoke: async (_name: string, options: { body: { messages: Array<{ role: string; content: string }> } }) => {
      try {
        const data = await callChatbot(options.body.messages);
        return { data, error: null };
      } catch (error) {
        return { data: null, error: error instanceof Error ? error : new Error("Gagal memanggil function") };
      }
    },
  },
};

export const supabase = firebaseBackend;
export const isSupabaseConfigured = isFirebaseConfigured;
