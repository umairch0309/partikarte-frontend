import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "../../context/auth-context";
import { resolveApiUrl, USE_LOCAL_API } from "../../utilities/resolveApiUrl";
import {
  ShowMessageError,
  ShowMessageSuccess,
  ShowMessageLoading,
} from "../ShowMessage";
import { useEffect } from "react";

const loadingKey = new Date().getTime().toString();

export function usePostApi() {
  const { token } = useAuthContext();

  function postApiCall(data) {
    const url = resolveApiUrl(data.path);

    return axios.post(url, data.data && data.data, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(USE_LOCAL_API ? { "Content-Type": "application/json" } : {}),
      },
    });
  }

  const { mutate, isPending } = useMutation({ mutationFn: postApiCall });

  useEffect(() => {
    if (isPending && loadingKey) {
      ShowMessageLoading(loadingKey);
    }
  }, [isPending]);

  function handleMutation(data, afterSucess = () => {}, afterError = () => {}) {
    mutate(data, {
      onSuccess: async (res) => {
        ShowMessageSuccess(res?.data?.message, loadingKey);
        afterSucess(res?.data);
      },
      onError: async (res) => {
        ShowMessageError(res?.response?.data?.message, loadingKey);
        afterError(res?.response?.data);
      },
    });
  }
  return { isLoading: isPending, handleMutation };
}
