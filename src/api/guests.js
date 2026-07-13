import { useFetch } from "../hooks/api-hooks/useFetch";

export function useAllGuestsForEvent(eventId, onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["get-all-guests", eventId],
    `guests/${eventId}`,
    {
      gcTime: 1,
      onSuccess,
      onError,
      enabled: !!eventId,
    }
  );
  return { response, isLoading };
}

export function useAllGuestsSummaryForEvent(eventId, onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["get-all-guests-summary", eventId],
    `guests/summary/${eventId}`,
    {
      gcTime: 1,
      onSuccess,
      onError,
      enabled: !!eventId,
    }
  );

  return { response, isLoading };
}
