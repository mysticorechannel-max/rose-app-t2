"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { deleteNotificationAction } from "@/shared/lib/actions/notifications.action";
import { notificationKeys } from "../notifications.keys";

/**
 * Mutation hook to delete a notification (using Server Action)
 */
export function useDeleteNotificationMutation() {
    const queryClient = useQueryClient();
    const t = useTranslations("notifications");

    return useMutation({
        mutationFn: async (id: string) => {
            const result = await deleteNotificationAction(id);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: notificationKeys.all,
            });

            toast.success(t("deleteSuccess"));
        },

        onError: (error: Error) => {
            toast.error(error.message || t("deleteError"));
        },
    });
}