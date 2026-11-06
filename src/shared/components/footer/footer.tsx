import { useTranslations } from "next-intl";
import { FooterLinks } from "./footer-links";
import { FooterLogo } from "./footer-logo";
import { SubscritionForm } from "./subscrition-form";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="bg-bg-inverse dark:bg-bg-muted text-text-plain">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-4">
          {/* Left Section - Logo & Copyright */}
          <FooterLogo />

          {/* Middle Section - Discover Links */}
          <FooterLinks />

          {/* Right Section - Newsletter */}
          <div className="space-y-5 min-w-[375px]">
            <div>
              <h3 className="text-lg font-semibold text-text-secondary dark:text-text-primary">
                {t.rich("newsletter.title", {
                  highlight: (chunks) => <span className="text-text-inverse dark:text-text-plain">{chunks}</span>,
                })}
              </h3>

              <p className="text-xs text-text-muted">{t("newsletter.subtitle")}</p>
            </div>
            <SubscritionForm />
          </div>
        </div>
      </div>
    </footer>
  );
}
