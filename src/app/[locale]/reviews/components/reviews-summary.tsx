import { useTranslations } from "next-intl";

import { StarRating } from "./star-rating";

type ReviewsSummaryProps = {
  rating: number;
  ratings: number;
};

export function ReviewsSummary({ rating, ratings }: ReviewsSummaryProps) {
  const t = useTranslations("reviews");

  return (
    <div className="space-y-1">
      <p className="text-lg font-medium text-text-plain">{t("generalRating")}</p>
      <p className="flex items-baseline gap-2">
        <span className="text-3xl font-semibold text-text-plain">{rating.toFixed(1)}</span>
        <span className="text-xs text-text-muted">{t("ratingsCount", { count: ratings })}</span>
      </p>
      <StarRating value={rating} />
    </div>
  );
}
