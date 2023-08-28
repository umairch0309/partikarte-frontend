import { useFetch } from "../hooks/api-hooks/useFetch";

export function useLatestOrders(onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["get-latest-orders"],
    "orders/latest-orders",
    {
      cacheTime: Infinity,
      onSuccess,
      onError,
    }
  );
  return { response, isLoading };
}

export function useOrdersByTimeInterval(interval, onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["ge-orders-by-time"],
    `orders/by-time/${interval}`,
    {
      cacheTime: Infinity,
      onSuccess,
      onError,
    }
  );
  return { response, isLoading };
}
