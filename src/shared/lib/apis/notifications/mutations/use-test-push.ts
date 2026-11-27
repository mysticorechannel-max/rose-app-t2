"use client";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { sendTestPushAction } from "@/shared/lib/actions/notifications.action";

/**
 * Mutation hook to send test push notification (using Server Action)
 */
export function useTestPush() {
  const t = useTranslations("notifications.push");

  return useMutation({
    mutationFn: async () => {
      const result = await sendTestPushAction();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },

    onSuccess: () => {
      toast.success(t("testPushSuccess") || "Test notification sent successfully");
    },

    onError: (error: Error) => {
      toast.error(error.message || t("testPushError") || "Failed to send test notification");
    },
  });
}
