"use client";

import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export function CartButton() {
  const t = useTranslations("header");

  return (
    <Link href="/cart" aria-label={t("cart")}>
      <ShoppingCart className="h-6 w-6" />
    </Link>
  );
}
