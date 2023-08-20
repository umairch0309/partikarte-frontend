import { useFetch } from "../hooks/api-hooks/useFetch";

export function useProfileDetails(onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["get-profile"],
    "auth/get-profile",
    {
      cacheTime: Infinity,
      onSuccess,
      onError,
    }
  );
  return { response, isLoading };
}
