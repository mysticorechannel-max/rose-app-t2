import { setRequestLocale } from "next-intl/server";

import { BestSellingSection } from "@/components/home/best-selling-section";
import { CompaniesSection } from "@/components/home/companies-section";
import { GallerySection } from "@/components/home/gallery-section";
import { MostPopularSection } from "@/components/home/most-popular-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";

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
