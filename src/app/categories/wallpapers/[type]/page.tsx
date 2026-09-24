import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/lib/data/products';
import { WALLPAPER_TYPES, getWallpaperTypeBySlug } from '@/lib/data/wallpapers';
import { WallpaperTypePage } from '@/components/wallpapers/WallpaperTypePage';

interface WallpaperTypeRouteProps {
  params: Promise<{ type: string }>;
}

export async function generateStaticParams() {
  return WALLPAPER_TYPES.map((t) => ({
    type: t.slug,
  }));
}

export async function generateMetadata({ params }: WallpaperTypeRouteProps): Promise<Metadata> {
  const resolved = await params;
  const wallpaperType = getWallpaperTypeBySlug(resolved.type);

  if (!wallpaperType) {
    return {
      title: 'Wallpapers & Wall Coverings | Zaira Furnishing',
    };
  }

  return {
    title: `${wallpaperType.name} | Wallpapers & Wall Coverings | Zaira Furnishing`,
    description: wallpaperType.description,
  };
}

export default async function WallpaperTypeRoute({ params }: WallpaperTypeRouteProps) {
  const resolved = await params;
  const wallpaperType = getWallpaperTypeBySlug(resolved.type);

  if (!wallpaperType) {
    notFound();
  }

  // Filter only wallpaper products
  const wallpaperProducts = PRODUCTS.filter(
    (product) => product.categorySlug === 'wallpapers-wall-coverings'
  );

  return <WallpaperTypePage wallpaperType={wallpaperType} products={wallpaperProducts} />;
}
