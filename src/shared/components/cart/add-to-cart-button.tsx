"use client";

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

  // Hooks
  const { status } = useSession();

  // Mutation
  const { mutate, isPending } = useAddToCart();

  // Variables
  const isDisabled = isOutOfStock || isPending || status === "loading";

  return (
    <button
      type="button"
      aria-label={t("addToCart")}
      aria-disabled={isDisabled}
      aria-busy={isPending}
      disabled={isDisabled}
      onClick={() => mutate({ productId, quantity })}
      className={cn(
        // Base
        "grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-bg-primary-fixed text-text-inverse shadow-sm",
        "transition-[transform,box-shadow,opacity] duration-200 ease-out",
        // Hover & press
        "hover:scale-105 hover:shadow-md active:scale-95",
        // Keyboard focus
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bg-primary-saturated/30",
        // Disabled keeps the Figma colour; only the cursor and motion change
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
