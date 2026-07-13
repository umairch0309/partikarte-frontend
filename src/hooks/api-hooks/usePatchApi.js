import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "../../context/auth-context";
import { resolveApiUrl } from "../../utilities/resolveApiUrl";
import {
  ShowMessageError,
  ShowMessageSuccess,
  ShowMessageLoading,
} from "../ShowMessage";
import { useEffect } from "react";

const path = new Date().getTime().toString();

export function usePatchApi() {
  const { token } = useAuthContext();

  function patchApiCall(data) {
    return axios.patch(resolveApiUrl(data.path), data.data && data.data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const { mutate, isPending } = useMutation({ mutationFn: patchApiCall });

  useEffect(() => {
    if (isPending && path) {
      ShowMessageLoading(path);
    }
  }, [isPending]);

  function handleMutation(data, afterSucess = () => {}, afterError = () => {}) {
    mutate(data, {
      onSuccess: async (res) => {
        ShowMessageSuccess(res?.data?.message, path);
        afterSucess(res?.data);
      },
      onError: async (res) => {
        ShowMessageError(res?.response?.data?.message, path);
        afterError(res?.data);
      },
    });
  }

  return { isLoading: isPending, handleMutation };
}
