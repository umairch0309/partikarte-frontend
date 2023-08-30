import { useFetch } from "../hooks/api-hooks/useFetch";

export function useAllEvents(onSuccess, onError) {
  const { response, isLoading } = useFetch(["get-all-events"], "events", {
    cacheTime: 60000 * 2,
    onSuccess,
    onError,
  });
  return { response, isLoading };
}

export function useActiveEvents(onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["get-active-events"],
    "events/active",
    {
      cacheTime: 60000 * 2,
      onSuccess,
      onError,
    }
  );
  return { response, isLoading };
}

export function useAllEventsForCustomer(onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["all-events-for-customer"],
    "all-events-for-customer",
    {
      cacheTime: 60000 * 2,
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
      cacheTime: 60000 * 2,
      onSuccess,
      onError,
    }
  );
  return { response, isLoading };
}
