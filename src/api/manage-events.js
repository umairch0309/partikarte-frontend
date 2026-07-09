import { useFetch } from "../hooks/api-hooks/useFetch";

export function useAllEvents(onSuccess, onError) {
  const { response, isLoading } = useFetch(["get-all-events"], "events", {
    gcTime: 60000 * 2,
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
      gcTime: 60000 * 2,
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
      gcTime: 60000 * 2,
      onSuccess,
      onError,
    }
  );
  return { response, isLoading };
}

export function useSingleEventForCustomer(id, onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["single-event-for-customer", id],
    `single-event-for-customer/${id}`,
    {
      gcTime: 1,
      onSuccess,
      onError,
      enabled: true,
    }
  );
  return { response, isLoading };
}
