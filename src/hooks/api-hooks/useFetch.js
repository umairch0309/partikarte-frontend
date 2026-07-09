import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../constants";
import axios from "axios";
import { useAuthContext } from "../../context/auth-context";

export function useFetch(queryKey, path, config = {}) {
  const { token } = useAuthContext();
  const { onSuccess, onError, ...queryConfig } = config;

  const fetchData = async () => {
    const { data } = await axios.get(`${BASE_URL}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: fetchData,
    ...queryConfig,
  });

  const response = data?.data ?? data;

  useEffect(() => {
    if (data && onSuccess) {
      onSuccess(response);
    }
  }, [data, onSuccess, response]);

  useEffect(() => {
    if (isError && onError) {
      onError(error);
    }
  }, [isError, error, onError]);

  return { response, isLoading };
}
