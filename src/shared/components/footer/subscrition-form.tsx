import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SubscritionForm() {
  // Translation
  const t = useTranslations("footer");

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-text-secondary">
          {t("newsletter.title")
            .split("20%")
            .map((part, index) => (
              <span key={index}>
                {part}
                {index === 0 && <span className="text-text-inverse">20%</span>}
              </span>
            ))}
        </h3>
        <p className="text-xs text-zinc-400">{t("newsletter.subtitle")}</p>
      </div>

      <form className="flex h-10 w-full items-center rounded-full bg-bg-default">
        <input
          type="email"
          placeholder="Enter Your Email"
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-text-muted"
        />

        <button
          type="submit"
          className="flex h-full shrink-0 items-center gap-3 rounded-full bg-bg-primary-fade px-5 text-sm font-medium text-text-primary transition-colors hover:bg-[#F8DADA]"
        >
          Subscribe
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
