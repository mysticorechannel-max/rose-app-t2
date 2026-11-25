import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";

import { authOptions } from "@/auth";
import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/utils/tailwindcn.utils";
import { getReviews } from "../lib/server/get-reviews";
import { ReviewForm } from "./review-form";
import { ReviewsList } from "./reviews-list";
import { ReviewsSummary } from "./reviews-summary";

type ProductReviewsProps = {
  productId: string;
  rating: number;
  ratings: number;
};

export async function ProductReviews({ productId, rating, ratings }: ProductReviewsProps) {
  // Translation
  const t = await getTranslations("reviews");

  // Data
  const [session, result] = await Promise.all([getServerSession(authOptions), getReviews({ productId })]);
  const isGuest = !session;

  return (
    <section aria-labelledby="product-reviews-heading" className="space-y-6">
      <div className="space-y-3">
        <h2 id="product-reviews-heading" className="text-3xl font-bold text-text-primary">
          {t("title")}
        </h2>
        <ReviewsSummary rating={rating} ratings={ratings} />
      </div>

      <hr className="border-border-soft" />

      <div className="grid gap-8 md:grid-cols-[3fr_auto_2fr]">
        {result.ok ? (
          <ReviewsList reviews={result.payload.data} />
        ) : (
          <p role="alert" className="py-8 text-center text-sm text-text-danger">
            {t("loadError")}
          </p>
        )}

        <div className="hidden w-px bg-border-soft md:block" />

        <div className="relative">
          <div
            inert={isGuest}
            aria-hidden={isGuest || undefined}
            className={cn(isGuest && "pointer-events-none select-none blur-sm")}
          >
            <ReviewForm productId={productId} />
          </div>

          {isGuest && (
            <Link
              href="/login"
              className="absolute inset-0 flex items-center justify-center p-4 text-center font-medium text-text-primary underline"
            >
              {t("loginToReview")}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
