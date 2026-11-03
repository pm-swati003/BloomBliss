import { HeroSection } from "../components/HeroSection";
import { FeaturedCategories } from "../components/FeaturedCategories";
import { BestSelling } from "../components/BestSelling";
import { USPSection } from "../components/USPSection";
import { OccasionBanner } from "../components/OccasionBanner";
import { Reviews } from "../components/Reviews";
import { Newsletter } from "../components/Newsletter";

export function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <BestSelling />
      <USPSection />
      <OccasionBanner />
      <Reviews />
      <Newsletter />
    </>
  );
}
