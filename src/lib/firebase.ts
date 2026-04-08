import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
};

export const IS_FIREBASE_CONFIGURED = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId
);

if (!IS_FIREBASE_CONFIGURED) {
  console.warn(
    '[NYX] Firebase env vars missing. ' +
    'Set VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID in your .env file to enable auth.'
  )
}

export const app = IS_FIREBASE_CONFIGURED ? initializeApp(firebaseConfig as any) : null as any;
export const auth = app ? getAuth(app) : null as any;
