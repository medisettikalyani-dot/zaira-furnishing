import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/lib/data/products';
import { BLIND_TYPES, getBlindTypeBySlug } from '@/lib/data/blinds';
import { BlindTypePage } from '@/components/blinds/BlindTypePage';

interface BlindTypeRouteProps {
  params: Promise<{ type: string }>;
}

export async function generateStaticParams() {
  return BLIND_TYPES.map((t) => ({
    type: t.slug,
  }));
}

export async function generateMetadata({ params }: BlindTypeRouteProps): Promise<Metadata> {
  const resolved = await params;
  const blindType = getBlindTypeBySlug(resolved.type);

  if (!blindType) {
    return {
      title: 'Window Blinds & Shades | Zaira Furnishing',
    };
  }

  return {
    title: `${blindType.name} | Window Blinds & Shades | Zaira Furnishing`,
    description: blindType.description,
  };
}

export default async function BlindTypeRoute({ params }: BlindTypeRouteProps) {
  const resolved = await params;
  const blindType = getBlindTypeBySlug(resolved.type);

  if (!blindType) {
    notFound();
  }

  // Filter only window blinds products
  const blindProducts = PRODUCTS.filter(
    (product) => product.categorySlug === 'window-blinds-shades'
  );

  return <BlindTypePage blindType={blindType} products={blindProducts} />;
}
