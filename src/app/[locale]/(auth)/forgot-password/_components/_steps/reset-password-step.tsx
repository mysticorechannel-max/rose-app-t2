"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import useResetPassword from "../../_hooks/use-reset-password";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../../_schemas/reset-password.schema";
import { Button } from "@/components/ui/button";

interface ResetPasswordStepProps {
  token: string;
}

export default function ResetPasswordStep({ token }: ResetPasswordStepProps) {
  const t = useTranslations("ForgotPassword");
  const resetPasswordMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    resetPasswordMutation.mutate(
      {
        token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            toast.success(t("resetSuccess"));
          } else {
            toast.error(result.message);
          }
        },
      }
    );
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 border-b border-border-soft pb-4">
        <h1 className="mb-3 text-2xl font-semibold text-text-plain">{t("resetTitle")}</h1>
        <p>{t("resetDis")}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="newPassword" className="block text-sm font-medium text-text-primary">
            {t("newPassword")}
          </Label>

          <Input
            id="newPassword"
            type="password"
            placeholder={t("newPasswordPlaceholder")}
            {...register("newPassword")}
          />

          {errors.newPassword && (
            <p className="text-sm text-text-danger">{t(errors.newPassword.message!)}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary">
            {t("confirmPassword")}
          </Label>

          <Input
            id="confirmPassword"
            type="password"
            placeholder={t("confirmPasswordPlaceholder")}
            {...register("confirmPassword")}
          />

          {errors.confirmPassword && (
            <p className="text-sm text-text-danger">{t(errors.confirmPassword.message!)}</p>
          )}
        </div>

        {resetPasswordMutation.isError && (
          <p className="text-sm text-text-danger">{resetPasswordMutation.error.message}</p>
        )}

        <Button type="submit" disabled={resetPasswordMutation.isPending} className="w-full">
          {resetPasswordMutation.isPending ? t("resetLoading") : t("resetButton")}
        </Button>
      </form>
      <div className="mt-6 border-t border-border-soft pt-4 text-center">
        <p className="text-xs font-medium text-text-plain">
          {t("needHelp")}{" "}
          <button type="button" className="font-bold text-bg-primary hover:underline">
            {t("contactUs")}
          </button>
        </p>
      </div>
    </div>
  );
}
