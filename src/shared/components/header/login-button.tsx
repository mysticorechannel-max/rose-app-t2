"use client";

import { User } from "lucide-react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";

export function LoginButton() {
  const t = useTranslations("header");
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="gap-2 hover:bg-transparent"
      onClick={() => router.push("/auth/login")}
    >
      <User className="h-5 w-5" />
      <span className="hidden sm:inline text-base font-normal">{t("login")}</span>
    </Button>
  );
}
