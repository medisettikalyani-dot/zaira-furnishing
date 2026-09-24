import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/lib/data/products';
import { CARPET_TYPES, getCarpetTypeBySlug } from '@/lib/data/carpets';
import { CarpetTypePage } from '@/components/carpets/CarpetTypePage';

interface CarpetTypeRouteProps {
  params: Promise<{ type: string }>;
}

export async function generateStaticParams() {
  return CARPET_TYPES.map((t) => ({
    type: t.slug,
  }));
}

export async function generateMetadata({ params }: CarpetTypeRouteProps): Promise<Metadata> {
  const resolved = await params;
  const carpetType = getCarpetTypeBySlug(resolved.type);

  if (!carpetType) {
    return {
      title: 'Carpets & Rugs | Zaira Furnishing',
    };
  }

  return {
    title: `${carpetType.name} | Carpets & Rugs | Zaira Furnishing`,
    description: carpetType.description,
  };
}

export default async function CarpetTypeRoute({ params }: CarpetTypeRouteProps) {
  const resolved = await params;
  const carpetType = getCarpetTypeBySlug(resolved.type);

  if (!carpetType) {
    notFound();
  }

  // Filter only carpet products
  const carpetProducts = PRODUCTS.filter(
    (product) => product.categorySlug === 'carpets-rugs'
  );

  return <CarpetTypePage carpetType={carpetType} products={carpetProducts} />;
}
