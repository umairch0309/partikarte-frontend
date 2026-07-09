import { useFetch } from "../hooks/api-hooks/useFetch";

export function useBusinessManagers(onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["get-all-business-managers"],
    "business/business-managers",
    {
      gcTime: 60000 * 2,
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
      gcTime: 60000 * 2,
      onSuccess,
      onError,
    }
  );
  return { response, isLoading };
}

export function useSingleBusinessForCustomer(id, onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["get-single-business-for-customer"],
    `business/business-for-customer/${id}`,
    {
      gcTime: 10,
      onSuccess,
      onError,
    }
  );
  return { response, isLoading };
}
