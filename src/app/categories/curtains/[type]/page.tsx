import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/lib/data/products';
import { CURTAIN_TYPES, getCurtainTypeBySlug } from '@/lib/data/curtains';
import { CurtainTypePage } from '@/components/curtains/CurtainTypePage';

interface CurtainTypeRouteProps {
  params: Promise<{ type: string }>;
}

export async function generateStaticParams() {
  return CURTAIN_TYPES.map((t) => ({
    type: t.slug,
  }));
}

export async function generateMetadata({ params }: CurtainTypeRouteProps): Promise<Metadata> {
  const resolved = await params;
  const curtainType = getCurtainTypeBySlug(resolved.type);

  if (!curtainType) {
    return {
      title: 'Curtains | Zaira Furnishing',
    };
  }

  return {
    title: `${curtainType.name} | Zaira Furnishing`,
    description: curtainType.description,
  };
}

export default async function CurtainTypeRoute({ params }: CurtainTypeRouteProps) {
  const resolved = await params;
  const curtainType = getCurtainTypeBySlug(resolved.type);

  if (!curtainType) {
    notFound();
  }

  // Filter only curtain products
  const curtainProducts = PRODUCTS.filter(
    (product) => product.categorySlug === 'curtains-drapes'
  );

  return <CurtainTypePage curtainType={curtainType} products={curtainProducts} />;
}
