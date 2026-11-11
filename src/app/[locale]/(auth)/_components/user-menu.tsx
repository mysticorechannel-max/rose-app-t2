"use client";

import {
  ChevronDownIcon,
  LogOutIcon,
  MapPinHouseIcon,
  ScrollTextIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useRouter } from "@/i18n/navigation";

const MAIN_ITEMS = [
  { href: "/account", icon: UserIcon, labelKey: "account" },
  { href: "/account/addresses", icon: MapPinHouseIcon, labelKey: "addresses" },
  { href: "/account/orders", icon: ScrollTextIcon, labelKey: "orders" },
] as const;

const MENU_ITEM_CLASS_NAME = "cursor-pointer gap-3 px-3 py-2 text-text-plain";

type UserMenuProps = {
  name?: string | null;
};

function getFirstName(name?: string | null) {
  return name?.trim().split(" ")[0] ?? "";
}

function UserMenu({ name }: UserMenuProps) {
  const t = useTranslations("auth.UserMenu");
  const router = useRouter();
  const firstName = getFirstName(name);
  const greeting = firstName ? t("greeting", { name: firstName }) : t("greetingFallback");


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" aria-label={t("openMenu")}>
          {greeting}
          <ChevronDownIcon aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-56 rounded-xl p-0 bg-bg-plain">
        {/* Header */}
        {name && (
          <DropdownMenuLabel className="px-3 py-3 font-medium text-text-primary border-b border-border-soft">
            {name}
          </DropdownMenuLabel>
        )}

        {/* Main links */}
        {MAIN_ITEMS.map(({ href, icon: Icon, labelKey }) => (
          <DropdownMenuItem key={href} asChild className={MENU_ITEM_CLASS_NAME}>
            <Link href={href}>
              <Icon className="size-4" aria-hidden="true" />
              {t(labelKey)}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator className="my-0" />

        {/* Dashboard */}
        <DropdownMenuItem asChild className={MENU_ITEM_CLASS_NAME}>
          <Link href="/dashboard">
            <SettingsIcon className="size-4" aria-hidden="true" />
            {t("dashboard")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-0" />

        {/* Log out */}
        <DropdownMenuItem  className={MENU_ITEM_CLASS_NAME}>
          <LogOutIcon className="size-4" aria-hidden="true" />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { UserMenu };