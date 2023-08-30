import { useFetch } from "../hooks/api-hooks/useFetch";

export function useProfileDetails(onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["get-profile"],
    "auth/get-profile",
    {
      onSuccess,
      onError,
    }
  );
  return { response, isLoading };
}
