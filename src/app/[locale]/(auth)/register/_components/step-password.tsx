"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";

import { registerAction } from "../_lib/actions";
import { type PasswordValues, passwordSchema } from "../_lib/schemas";
import { useRegister } from "../_providers/register-provider";
import { FormError } from "./form-error";
import { FooterLink } from "../../_components/auth-footer-link";

function PasswordField({
  id,
  label,
  error,
  toggleLabel,
  registration,
}: {
  id: string;
  label: string;
  error?: string;
  toggleLabel: string;
  registration: ReturnType<ReturnType<typeof useForm<PasswordValues>>["register"]>;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          placeholder="********"
          aria-invalid={!!error}
          className="pe-11"
          {...registration}
        />
      </div>
      {error && (
        <p role="alert" className="text-text-danger text-sm">
          {error}
        </p>
      )}
    </div>
  );
}

export function StepPassword() {
  const t = useTranslations("auth.register");
  const { email, profile, goTo } = useRegister();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: PasswordValues) {
    if (!profile) return goTo("profile");
    setServerError(null);
    const res = await registerAction({
      email,
      profile,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
    if (!res.ok) return setServerError(t(`errors.${res.error}`));
    goTo("done");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <PasswordField
        id="password"
        label={t("fields.password")}
        toggleLabel={t("fields.togglePassword")}
        error={errors.password?.message && t(`validation.${errors.password.message}`)}
        registration={register("password")}
      />
      <PasswordField
        id="confirmPassword"
        label={t("fields.confirmPassword")}
        toggleLabel={t("fields.togglePassword")}
        error={errors.confirmPassword?.message && t(`validation.${errors.confirmPassword.message}`)}
        registration={register("confirmPassword")}
      />

      <FormError message={serverError} />

      <Button type="submit" className="mt-2 w-full" loading={isSubmitting}>
        {t("actions.next")}
      </Button>

      <FooterLink messageKey="needHelp" linkKey="contactUs" href="/contact-us" />
    </form>
  );
}
