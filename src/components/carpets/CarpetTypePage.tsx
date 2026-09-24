'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ArrowLeft, ArrowRight, ArrowUpDown, Heart, Sparkles } from 'lucide-react';
import { Product } from '@/lib/data/types';
import { CarpetType } from '@/lib/data/carpets';

interface CarpetTypePageProps {
  carpetType: CarpetType;
  products: Product[];
}

export function CarpetTypePage({ carpetType, products }: CarpetTypePageProps) {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter: must belong to carpets-rugs category and match this exact carpet type
  const typeProducts = products.filter(
    (p) =>
      p.categorySlug === 'carpets-rugs' &&
      (p.carpetType === carpetType.slug ||
        p.slug === carpetType.productSlug ||
        (p.carpetType && p.carpetType.toLowerCase() === carpetType.slug.toLowerCase()))
  );

  // Apply sorting
  const sortedProducts = [...typeProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#1C1917] selection:bg-[#9A7B56] selection:text-white">
      {/* ─── 1. BREADCRUMB & BACK NAVIGATION ─── */}
      <div className="border-b border-[#EAE4D8] bg-[#F7F4EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Breadcrumb: Home → Carpets & Rugs → Carpet Type */}
            <nav className="flex items-center gap-1.5 text-[12px] text-[#78716C] flex-wrap">
              <Link href="/" className="hover:text-[#1C1917] transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
              <Link href="/categories/carpets" className="hover:text-[#1C1917] transition-colors">
                Carpets & Rugs
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
              <span className="text-[#1C1917] font-medium">{carpetType.name}</span>
            </nav>

            {/* Back to Carpets & View All Link */}
            <div className="flex items-center gap-4 text-[12px]">
              <Link
                href="/categories/carpets"
                className="inline-flex items-center gap-1.5 font-semibold text-[#1C1917] hover:text-[#9A7B56] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Carpets & Rugs</span>
              </Link>
              <span className="text-[#D8CFBF]">|</span>
              <Link
                href="/categories/carpets"
                className="text-[#78716C] hover:text-[#1C1917] transition-colors underline underline-offset-4"
              >
                View All Carpets & Rugs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. PRODUCT SHOPPING AREA ─── */}
      <section className="py-7 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Controls Bar: Type Badge, Count & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 pb-4 border-b border-[#EAE4D8]">
            <div className="flex items-center gap-3">
              <h1 className="text-[13px] sm:text-[14px] uppercase tracking-wider font-semibold text-[#1C1917]">
                {carpetType.name}
              </h1>
              <span className="text-[12px] sm:text-[13px] text-[#78716C]">
                ({sortedProducts.length} {sortedProducts.length === 1 ? 'Product' : 'Products'})
              </span>
            </div>

            {/* Simple Sort Dropdown */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <label htmlFor="carpet-sort" className="text-[11.5px] uppercase tracking-wider text-[#78716C] font-medium flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3" />
                <span>Sort by:</span>
              </label>
              <select
                id="carpet-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-[11.5px] uppercase tracking-wider bg-white border border-[#E2DBD0] rounded-sm py-1.5 px-3 text-[#1C1917] focus:outline-hidden focus:border-[#9A7B56] cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid: 4 per row Desktop, 3 Tablet, 2 Mobile */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {sortedProducts.map((product) => {
                const hasValidImage = Boolean(product.mainImage && product.mainImage.trim() !== '');

                return (
                  <div
                    key={product.id}
                    className="group flex flex-col bg-white rounded-xl border border-[#EAE4D8] hover:border-[#1C1917] transition-all duration-300 overflow-hidden shadow-2xs hover:shadow-md"
                  >
                    {/* Product Image Area */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F4EFE6] block">
                      <Link
                        href={`/products/${product.slug}`}
                        className="absolute inset-0 block"
                      >
                        {hasValidImage ? (
                          <Image
                            src={product.mainImage}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#F7F4EE] to-[#EBE4D6] text-center">
                            <div className="w-full flex justify-end">
                              <span className="text-[9.5px] uppercase tracking-wider font-semibold text-[#8C7A6B] bg-[#E2D8C7] px-2 py-0.5 rounded-full">
                                {carpetType.name}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="w-12 h-12 mx-auto rounded-full bg-[#E5DCD0] flex items-center justify-center text-[#786E65] group-hover:bg-[#1C1917] group-hover:text-white transition-colors duration-300">
                                <Sparkles className="w-6 h-6 stroke-[1.5]" />
                              </div>
                              <p className="font-serif text-[15px] text-[#1C1917] font-medium leading-snug">
                                {product.displayName || product.name}
                              </p>
                              <p className="text-[11px] text-[#8C827A] tracking-wider uppercase">
                                Artisanal Handcraft Weave
                              </p>
                            </div>
                            <span className="text-[10px] text-[#78716C] italic">
                              Showroom collection updating
                            </span>
                          </div>
                        )}
                      </Link>

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        onClick={(e) => toggleWishlist(product.id, e)}
                        aria-label="Save to Wishlist"
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#1C1917] flex items-center justify-center transition-all shadow-xs backdrop-blur-xs z-10"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            wishlist[product.id] ? 'fill-[#9A7B56] text-[#9A7B56]' : 'text-[#78716C]'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Product Meta */}
                    <div className="p-4 flex flex-col flex-1">
                      <span className="text-[10.5px] uppercase tracking-wider text-[#9A7B56] font-semibold mb-1">
                        {carpetType.name}
                      </span>

                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-serif text-[16px] sm:text-[17px] text-[#1C1917] font-medium leading-snug group-hover:text-[#9A7B56] transition-colors mb-1.5 line-clamp-1">
                          {product.displayName || product.name}
                        </h3>
                      </Link>

                      <p className="text-[12px] text-[#78716C] line-clamp-2 leading-relaxed mb-4 flex-1">
                        {product.shortDescription}
                      </p>

                      {/* Price and Action Button */}
                      <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between gap-2 mt-auto">
                        <div>
                          {product.startingPrice && (
                            <span className="text-[9.5px] uppercase tracking-wider text-[#8C827A] block leading-none mb-0.5">
                              Starting from
                            </span>
                          )}
                          <span className="font-serif text-[16px] font-semibold text-[#1C1917]">
                            {product.currency}{product.price.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <Link
                          href={`/products/${product.slug}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm text-[11px] uppercase tracking-wider font-semibold bg-[#1C1917] text-white hover:bg-[#9A7B56] transition-colors shrink-0"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center bg-white rounded-2xl border border-[#EAE4D8] p-8 max-w-md mx-auto">
              <p className="font-serif text-[18px] text-[#1C1917] mb-2">
                No products available yet in {carpetType.name}.
              </p>
              <p className="text-[13px] text-[#78716C] mb-5 leading-relaxed">
                {carpetType.description}
              </p>
              <Link
                href="/categories/carpets"
                className="inline-block px-5 py-2.5 rounded-full text-[11px] uppercase tracking-wider font-semibold bg-[#1C1917] text-white hover:bg-[#9A7B56] transition-colors"
              >
                Browse All Carpets & Rugs
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
