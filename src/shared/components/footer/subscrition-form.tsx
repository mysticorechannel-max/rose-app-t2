"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useSubscribeMutation } from "@/shared/lib/apis/subscriptions/mutations/use-subscribe";
import {
  subscriptionSchema,
  type SubscriptionFields,
} from "@/shared/lib/schemes/subscription.schema";
import { Button } from "@/shared/ui/button";

export function SubscritionForm() {
  // Translation
  const t = useTranslations("footer.newsletter");
  // Locale
  const locale = useLocale();

  // Mutation
  const { mutate: subscribe, isPending } = useSubscribeMutation();

  // Form & validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscriptionFields>({
    resolver: zodResolver(subscriptionSchema),
    mode: "onSubmit",
  });

  // Functions
  const onSubmit = (data: SubscriptionFields) => {
    subscribe(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  // Effects
  useEffect(() => {
    if (errors.email) {
      const errorMessage =
        errors.email.type === "too_small"
          ? t("emailRequired")
          : errors.email.type === "invalid_string"
            ? t("invalidEmail")
            : t("invalidEmail");

      toast.error(errorMessage);
    }
  }, [errors.email, t]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-10 w-full items-center rounded-full bg-bg-default dark:bg-bg-subtle"
    >
      <input
        type="email"
        {...register("email")}
        placeholder={t("placeholder")}
        disabled={isPending}
        className="h-full min-w-0 flex-1 bg-transparent px-6 text-sm text-white outline-none placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-50"
      />

      <Button
        type="submit"
        disabled={isPending}
        className="flex h-full shrink-0 items-center gap-3 rounded-full bg-bg-primary-fade dark:bg-bg-primary px-5 text-sm font-medium text-text-primary dark:text-zinc-900 transition-colors hover:bg-bg-danger-faint disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? t("subscription") + "..." : t("subscription")}
        {locale === "en" ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
      </Button>
    </form>
  );
}
