import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Pinyon_Script, Sarabun, Tajawal, Great_Vibes, Aref_Ruqaa  } from "next/font/google";
import { notFound } from "next/navigation";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { routing } from "@/i18n/routing";

import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/components/providers/query-provider";




const sarabun = Sarabun({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sarabun",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
});
const pinyonScript = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon-script",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
});

const arefRuqaa = Aref_Ruqaa({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-aref-ruqaa",
});
export const metadata: Metadata = {
  title: "Rose App",
  description: "Rose App team foundation",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const direction = locale === "ar" ? "rtl" : "ltr";
  const fontClass = locale === "ar" ? "font-arabic" : "font-english";

  return (
    <html
      className={`${sarabun.variable} ${tajawal.variable} ${pinyonScript.variable} ${greatVibes.variable} ${arefRuqaa.variable}`}
      dir={direction}
      lang={locale}
      suppressHydrationWarning
    >
<body className={fontClass}>
  <NextIntlClientProvider>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        {children}
        <Toaster />
      </QueryProvider>
    </ThemeProvider>
  </NextIntlClientProvider>
</body>
    </html>
  );
}
