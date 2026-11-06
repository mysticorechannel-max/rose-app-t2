"use client";

import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/shared/lib/utils/tailwindcn.utils";
import { Button } from "@/shared/ui/button";

export function LocaleSwitcher() {
  // Translation
  const t = useTranslations("common.locale");

  // Navigation
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();

  // Functions
  const toggleLocale = () => {
    const newLocale: AppLocale = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleLocale}
      aria-label={t("label")}
      className="gap-2 hover:bg-transparent"
    >
      <span
        className={cn(`text-base font-normal`, locale === "en" ? "font-arabic" : "font-english")}
      >
        {locale === "en" ? "العربية" : "English"}
      </span>
    </Button>
  );
}
