import { useTranslations } from "next-intl";
import { FooterLinks } from "./footer-links";
import { FooterLogo } from "./footer-logo";
import { SubscritionForm } from "./subscrition-form";

export function Footer() {
    const t = useTranslations("footer");
  return (
    <footer className="bg-bg-inverse text-zinc-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-4">
          {/* Left Section - Logo & Copyright */}
          <FooterLogo />

          {/* Middle Section - Discover Links */}
          <FooterLinks />

          {/* Right Section - Newsletter */}
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
            <SubscritionForm />
          </div>
        </div>
      </div>
    </footer>
  );
}
