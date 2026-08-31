import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase Web configuration is safe to expose in the browser, but keeping it in
// Vite environment variables makes the project portable between environments.
const env = (import.meta as ImportMeta & {
  env: Record<string, string | undefined>;
}).env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

const isConfigured = Object.values(firebaseConfig).every(Boolean);

export const firebaseEnabled = isConfigured;

export const firebaseApp = isConfigured
  ? (getApps()[0] ?? initializeApp(firebaseConfig))
  : null;

export const auth = firebaseApp ? getAuth(firebaseApp) : null;
