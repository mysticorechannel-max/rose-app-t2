"use client";

import { MarkAsReadPayload } from "@/shared/lib/types/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { markNotificationsAsRead } from "../notification.api";
import { notificationKeys } from "../notifications.keys";

/**
 * Mutation hook to mark notifications as read
 */
export function useMarkAsReadMutation() {
  const queryClient = useQueryClient();
  const t = useTranslations("notifications");

  return useMutation({
    mutationFn: (payload: MarkAsReadPayload) => markNotificationsAsRead(payload),

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
