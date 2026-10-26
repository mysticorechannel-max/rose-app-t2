import { defineRouting } from "next-intl/routing";

export const locales = ["en", "ar"] as const;

export type AppLocale = (typeof locales)[number];

export const routing = defineRouting({ locales, defaultLocale: "en" });
