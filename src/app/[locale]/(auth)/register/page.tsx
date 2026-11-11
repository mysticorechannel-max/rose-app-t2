import { getTranslations, setRequestLocale } from "next-intl/server";
import { RegisterFlow } from "./_components/register-flow";
import { RegisterProvider } from "./_providers/register-provider";
import AuthTitle from "../_components/auth-title";

export default async function RegisterPage({ params }: PageProps<"/[locale]/register">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t=getTranslations("auth.register");

  return (

      <RegisterProvider>
        <AuthTitle>
          {(await t)("title")}
        </AuthTitle>
        <RegisterFlow />
      </RegisterProvider>
  );
}
