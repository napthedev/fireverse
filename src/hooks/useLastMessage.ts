import {
  collection,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "../shared/firebase";
import { formatDate } from "../shared/utils";

let cache: { [key: string]: any } = {};

export const useLastMessage = (conversationId: string) => {
  const [data, setData] = useState<string | null>(
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
        const type = snapshot.docs?.[0]?.data()?.type;
        const response =
          snapshot.docs.length === 0
            ? "No message recently"
            : type === "image"
            ? "An image"
            : type === "file"
            ? `File: ${snapshot.docs[0]?.data()?.file?.name}`
            : type === "sticker"
            ? "A sticker"
            : type === "removed"
            ? "Message removed"
            : snapshot.docs[0].data().content;

        const seconds = snapshot.docs[0]?.data()?.createdAt?.seconds;
        const formattedDate = formatDate(seconds ? seconds * 1000 : Date.now());
        const result = `${response} • ${formattedDate}`;
        setData(result);
        cache[conversationId] = result;
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
