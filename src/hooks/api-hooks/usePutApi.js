import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../constants";
import { useAuthContext } from "../../context/auth-context";
import {
  ShowMessageError,
  ShowMessageLoading,
  ShowMessageSuccess,
} from "../ShowMessage";
import { useEffect } from "react";

const path = new Date().getTime().toString();

export function usePutApi() {
  const { token } = useAuthContext();

  function putApiCall(data) {
    return axios.put(`${BASE_URL}${data.path}`, data.data && data.data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const { mutate, isPending } = useMutation({ mutationFn: putApiCall });

  useEffect(() => {
    if (isPending && path) {
      ShowMessageLoading(path);
    }
  }, [isPending]);

  function handleMutation(
    data,
    afterSuccess = () => {},
    afterError = () => {}
  ) {
    mutate(data, {
      onSuccess: async (res) => {
        ShowMessageSuccess(res?.data?.message, path);
        afterSuccess(res);
      },
      onError: async (res) => {
        ShowMessageError(res?.response?.data?.message, path);
        afterError(res);
      },
    });
  }
  return { isLoading: isPending, handleMutation };
}
