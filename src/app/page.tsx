import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { FeaturedCollection } from '@/components/home/FeaturedCollection';
import { TrustHighlights } from '@/components/home/TrustHighlights';
import { ShopBySpace } from '@/components/home/ShopBySpace';
import { ServicesSection } from '@/components/home/ServicesSection';
import { BrandStorySection } from '@/components/home/BrandStorySection';
import { CustomerReviewsSection } from '@/components/home/CustomerReviewsSection';
import { FaqSection } from '@/components/home/FaqSection';
import { ContactVisitSection } from '@/components/home/ContactVisitSection';
import { FinalCtaSection } from '@/components/home/FinalCtaSection';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Shop by Category */}
      <CategoryShowcase />

      {/* 3. Best Sellers (Featured Collection) */}
      <FeaturedCollection />

      {/* 4. Trust / Service Highlights */}
      <TrustHighlights />

      {/* 5. Shop by Space */}
      <ShopBySpace />

      {/* 6. Services Section */}
      <ServicesSection />

      {/* 7. Why Zaira Furnishing (About) */}
      <BrandStorySection />

      {/* 8. Customer Reviews */}
      <CustomerReviewsSection />

      {/* 9. Frequently Asked Questions */}
      <FaqSection />

      {/* 10. Contact Us + Visit Us */}
      <ContactVisitSection />

      {/* 11. Final Call to Action */}
      <FinalCtaSection />
    </div>
  );
}
