import { useFetch } from "../hooks/api-hooks/useFetch";

export function useProfileDetails(onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["get-profile"],
    "auth/get-profile",
    {
      gcTime: 60000 * 2,
      onSuccess,
      onError,
    }
  );
  return { response, isLoading };
}
