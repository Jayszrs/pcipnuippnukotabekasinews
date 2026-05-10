import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  QueryConstraint,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type OrderByDirection,
  type WhereFilterOp,
  type Timestamp,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, functions, isFirebaseConfigured, storage } from "./client";

type Filter = {
  field: string;
  op: WhereFilterOp;
  value: unknown;
};

type Sort = {
  field: string;
  direction?: OrderByDirection;
};

type ListOptions = {
  filters?: Filter[];
  order?: Sort[];
  limit?: number;
};

const requireDb = () => {
  if (!db || !isFirebaseConfigured) throw new Error("Firebase belum dikonfigurasi.");
  return db;
};

const normalizeValue = (value: unknown): unknown => {
  if (!value) return value;
  if (typeof value === "object" && "toDate" in value && typeof (value as Timestamp).toDate === "function") {
    return (value as Timestamp).toDate().toISOString();
  }
  if (Array.isArray(value)) return value.map(normalizeValue);
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, normalizeValue(item)]),
    );
  }
  return value;
};

const normalizeDoc = <T extends Record<string, unknown>>(id: string, data: DocumentData): T => {
  return { id, ...(normalizeValue(data) as Record<string, unknown>) } as T;
};

const cleanPayload = (payload: Record<string, unknown>) => {
  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
};

const buildConstraints = (options: ListOptions = {}) => {
  const constraints: QueryConstraint[] = [];
  options.filters?.forEach((filter) => constraints.push(where(filter.field, filter.op, filter.value)));
  return constraints;
};

const sortAndLimit = <T extends Record<string, unknown>>(rows: T[], options: ListOptions = {}) => {
  const sorted = [...rows].sort((a, b) => {
    for (const sort of options.order ?? []) {
      const av = a[sort.field];
      const bv = b[sort.field];
      if (av === bv) continue;
      const result = String(av ?? "").localeCompare(String(bv ?? ""));
      return sort.direction === "desc" ? -result : result;
    }
    return 0;
  });

  return options.limit ? sorted.slice(0, options.limit) : sorted;
};

export const listCollection = async <T extends Record<string, unknown>>(name: string, options?: ListOptions) => {
  const database = requireDb();
  const snap = await getDocs(query(collection(database, name), ...buildConstraints(options)));
  return sortAndLimit(snap.docs.map((item) => normalizeDoc<T>(item.id, item.data())), options);
};

export const subscribeCollection = <T extends Record<string, unknown>>(
  name: string,
  options: ListOptions,
  onData: (rows: T[]) => void,
  onError?: (error: Error) => void,
) => {
  const database = requireDb();
  return onSnapshot(
    query(collection(database, name), ...buildConstraints(options)),
    (snap) => onData(sortAndLimit(snap.docs.map((item) => normalizeDoc<T>(item.id, item.data())), options)),
    onError,
  );
};

export const getDocument = async <T extends Record<string, unknown>>(name: string, id: string) => {
  const database = requireDb();
  const snap = await getDoc(doc(database, name, id));
  return snap.exists() ? normalizeDoc<T>(snap.id, snap.data()) : null;
};

export const addDocument = async <T extends Record<string, unknown>>(name: string, payload: Record<string, unknown>) => {
  const database = requireDb();
  const created = await addDoc(collection(database, name), cleanPayload(payload));
  const snap = await getDoc(created);
  return normalizeDoc<T>(snap.id, snap.data() ?? {});
};

export const updateDocument = async (name: string, id: string, payload: Record<string, unknown>) => {
  const database = requireDb();
  await updateDoc(doc(database, name, id), cleanPayload(payload));
};

export const upsertDocument = async (name: string, id: string, payload: Record<string, unknown>) => {
  const database = requireDb();
  await setDoc(doc(database, name, id), cleanPayload(payload), { merge: true });
};

export const deleteDocument = async (name: string, id: string) => {
  const database = requireDb();
  await deleteDoc(doc(database, name, id));
};

export const uploadFile = async (folder: string, path: string, file: File) => {
  if (!storage || !isFirebaseConfigured) throw new Error("Firebase Storage belum dikonfigurasi.");
  const fileRef = ref(storage, `${folder}/${path}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
};

export const getUserRole = async (userId: string) => {
  const direct = await getDocument<{ role?: string }>("user_roles", userId);
  if (direct?.role) return direct.role;

  const rows = await listCollection<{ role?: string }>("user_roles", {
    filters: [{ field: "user_id", op: "==", value: userId }],
    limit: 5,
  });

  const roles = rows.map((item) => item.role).filter(Boolean);
  if (roles.includes("admin")) return "admin";
  if (roles.includes("editor")) return "editor";
  return "user";
};

export const callChatbot = async (messages: Array<{ role: string; content: string }>) => {
  if (functions && isFirebaseConfigured) {
    const callable = httpsCallable(functions, "chatbot");
    const result = await callable({ messages });
    return result.data as { reply?: string; error?: string };
  }

  const endpoint = import.meta.env.VITE_CHATBOT_FUNCTION_URL;
  if (!endpoint) throw new Error("Firebase chatbot function belum dikonfigurasi.");
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  return response.json() as Promise<{ reply?: string; error?: string }>;
};
