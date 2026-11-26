import { getTranslations } from "next-intl/server";

import { redirect } from "@/i18n/navigation";
import { ProfileForm } from "./components/profile-form";
import { getProfile } from "./lib/server/get-profile";

export default async function ProfilePage({ params }: PageProps<"/[locale]/account">) {
  const { locale } = await params;
  const result = await getProfile();

  if (!result.ok && result.code === "unauthenticated") {
    redirect({ href: "/login", locale });
  }

  if (!result.ok) {
    const t = await getTranslations("account.errors");
    return (
      <p role="alert" className="text-sm text-text-danger">
        {t(result.code)}
      </p>
    );
  }

  return <ProfileForm user={result.user} />;
}
