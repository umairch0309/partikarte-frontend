import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { useAuthContext } from "../../context/auth-context";
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
    return axios.patch(`${BASE_URL}${data.path}`, data.data && data.data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const { mutate, isLoading } = useMutation(patchApiCall);

  useEffect(() => {
    if (isLoading && path) {
      ShowMessageLoading(path);
    }
  }, [isLoading]);

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

  return { isLoading, handleMutation };
}
