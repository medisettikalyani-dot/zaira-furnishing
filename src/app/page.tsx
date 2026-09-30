import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { FeaturedCollection } from '@/components/home/FeaturedCollection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { BrandStorySection } from '@/components/home/BrandStorySection';
import { ContactVisitSection } from '@/components/home/ContactVisitSection';
import {
  getDynamicCmsSection,
  getDynamicProducts,
  getDynamicServices,
  getDynamicCategoryDiscovery,
} from '@/lib/db/catalog';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [
    heroCms,
    featuredCms,
    featuredProducts,
    brandStoryCms,
    showroomCms,
    discoveryCategories,
    services,
  ] = await Promise.all([
    getDynamicCmsSection('home_hero'),
    getDynamicCmsSection('home_featured_furnishings'),
    getDynamicProducts({ featured: true }),
    getDynamicCmsSection('home_brand_story'),
    getDynamicCmsSection('home_showroom_contact'),
    getDynamicCategoryDiscovery(),
    getDynamicServices(),
  ]);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section (Driven by D1 CMS) */}
      <HeroSection cmsContent={heroCms} />

      {/* 2. Shop by Category (Driven by D1 Categories & Subcategories) */}
      <CategoryShowcase categories={discoveryCategories} />

      {/* 3. Featured Products & Collections (Driven by D1 Products + CMS) */}
      <FeaturedCollection
        products={featuredProducts}
        title={featuredCms?.title || undefined}
        subtitle={featuredCms?.subtitle || undefined}
      />

      {/* 4. Atelier Furnishing & Value-Added Services Highlight (Driven by D1 Services) */}
      <ServicesSection services={services} />

      {/* 5. Short Brand / Atelier Section (Driven by D1 CMS) */}
      <BrandStorySection cmsContent={brandStoryCms} />

      {/* 6. Clear Shopping & Showroom Contact CTA (Driven by D1 CMS) */}
      <ContactVisitSection cmsContent={showroomCms} />
    </div>
  );
}
