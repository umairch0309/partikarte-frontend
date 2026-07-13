import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  ShowMessageError,
  ShowMessageLoading,
  ShowMessageSuccess,
} from "../ShowMessage";

const loadingKey = "contact-email";

async function sendContactEmailRequest(payload) {
  const { data } = await axios.post("/api/contact", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data;
}

export function useSendContactEmail() {
  const { mutate, isPending } = useMutation({
    mutationFn: sendContactEmailRequest,
  });

  useEffect(() => {
    if (isPending) {
      ShowMessageLoading(loadingKey);
    }
  }, [isPending]);

  function handleMutation(payload, onSuccess = () => {}, onError = () => {}) {
    mutate(payload, {
      onSuccess: (response) => {
        ShowMessageSuccess(
          response?.message || "Your message has been sent successfully",
          loadingKey
        );
        onSuccess(response);
      },
      onError: (error) => {
        ShowMessageError(
          error?.response?.data?.message || "Failed to send your message",
          loadingKey
        );
        onError(error?.response?.data);
      },
    });
  }

  return { isLoading: isPending, handleMutation };
}
