import { useTranslations } from "next-intl";

import { cn } from "@/shared/lib/utils/tailwindcn.utils";

export function ProductsEmptyState({ className }: { className?: string }) {
  const t = useTranslations("products");

  return <p className={cn("py-20 text-center text-text-muted", className)}>{t("empty")}</p>;
}
