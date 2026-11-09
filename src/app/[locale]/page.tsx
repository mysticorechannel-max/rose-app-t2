import { setRequestLocale } from "next-intl/server";

import { BestSellingSection } from "@/shared/components/home/best-selling-section";
import { CompaniesSection } from "@/shared/components/home/companies-section";
import { GallerySection } from "@/shared/components/home/gallery-section";
import { MostPopularSection } from "@/shared/components/home/most-popular-section";
import { TestimonialsSection } from "@/shared/components/home/testimonials-sectionsection";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <>
      <BestSellingSection />
      <MostPopularSection />
      <GallerySection />
      <TestimonialsSection />
      <CompaniesSection />
    </>
  );
}
