
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type FooterLinkProps = {
  messageKey: string;
  linkKey: string;
  href: string;
};

export function FooterLink({
  messageKey,
  linkKey,
  href,
}: FooterLinkProps) {
  const t = useTranslations("auth.register");

  return (
    <div className="border-t pt-4 text-center text-sm">
      {t(messageKey)}{" "}
      <Link
        href={href}
        className="text-text-primary font-semibold"
      >
        {t(linkKey)}
      </Link>
    </div>
  );
}
