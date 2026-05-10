import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getAuth, type Auth } from "firebase/auth";
import {
  connectDataConnectEmulator,
  getDataConnect,
  type DataConnect,
  type ConnectorConfig,
} from "firebase/data-connect";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getFunctions, type Functions } from "firebase/functions";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId,
);

if (!isFirebaseConfigured) {
  console.error("Missing Firebase environment variables. Set VITE_FIREBASE_* values in Vercel.");
}

export const firebaseApp: FirebaseApp | null = isFirebaseConfigured
  ? getApps()[0] ?? initializeApp(firebaseConfig)
  : null;

const dataConnectConfig: ConnectorConfig = {
  location: import.meta.env.VITE_FIREBASE_DATACONNECT_LOCATION || "asia-southeast2",
  service: import.meta.env.VITE_FIREBASE_DATACONNECT_SERVICE_ID,
  connector: import.meta.env.VITE_FIREBASE_DATACONNECT_CONNECTOR_ID,
};

export const isDataConnectConfigured = Boolean(
  firebaseApp &&
    dataConnectConfig.location &&
    dataConnectConfig.service &&
    dataConnectConfig.connector,
);

export const auth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
export const db: Firestore | null = firebaseApp ? getFirestore(firebaseApp) : null;
export const storage: FirebaseStorage | null = firebaseApp ? getStorage(firebaseApp) : null;
export const functions: Functions | null = firebaseApp
  ? getFunctions(firebaseApp, import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || "asia-southeast2")
  : null;
export const analytics: Promise<Analytics | null> =
  firebaseApp && firebaseConfig.measurementId && typeof window !== "undefined"
    ? isSupported()
        .then((supported) => (supported ? getAnalytics(firebaseApp) : null))
        .catch(() => null)
    : Promise.resolve(null);
export const dataConnect: DataConnect | null =
  firebaseApp && isDataConnectConfigured ? getDataConnect(firebaseApp, dataConnectConfig) : null;

const emulatorHost = import.meta.env.VITE_FIREBASE_DATACONNECT_EMULATOR_HOST;
const emulatorPort = Number(import.meta.env.VITE_FIREBASE_DATACONNECT_EMULATOR_PORT || 9399);

if (dataConnect && emulatorHost) {
  connectDataConnectEmulator(dataConnect, emulatorHost, emulatorPort);
}
