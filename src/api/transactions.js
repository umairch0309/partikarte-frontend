import { useFetch } from "../hooks/api-hooks/useFetch";

export function useBusinessTransactions(onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["get-all-business-transactions"],
    "transactions/all",
    {
      gcTime: 60000 * 2,
      onSuccess,
      onError,
    }
  );
  return { response, isLoading };
}
