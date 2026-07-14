import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "../../context/auth-context";
import { resolveApiUrl } from "../../utilities/resolveApiUrl";

export function useFetch(queryKey, path, config = {}) {
  const { token } = useAuthContext();
  const { onSuccess, onError, ...queryConfig } = config;
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  const fetchData = async () => {
    const { data } = await axios.get(resolveApiUrl(path), {
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
    if (data && onSuccessRef.current) {
      onSuccessRef.current(response);
    }
  }, [data, response]);

  useEffect(() => {
    if (isError && onErrorRef.current) {
      onErrorRef.current(error);
    }
  }, [isError, error]);

  return { response, isLoading };
}
