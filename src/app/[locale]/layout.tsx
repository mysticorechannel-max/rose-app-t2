import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Pinyon_Script, Sarabun, Tajawal } from "next/font/google";
import { notFound } from "next/navigation";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { AppProviders } from "@/shared/providers/app-providers";
import { FAVICON } from "@/../public/assets";
import { routing } from "@/i18n/routing";
import { Footer, Header } from "@/shared/components";
import "../globals.css";
import { Toaster } from "@/shared/ui/sonner";

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

// Font stack configuration:
// - English pages: Poppins (primary) → Cairo (fallback for Arabic text)
// - Arabic pages: Cairo (primary) → Poppins (fallback for Latin text)
// This ensures proper rendering of mixed-language content

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
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppProviders>
              {children}
              <Toaster />
            </AppProviders>
          </ThemeProvider>
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
