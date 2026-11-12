"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteAccountAction } from "../../actions/account.action";

export function useDeleteAccountMutation() {
  return useMutation({
    mutationFn: async (): Promise<void> => {
      const result = await deleteAccountAction();
      if (!result.ok) throw new Error(result.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}