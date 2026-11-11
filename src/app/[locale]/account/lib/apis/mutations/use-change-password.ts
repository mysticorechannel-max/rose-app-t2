"use client";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { changePasswordAction } from "../../actions/account.action";
import type { ChangePasswordBody } from "../../types/account";

export function useChangePasswordMutation() {
  const t = useTranslations("account.changePassword");

  return useMutation({
    mutationFn: async (body: ChangePasswordBody): Promise<void> => {
      const result = await changePasswordAction(body);
      if (!result.ok) throw new Error(result.message);
    },
    onSuccess: () => {
      toast.success(t("success"));
    },
    onError: (error: Error) => {
      toast.error(error.message || t("error"));
    },
  });
}