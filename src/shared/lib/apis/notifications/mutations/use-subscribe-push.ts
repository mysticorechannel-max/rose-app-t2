"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { subscribeToPushAction } from "@/shared/lib/actions/notifications.action";
import { notificationKeys } from "../notifications.keys";
import type { PushSubscriptionPayload } from "@/shared/lib/types/push-notification";

/**
 * Mutation hook to subscribe to push notifications (using Server Action)
 */
export function useSubscribePush() {
  const queryClient = useQueryClient();
  const t = useTranslations("notifications.push");

  return useMutation({
    mutationFn: async (payload: PushSubscriptionPayload) => {
      const result = await subscribeToPushAction(payload);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },

    onSuccess: () => {
      toast.success(t("subscribeSuccess"));
      // Invalidate queries to refresh subscription status
      queryClient.invalidateQueries({ queryKey: notificationKeys.push.vapidKey });
      queryClient.invalidateQueries({ queryKey: notificationKeys.push.status });
    },

    onError: (error: Error) => {
      toast.error(error.message || t("subscribeError"));
    },
  });
}
