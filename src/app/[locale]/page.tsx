import { setRequestLocale } from "next-intl/server";

import { BestSellingSection } from "@/components/home/best-selling-section";
import { CompaniesSection } from "@/components/home/companies-section";
import { GallerySection } from "@/components/home/gallery-section";
import { MostPopularSection } from "@/components/home/most-popular-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ModeToggle } from "@/components/ui/toggle-group";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main className="min-h-svh bg-background">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-end gap-4 px-4 py-4 sm:px-6">
        <ModeToggle />
        <LocaleSwitcher />
      </header>

      <BestSellingSection />
      <MostPopularSection />
      <GallerySection />
      <TestimonialsSection />
      <CompaniesSection />
    </main>
  );
}
