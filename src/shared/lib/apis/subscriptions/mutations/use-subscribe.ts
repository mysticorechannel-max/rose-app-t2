"use client";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { subscribeToNewsletterAction } from "@/shared/lib/actions/subscription.action";
import { SubscribePayload } from "@/shared/lib/types/subscription";

/**
 * Mutation hook to subscribe to newsletter
 * Wraps the Server Action for client-side usage with React Query
 */
export function useSubscribeMutation() {
  const t = useTranslations("footer.newsletter");

  return useMutation({
    mutationFn: (payload: SubscribePayload) => subscribeToNewsletterAction(payload),

    onSuccess: () => {
      toast.success(t("subscribeSuccess"));
    },

    onError: (error: Error) => {
      toast.error(error.message || t("subscribeError"));
    },
  });
}
