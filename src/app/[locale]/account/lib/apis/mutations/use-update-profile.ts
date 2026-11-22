"use client";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useRouter } from "@/i18n/navigation";
import { updateProfileAction } from "../../actions/account.action";
import { ActionError } from "../../errors/action-error";
import { useErrorMessage } from "../../hooks/use-error-message";
import type { UpdateProfileBody } from "../../types/account";

export function useUpdateProfileMutation() {
  const t = useTranslations("account.profile");
  const getErrorMessage = useErrorMessage();
  const router = useRouter();

  return useMutation({
    mutationFn: async (body: UpdateProfileBody): Promise<void> => {
      const result = await updateProfileAction(body);
      if (!result.ok) throw new ActionError(result.code);
    },
    onSuccess: () => {
      toast.success(t("saveSuccess"));
      // The profile is read on the server, so ask Next.js to render it again.
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
