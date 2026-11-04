"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import useForgotPassword from "../hooks/use-forgot-password";
import { ForgotPasswordFormValues, forgotPasswordSchema } from "../schemas/forgot-password.schema";
import { Input } from "@/components/ui/input";


export default function ForgotPasswordForm() {
  const t = useTranslations("ForgotPassword");
  const locale = useLocale();
  const isArabic = locale === "ar";

  const [step, setStep] = useState(1);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(
      {
        email: values.email,
        redirectUrl: `${window.location.origin}/${locale}/forgot-password`,
      },
      {
        onSuccess: () => {
          setSubmittedEmail(values.email);
          setStep(2);
        },
      },
    );
  };

  return (
    <div className="w-full max-w-md">
      {step === 1 && (
        <>
          <div className="mb-8">
            <h1 className="mb-3 text-2xl font-semibold text-text-plain">
              {t("title")}
            </h1>

            <p className="text-base font-normal text-text-plain">
              {t("description")}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary"
              >
                {t("email")}
              </Label>

              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                {...register("email")}
              />

              {errors.email && (
                <p className="text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {forgotPasswordMutation.isError && (
              <p className="text-sm text-red-500">
                {forgotPasswordMutation.error.message}
              </p>
            )}

            <button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-bg-primary text-sm font-semibold text-white transition hover:bg-bg-primary-saturated disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>
                {forgotPasswordMutation.isPending
                  ? t("loading")
                  : t("next")}
              </span>

              {!forgotPasswordMutation.isPending &&
                (isArabic ? (
                  <ArrowLeft size={18} />
                ) : (
                  <ArrowRight size={18} />
                ))}
            </button>
          </form>
        </>
      )}

      {step === 2 && (
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-semibold text-text-primary">
            {t("checkEmailTitle")}
          </h1>

          <p className="text-sm leading-6 text-text-secondary">
            {t("checkEmailDescription")}{" "}
            <span className="font-semibold text-text-primary">
              {submittedEmail}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}