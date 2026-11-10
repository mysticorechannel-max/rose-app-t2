

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { ABOUT_IMAGES, BENEFITS } from "@/app/[locale]/home/lib/constants/about.contstant";
import { getLocale, getTranslations } from "next-intl/server";



export default async function AboutSection() {
  const t = await getTranslations("home.about");
  const locale = await getLocale();

  return (
    <section className="container mx-auto grid grid-cols-1 items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-14 lg:gap-20">
      {/* Images */}
      <div className="mx-auto grid w-full max-w-[500px] grid-cols-[1.6fr_1fr] gap-2">
        {/* Main Image */}
        <div className="relative mt-2 aspect-[0.85] rounded-[30px_160px_130px_100px] border-[3px] border-border-primary p-1 rotate-2">
          <div className="relative left-2 top-2 h-full w-full overflow-hidden rounded-[30px_110px_110px_110px] -rotate-2">
            <Image
              src={ABOUT_IMAGES[0].src}
              alt={t("images.0.alt")}
              fill
              sizes="(max-width: 768px) 60vw, 260px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Small Images */}
        <div className="flex flex-col gap-2">
          <div className="relative aspect-square overflow-hidden rounded-full">
            <Image
              src={ABOUT_IMAGES[1].src}
              alt={t("images.1.alt")}
              fill
              sizes="(max-width: 768px) 45vw, 140px"
              className="object-cover"
            />
          </div>

          <div className="relative aspect-[1.2/.9] overflow-hidden rounded-[28%_45%_45%_28%]">
            <Image
              src={ABOUT_IMAGES[2].src}
              alt={t("images.2.alt")}
              fill
              sizes="(max-width: 768px) 45vw, 170px"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col">
        <span className="mb-4 text-xs font-semibold tracking-[0.3em] text-text-secondary">
          {t("badge")}
        </span>

        <h2 className="mb-2 text-2xl font-bold leading-tight text-text-primary md:text-[28px]">
          {t("title.part1")} <span className="text-text-secondary">{t("title.highlight1")}</span> {t("title.part2")}{" "}
          <span className="text-text-secondary">{t("title.highlight2")}</span>
        </h2>

        <p className="mb-5 text-sm leading-relaxed text-neutral-500">
          {t("description")}
        </p>

        <Link
          href="/about"
          className="mb-6 inline-flex w-fit items-center gap-3 rounded-lg bg-bg-primary-saturated px-4 py-2 text-xs font-medium text-text-inverse transition hover:bg-bg-primary"
        >
          {t("cta")}
         {locale === "en" ? <ArrowRight size={15} /> : <ArrowLeft size={15}/>}
        </Link>

        {/* Benefits */}
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
          {BENEFITS.map((benefit, index) => (
            <div key={benefit} className="flex items-center gap-3">
              <Check size={16} strokeWidth={2} className="shrink-0 text-text-primary" />
              <span className="text-xs text-neutral-700">{t(`benefits.${index}`)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
