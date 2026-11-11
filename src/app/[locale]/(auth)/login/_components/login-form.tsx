"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/shared/ui/button";

import useLogin from "../_hooks/use-login";
import { LoginFormValues, loginSchema } from "../_schemas/login.schema";
import Link from "next/link";

export default function LoginForm() {
  const t = useTranslations("Login");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLogin();
  const locale = useLocale();

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

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 border-b border-border-soft pb-4">
        <h1 className="mb-3 text-2xl font-semibold text-text-plain text-center">{t("title")}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username" className="block text-sm font-medium text-text-primary">
            {t("username")}
          </Label>

          <Input
            id="username"
            type="text"
            placeholder={t("usernamePlaceholder")}
            autoComplete="username"
            {...register("username")}
          />

          {errors.username && <p className="text-sm text-text-danger">{t(errors.username.message!)}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-text-primary">
              {t("password")}
            </Label>

            <Link
              href={`/${locale}/forgot-password`}
              className="text-sm font-medium text-bg-primary hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("passwordPlaceholder")}
              autoComplete="current-password"
              className="pr-10"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errors.password && <p className="text-sm text-text-danger">{t(errors.password.message!)}</p>}
        </div>

        {/* API Error */}
        {loginMutation.isError && (
          <p className="text-sm text-text-danger">{loginMutation.error.message}</p>
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
          {t("createAccount")}{" "}
          <button type="button" className="font-bold text-bg-primary hover:underline">
            {t("createOneNow")}
          </button>
        </p>
      </div>
    </div>
  );
}
