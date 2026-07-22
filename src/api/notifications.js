import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "../context/auth-context";
import { resolveApiUrl } from "../utilities/resolveApiUrl";

export function formatNotificationTime(dateValue) {
  if (!dateValue) return "";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    return `${mins} min${mins === 1 ? "" : "s"} ago`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  if (seconds < 172800) return "Yesterday";
  if (seconds < 604800) {
    const days = Math.floor(seconds / 86400);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function useBusinessNotifications(options = {}) {
  const { token } = useAuthContext();
  const { enabled = true, limit = 20 } = options;

  return useQuery({
    queryKey: ["business-notifications", limit],
    enabled: Boolean(token) && enabled,
    refetchInterval: 30000,
    queryFn: async () => {
      const { data } = await axios.get(
        resolveApiUrl(`notifications?limit=${limit}`),
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      return data?.data || { notifications: [], unreadCount: 0 };
    },
  });
}

export function useNotificationActions() {
  const { token } = useAuthContext();
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["business-notifications"] });

  const markAsRead = async (notificationId) => {
    if (!notificationId || !token) return;
    await axios.patch(
      resolveApiUrl(`notifications/${notificationId}/read`),
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await invalidate();
  };

  const markAllAsRead = async () => {
    if (!token) return;
    await axios.patch(
      resolveApiUrl("notifications/read-all"),
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await invalidate();
  };

  return { markAsRead, markAllAsRead, invalidate };
}
