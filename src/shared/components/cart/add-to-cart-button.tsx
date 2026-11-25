"use client";

import { useState } from "react";

import { Loader2, ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { DEFAULT_ADD_QUANTITY } from "@/shared/lib/constants/cart.constant";
import { useAddToCart } from "@/shared/lib/apis/cart/mutations/use-add-to-cart";
import { cn } from "@/shared/lib/utils/tailwindcn.utils";

interface AddToCartButtonProps {
  productId: string;
  isOutOfStock: boolean;
  quantity?: number;
  className?: string;
}

export function AddToCartButton({
  productId,
  isOutOfStock,
  quantity = DEFAULT_ADD_QUANTITY,
  className,
}: AddToCartButtonProps) {
  // Translation
  const t = useTranslations("home.product");

  // State
  const [isAdded, setIsAdded] = useState(false);

  // Hooks
  const { status } = useSession();

  // Mutation
  const { mutate, isPending } = useAddToCart();

  // Variables
  const isDisabled = isOutOfStock || isPending || status === "loading";

  // Functions
  // After the first add the button turns grey; clicking again keeps adding
  function handleClick(): void {
    mutate({ productId, quantity }, { onSuccess: () => setIsAdded(true) });
  }

  return (
    <button
      type="button"
      aria-label={t("addToCart")}
      aria-disabled={isDisabled}
      aria-busy={isPending}
      disabled={isDisabled}
      onClick={handleClick}
      className={cn(
        // Base
        "grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-text-inverse shadow-sm",
        "transition-[transform,box-shadow,opacity,background-color] duration-200 ease-out",
        isAdded ? "bg-bg-default" : "bg-bg-primary-fixed",
        // Hover & press
        "hover:scale-105 hover:shadow-md active:scale-95",
        // Keyboard focus
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bg-primary-saturated/30",
        // Disabled keeps the colour; only the cursor and motion change
        "disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-sm disabled:active:scale-100",
        // Pending shows a wait cursor while the request runs
        isPending && "disabled:cursor-wait",
        className
      )}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <ShoppingCart className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
