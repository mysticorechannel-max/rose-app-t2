"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { changePasswordAction } from "../../actions/account.action";
import { ActionError } from "../../errors/action-error";
import { useErrorMessage } from "../../hooks/use-error-message";
import type { ChangePasswordBody } from "../../types/account";

export function useChangePasswordMutation() {
  const t = useTranslations("account.changePassword");
  const getErrorMessage = useErrorMessage();
  const { update } = useSession();

  return useMutation({
    mutationFn: async (body: ChangePasswordBody): Promise<void> => {
      const result = await changePasswordAction(body);
      if (!result.ok) throw new ActionError(result.code);
    },
    onSuccess: async () => {
      toast.success(t("success"));
      // Re-read the session so the app does not keep a stale one.
      await update();
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
