import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp(
  JSON.parse((import.meta.env.VITE_FIREBASE_CONFIG as string) || "{}")
);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

enableIndexedDbPersistence(db, { forceOwnership: false });
