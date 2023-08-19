import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../constants";
import { useAuthContext } from "../../context/auth-context";
import {
  useMessageError,
  useMessageLoading,
  useMessageSuccess,
} from "../useMessage";

export function usePutApi() {
  const { token } = useAuthContext();
  let path = "";

  function putApiCall(data) {
    path = data.path;

    return axios.put(`${BASE_URL}${data.path}`, data.data && data.data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const { mutate, isLoading } = useMutation(putApiCall);

  if (isLoading) {
    useMessageLoading(path);
  }

  function handleMutation(data, afterSucess = () => {}) {
    mutate(data, {
      onSuccess: async (res) => {
        useMessageSuccess(res?.data?.message, path);
        afterSucess(res);
      },
      onError: async (res) => {
        useMessageError(res?.data?.message, path);
        afterSucess(res);
      },
    });
  }
  return { isLoading, handleMutation };
}
