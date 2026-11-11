"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import useForgotPassword from "../../_hooks/use-forgot-password";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../../_schemas/forgot-password.schema";
import { Button } from "@/components/ui/button";

interface RequestResetStepProps {
  onSuccess: (email: string) => void;
}

export default function RequestResetStep({ onSuccess }: RequestResetStepProps) {
  const t = useTranslations("ForgotPassword");
  const locale = useLocale();
  const isArabic = locale === "ar";

  const forgotPasswordMutation = useForgotPassword();
  const [actionError, setActionError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    setActionError(null);
    forgotPasswordMutation.mutate(
      {
        email: values.email,
        redirectUrl: `${window.location.origin}/${locale}/forgot-password`,
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            onSuccess(values.email);
          } else {
            setActionError(result.message);
          }
        },
      }
    );
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 border-b border-border-soft pb-4">
        <h1 className="mb-3 text-2xl font-semibold text-text-plain">{t("title")}</h1>
        <p className="text-base font-normal text-text-plain">{t("description")}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="block text-sm font-medium text-text-primary">
            {t("email")}
          </Label>

          <Input
            id="email"
            type="text"
            placeholder={t("emailPlaceholder")}
            {...register("email")}
          />

          {errors.email && <p className="text-sm text-text-danger">{t(errors.email.message!)}</p>}
        </div>

        {(actionError || forgotPasswordMutation.isError) && (
          <p className="text-sm text-text-danger">
            {actionError || forgotPasswordMutation.error?.message}{" "}
          </p>
        )}

        <Button type="submit" disabled={forgotPasswordMutation.isPending} className="w-full">
          <span>{forgotPasswordMutation.isPending ? t("loading") : t("next")}</span>

          {!forgotPasswordMutation.isPending &&
            (isArabic ? <ArrowLeft size={18} /> : <ArrowRight size={18} />)}
        </Button>
      </form>
      <div className="mt-6 border-t border-border-soft pt-4 text-center">
        <p className="text-xs font-medium text-text-plain">
          {t("createAccount")}{" "}
          <button type="button" className="font-bold text-bg-primary hover:underline">
            {t("createOneNow")}
          </button>
        </p>
      </div>
    </div>
  );
}
