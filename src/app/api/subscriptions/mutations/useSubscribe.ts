"use client";

import { SubscribePayload } from "@/shared/lib/types/subscription";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { subscribeToNewsletter } from "../subscription.api";
import { toast } from "sonner";

/**
 * Mutation hook to subscribe to newsletter
 */
export function useSubscribeMutation() {
  const t = useTranslations("footer.newsletter");

  return useMutation({
    mutationFn: (payload: SubscribePayload) => subscribeToNewsletter(payload),

    onSuccess: () => {
      toast.success(t("subscribeSuccess"));
    },

    onError: (error: Error) => {
      toast.error(error.message || t("subscribeError"));
    },
  });
}
