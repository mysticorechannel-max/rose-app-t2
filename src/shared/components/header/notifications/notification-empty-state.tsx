import { BellOff } from "lucide-react";
import { useTranslations } from "next-intl";

export function NotificationEmptyState() {
  const t = useTranslations("notifications");

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-bg-plain">
      <BellOff className="h-16 w-16 text-text-muted mb-4" />
      <p className="text-text-muted text-center text-sm">{t("emptyState")}</p>
    </div>
  );
}
