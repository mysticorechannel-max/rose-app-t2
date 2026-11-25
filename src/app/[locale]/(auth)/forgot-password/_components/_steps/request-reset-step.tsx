"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@/i18n/navigation";



import useForgotPassword from "../../_hooks/use-forgot-password";
import AuthTitle from "../../../_components/auth-title";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../../_schemas/forgot-password.schema";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

interface RequestResetStepProps {
  onSuccess: (email: string) => void;
}

export default function RequestResetStep({ onSuccess }: RequestResetStepProps) {
  // Translation
  const t = useTranslations("ForgotPassword");

  // Navigation
  const locale = useLocale();

  // Hooks
  const forgotPasswordMutation = useForgotPassword();

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // Variables
  const isArabic = locale === "ar";

  // Functions
  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(
      {
        email: values.email,
        redirectUrl: `${window.location.origin}/${locale}/forgot-password`,
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            onSuccess(values.email);
          }
        },
      }
    );
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 border-b border-border-soft pb-4">
        <AuthTitle>{t("title")}</AuthTitle>
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

        {forgotPasswordMutation.data?.success === false && (
          <p className="text-sm text-text-danger">{t(forgotPasswordMutation.data.errorKey)}</p>
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
          <Link href="/register" className="font-bold text-bg-primary hover:underline">
            {t("createOneNow")}
          </Link>
        </p>
      </div>
    </div>
  );
}
