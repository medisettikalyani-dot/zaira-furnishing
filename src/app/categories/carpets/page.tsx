import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { CarpetsLanding } from '@/components/carpets/CarpetsLanding';
import { getCarpetTypeBySlug } from '@/lib/data/carpets';
import { PRODUCTS } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'Carpets & Rugs | Hand-Tufted Wool, Silk Blends & Area Rugs | Zaira Furnishing',
  description:
    'Discover bespoke hand-tufted botanical wool rugs, heirloom hand-knotted Persian carpets, lustrous silk-blend rugs, and bespoke wall-to-wall flooring solutions.',
};

interface CarpetsPageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function CarpetsCategoryPage({ searchParams }: CarpetsPageProps) {
  const resolved = await searchParams;
  if (resolved?.type && resolved.type !== 'all') {
    const matched = getCarpetTypeBySlug(resolved.type);
    if (matched) {
      redirect(`/categories/carpets/${matched.slug}`);
    }
  }

  const carpetProducts = PRODUCTS.filter(
    (product) => product.categorySlug === 'carpets-rugs'
  );

  return <CarpetsLanding products={carpetProducts} />;
}
