import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function AccountPage({params,}: PageProps<"/[locale]/account">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("account.sidebar");

  return <h1 className="text-3xl font-bold">{t("profile")}</h1>;
}