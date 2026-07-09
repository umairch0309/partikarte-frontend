import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../constants";
import axios from "axios";
import { useAuthContext } from "../../context/auth-context";

export function useFetch(queryKey, path, config = {}) {
  const { token } = useAuthContext();

  const fetchData = async () => {
    const { data } = await axios.get(`${BASE_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  };

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: fetchData,
    ...config,
  });
  const response = data?.data;

  return { response, isLoading };
}
