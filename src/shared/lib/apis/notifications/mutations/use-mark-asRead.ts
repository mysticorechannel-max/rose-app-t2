"use client";

import { MarkAsReadPayload } from "@/shared/lib/types/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { markNotificationsAsReadAction } from "@/shared/lib/actions/notifications.action";
import { notificationKeys } from "../notifications.keys";

/**
 * Mutation hook to mark notifications as read (using Server Action)
 */
export function useMarkAsReadMutation() {
  const queryClient = useQueryClient();
  const t = useTranslations("notifications");

  return useMutation({
    mutationFn: async (payload: MarkAsReadPayload) => {
      const result = await markNotificationsAsReadAction(payload);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });

      toast.success(t("markAsReadSuccess"));
    },

    onError: (error: Error) => {
      toast.error(error.message || t("markAsReadError"));
    },
  });
}
