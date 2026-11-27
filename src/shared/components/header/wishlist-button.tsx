"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export function WishlistButton() {
  const t = useTranslations("header");

  return (
    <Link href="/wishlist" aria-label={t("wishlist")}>
      <Heart className="h-6 w-6" />
    </Link>
  );
}
