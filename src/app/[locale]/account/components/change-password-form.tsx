"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useChangePasswordMutation } from "../lib/apis/mutations/use-change-password";
import {
  passwordSchema,
  type PasswordFields,
} from "../lib/schemes/password.schema";

export function ChangePasswordForm() {
  // Translation
  const t = useTranslations("account");

  // Mutation
const { mutate, isPending } = useChangePasswordMutation();

  // Form & validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFields>({
    resolver: zodResolver(passwordSchema),
defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },  });

  // Functions
  function errorText(message?: string): string | undefined {
    return message ? t(`validation.${message}`) : undefined;
  }

 function onSubmit(values: PasswordFields): void {
  mutate(values, { onSuccess: () => reset() });
}

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input
        type="password"
        label={t("changePassword.oldPassword")}
        autoComplete="current-password"
        placeholder="********"
        error={errorText(errors.currentPassword?.message)}
        {...register("currentPassword")}
      />

      <hr className="border-border-muted" />

      <Input
        type="password"
        label={t("changePassword.newPassword")}
        autoComplete="new-password"
        placeholder="********"
        error={errorText(errors.newPassword?.message)}
        {...register("newPassword")}
      />
      <Input
        type="password"
        label={t("changePassword.confirmPassword")}
        autoComplete="new-password"
        placeholder="********"
        error={errorText(errors.confirmPassword?.message)}
        {...register("confirmPassword")}
      />

      <div className="flex justify-end pt-6">
        <Button type="submit" loading={isSubmitting} className="min-w-52">
          {t("changePassword.submit")}
        </Button>
      </div>
    </form>
  );
}