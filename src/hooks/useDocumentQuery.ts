import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";

let cache: { [key: string]: any } = {};

export const useDocumentQuery = (
  key: string,
  document: DocumentReference<DocumentData>
) => {
  const [data, setData] = useState<DocumentSnapshot<DocumentData> | null>(
    cache[key] || null
  );
  const [loading, setLoading] = useState(!Boolean(data));
  const [error, setError] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      document,
      (snapshot) => {
        setData(snapshot);
        setLoading(false);
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
    // eslint-disable-next-line
  }, [key]);

  return { loading, error, data };
};
