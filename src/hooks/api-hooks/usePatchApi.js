import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { useAuthContext } from "../../context/auth-context";
import {
  useMessageError,
  useMessageLoading,
  useMessageSuccess,
} from "../useMessage";

export function usePatchApi() {
  const { token } = useAuthContext();
  let path = "";

  function patchApiCall(data) {
    path = data.path;

    return axios.patch(`${BASE_URL}${data.path}`, data.data && data.data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const { mutate, isLoading } = useMutation(patchApiCall);

  if (isLoading) {
    useMessageLoading(path);
  }

  function handleMutation(data, afterSucess = () => {}, afterError = () => {}) {
    mutate(data, {
      onSuccess: async (res) => {
        useMessageSuccess(res?.data?.message, path);
        afterSucess(res);
      },
      onError: async (err) => {
        useMessageError(res?.data?.message, path);
        afterError(res);
      },
    });
  }

  return { isLoading, handleMutation };
}
