import { useTranslations } from "next-intl";

import type { Review } from "../lib/types/review";
import { ReviewItem } from "./review-item";

type ReviewsListProps = {
  reviews: Review[];
};

export function ReviewsList({ reviews }: ReviewsListProps) {
  const t = useTranslations("reviews");

  if (reviews.length === 0) {
    return <p className="py-8 text-center text-sm text-text-muted">{t("empty")}</p>;
  }

  return (
    <div className="max-h-90 overflow-y-auto pe-4">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
}
