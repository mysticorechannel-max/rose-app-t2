import { getTranslations, setRequestLocale } from "next-intl/server";
import { AccountSidebar } from "./components/account-sidebar";

export default async function AccountLayout({
  children,
  params,
}: LayoutProps<"/[locale]/account">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("account");

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>
      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        <AccountSidebar />
        <section>{children}</section>
      </div>
    </main>
  );
}