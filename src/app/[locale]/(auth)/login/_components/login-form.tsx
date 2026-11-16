"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import AuthTitle from "../../_components/auth-title";
import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import useLogin from "../_hooks/use-login";
import { type LoginFormValues, loginSchema } from "../_schemas/login.schema";

export default function LoginForm() {
  // Translation
  const t = useTranslations("Login");

  // Hooks
  const loginMutation = useLogin();

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Functions
  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 border-b border-border-soft pb-4">
        <AuthTitle>{t("title")}</AuthTitle>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Username */}
        <Input
          id="username"
          type="text"
          label={t("username")}
          error={errors.username ? t(errors.username.message!) : undefined}
          placeholder={t("usernamePlaceholder")}
          autoComplete="username"
          {...register("username")}
        />

        {/* Password */}
        <div className="relative">
          <Input
            id="password"
            type="password"
            label={t("password")}
            error={errors.password ? t(errors.password.message!) : undefined}
            placeholder={t("passwordPlaceholder")}
            autoComplete="current-password"
            {...register("password")}
          />

          <Link
            href="/forgot-password"
            className="absolute end-0 top-0 text-sm font-medium text-bg-primary hover:underline"
          >
            {t("forgotPassword")}
          </Link>
        </div>

        {/* API Error */}
        {loginMutation.isError && (
          <p className="text-sm text-text-danger">{t("invalidCredentials")}</p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="flex h-12 w-full items-center justify-center rounded-lg text-sm font-semibold transition hover:bg-bg-primary-saturated disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loginMutation.isPending ? t("loading") : t("submit")}
        </Button>
      </form>
      <div className="mt-6 border-t border-border-soft pt-4 text-center">
        <p className="text-xs font-medium text-text-plain">
          {t("createAccount")} {" "}
          <Link href="/register" className="font-bold text-bg-primary hover:underline">
            {t("createOneNow")}
          </Link>
        </p>
      </div>
    </div>
  );
}
