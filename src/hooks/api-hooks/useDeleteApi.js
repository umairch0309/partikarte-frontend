import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../../constants";
import {
  ShowMessageSuccess,
  ShowMessageError,
  ShowMessageLoading,
} from "../ShowMessage";
import { useAuthContext } from "../../context/auth-context";
import { useEffect } from "react";

const path = new Date().getTime().toString();

export function useDeleteApi() {
  const { token } = useAuthContext();

  function deleteApi(data) {
    return axios.delete(`${BASE_URL}/${data.path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  const { mutate, isLoading } = useMutation(deleteApi);

  useEffect(() => {
    if (isLoading && path) {
      ShowMessageLoading(path);
    }
  }, [isLoading]);

  function handleMutation(data, afterSucess = () => {}, afterError = () => {}) {
    mutate(data, {
      onSuccess: async (res) => {
        ShowMessageSuccess(res?.data?.message, path);
        afterSucess(res);
      },
      onError: async (res) => {
        ShowMessageError(res?.data?.message, path);
        afterError(res);
      },
    });
  }
  return { isLoading, handleMutation };
}
