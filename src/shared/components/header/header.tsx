import { useTranslations } from "next-intl";
import Image from "next/image";

import { LOGO } from "@/../public/assets";
import { Link } from "@/i18n/navigation";

import { LocaleSwitcher } from "@/shared/components/switchers/locale-switcher";
import { CartButton } from "./cart-button";
import { LoginButton } from "./login-button";
import { Navbar } from "./nav";
import { NotificationDropdown as NotificationButton } from "./notifications";
import { SearchBar } from "./search-bar";
import { WishlistButton } from "./wishlist-button";

export function Header() {
  const t = useTranslations("header");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-bg-plain">
      {/* Top Bar */}
      <div className="container mx-auto py-1 ">
        <div className="flex h-20 items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src={LOGO}
              alt={t("logoAlt")}
              width={85}
              height={80}
              className="h-[80px] w-auto"
              priority
            />
          </Link>

          {/* Search Bar */}
          <SearchBar />

          {/* Actions */}
          <div className="flex items-center divide-x divide-gray-300">
            <div className="py-1.5">
              <LoginButton />
            </div>

            <div className="flex items-center gap-2.5 px-4 py-1.5">
              <WishlistButton />
              <CartButton />
              <NotificationButton />
            </div>

            {/* Locale Switcher */}
            <div className="hidden lg:block">
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <Navbar />
    </header>
  );
}
