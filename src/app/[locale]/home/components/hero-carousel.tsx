"use client";

import type { CarouselApi } from "@/shared/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/carousel";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import PillButton from "../../../../shared/components/pill-button";
import { SLIDES } from "../lib/constants/hero.contsants";

export default function HeroCarousel() {
  const t = useTranslations("home.hero.slides");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: true }}
      className="group relative h-full min-h-0 w-full"
    >
      <CarouselContent className="ml-0 h-full">
        {SLIDES.map((slide, index) => (
          <CarouselItem key={slide.title} className="h-full basis-full  pl-0">
            <div className="relative h-[430px] w-full overflow-hidden rounded-2xl">
              <Image
                src={slide.image}
                alt={t(`${index}.title`)}
                fill
                sizes="(max-width: 768px) 100vw, 75vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/45 to-black/5 rtl:bg-gradient-to-l" />

              <div className="absolute bottom-6 left-6 z-10 rtl:left-auto rtl:right-6">
                <h2 className="text-[22px] text-text-inverse font-semibold sm:text-[28px]">
                  {t(`${index}.title`)}
                </h2>

                <p className="mb-[18px] mt-0.5 text-text-inverse text-xs opacity-95">
                  {t(`${index}.subtitle`)}
                </p>

                <PillButton href={slide.href}>{t(`${index}.cta`)}</PillButton>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Pagination Dots */}
      <div className="absolute right-6 top-6 z-20 flex items-center gap-1.5 rtl:left-6 rtl:right-auto">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={current === index ? "true" : undefined}
            className={`h-[7px] rounded-full transition-all duration-300 ${
              current === index ? "w-[25px] bg-bg-primary" : "w-[7px] bg-white"
            }`}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center rounded-3xl bg-white rtl:left-6 rtl:right-auto">
        <CarouselPrevious className="static translate-y-0 border-0" />
        <CarouselNext className="static translate-y-0 border-0" />
      </div>
    </Carousel>
  );
}
