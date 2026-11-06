"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { markAllNotificationsAsReadAction } from "@/shared/lib/actions/notifications.action";
import { notificationKeys } from "../notifications.keys";

/**
 * Mutation hook to mark all notifications as read (using Server Action)
 */
export function useMarkAllAsReadMutation() {
  const queryClient = useQueryClient();
  const t = useTranslations("notifications");

  return useMutation({
    mutationFn: async () => {
      const result = await markAllNotificationsAsReadAction();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },

    onSuccess: () => {
      toast.success(t("markAllAsReadSuccess") || "All notifications marked as read");
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },

    onError: (error: Error) => {
      toast.error(error.message || t("markAsReadError"));
    },
  });
}
