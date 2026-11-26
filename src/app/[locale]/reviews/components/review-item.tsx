import { useFormatter } from "next-intl";

import type { Review } from "../lib/types/review";
import { StarRating } from "./star-rating";

type ReviewItemProps = {
  review: Review;
};

export function ReviewItem({ review }: ReviewItemProps) {
  const format = useFormatter();

  const { user, rating, headline, content, createdAt } = review;
  const fullName = `${user.firstName} ${user.lastName}`;
  const initial = user.firstName.charAt(0).toUpperCase();
  const date = format.dateTime(new Date(createdAt), {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="space-y-2 border-b border-border-soft py-4 last:border-b-0">
      <header className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-10 items-center justify-center rounded-full bg-bg-primary font-semibold text-text-inverse"
        >
          {initial}
        </span>
        <div>
          <p className="text-sm font-medium text-text-plain">{fullName}</p>
          <time dateTime={createdAt} className="text-xs text-text-muted">
            {date}
          </time>
        </div>
      </header>

      <div className="flex items-center gap-2">
        <StarRating value={rating} />
        <span className="text-sm text-text-plain">({rating})</span>
      </div>

      <h3 className="font-semibold text-text-plain">{headline}</h3>
      <p className="whitespace-pre-line break-words text-sm text-text-soft">{content}</p>
    </article>
  );
}