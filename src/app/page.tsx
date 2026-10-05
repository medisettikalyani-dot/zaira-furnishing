import React from 'react';
import { EcommerceHeroBanner } from '@/components/home/EcommerceHeroBanner';
import { StunningHomeBanner } from '@/components/home/StunningHomeBanner';
import { DecorStylingSolutions } from '@/components/home/DecorStylingSolutions';
import { CategoryIconGrid } from '@/components/home/CategoryIconGrid';
import { WhatYouGetAtZaira } from '@/components/home/WhatYouGetAtZaira';
import { EcommerceProductGrid } from '@/components/home/EcommerceProductGrid';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ContactVisitSection } from '@/components/home/ContactVisitSection';
import {
  getDynamicCmsSection,
  getDynamicProducts,
} from '@/lib/db/catalog';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [
    featuredProducts,
    showroomCms,
  ] = await Promise.all([
    getDynamicProducts({ featured: true }),
    getDynamicCmsSection('home_showroom_contact'),
  ]);

  return (
    <div className="flex flex-col w-full bg-[#F8F9FA]">
      {/* 1. Full-Width Promotional Hero Banner Slider & Trust Strip */}
      <EcommerceHeroBanner />

      {/* 2. Curating What Makes Your Home Beautiful Banner */}
      <StunningHomeBanner />

      {/* 3. Bespoke Home Styling & Atelier Services (6-Card Services Section) */}
      <DecorStylingSolutions />

      {/* 4. Top Categories Of This Month */}
      <CategoryIconGrid />

      {/* 5. What you get at Zaira (Quality, Advisory, Measuring, Installation, Assistance) */}
      <WhatYouGetAtZaira />

      {/* 6. Product Category Showcase & Concierge */}
      <EcommerceProductGrid products={featuredProducts} />

      {/* 7. Verified Customer Reviews & Hyderabad Home Transformations */}
      <TestimonialsSection />

      {/* 8. Showroom Experience Visit & Fast In-Home Consultation Booking */}
      <ContactVisitSection cmsContent={showroomCms} />
    </div>
  );
}
