import { useFetch } from "../hooks/api-hooks/useFetch";

export function useLatestOrders(onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["get-latest-orders"],
    "orders/latest-orders",
    {
      cacheTime: 60000 * 2,
      onSuccess,
      onError,
    }
  );
  return { response, isLoading };
}

export function useOrdersByTimeInterval(
  selectedEvent,
  interval,
  onSuccess,
  onError
) {
  const { response, isLoading } = useFetch(
    ["ge-orders-by-time", selectedEvent],
    `orders/by-time/${interval}`,
    {
      cacheTime: 1,
      onSuccess,
      onError,
      enabled: true,
    }
  );
  return { response, isLoading };
}

export function useOrdersByEventId(selectedEvent, onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["ge-orders-by-eventId", selectedEvent],
    `orders/${selectedEvent}`,
    {
      cacheTime: 1,
      onSuccess,
      onError,
      enabled: true,
    }
  );
  return { response, isLoading };
}
