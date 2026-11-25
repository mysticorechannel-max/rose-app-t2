import { useTranslations } from "next-intl";

const SKELETON_ROWS = 3;

export function ReviewsSkeleton() {
  const t = useTranslations("reviews");

  return (
    <div role="status" aria-busy="true" className="animate-pulse space-y-6">
      <span className="sr-only">{t("loading")}</span>
      <div className="h-10 w-64 rounded-lg bg-bg-muted" />
      <div className="grid gap-8 md:grid-cols-[3fr_auto_2fr]">
        <div className="space-y-6">
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-10 w-40 rounded-lg bg-bg-muted" />
              <div className="h-4 w-full rounded bg-bg-muted" />
              <div className="h-4 w-3/4 rounded bg-bg-muted" />
            </div>
          ))}
        </div>
        <div className="hidden w-px bg-border-soft md:block" />
        <div className="h-72 rounded-lg bg-bg-muted" />
      </div>
    </div>
  );
}
