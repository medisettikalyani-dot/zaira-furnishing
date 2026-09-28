import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getDynamicProductBySlug, getDynamicProducts } from '@/lib/db/catalog';
import { ProductDetailView } from '@/components/products/ProductDetailView';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getDynamicProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getDynamicProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Zaira Furnishing',
    };
  }

  return {
    title: `${product.name} | Zaira Furnishing`,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getDynamicProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Only include products from the same category
  const allCategoryProducts = await getDynamicProducts({ categorySlug: product.categorySlug });
  const relatedProducts = allCategoryProducts.filter((p) => p.id !== product.id);

  return <ProductDetailView product={product} relatedProducts={relatedProducts} />;
}
