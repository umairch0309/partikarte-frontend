import { useFetch } from "../hooks/api-hooks/useFetch";

export function useLatestOrders(onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["get-latest-orders"],
    "orders/latest-orders",
    {
      gcTime: 60000 * 2,
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
      gcTime: 1,
      onSuccess,
      onError,
      enabled: true,
    }
  );
  return { response, isLoading };
}

export function useOrdersByEventId(selectedEvent, onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["get-orders-by-eventId", selectedEvent],
    `orders/${selectedEvent}`,
    {
      gcTime: 1,
      onSuccess,
      onError,
      enabled: true,
    }
  );
  return { response, isLoading };
}

export function useBusinessRevenueByMonth(month, onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["get-business-revenue-by-month", month],
    `orders/get-business-revenue-by-month/${month}`,
    {
      gcTime: 1,
      onSuccess,
      onError,
      enabled: true,
    }
  );
  return { response, isLoading };
}
