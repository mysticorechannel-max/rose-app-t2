"use client";

import { LockKeyhole, LogOut, UserRoundPen } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/shared/lib/utils/tailwindcn.utils";
const links = [
  { href: "/account", key: "profile", icon: UserRoundPen },
  {
    href: "/account/change-password",
    key: "changePassword",
    icon: LockKeyhole,
  },
] as const;

export function AccountSidebar() {
  const t = useTranslations("account.sidebar");
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col justify-between rounded-2xl border border-border-muted bg-bg-subtle p-4">
      <nav aria-label={t("label")} className="flex flex-col gap-2">
        {links.map(({ href, key, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-12 items-center gap-3 rounded-lg px-4 text-sm",
                active
                  ? "bg-bg-inverse text-text-inverse"
                  : "text-text-plain hover:bg-bg-muted"
              )}
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              {t(key)}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        className="flex h-12 items-center gap-3 rounded-lg bg-bg-muted px-4 text-sm text-text-danger"
      >
        <LogOut className="size-5 shrink-0" aria-hidden="true" />
        {t("logout")}
      </button>
    </aside>
  );
}