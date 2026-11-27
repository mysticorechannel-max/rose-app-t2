"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  BrushCleaning,
  FolderHeart,
  LoaderCircle,
  ShoppingCart,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { cn } from "@/shared/lib/utils/tailwindcn.utils";
import { useGetWishlist } from "@/shared/lib/apis/wishlist/queries/use-get-wishlist";
import { useClearWishlist } from "@/shared/lib/apis/wishlist/mutations/use-clear-wishlist";
import { useRemoveWishlistItem } from "@/shared/lib/apis/wishlist/mutations/use-remove-wishlist-item";

type WishlistItem = NonNullable<ReturnType<typeof useGetWishlist>["data"]>[number];

function getPricing(product: WishlistItem["product"]) {
  const original = Number(product.price) || 0;
  const discountVal = Number(product.discountValue) || 0;
  const hasDiscount = discountVal > 0;

  if (!hasDiscount) {
    return { current: original, original, hasDiscount: false };
  }

  const isPercentage =
    product.discountType === "PERCENT" || product.discountType === "PERCENTAGE";

  const current = isPercentage
    ? original - (original * discountVal) / 100
    : Math.max(0, original - discountVal);

  return { current, original, hasDiscount: true };
}

const formatPrice = (value: number) => value.toFixed(2);

