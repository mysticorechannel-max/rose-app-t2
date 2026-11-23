"use client";

import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/shared/ui/button";

export function LoginButton() {
  // Translation
  const t = useTranslations("header");

  // Navigation
  const router = useRouter();

  // Session
  const { data: session, status } = useSession();

  // Variables
  const isAuthenticated = status === "authenticated";
  const label = isAuthenticated ? (session?.user?.name ?? session?.user?.username) : t("login");

  return (
    <Button
      variant="ghost"
      className="gap-2 hover:bg-transparent"
      onClick={() => router.push(isAuthenticated ? "/account" : "/login")}
    >
      <User className="h-5 w-5" />
      <span className="hidden max-w-32 truncate text-base font-normal sm:inline">{label}</span>
    </Button>
  );
}
