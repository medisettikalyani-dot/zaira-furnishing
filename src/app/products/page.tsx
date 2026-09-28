import React from 'react';
import { Metadata } from 'next';
import { getDynamicProducts, getDynamicCategories } from '@/lib/db/catalog';
import ProductsClientView from './ProductsClientView';

export const metadata: Metadata = {
  title: 'All Furnishings | Zaira Furnishing',
  description:
    'Explore handcrafted curtains, architectural blinds, luxury sofa fabrics, wallpapers, carpets, and curated living decor from Zaira Furnishing.',
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getDynamicProducts(),
    getDynamicCategories(),
  ]);

  return <ProductsClientView initialProducts={products} initialCategories={categories} />;
}
