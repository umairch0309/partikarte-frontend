import { useFetch } from "../hooks/api-hooks/useFetch";

export function useAllRoles(onSuccess, onError) {
  const { response, isLoading } = useFetch(["get-all-roles"], "roles", {
    onSuccess,
    onError,
  });
  return { response, isLoading };
}
