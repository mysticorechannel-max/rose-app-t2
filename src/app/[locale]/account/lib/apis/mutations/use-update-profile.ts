"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { updateProfileAction } from "../../actions/account.action";
import type { UpdateProfileBody } from "../../types/account";
import { PROFILE_QUERY_KEY } from "../queries/use-get-profile";

export function useUpdateProfileMutation() {
  const t = useTranslations("account.profile");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: UpdateProfileBody) => {
      const result = await updateProfileAction(body);
      if (!result.ok) throw new Error(result.message);
      return result.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, user);
      toast.success(t("saveSuccess"));
    },
    onError: (error: Error) => {
      toast.error(error.message || t("saveError"));
    },
  });
}