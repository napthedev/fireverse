import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";

import configs from "./configs";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp(JSON.parse(configs.firebaseConfig));

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

enableIndexedDbPersistence(db, { forceOwnership: false });
