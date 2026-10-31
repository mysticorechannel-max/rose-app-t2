
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";



export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations("common");

  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden px-6 py-16">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-80 bg-primary/10 blur-3xl"
      />
      <section className="w-full max-w-3xl rounded-3xl border border-border bg-card/90 p-8 shadow-xl shadow-primary/5 backdrop-blur sm:p-12">
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
          <span className="text-sm font-semibold tracking-wide text-primary">{t("appName")}</span>
          <LocaleSwitcher />
        </div>
        <div className="max-w-2xl">
          <div className="mb-6 size-14 rounded-full bg-primary/15 p-3">
            <div className="size-full rounded-full bg-primary" />
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-card-foreground sm:text-6xl">
            {t("welcome")}
          </h1>
          <p className="mt-5 text-pretty text-lg leading-8 text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <div className="mt-12">
          <ThemeSwitcher />
        </div>
      </section>


    </main>
  );
}
