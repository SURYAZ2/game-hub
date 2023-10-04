import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";

interface FetchData<T> {
  count: number;
  results: T[];
}
const useData = <T,>(endpoint: string) => {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    apiClient
      .get<FetchData<T>>(endpoint, { signal: controller.signal })
      .then((res) => {
        setData(res.data.results);
        console.log(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err);
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return { data, error, isLoading };
};

export default useData;
