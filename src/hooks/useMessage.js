import { message } from "antd";

export function useMessageLoading(url) {
  const [messageApi, contextHolder] = message.useMessage();
  const key = url?.toLowerCase();
  return messageApi.open({
    key,
    type: "loading",
    content: "Loading...",
  });
}

export function useMessageSuccess(text, url) {
  const [messageApi, contextHolder] = message.useMessage();
  const key = url?.toLowerCase();
  return messageApi.open({
    key,
    type: "success",
    content: text,
    duration: 2,
  });
}

export function useMessageError(text, url) {
  const [messageApi, contextHolder] = message.useMessage();
  const key = url?.toLowerCase();
  return messageApi.open({
    key,
    type: "error",
    content: text,
    duration: 2,
  });
}

export function useMessageInfo(text, url) {
  const [messageApi, contextHolder] = message.useMessage();
  const key = url?.toLowerCase();
  return messageApi.open({
    key,
    type: "info",
    content: text,
    duration: 2,
  });
}

export function useMessageDelete(text, url) {
  const [messageApi, contextHolder] = message.useMessage();
  const key = url?.toLowerCase();
  return messageApi.open({
    key,
    type: "warning",
    content: text,
    duration: 2,
  });
}
