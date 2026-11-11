import { useTranslations } from "next-intl";
import Link from "next/link";
import { discoverLinks } from "../../lib/constants/footer.constants";

export function FooterLinks() {
  // Translation
  const t = useTranslations("footer");
  return (
    <div className="flex-1 px-4">
      <h3 className="text-lg font-semibold text-text-secondary dark:text-text-primary">{t("discover.title")}</h3>
      <ul>
        {discoverLinks.map(({ key, href }) => (
          <li key={key}>
            <Link
              href={href}
              className="text-sm transition-colors text-text-soft hover:text-text-primary"
            >
              {t(`discover.${key}`)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
