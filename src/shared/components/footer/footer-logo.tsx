import { LOGO } from "@/../public/assets";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function FooterLogo() {
  // Translation
  const t = useTranslations("footer");

  return (
    <div className="space-y-6">
      <Link href="/" className="inline-block">
        <Image
          src={LOGO}
          alt={t("logoAlt")}
          width={240}
          height={225}
          className="h-[225px] w-auto"
        />
      </Link>

      <div className=" text-center">
        <p className="text-lg font-semibold text-text-secondary dark:text-text-primary">
          {t("appName")}
        </p>
        <p className="text-sm text-text-muted">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </div>
  );
}
