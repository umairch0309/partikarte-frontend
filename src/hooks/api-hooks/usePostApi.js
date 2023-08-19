import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "../../context/auth-context";
import { BASE_URL } from "../../constants";
import {
  useMessageError,
  useMessageSuccess,
  useMessageLoading,
} from "../useMessage";

export function usePostApi() {
  const { token } = useAuthContext();
  let path = "";

  function postApiCall(data) {
    path = data.path;

    return axios.post(`${BASE_URL}${data.path}`, data.data && data.data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const { mutate, isLoading } = useMutation(postApiCall);

  if (isLoading) {
    useMessageLoading(path);
  }

  function handleMutation(data, afterSucess = () => {}, afterError = () => {}) {
    mutate(data, {
      onSuccess: async (res) => {
        useMessageSuccess(res?.data?.message, path);
        afterSucess(res?.data);
      },
      onError: async (err) => {
        useMessageError(res?.data?.message, path);
        afterError(res?.data);
      },
    });
  }
  return { isLoading, handleMutation };
}
