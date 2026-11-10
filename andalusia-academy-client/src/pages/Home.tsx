import HeroSection from "../sections/HeroSection";
import CareerPathDiscovery from "../sections/CareerPathDiscovery";
import PopularCategories from "../sections/PopularCategories";
import FeaturedCourses from "../sections/FeaturedCourses";
import ComingSoonSection from "../sections/ComingSoonSection";
import CorporateSection from "../sections/CorporateSection";
import PartnersSection from "../sections/PartnersSection";
import TestimonialsSection from "../sections/TestimonialsSection";
import CTASection from "../sections/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CareerPathDiscovery />
      <PopularCategories />
      <FeaturedCourses />
      <ComingSoonSection />
      <CorporateSection />
      <PartnersSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
