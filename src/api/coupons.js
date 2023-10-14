import { useFetch } from "../hooks/api-hooks/useFetch";

export function useCouponByEventId(selectedEvent, onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["get-coupon", selectedEvent],
    `coupon/${selectedEvent}`,
    {
      cacheTime: 1,
      onSuccess,
      onError,
      enabled: true,
    }
  );
  return { response, isLoading };
}
