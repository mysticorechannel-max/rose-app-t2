"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { startResendLock } from "../_hooks/use-resend-countdown";
import { sendEmailVerificationAction } from "../_lib/actions";
import { type EmailValues, emailSchema } from "../_lib/schemas";
import { useRegister } from "../_providers/register-provider";
import { FormError } from "./form-error";
import { FooterLink } from "../../_components/auth-footer-link";

export function StepEmail() {
  const t = useTranslations("auth.register");
  const { email, setEmail, goTo } = useRegister();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email },
  });

  async function onSubmit(values: EmailValues) {
    setServerError(null);
    const normalized = values.email.trim();
    const res = await sendEmailVerificationAction(normalized);
    if (!res.ok) return setServerError(t(`errors.${res.error}`));

    startResendLock(normalized);
    setEmail(normalized);
    goTo("otp");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">{t("fields.email")}</Label>
        <Input
          id="email"
          type="text"
          inputMode="email"
          autoComplete="email"
          placeholder="user@example.com"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email?.message && (
          <p role="alert" className="text-destructive text-sm">
            {t(`validation.${errors.email.message}`)}
          </p>
        )}
      </div>

      <FormError message={serverError} />

      <Button type="submit" className="w-full" loading={isSubmitting}>
        {t("actions.next")}
        <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
      </Button>

      <FooterLink messageKey="haveAccount" linkKey="login" href="/login" />
    </form>
  );
}
