"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { navItems } from "../../../lib/constants/navbar.constant";

export function NavMenu() {
  const t = useTranslations("header");
  const pathname = usePathname();

  return (
    <ul className="flex h-12 items-center justify-center gap-15">
      {navItems.map(({ key, href, icon: Icon }) => {
        const isActive = pathname === href;

        return (
          <li key={key} className="flex-shrink-0">
            <Link
              href={href}
              className={`relative flex items-center gap-2 text-sm transition-colors hover:text-primary-foreground/80
                  after:absolute after:-bottom-3.5 after:left-0 after:h-0.5 after:w-full after:bg-bg-secondary after:transition-transform
                  ${isActive ? "after:scale-x-100 text-pink-200" : "after:scale-x-0"}
                `}
            >
              <Icon className="h-5 w-5" />
              <span className="capitalize">{t(`nav.${key}`)}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
