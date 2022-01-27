import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp(
  JSON.parse((import.meta.env.VITE_FIREBASE_CONFIG as string) || "{}")
);

export const auth = getAuth(firebaseApp);
