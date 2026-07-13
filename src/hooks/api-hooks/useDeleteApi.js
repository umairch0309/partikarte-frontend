import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  ShowMessageSuccess,
  ShowMessageError,
  ShowMessageLoading,
} from "../ShowMessage";
import { useAuthContext } from "../../context/auth-context";
import { resolveApiUrl } from "../../utilities/resolveApiUrl";
import { useEffect } from "react";

const path = new Date().getTime().toString();

export function useDeleteApi() {
  const { token } = useAuthContext();

  function deleteApi(data) {
    return axios.delete(resolveApiUrl(data.path), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  const { mutate, isPending } = useMutation({ mutationFn: deleteApi });

  useEffect(() => {
    if (isPending && path) {
      ShowMessageLoading(path);
    }
  }, [isPending]);

  function handleMutation(data, afterSucess = () => {}, afterError = () => {}) {
    mutate(data, {
      onSuccess: async (res) => {
        ShowMessageSuccess(res?.data?.message, path);
        afterSucess(res);
      },
      onError: async (res) => {
        ShowMessageError(res?.response?.data?.message, path);
        afterError(res);
      },
    });
  }
  return { isLoading: isPending, handleMutation };
}
