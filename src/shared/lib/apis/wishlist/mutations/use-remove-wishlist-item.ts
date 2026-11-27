
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { removeWishlistItem } from "../wishlist.api";
import { wishlistKeys } from "../wishlist.keys";

export function useRemoveWishlistItem() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (id: string) => removeWishlistItem(id, session?.accessToken || ""),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wishlistKeys.all,
      });

      toast.success("Item removed from wishlist");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove item");
    },
  });
}
