import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../../constants";
import {
  useMessageDelete,
  useMessageError,
  useMessageLoading,
} from "../useMessage";
import { useAuthContext } from "../../context/auth-context";

export function useDeleteApi() {
  const { token } = useAuthContext();

  let path = "";

  function deleteApi(data) {
    path = data.path;
    return axios.delete(`${BASE_URL}/${data.path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  const { mutate, isLoading } = useMutation(deleteApi);

  if (isLoading) {
    useMessageLoading(path);
  }

  function handleMutation(data, afterSucess = () => {}, afterError = () => {}) {
    mutate(data, {
      onSuccess: async (res) => {
        useMessageDelete(res?.data?.message, path);
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
