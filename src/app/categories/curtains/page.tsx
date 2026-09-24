import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { CurtainsLanding } from '@/components/curtains/CurtainsLanding';
import { getCurtainTypeBySlug } from '@/lib/data/curtains';

export const metadata: Metadata = {
  title: 'Curtains & Drapes | Bespoke Window Treatments | Zaira Furnishing',
  description:
    'Explore our collection of bespoke residential and commercial window curtains, sheer drapes, blackout fabrics, and tailored window treatments.',
};

interface CurtainsPageProps {
  searchParams: Promise<{ type?: string }>;
}

import { PRODUCTS } from '@/lib/data/products';

export default async function CurtainsCategoryPage({ searchParams }: CurtainsPageProps) {
  const resolved = await searchParams;
  if (resolved?.type && resolved.type !== 'all') {
    const matched = getCurtainTypeBySlug(resolved.type);
    if (matched) {
      redirect(`/categories/curtains/${matched.slug}`);
    }
  }

  const curtainProducts = PRODUCTS.filter(
    (product) => product.categorySlug === 'curtains-drapes'
  );

  return <CurtainsLanding products={curtainProducts} />;
}
