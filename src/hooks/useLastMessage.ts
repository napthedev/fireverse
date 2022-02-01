import {
  DocumentData,
  QuerySnapshot,
  collection,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "../shared/firebase";

let cache: { [key: string]: any } = {};

export const useLastMessage = (conversationId: string) => {
  const [data, setData] = useState<QuerySnapshot<DocumentData> | null>(
    cache[conversationId] || null
  );
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "conversations", conversationId, "messages"),
        orderBy("createdAt"),
        limitToLast(1)
      ),
      (snapshot) => {
        const response =
          snapshot.docs.length === 0
            ? "No message recently"
            : snapshot.docs[0].data().type === "image"
            ? "An image"
            : snapshot.docs[0].data().content;
        setData(response);
        cache[conversationId] = response;
        setLoading(false);
        setError(false);
      },
      (err) => {
        console.log(err);
        setData(null);
        setLoading(false);
        setError(true);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [conversationId]);

  return { data, loading, error };
};
