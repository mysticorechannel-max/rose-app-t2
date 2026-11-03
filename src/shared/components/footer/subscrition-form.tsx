"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useSubscribeMutation } from "@/app/api/subscriptions/mutations/useSubscribe";
import {
  subscriptionSchema,
  type SubscriptionFields,
} from "@/shared/lib/schemes/subscription.schema";

export function SubscritionForm() {
  // Translation
  const t = useTranslations("footer.newsletter");

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
      className="flex h-10 w-full items-center rounded-full bg-bg-default"
    >
      <input
        type="email"
        {...register("email")}
        placeholder={t("placeholder")}
        disabled={isPending}
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-50"
      />

      <button
        type="submit"
        disabled={isPending}
        className="flex h-full shrink-0 items-center gap-3 rounded-full bg-bg-primary-fade px-5 text-sm font-medium text-text-primary transition-colors hover:bg-[#F8DADA] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? t("subscription") + "..." : t("subscription")}
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
