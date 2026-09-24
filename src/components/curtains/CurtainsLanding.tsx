'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ArrowRight, Heart, ArrowUpDown } from 'lucide-react';
import { CURTAIN_TYPES } from '@/lib/data/curtains';
import { Product } from '@/lib/data/types';

interface CurtainsLandingProps {
  products: Product[];
}

export function CurtainsLanding({ products }: CurtainsLandingProps) {
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#1C1917] selection:bg-[#9A7B56] selection:text-white">
      {/* ─── 1. BREADCRUMB ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2">
        <nav className="flex items-center gap-1.5 text-[12px] text-[#78716C]">
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
      </div>

      {/* ─── 2. SHOP BY CURTAIN TYPE (5 Cards per Row on Desktop) ─── */}
      <section className="pt-4 sm:pt-6 pb-12 sm:pb-16 border-b border-[#EAE4D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <h1 className="font-serif text-[28px] sm:text-[34px] text-[#1C1917] font-medium tracking-tight mb-2">
              Shop by Curtain Type
            </h1>
            <p className="text-[13.5px] sm:text-[14.5px] text-[#78716C]">
              Select a curtain style below to view its tailored collection.
            </p>
          </div>

          {/* 10 Types: 5 per row Desktop, 3 Tablet, 2 Mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
            {CURTAIN_TYPES.map((type) => (
              <Link
                key={type.id}
                href={`/categories/curtains/${type.slug}`}
                className="group flex flex-col bg-white rounded-xl border border-[#EAE4D8] hover:border-[#1C1917] transition-all duration-300 overflow-hidden text-left shadow-2xs hover:shadow-md hover:-translate-y-1 block"
              >
                {/* Realistic Curtain Image */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F2EDE2]">
                  <Image
                    src={type.image}
                    alt={type.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>

                {/* Card Footer: Type Name + Arrow */}
                <div className="p-3 sm:p-3.5 flex items-center justify-between gap-1.5 bg-white border-t border-[#F2ECE1]">
                  <span className="font-serif text-[13.5px] sm:text-[14.5px] font-medium leading-snug line-clamp-1 text-[#1C1917] group-hover:text-[#9A7B56] transition-colors">
                    {type.name}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8C827A] group-hover:text-[#1C1917] group-hover:translate-x-0.5 transition-all duration-300 shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. SHOP ALL CURTAINS (Product Catalog Grid) ─── */}
      <section id="all-curtains" className="py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 pb-4 border-b border-[#EAE4D8]">
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-[22px] sm:text-[28px] text-[#1C1917] font-medium tracking-tight">
                All Curtains
              </h2>
              <span className="text-[13px] text-[#78716C]">
                ({sortedProducts.length} {sortedProducts.length === 1 ? 'Product' : 'Products'})
              </span>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <label htmlFor="landing-sort" className="text-[11.5px] uppercase tracking-wider text-[#78716C] font-medium flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3" />
                <span>Sort by:</span>
              </label>
              <select
                id="landing-sort"
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {sortedProducts.map((product) => {
              const matchedType = CURTAIN_TYPES.find(
                (t) => t.slug === product.curtainType || t.productSlug === product.slug
              );
              const typeLabel = matchedType ? matchedType.name : 'Curtains & Drapes';
              const isWishlisted = !!wishlist[product.id];

              return (
                <div
                  key={product.id}
                  className="group flex flex-col bg-white rounded-xl border border-[#EAE4D8] hover:border-[#1C1917] transition-all duration-300 overflow-hidden shadow-2xs hover:shadow-md"
                >
                  {/* Image with Wishlist Button */}
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

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleWishlist(product.id, e)}
                      aria-label="Save to Wishlist"
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#1C1917] flex items-center justify-center transition-all shadow-xs backdrop-blur-xs"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isWishlisted ? 'fill-[#9A7B56] text-[#9A7B56]' : 'text-[#78716C]'
                        }`}
                      />
                    </button>
                  </Link>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-[10.5px] uppercase tracking-wider text-[#9A7B56] font-semibold mb-1">
                      {typeLabel}
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
        </div>
      </section>
    </div>
  );
}
