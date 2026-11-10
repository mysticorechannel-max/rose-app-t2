
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import PillButton from "../../../../shared/components/pill-button";
import { CATEGORIES, PROMO } from "../lib/constants/hero.contsants";
import HeroCarousel from "./hero-carousel";
import { getLocale, getTranslations } from "next-intl/server";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 inline-block rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-[#A62027]">
      {children}
    </span>
  );
}

export default async function HeroSection() {
  const t = await getTranslations("home.hero");
  const locale = await getLocale();

  return (
    <section className="container mx-auto grid h-[calc(100dvh-137px)] min-h-0 grid-rows-[2fr_1fr] gap-4 py-8 text-neutral-800">
      {/* Row 1 */}
      <div className="grid min-h-0 grid-cols-1 gap-4 md:grid-cols-[1fr_3fr]">
        {/* Promo */}
        <article className="relative min-h-0 overflow-hidden rounded-2xl bg-[#5E1218] text-white">
          {PROMO?.image && (
            <Image
              src={PROMO.image}
              alt={t("promo.title")}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#280508]/80 to-[#280508]/10" />

          <div className="absolute inset-x-4 bottom-4 z-10">
            <Badge>{t("promo.badge")}</Badge>
            <h3 className="mb-4 text-[19px] font-semibold leading-tight">{t("promo.title")}</h3>
            <PillButton href={PROMO.href}>
              {t("promo.cta")}
              {locale === "en" ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
            </PillButton>
          </div>
        </article>

        {/* Carousel */}
        <div className="min-h-0">
          <HeroCarousel />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid min-h-0 grid-cols-1 gap-4 md:grid-cols-3">
        {CATEGORIES.map((category, index) => (
          <a
            key={category.badge}
            href={category.href}
            className="relative block min-h-0 overflow-hidden rounded-2xl bg-[#6b2a2e] text-white"
          >
            <Image
              src={category.image}
              alt={t(`categories.${index}.badge`)}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-black/5" />

            <div className="absolute inset-x-4 bottom-4 z-10">
              <Badge>{t(`categories.${index}.badge`)}</Badge>
              <h3 className="text-base font-semibold leading-tight">
                {t(`categories.${index}.title`)}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
