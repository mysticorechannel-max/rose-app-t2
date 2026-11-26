"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { useAddReviewMutation } from "../lib/hooks/use-add-review";
import { reviewSchema, type ReviewFields } from "../lib/schemes/review.schema";
import { RatingInput } from "./rating-input";

type ReviewFormProps = {
  productId: string;
};

export function ReviewForm({ productId }: ReviewFormProps) {
  // Translation
  const t = useTranslations("reviews");

  // Mutation
  const { mutate, isPending } = useAddReviewMutation();

  // Form & validation
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFields>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, headline: "", content: "" },
  });

  // Functions
  function errorText(message?: string): string | undefined {
    return message ? t(`validation.${message}`) : undefined;
  }

  function onSubmit(values: ReviewFields): void {
    mutate({ productId, ...values }, { onSuccess: () => reset() });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-text-plain">{t("yourRating")}</span>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => <RatingInput value={field.value} onChange={field.onChange} />}
          />
        </div>
        {errors.rating && (
          <p role="alert" className="text-sm text-text-danger">
            {errorText(errors.rating.message)}
          </p>
        )}
      </div>

      <Input
        label={t("titleLabel")}
        placeholder={t("titlePlaceholder")}
        error={errorText(errors.headline?.message)}
        {...register("headline")}
      />

      <Textarea
        label={t("reviewLabel")}
        placeholder={t("reviewPlaceholder")}
        error={errorText(errors.content?.message)}
        {...register("content")}
      />

      <Button type="submit" loading={isPending} className="w-full">
        {t("submit")}
      </Button>
    </form>
  );
}
