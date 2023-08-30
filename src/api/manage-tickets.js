import { useFetch } from "../hooks/api-hooks/useFetch";

export function useAllTickets(eventId, onSuccess, onError) {
  console.log(eventId);
  const { response, isLoading } = useFetch(
    ["get-all-tickets", eventId],
    `event/${eventId}/tickets`,
    {
      cacheTime: 1,
      onSuccess,
      onError,
      enabled: !!eventId,
    }
  );
  return { response, isLoading };
}
