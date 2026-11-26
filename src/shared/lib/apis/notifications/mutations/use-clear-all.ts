"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { clearAllNotificationsAction } from "@/shared/lib/actions/notifications.action";
import { notificationKeys } from "../notifications.keys";

/**
 * Mutation hook to clear all notifications (using Server Action)
 */
export function useClearAllMutation() {
  const queryClient = useQueryClient();
  const t = useTranslations("notifications");

  return useMutation({
    mutationFn: async () => {
      const result = await clearAllNotificationsAction();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },

    onSuccess: () => {
      toast.success(t("clearAllSuccess") || "All notifications cleared");
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },

    onError: (error: Error) => {
      toast.error(error.message || t("clearAllError") || "Failed to clear notifications");
    },
  });
}
