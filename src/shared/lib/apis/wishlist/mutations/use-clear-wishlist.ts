
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { clearWishlist } from "../wishlist.api";
import { wishlistKeys } from "../wishlist.keys";

export function useClearWishlist() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: () => clearWishlist(session?.accessToken || ""),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wishlistKeys.all,
      });

      toast.success("Wishlist cleared successfully");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to clear wishlist");
    },
  });
}
