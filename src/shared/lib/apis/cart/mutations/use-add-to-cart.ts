"use client";

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { addToCartAction } from "@/shared/lib/actions/cart.action";
import { cartKeys } from "@/shared/lib/apis/cart/cart.keys";
import { CartError, getCartErrorMessage } from "@/shared/lib/errors/cart-error";
import type { AddToCartInput } from "@/shared/lib/schemes/cart.schema";
import { addToGuestCart } from "@/shared/lib/utils/guest-cart.util";

// Logged in: Server Action → POST /api/cart (token stays on the server)
async function addToAccountCart(input: AddToCartInput): Promise<void> {
  const result = await addToCartAction(input);
  if (!result.ok) throw new CartError(result.code, result.message);
}

// Guest: local storage only, no token and no login.
// Accessing or writing localStorage can throw when storage is blocked or full.
function addToBrowserCart(input: AddToCartInput): void {
  try {
    addToGuestCart(window.localStorage, input.productId, input.quantity);
  } catch {
    throw new CartError("storageUnavailable");
  }
}

export function useAddToCart(): UseMutationResult<void, CartError, AddToCartInput> {
  // Translation
  const t = useTranslations("cart");

  // Hooks
  const { status } = useSession();
  const queryClient = useQueryClient();

  return useMutation<void, CartError, AddToCartInput>({
    mutationFn: async (input) => {
      // The button is disabled while the session loads; guard anyway
      if (status === "loading") throw new CartError("unknown");
      if (status === "authenticated") return addToAccountCart(input);

      addToBrowserCart(input);
    },

    onSuccess: () => {
      toast.success(t("added"));
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },

    onError: (error) => {
      toast.error(getCartErrorMessage(error, t));
    },
  });
}
