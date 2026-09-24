import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/lib/data/products';
import { SOFA_FABRIC_TYPES, getSofaFabricTypeBySlug } from '@/lib/data/sofa-fabrics';
import { SofaFabricTypePage } from '@/components/sofa-fabrics/SofaFabricTypePage';

interface SofaFabricTypeRouteProps {
  params: Promise<{ type: string }>;
}

export async function generateStaticParams() {
  return SOFA_FABRIC_TYPES.map((t) => ({
    type: t.slug,
  }));
}

export async function generateMetadata({ params }: SofaFabricTypeRouteProps): Promise<Metadata> {
  const resolved = await params;
  const sofaFabricType = getSofaFabricTypeBySlug(resolved.type);

  if (!sofaFabricType) {
    return {
      title: 'Sofa Fabrics & Upholstery | Zaira Furnishing',
    };
  }

  return {
    title: `${sofaFabricType.name} | Sofa Fabrics & Upholstery | Zaira Furnishing`,
    description: sofaFabricType.description,
  };
}

export default async function SofaFabricTypeRoute({ params }: SofaFabricTypeRouteProps) {
  const resolved = await params;
  const sofaFabricType = getSofaFabricTypeBySlug(resolved.type);

  if (!sofaFabricType) {
    notFound();
  }

  // Filter only sofa fabrics products
  const sofaFabricProducts = PRODUCTS.filter(
    (product) => product.categorySlug === 'sofa-fabrics-upholstery'
  );

  return <SofaFabricTypePage sofaFabricType={sofaFabricType} products={sofaFabricProducts} />;
}
