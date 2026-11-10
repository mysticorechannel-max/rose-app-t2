import { setRequestLocale } from "next-intl/server";

import AboutSection from "@/app/[locale]/about/commponents/about-section";
import FeatureSection from "./home/components/feature-section";
import HeroSection from "./home/components/hero-section";


export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main className="bg-background container mx-auto">
      {/* Hero Section with Carousel */}
      <HeroSection />
      
      {/* Feature section */}
      <FeatureSection />

      {/* About Section */}
      <AboutSection />

    </main>
  );
}
