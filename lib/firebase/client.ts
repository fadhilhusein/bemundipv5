import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { type Auth, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

let cachedAuth: Auth | null = null;

export function getFirebaseAuth(): Auth {
  if (!cachedAuth) {
    cachedAuth = getAuth(getFirebaseApp());
  }
  return cachedAuth;
}
