import { useFetch } from "../hooks/api-hooks/useFetch";

export function useAllEvents(onSuccess, onError) {
  const { response, isLoading } = useFetch(["get-all-events"], "events", {
    cacheTime: Infinity,
    onSuccess,
    onError,
  });
  return { response, isLoading };
}
