import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
<<<<<<< HEAD

import { Sarabun, Tajawal } from "next/font/google";
=======
import { setRequestLocale } from "next-intl/server";
import { Pinyon_Script, Sarabun, Tajawal } from "next/font/google";
>>>>>>> origin/sprint/2-auth-home-products
import { notFound } from "next/navigation";

import { FAVICON } from "@/../public/assets";
import { routing } from "@/i18n/routing";

import { AppProviders } from "../../shared/providers/app-providers";

<<<<<<< HEAD
import { Footer, Header } from "@/shared/components";
import "../globals.css";
import { setRequestLocale } from "next-intl/server";
=======
import "../../../globals.css";
>>>>>>> origin/sprint/2-auth-home-products

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

// Font stack configuration:
// - English pages: Poppins (primary) → Cairo (fallback for Arabic text)
// - Arabic pages: Cairo (primary) → Poppins (fallback for Latin text)
// This ensures proper rendering of mixed-language content
const pinyonScript = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon-script",
});

export const metadata: Metadata = {
  title: "Rose App",
  description: "Rose App team foundation",
  icons: {
    icon: FAVICON,
  },
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
      className={`${sarabun.variable} ${tajawal.variable} ${pinyonScript.variable}`}
      dir={direction}
      lang={locale}
      suppressHydrationWarning
    >
      <body className={fontClass}>
        <NextIntlClientProvider>
          <AppProviders>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
}
