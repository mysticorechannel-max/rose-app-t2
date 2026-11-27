"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { unsubscribeFromPushAction } from "@/shared/lib/actions/notifications.action";
import { notificationKeys } from "../notifications.keys";

/**
 * Mutation hook to unsubscribe from push notifications (using Server Action)
 */
export function useUnsubscribePush() {
  const queryClient = useQueryClient();
  const t = useTranslations("notifications.push");

  return useMutation({
    mutationFn: async () => {
      const result = await unsubscribeFromPushAction();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },

    onSuccess: () => {
      toast.success(t("unsubscribeSuccess"));
      // Invalidate queries to refresh subscription status
      queryClient.invalidateQueries({ queryKey: notificationKeys.push.vapidKey });
      queryClient.invalidateQueries({ queryKey: notificationKeys.push.status });
    },

    onError: (error: Error) => {
      toast.error(error.message || t("unsubscribeError"));
    },
  });
}
