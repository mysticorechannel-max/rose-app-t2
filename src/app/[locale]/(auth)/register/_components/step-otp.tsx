"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useResendCountdown } from "../_hooks/use-resend-countdown";
import { confirmEmailVerificationAction, sendEmailVerificationAction } from "../_lib/actions";
import { type OtpValues, otpSchema } from "../_lib/schemas";
import { useRegister } from "../_providers/register-provider";
import { FormError } from "./form-error";
import { FooterLink } from "../../_components/auth-footer-link";

const OTP_LENGTH = 6;

export function StepOtp() {
  // Translation
  const t = useTranslations("auth.register");

  // Context
  const { email, goTo } = useRegister();

  // Custom hooks
  const { remaining, isLocked, restart } = useResendCountdown(email);

  // State
  const [serverError, setServerError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  // Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
  });

  // Functions
  async function onSubmit({ code }: OtpValues) {
    if (isSubmitting) return;
    setServerError(null);
    const res = await confirmEmailVerificationAction(email, code);
    if (!res.ok) return setServerError(t(`errors.${res.error}`));
    goTo("profile");
  }

  async function onResend() {
    if (isLocked) return;
    setServerError(null);
    setIsResending(true);
    const res = await sendEmailVerificationAction(email);
    setIsResending(false);
    if (!res.ok) return setServerError(t(`errors.${res.error}`));

    restart(); // new one-minute lock
    reset({ code: "" });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="space-y-3">
        {/* OTP digits are always left-to-right, even in Arabic */}
        <div dir="ltr" className="flex justify-center">
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <InputOTP
                maxLength={OTP_LENGTH}
                inputMode="numeric"
                pattern="^[0-9]*$"
                value={field.value}
                onChange={field.onChange}
                onComplete={() => void handleSubmit(onSubmit)()}
                aria-label={t("otp.label")}
              >
                <InputOTPGroup className="gap-2">
                  {Array.from({ length: OTP_LENGTH }, (_, index) => (
                    <InputOTPSlot key={index} index={index} className="size-11 rounded-lg border" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />
        </div>

        {errors.code?.message && (
          <p role="alert" className="text-center text-sm text-text-danger">
            {t(`validation.${errors.code.message}`)}
          </p>
        )}

        <div className="flex justify-end">
          <Button
            variant="ghost"
            type="button"
            onClick={onResend}
            disabled={isLocked || isResending}
           className="text-sm disabled:cursor-not-allowed  enabled:font-semibold"
          >
            {isLocked ? t("otp.resendIn", { seconds: remaining }) : t("otp.resend")}
          </Button>
          
        </div>
      </div>

      <FormError message={serverError} />

      <Button type="submit" className="w-full" loading={isSubmitting}>
        {t("otp.verify")}
      </Button>

      <FooterLink messageKey="needHelp" linkKey="contactUs" href="/contact-us" />
    </form>
  );
}


