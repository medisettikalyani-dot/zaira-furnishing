'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronRight, ArrowRight, X, Sparkles } from 'lucide-react';
import { Product } from '@/lib/data/types';
import { CURTAIN_TYPES } from '@/lib/data/curtains';

interface CurtainsExperienceProps {
  products: Product[];
  initialType?: string;
}

export function CurtainsExperience({ products, initialType }: CurtainsExperienceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productsSectionRef = useRef<HTMLDivElement>(null);

  // Active filter state from query param or initial prop
  const urlType = searchParams.get('type') || initialType || 'all';
  const [selectedType, setSelectedType] = useState<string>(urlType);

  useEffect(() => {
    const current = searchParams.get('type') || 'all';
    setSelectedType(current);
  }, [searchParams]);

  // Click handler: select style, filter products, scroll down to products, update URL
  const handleSelectType = (slug: string, scroll = true) => {
    setSelectedType(slug);

    const params = new URLSearchParams(searchParams.toString());
    if (slug === 'all') {
      params.delete('type');
    } else {
      params.set('type', slug);
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    router.replace(`/categories/curtains${query}`, { scroll: false });

    if (scroll && productsSectionRef.current) {
      const topOffset = productsSectionRef.current.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  // Find active type object for description and title
  const activeTypeObj = CURTAIN_TYPES.find((t) => t.slug === selectedType);

  // Filter products by selected curtain type
  const filteredProducts = products.filter((p) => {
    if (selectedType === 'all') return true;
    if (!activeTypeObj) return true;
    return (
      p.slug === activeTypeObj.productSlug ||
      p.name.toLowerCase().includes(activeTypeObj.name.toLowerCase()) ||
      p.slug.includes(activeTypeObj.slug)
    );
  });

  // Featured styles for visual hierarchy (Top 2: Blackout & Sheer, then next 8 in balanced grid)
  const heroStyles = CURTAIN_TYPES.slice(0, 2);
  const remainingStyles = CURTAIN_TYPES.slice(2);

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#1C1917] selection:bg-[#9A7B56] selection:text-white">
      {/* ════════════════════════════════════════════════════════════════
          1. CATEGORY LANDING EXPERIENCE — Clean, Compact Introduction
      ════════════════════════════════════════════════════════════════ */}
      <section className="pt-6 sm:pt-8 pb-6 border-b border-[#EAE4D8] bg-[#F7F4EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[12px] text-[#78716C] mb-4">
            <Link href="/" className="hover:text-[#1C1917] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
            <Link href="/categories" className="hover:text-[#1C1917] transition-colors">
              Categories
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
            <span className="text-[#1C1917] font-medium">Curtains & Drapes</span>
          </nav>

          <div className="max-w-3xl">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#9A7B56] font-semibold block mb-2">
              The Window Collection
            </span>
            <h1 className="font-serif text-[32px] sm:text-[42px] lg:text-[46px] text-[#1C1917] font-normal tracking-tight leading-[1.1] mb-3">
              CURTAINS & DRAPES
            </h1>
            <p className="text-[14.5px] sm:text-[16px] text-[#6E6862] leading-relaxed font-light">
              Beautiful curtains for privacy, comfort and elegant interiors.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          2. SHOP CURTAINS BY STYLE — Visual Hierarchy & Large Rounded Tiles
          Not 10 equal rectangular cards: 2 prominent hero feature tiles + 8 balanced tiles
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-14 border-b border-[#EAE4D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
            <div>
              <h2 className="font-serif text-[24px] sm:text-[30px] text-[#1C1917] font-medium tracking-tight">
                Shop Curtains by Style
              </h2>
              <p className="text-[13px] sm:text-[14px] text-[#78716C] mt-1">
                Explore our signature fabrics and finishes. Choose a style to view products.
              </p>
            </div>
            {selectedType !== 'all' && (
              <button
                type="button"
                onClick={() => handleSelectType('all')}
                className="text-[12px] uppercase tracking-wider font-semibold text-[#9A7B56] hover:text-[#1C1917] transition-colors self-start sm:self-auto inline-flex items-center gap-1"
              >
                <span>Reset selection</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* VISUAL HIERARCHY TILES */}
          <div className="space-y-4 sm:space-y-5">
            {/* ROW 1: 2 Prominent Featured Curtain Styles (Blackout & Sheer / Day) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {heroStyles.map((type) => {
                const isSelected = selectedType === type.slug;
                return (
                  <div
                    key={type.id}
                    onClick={() => handleSelectType(type.slug)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleSelectType(type.slug);
                    }}
                    className={`group relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/10] w-full rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'ring-3 ring-[#9A7B56] ring-offset-2 ring-offset-[#FAF7F2] shadow-lg -translate-y-1'
                        : 'hover:shadow-lg hover:-translate-y-1'
                    }`}
                  >
                    {/* Curtain Image */}
                    <Image
                      src={type.image}
                      alt={type.name}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300" />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 sm:top-5 sm:left-5">
                      <span className="px-3 py-1 text-[10.5px] uppercase tracking-widest font-semibold bg-white/95 text-[#1C1917] backdrop-blur-md rounded-full shadow-xs">
                        Featured Style
                      </span>
                    </div>

                    {/* Bottom Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 text-white flex items-end justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-[22px] sm:text-[28px] font-medium leading-snug tracking-tight text-white mb-1 drop-shadow-xs">
                          {type.name}
                        </h3>
                        <p className="text-[12.5px] sm:text-[13.5px] text-[#EAE4D8] font-light max-w-md line-clamp-1">
                          {type.description}
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#1C1917] backdrop-blur-md text-[11px] sm:text-[12px] uppercase tracking-wider font-semibold transition-all duration-200 shrink-0">
                        <span>{isSelected ? 'Selected' : 'Shop Now'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ROW 2: Remaining 8 Styles in Balanced 4-column (desktop) / 2-column (mobile) grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
              {remainingStyles.map((type) => {
                const isSelected = selectedType === type.slug;
                return (
                  <div
                    key={type.id}
                    onClick={() => handleSelectType(type.slug)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleSelectType(type.slug);
                    }}
                    className={`group relative aspect-[3/4] sm:aspect-[4/5] w-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'ring-3 ring-[#9A7B56] ring-offset-2 ring-offset-[#FAF7F2] shadow-md -translate-y-1'
                        : 'hover:shadow-md hover:-translate-y-1'
                    }`}
                  >
                    {/* Curtain Image */}
                    <Image
                      src={type.image}
                      alt={type.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-300" />

                    {/* Bottom Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 text-white">
                      <h3 className="font-serif text-[15px] sm:text-[18px] font-medium leading-snug tracking-tight text-white mb-1 drop-shadow-xs">
                        {type.name}
                      </h3>
                      <div className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#D8CFBF] group-hover:text-white transition-colors">
                        <span>{isSelected ? 'Viewing' : 'Shop Now'}</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          3. PRODUCT SHOPPING AREA
          - Clean horizontal category pills (horizontally scrollable on mobile)
          - Clear title & description matching selected type
          - Real e-commerce product cards (4 desktop, 3 tablet, 2 mobile)
      ════════════════════════════════════════════════════════════════ */}
      <section ref={productsSectionRef} className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Horizontal Category Navigation / Pill Selector */}
          <div className="mb-8 pb-3 border-b border-[#EAE4D8]">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                type="button"
                onClick={() => handleSelectType('all', false)}
                className={`px-4 py-2 rounded-full text-[11.5px] uppercase tracking-wider font-semibold transition-all shrink-0 ${
                  selectedType === 'all'
                    ? 'bg-[#1C1917] text-white shadow-xs'
                    : 'bg-white text-[#57534E] border border-[#E2DBD0] hover:border-[#9A7B56]'
                }`}
              >
                All Curtains ({products.length})
              </button>

              {CURTAIN_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectType(t.slug, false)}
                  className={`px-4 py-2 rounded-full text-[11.5px] uppercase tracking-wider font-medium transition-all shrink-0 ${
                    selectedType === t.slug
                      ? 'bg-[#9A7B56] text-white shadow-xs'
                      : 'bg-white text-[#57534E] border border-[#E2DBD0] hover:border-[#9A7B56]'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Active Header & Description */}
          <div className="mb-8">
            <h2 className="font-serif text-[26px] sm:text-[34px] text-[#1C1917] font-medium tracking-tight mb-1.5">
              {activeTypeObj ? activeTypeObj.name.toUpperCase() : 'SHOP ALL CURTAINS'}
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#6E6862] max-w-2xl leading-relaxed">
              {activeTypeObj
                ? activeTypeObj.description
                : 'Explore our complete range of bespoke residential and commercial window curtains.'}
            </p>
            <p className="text-[12px] text-[#8C827A] mt-2">
              Showing{' '}
              <span className="font-semibold text-[#1C1917]">{filteredProducts.length}</span>{' '}
              {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          {/* Product Grid: 4 per row Desktop, 3 Tablet, 2 Mobile */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col bg-white rounded-xl border border-[#EAE4D8] hover:border-[#1C1917] transition-all duration-300 overflow-hidden shadow-2xs hover:shadow-md"
                >
                  {/* Product Image */}
                  <Link
                    href={`/products/${product.slug}`}
                    className="relative aspect-[4/5] w-full overflow-hidden bg-[#F4EFE6] block"
                  >
                    <Image
                      src={product.mainImage}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {product.productType === 'custom_made' && (
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold bg-[#1C1917]/85 text-white backdrop-blur-xs rounded-sm">
                          Made to Measure
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Product Body */}
                  <div className="p-3.5 sm:p-4 flex flex-col flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#9A7B56] font-semibold mb-1">
                      {product.categoryName}
                    </span>

                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-serif text-[15px] sm:text-[17px] text-[#1C1917] font-medium leading-snug group-hover:text-[#9A7B56] transition-colors mb-1.5 line-clamp-1">
                        {product.displayName || product.name}
                      </h3>
                    </Link>

                    <p className="text-[11.5px] sm:text-[12px] text-[#78716C] line-clamp-2 leading-relaxed mb-4 flex-1">
                      {product.shortDescription}
                    </p>

                    {/* Price and Action Button */}
                    <div className="pt-2.5 border-t border-[#F2ECE1] flex items-center justify-between gap-2 mt-auto">
                      <div>
                        {product.startingPrice && (
                          <span className="text-[9.5px] uppercase tracking-wider text-[#8C827A] block leading-none mb-0.5">
                            Starting from
                          </span>
                        )}
                        <span className="font-serif text-[15px] sm:text-[16px] font-semibold text-[#1C1917]">
                          {product.currency}{product.price.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <Link
                        href={`/products/${product.slug}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm text-[11px] uppercase tracking-wider font-semibold bg-[#1C1917] text-white hover:bg-[#9A7B56] transition-colors shrink-0"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white rounded-2xl border border-[#EAE4D8] p-8 max-w-md mx-auto">
              <p className="font-serif text-[18px] text-[#1C1917] mb-2">
                No curtain products found for this filter.
              </p>
              <button
                type="button"
                onClick={() => handleSelectType('all')}
                className="mt-3 px-5 py-2 rounded-full text-[11px] uppercase tracking-wider font-semibold bg-[#1C1917] text-white hover:bg-[#9A7B56] transition-colors"
              >
                View All Curtains
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
