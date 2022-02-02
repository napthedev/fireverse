import { useEffect, useState } from "react";

let cache: { [key: string]: any } = {};

export function useFetch<T>(
  key: string,
  query: (...arg: any) => Promise<any>
): { data: T | null; loading: boolean; error: boolean } {
  const [data, setData] = useState<any>(cache[key] || null);
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(false);

  useEffect(() => {
    query()
      .then((res) => {
        cache[key] = res;
        setData(res);
        setLoading(false);
        setError(false);
      })
      .catch((err) => {
        console.log(err);
        setData(null);
        setLoading(false);
        setError(true);
      });
  }, [key]);

  return { data, loading, error };
}
