import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ArrowRight, Calendar, ChevronRight, Sparkles } from 'lucide-react';
import { CATEGORIES, getCategoryBySlug } from '@/lib/data/categories';
import { PRODUCTS } from '@/lib/data/products';
import { ProductCard } from '@/components/ui/ProductCard';
import { CloudflareImage } from '@/components/ui/CloudflareImage';
import { getCurtainTypeBySlug } from '@/lib/data/curtains';
import { getBlindTypeBySlug } from '@/lib/data/blinds';
import { getSofaFabricTypeBySlug } from '@/lib/data/sofa-fabrics';
import { getWallpaperTypeBySlug } from '@/lib/data/wallpapers';
import { getCarpetTypeBySlug } from '@/lib/data/carpets';

interface CategoriesPageProps {
  searchParams: Promise<{ slug?: string | string[]; type?: string }>;
}

export async function generateMetadata({
  searchParams,
}: CategoriesPageProps): Promise<Metadata> {
  const resolved = await searchParams;
  const rawSlug = typeof resolved.slug === 'string'
    ? resolved.slug
    : Array.isArray(resolved.slug)
    ? resolved.slug[0]
    : undefined;

  if (rawSlug) {
    const category = getCategoryBySlug(rawSlug);
    if (category) {
      return {
        title: `${category.name} | Zaira Furnishing`,
        description: category.description,
      };
    }
  }

  return {
    title: 'Product Categories | Zaira Furnishing',
    description:
      'Explore all 14 luxury interior and furnishing categories from custom drapery to wooden flooring and curated living accents.',
  };
}

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const resolved = await searchParams;
  const rawSlug = typeof resolved.slug === 'string'
    ? resolved.slug
    : Array.isArray(resolved.slug)
    ? resolved.slug[0]
    : undefined;

  const selectedCategory = rawSlug ? getCategoryBySlug(rawSlug) : undefined;

  // ─── CATEGORY SPECIFIC VIEW: When ?slug=... is provided ───
  if (rawSlug) {
    if (!selectedCategory) {
      return (
        <div className="bg-[#FDFBF7] py-16 sm:py-24">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h1 className="font-serif text-[32px] text-[#1C1917] mb-3">
              Category Not Found
            </h1>
            <p className="text-[14px] text-[#78716C] mb-8 leading-relaxed">
              We couldn’t find a category matching &ldquo;{rawSlug}&rdquo;. Explore all 14 official categories below.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/categories"
                className="px-6 py-2.5 text-[11px] uppercase tracking-wider font-semibold bg-[#1C1917] text-white hover:bg-[#9A7B56] transition-colors"
              >
                View All Categories
              </Link>
              <Link
                href="/products"
                className="px-6 py-2.5 text-[11px] uppercase tracking-wider font-semibold border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-white transition-colors"
              >
                Explore All Products
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Filter PRODUCTS data-driven by explicit categorySlug matching selectedCategory.slug
    const categoryProducts = PRODUCTS.filter(
      (product) => product.categorySlug === selectedCategory.slug
    );

    // If Curtains & Drapes category, redirect to dedicated clean routes
    if (selectedCategory.slug === 'curtains-drapes') {
      if (resolved?.type && resolved.type !== 'all') {
        const matched = getCurtainTypeBySlug(resolved.type);
        if (matched) {
          redirect(`/categories/curtains/${matched.slug}`);
        }
      }
      redirect('/categories/curtains');
    }

    // If Window Blinds & Shades category, redirect to dedicated clean routes
    if (selectedCategory.slug === 'window-blinds-shades') {
      if (resolved?.type && resolved.type !== 'all') {
        const matched = getBlindTypeBySlug(resolved.type);
        if (matched) {
          redirect(`/categories/blinds/${matched.slug}`);
        }
      }
      redirect('/categories/blinds');
    }

    // If Sofa Fabrics & Upholstery category, redirect to dedicated clean routes
    if (selectedCategory.slug === 'sofa-fabrics-upholstery') {
      if (resolved?.type && resolved.type !== 'all') {
        const matched = getSofaFabricTypeBySlug(resolved.type);
        if (matched) {
          redirect(`/categories/sofa-fabrics/${matched.slug}`);
        }
      }
      redirect('/categories/sofa-fabrics');
    }

    // If Wallpapers & Wall Coverings category, redirect to dedicated clean routes
    if (selectedCategory.slug === 'wallpapers-wall-coverings') {
      if (resolved?.type && resolved.type !== 'all') {
        const matched = getWallpaperTypeBySlug(resolved.type);
        if (matched) {
          redirect(`/categories/wallpapers/${matched.slug}`);
        }
      }
      redirect('/categories/wallpapers');
    }

    // If Carpets & Rugs category, redirect to dedicated clean routes
    if (selectedCategory.slug === 'carpets-rugs') {
      if (resolved?.type && resolved.type !== 'all') {
        const matched = getCarpetTypeBySlug(resolved.type);
        if (matched) {
          redirect(`/categories/carpets/${matched.slug}`);
        }
      }
      redirect('/categories/carpets');
    }

    return (
      <div className="bg-[#FDFBF7] py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-[12px] text-[#78716C] mb-8">
            <Link href="/" className="hover:text-[#1C1917] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/categories" className="hover:text-[#1C1917] transition-colors">
              Categories
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1C1917] font-medium">
              {selectedCategory.name}
            </span>
          </nav>

          {/* Category Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#9A7B56] font-semibold block mb-2">
              The Zaira Catalog
            </span>
            <h1 className="font-serif text-[34px] sm:text-[44px] text-[#1C1917] font-medium tracking-tight mb-3">
              {selectedCategory.name}
            </h1>
            <p className="text-[14px] text-[#78716C] leading-relaxed mb-4">
              {selectedCategory.description}
            </p>
          </div>

          {/* Category Filter Navigation Pills */}
          <div className="mb-10 pb-5 border-b border-[#EBE7DF]">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <Link
                href="/categories"
                className="px-3.5 py-1.5 text-[11px] uppercase tracking-wider font-medium flex-shrink-0 transition-all bg-[#FAF7F2] text-[#57534E] border border-[#E7E2D8] hover:border-[#9A7B56]"
              >
                All Categories Grid
              </Link>
              <Link
                href="/products"
                className="px-3.5 py-1.5 text-[11px] uppercase tracking-wider font-medium flex-shrink-0 transition-all bg-[#FAF7F2] text-[#57534E] border border-[#E7E2D8] hover:border-[#9A7B56]"
              >
                All Products
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories?slug=${cat.slug}`}
                  className={`px-3.5 py-1.5 text-[11px] uppercase tracking-wider font-medium flex-shrink-0 transition-all ${
                    cat.slug === selectedCategory.slug
                      ? 'bg-[#9A7B56] text-white'
                      : 'bg-[#FAF7F2] text-[#57534E] border border-[#E7E2D8] hover:border-[#9A7B56]'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Results Count Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-3">
            <p className="text-[12px] text-[#78716C]">
              Showing <span className="font-semibold text-[#1C1917]">{categoryProducts.length}</span> {categoryProducts.length === 1 ? 'curated product' : 'curated products'}
            </p>
            {selectedCategory.isCustomizable && (
              <div className="inline-flex items-center gap-2 text-[11px] text-[#57534E] bg-[#FAF7F2] px-3 py-1 border border-[#E7E2D8]">
                <Sparkles className="w-3 h-3 text-[#9A7B56]" />
                <span>Custom sizing & doorstep measurement available</span>
              </div>
            )}
          </div>

          {/* Data-Driven Filtered Product Grid */}
          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Clean Empty State as required by Section 7 */
            <div className="py-20 text-center bg-white border border-[#EBE7DF] p-8 max-w-lg mx-auto">
              <p className="font-serif text-[20px] text-[#1C1917] mb-2">
                No products available in this category yet.
              </p>
              <p className="text-[13px] text-[#78716C] mb-6">
                Check back soon or explore our complete catalog.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-[11px] uppercase tracking-wider font-medium bg-[#1C1917] text-white hover:bg-[#9A7B56] transition-colors"
              >
                <span>Explore All Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Consultation Callout Banner */}
          <div className="mt-16 p-8 bg-[#FAF7F2] border border-[#EBE7DF] flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-[22px] text-[#1C1917] mb-1">
                Need custom window or upholstery dimensions?
              </h3>
              <p className="text-[13px] text-[#78716C]">
                Book our complimentary in-home laser measurement visit. We bring fabric catalogues directly to your space.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 text-[12px] uppercase tracking-wider font-medium bg-[#1C1917] text-white hover:bg-[#9A7B56] transition-colors shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Free Site Measurement</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── OVERVIEW GRID: When visiting /categories without ?slug=... ───
  return (
    <div className="bg-[#FDFBF7] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#9A7B56] font-semibold block mb-2">
            The Zaira Catalog
          </span>
          <h1 className="font-serif text-[36px] sm:text-[46px] text-[#1C1917] font-medium tracking-tight mb-3">
            Product Categories
          </h1>
          <p className="text-[14px] text-[#78716C] leading-relaxed">
            All 14 specialized furnishing categories, crafted to elevate residential and executive spaces with refined elegance.
          </p>
        </div>

        {/* 14 Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="group flex flex-col bg-white border border-[#EBE7DF] hover:border-[#C4B9A1] transition-all duration-300 overflow-hidden"
            >
              {/* Category Image */}
              <Link
                href={`/categories?slug=${category.slug}`}
                className="relative aspect-[16/10] w-full overflow-hidden bg-[#FAF7F2] block"
              >
                <CloudflareImage
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium bg-white/95 text-[#1C1917] backdrop-blur-xs">
                    {category.itemCountText}
                  </span>
                </div>
                {category.isCustomizable && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium bg-[#1C1917]/85 text-[#FDFBF7] backdrop-blur-xs flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-[#C4B9A1]" />
                      Custom Sizing
                    </span>
                  </div>
                )}
              </Link>

              {/* Meta */}
              <div className="flex flex-col flex-1 p-6">
                <Link href={`/categories?slug=${category.slug}`}>
                  <h2 className="font-serif text-[22px] text-[#1C1917] font-medium mb-1.5 leading-snug hover:text-[#9A7B56] transition-colors">
                    {category.name}
                  </h2>
                </Link>
                <p className="text-[12px] text-[#9A7B56] font-medium uppercase tracking-wider mb-3">
                  {category.tagline}
                </p>
                <p className="text-[13px] text-[#78716C] leading-relaxed mb-6 flex-1">
                  {category.description}
                </p>

                <div className="pt-4 border-t border-[#F2EFE9] flex items-center justify-between">
                  <Link
                    href={`/categories?slug=${category.slug}`}
                    className="text-[12px] uppercase tracking-widest font-medium text-[#1C1917] group-hover:text-[#9A7B56] inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>View Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  {category.isCustomizable && (
                    <Link
                      href="/services"
                      className="text-[11px] uppercase tracking-wider text-[#78716C] hover:text-[#1C1917] underline underline-offset-4"
                    >
                      Book Measurement
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
