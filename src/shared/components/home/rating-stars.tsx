import { Star } from "lucide-react";

import { cn } from "@/shared/lib/utils/tailwindcn.utils";

interface RatingStarsProps {
    value: number;
    total?: number;
    className?: string;
}

export function RatingStars({ value, total = 5, className }: RatingStarsProps) {
    // Variables
    const rounded = Math.round(value);
    const stars = Array.from({ length: total });

    return (
        <div
            className={cn("flex items-center gap-0.5", className)}
            role="img"
            aria-label={`${value} / ${total}`}
        >
            {stars.map((_, index) => {
                const isFilled = index < rounded;

                return (
                    <Star
                        key={index}
                        aria-hidden="true"
                        className={cn(
                            "size-4",
                            isFilled
                                ? "fill-bg-warning text-bg-warning"
                                : "fill-transparent text-border-soft"
                        )}
                    />
                );
            })}
        </div>
    );
}
