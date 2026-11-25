"use client";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { ActionError } from "@/app/[locale]/account/lib/errors/action-error";
import { useErrorMessage } from "@/app/[locale]/account/lib/hooks/use-error-message";
import { useRouter } from "@/i18n/navigation";
import { addReviewAction } from "../actions/review.action";
import type { AddReviewBody } from "../types/review";

export function useAddReviewMutation() {
  const t = useTranslations("reviews");
  const getErrorMessage = useErrorMessage();
  const router = useRouter();

  return useMutation({
    mutationFn: async (body: AddReviewBody): Promise<void> => {
      const result = await addReviewAction(body);
      if (!result.ok) throw new ActionError(result.code);
    },
    onSuccess: () => {
      toast.success(t("addSuccess"));
      // Reviews are read on the server, so render the page again to show the new one.
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
