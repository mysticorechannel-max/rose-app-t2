"use client";

import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export default function AuthLocaleSwitcher() {
  const t = useTranslations("common.locale");

  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (newLocale: AppLocale) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <select
      aria-label={t("label")}
      value={locale}
      onChange={(e) => handleLocaleChange(e.target.value as AppLocale)}
      className="cursor-pointer appearance-none border-none bg-transparent text-sm font-medium text-text-primary outline-none"
    >
      <option value="en">{t("en")}</option>
      <option value="ar">{t("ar")}</option>
    </select>
  );
}