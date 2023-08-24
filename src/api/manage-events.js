import { useFetch } from "../hooks/api-hooks/useFetch";

export function useAllEvents(onSuccess, onError) {
  const { response, isLoading } = useFetch(["get-all-events"], "events", {
    cacheTime: Infinity,
    onSuccess,
    onError,
  });
  return { response, isLoading };
}

export function useAllEventsForCustomer(onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["all-events-for-customer"],
    "all-events-for-customer",
    {
      cacheTime: Infinity,
      onSuccess,
      onError,
    }
  );
  return { response, isLoading };
}

export function useSingleEventForCustomer(id, onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["single-event-for-customer"],
    `single-event-for-customer/${id}`,
    {
      cacheTime: Infinity,
      onSuccess,
      onError,
    }
  );
  return { response, isLoading };
}
