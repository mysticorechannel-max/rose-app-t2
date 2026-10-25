"use client";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
export function LocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("common.locale");
  const pathname = usePathname();
  const router = useRouter();
  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>{t("label")}</span>
      <select
        aria-label={t("label")}
        className="h-10 rounded-md border border-border bg-card px-3 text-card-foreground outline-none focus:ring-2 focus:ring-ring"
        onChange={(e) => router.replace(pathname, { locale: e.target.value as AppLocale })}
        value={locale}
      >
        <option value="en">{t("en")}</option>
        <option value="ar">{t("ar")}</option>
      </select>
    </label>
  );
}
