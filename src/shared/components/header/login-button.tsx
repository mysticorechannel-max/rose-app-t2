"use client";

import { User } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";

export function LoginButton() {
  const t = useTranslations("header");

  return (
    <Button variant="ghost" size="sm" asChild className="gap-2 hover:bg-transparent">
      <Link href="/auth/login">
        <User className="h-5 w-5" />
        <span className="hidden sm:inline text-base font-normal">{t("login")}</span>
      </Link>
    </Button>
  );
}
