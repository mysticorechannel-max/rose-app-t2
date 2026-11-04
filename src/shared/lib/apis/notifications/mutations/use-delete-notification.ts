"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { deleteNotification } from "../notification.api";
import { notificationKeys } from "../notifications.keys";

/**
 * Mutation hook to delete a notification
 */
export function useDeleteNotificationMutation() {
    const queryClient = useQueryClient();
    const t = useTranslations("notifications");

    return useMutation({
        mutationFn: (id: string) => deleteNotification(id),

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