export default function WishlistPage() {
  const t = useTranslations("wishlist");
  const router = useRouter();
  const goToProducts = () => router.push("/product");

  const [confirmOpen, setConfirmOpen] = useState(false);

  const { status } = useSession();
  const isSessionLoading = status === "loading";
  const isUnauthenticated = status === "unauthenticated";

  const { data, isLoading: isQueryLoading, isError, refetch } = useGetWishlist();
  const clearWishlist = useClearWishlist();
  const removeItem = useRemoveWishlistItem();
  const isLoading = isSessionLoading || (status === "authenticated" && isQueryLoading);

  const items = data ?? [];
  const showList = !isLoading && !isError && !isUnauthenticated && items.length > 0;
  const showEmpty = !isLoading && !isError && !isUnauthenticated && items.length === 0;

  const handleClear = () => {
    clearWishlist.mutate(undefined, {
      onSuccess: () => setConfirmOpen(false),
    });
  };

  const handleAddToCart = () => {
    toast.success(t("addedToCart"));
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      {/* Header section */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FolderHeart className="size-9 text-text-plain sm:size-10" strokeWidth={1.5} />
          <h1 className="text-2xl font-bold tracking-tight text-text-plain sm:text-3xl">
            {t("title")}
          </h1>
          {!isLoading && !isError && (
            <span className="text-sm font-normal text-text-soft">
              {t("itemsCount", { count: items.length })}
            </span>
          )}
        </div>

        {showList && (
          <Button
            variant="destructive"
            className="h-10 px-4 rounded-lg bg-bg-danger hover:bg-bg-danger-saturated text-text-inverse font-medium text-sm flex items-center gap-2 cursor-pointer shadow-none"
            onClick={() => setConfirmOpen(true)}
          >
            <BrushCleaning className="size-4" />
            {t("clear")}
          </Button>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <ul className="divide-y divide-border-subtle/80">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="flex gap-4 sm:gap-6 py-5 items-stretch justify-between">
              <div className="relative size-28 sm:size-32 shrink-0 animate-pulse rounded-xl bg-bg-soft" />

              <div className="flex flex-1 flex-col justify-between py-1 space-y-2">
                <div className="space-y-2">
                  <div className="h-3.5 w-16 animate-pulse rounded bg-bg-soft" />
                  <div className="h-5 w-56 max-w-full animate-pulse rounded bg-bg-soft" />
                  <div className="h-4 w-28 animate-pulse rounded bg-bg-soft" />
                </div>
                <div className="h-6 w-36 animate-pulse rounded bg-bg-soft" />
              </div>

              <div className="flex flex-col items-end justify-between py-1 shrink-0">
                <div className="size-9 animate-pulse rounded-lg bg-bg-soft" />
                <div className="h-9 w-28 animate-pulse rounded-lg bg-bg-soft" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Unauthenticated State */}
      {isUnauthenticated && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-bg-muted">
            <User className="size-10 text-text-soft" strokeWidth={1.5} />
          </div>
          <h2 className="mb-2 text-xl font-bold text-text-plain">{t("needLogin")}</h2>
          <p className="mb-6 max-w-sm text-sm text-text-soft">{t("needLoginDescription")}</p>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              className="h-10 px-6 rounded-lg bg-bg-primary hover:bg-bg-primary-saturated text-text-inverse font-medium text-sm"
              onClick={() => router.push("/login")}
            >
              {t("loginCta")}
            </Button>
            <Button
              variant="subtle"
              className="h-10 px-5 rounded-lg border border-border-soft bg-bg-muted hover:bg-bg-soft text-text-plain font-medium text-sm"
              onClick={goToProducts}
            >
              {t("continueShopping")}
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <p className="text-sm font-medium text-text-danger">{t("error")}</p>
          <Button variant="outline" onClick={() => refetch()}>
            {t("retry")}
          </Button>
        </div>
      )}

      {/* Empty State */}
      {showEmpty && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-bg-muted">
            <FolderHeart className="size-10 text-text-soft" strokeWidth={1.5} />
          </div>
          <h2 className="mb-2 text-xl font-bold text-text-plain">{t("empty")}</h2>
          <p className="mb-6 max-w-sm text-sm text-text-soft">{t("emptyDescription")}</p>
          <Button
            variant="primary"
            className="h-10 px-5 rounded-lg bg-bg-primary hover:bg-bg-primary-saturated text-text-inverse font-medium text-sm flex items-center gap-2"
            onClick={goToProducts}
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
            {t("continueShopping")}
          </Button>
        </div>
      )}

      {/* Wishlist Items List */}
      {showList && (
        <>
          <ul className="divide-y divide-border-subtle/80">
            {items.map((item) => {
              const { product } = item;
              const inStock = product.stock > 0;
              const pricing = getPricing(product);
              const rating = product.rating ?? 0;
              const ratingsCount = product.ratings ?? 0;

              return (
                <li
                  key={item.id}
                  className="flex gap-4 sm:gap-6 py-5 first:pt-2 last:pb-2 items-stretch justify-between"
                >
                  {/* Left: Product Image */}
                  <div className="relative size-28 sm:size-32 shrink-0 overflow-hidden rounded-xl bg-bg-soft">
                    <Image
                      src={product.cover || "/images/placeholder.webp"}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 112px, 128px"
                      className={cn(
                        "object-cover transition-opacity",
                        inStock ? "opacity-100" : "opacity-60"
                      )}
                    />
                  </div>

                  {/* Middle: Product Info */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                    <div className="space-y-1">
                      {/* Stock badge */}
                      <span
                        className={cn(
                          "block text-xs font-medium",
                          inStock ? "text-text-success" : "text-text-danger"
                        )}
                      >
                        {inStock ? t("inStock") : t("outOfStock")}
                      </span>

                      {/* Product title */}
                      <h2 className="text-base font-bold text-text-plain sm:text-lg truncate">
                        {product.title}
                      </h2>

                      {/* Rating */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="inline-flex items-center gap-1 rounded bg-bg-warning px-1.5 py-0.5 text-xs font-bold text-black leading-none">
                          <Star className="size-3 fill-black text-black" />
                          <span>{rating}/5</span>
                        </span>
                        <span className="text-xs text-text-info hover:underline cursor-pointer">
                          ({t("ratings", { count: ratingsCount })})
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1.5 pt-2">
                      <span className="text-lg font-bold text-text-plain sm:text-xl leading-none">
                        {formatPrice(pricing.current)}
                      </span>
                      <span className="text-xs font-semibold text-text-plain">
                        {t("currency")}
                      </span>
                      {pricing.hasDiscount && (
                        <span className="text-xs text-text-muted line-through sm:text-sm ltr:ml-1 rtl:mr-1">
                          {formatPrice(pricing.original)} {t("currency")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col items-end justify-between py-0.5 shrink-0">
                    {/* Delete button */}
                    <button
                      type="button"
                      aria-label={t("remove")}
                      disabled={removeItem.isPending && removeItem.variables === item.id}
                      onClick={() => removeItem.mutate(item.id)}
                      className="flex size-9 cursor-pointer items-center justify-center rounded-lg bg-bg-danger-fade text-text-danger transition-colors hover:bg-bg-danger-faint disabled:opacity-50"
                    >
                      {removeItem.isPending && removeItem.variables === item.id ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4.5" />
                      )}
                    </button>

                    {/* Stock action button */}
                    {inStock ? (
                      <Button
                        variant="primary"
                        size="sm"
                        className="h-9 px-4 rounded-lg bg-bg-primary hover:bg-bg-primary-saturated text-text-inverse font-medium text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-none"
                        onClick={handleAddToCart}
                      >
                        <ShoppingCart className="size-4" />
                        {t("addToCart")}
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-9 px-4 rounded-lg bg-bg-primary-fade hover:bg-bg-primary-faint text-text-primary dark:text-text-plain font-medium text-xs sm:text-sm cursor-pointer shadow-none"
                        onClick={goToProducts}
                      >
                        {t("exploreSimilar")}
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Continue Shopping button */}
          <div className="mt-8 flex justify-start">
            <Button
              variant="primary"
              className="h-10 px-5 rounded-lg bg-bg-primary hover:bg-bg-primary-saturated text-text-inverse font-medium text-sm flex items-center gap-2 cursor-pointer shadow-none"
              onClick={goToProducts}
            >
              <ArrowLeft className="size-4 rtl:rotate-180" />
              {t("continueShopping")}
            </Button>
          </div>
        </>
      )}

      {/* Clear Wishlist Confirmation Modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent
          className="max-w-[420px] rounded-2xl border-none bg-bg-plain p-6 sm:p-8 shadow-xl"
          aria-describedby={undefined}
        >
          <div className="flex flex-col items-center text-center">
            {/* Cleaning Brush icon in circular container */}
            <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-bg-muted">
              <BrushCleaning className="size-9 text-text-soft" strokeWidth={1.75} />
            </div>

            {/* Dialog question */}
            <DialogTitle className="text-base font-bold text-text-plain sm:text-lg max-w-[280px] leading-snug">
              {t("clearConfirm")}
            </DialogTitle>

            {/* Actions: Cancel & Confirm */}
            <div className="mt-8 flex w-full items-center gap-3">
              <Button
                variant="subtle"
                className="h-11 flex-1 rounded-lg border-none bg-bg-muted hover:bg-bg-soft text-text-plain font-semibold text-sm cursor-pointer shadow-none"
                onClick={() => setConfirmOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button
                variant="destructive"
                loading={clearWishlist.isPending}
                className="h-11 flex-1 rounded-lg bg-bg-danger hover:bg-bg-danger-saturated text-text-inverse font-semibold text-sm cursor-pointer shadow-none"
                onClick={handleClear}
              >
                {t("confirm")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}