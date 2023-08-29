import { useFetch } from "../hooks/api-hooks/useFetch";

export function useBusinessManagers(onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["get-all-business-managers"],
    "business/business-managers",
    {
      cacheTime: Infinity,
      onSuccess,
      onError,
    }
  );
  return { response, isLoading };
}

export function useAllBusinessesForCustomer(onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["get-all-business-for-customer"],
    "business/businesses-for-customer",
    {
      cacheTime: Infinity,
      onSuccess,
      onError,
    }
  );
  return { response, isLoading };
}
