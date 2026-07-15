import "server-only";

import { type App, cert, getApps, initializeApp } from "firebase-admin/app";
import { type Auth, getAuth } from "firebase-admin/auth";

function getAdminApp(): App {
  if (getApps().length) return getApps()[0];

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
    })
  });
}

let cachedAuth: Auth | null = null;

export function getAdminAuth(): Auth {
  if (!cachedAuth) {
    cachedAuth = getAuth(getAdminApp());
  }
  return cachedAuth;
}
