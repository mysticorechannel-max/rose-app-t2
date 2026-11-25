"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteAccountAction } from "../../actions/account.action";
import { ActionError } from "../../errors/action-error";
import { useErrorMessage } from "../../hooks/use-error-message";

export function useDeleteAccountMutation() {
  const getErrorMessage = useErrorMessage();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      const result = await deleteAccountAction();
      if (!result.ok) throw new ActionError(result.code);
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
