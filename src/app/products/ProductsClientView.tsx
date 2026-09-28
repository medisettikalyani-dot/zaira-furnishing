'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Calendar, Search, X, Sparkles } from 'lucide-react';
import { Product, Category } from '@/lib/data/types';
import { normalizeCategorySlug } from '@/lib/data/categories';
import { ProductCard } from '@/components/ui/ProductCard';

interface ProductsClientViewProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

function ProductsContent({ initialProducts, initialCategories }: ProductsClientViewProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || searchParams.get('slug');
  const urlCategory = categoryParam ? normalizeCategorySlug(categoryParam) : null;

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const selectedCategory = activeCategory !== null ? activeCategory : (urlCategory || 'all');

  // Combined Category + Search + Type filtering
  const filteredProducts = initialProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.categorySlug === selectedCategory;
    const matchesType =
      selectedType === 'all' || product.productType === selectedType;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      product.name.toLowerCase().includes(q) ||
      (product.displayName && product.displayName.toLowerCase().includes(q)) ||
      product.shortDescription.toLowerCase().includes(q) ||
      product.categoryName.toLowerCase().includes(q);

    return matchesCategory && matchesType && matchesSearch;
  });

  // Apply sorting
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [filteredProducts, sortBy]);

  const hasActiveFilters = selectedCategory !== 'all' || selectedType !== 'all' || searchQuery.trim() !== '';
  const activeCategoryObj = initialCategories.find((c) => c.slug === selectedCategory);

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#1C1917]">
      {/* ─── 1. Refined Compact Shopping Header ─── */}
      <section className="border-b border-[#EAE4D8] bg-gradient-to-b from-[#F4EFE6]/60 via-[#FAF7F2] to-[#FAF7F2] pt-8 sm:pt-12 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B56]" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#9A7B56] font-semibold">
                The Zaira Showroom
              </span>
            </div>
            <h1 className="font-serif text-[28px] sm:text-[40px] lg:text-[44px] text-[#1C1917] font-medium tracking-tight mb-2.5 sm:mb-3 leading-[1.15]">
              Shop All Furnishings
            </h1>
            <p className="text-[13px] sm:text-[14.5px] text-[#78716C] leading-relaxed max-w-2xl">
              Bespoke drapery, tailored upholstery textiles, architectural blinds, and fine interior decor — handcrafted to elevate residential and commercial spaces.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 2. Visually Integrated Filter & Search Toolbar ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        <div className="bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl border border-[#EDE8DE] p-3 sm:p-4 mb-6 sm:mb-8 shadow-[0_2px_12px_rgba(28,25,23,0.03)]">
          {/* Top Row: Search, Type Segment, and Sort */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between pb-3 sm:pb-3.5 border-b border-[#F2ECE1]">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E] pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, fabric, style..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-9 py-2 sm:py-2.5 bg-[#FAF7F2] hover:bg-[#F6F2EA] focus:bg-white border border-[#E7E2D8] rounded-lg text-[12.5px] sm:text-[13px] text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#9A7B56]/20 focus:border-[#9A7B56] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#EAE4D8] hover:bg-[#D6CFC3] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3 text-[#57534E]" />
                </button>
              )}
            </div>

            {/* Right Controls: Type Segment + Sort Dropdown */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              {/* Product Type Segment */}
              <div className="inline-flex items-center p-0.5 sm:p-1 bg-[#F5F1E8] rounded-lg border border-[#EDE7DC]">
                {[
                  { id: 'all', label: 'All Designs' },
                  { id: 'custom_made', label: 'Bespoke' },
                  { id: 'standard', label: 'Standard' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedType(tab.id)}
                    className={`px-2.5 sm:px-3 py-1.5 text-[10.5px] sm:text-[11px] uppercase tracking-wider font-semibold rounded-md transition-all duration-200 cursor-pointer ${
                      selectedType === tab.id
                        ? 'bg-white text-[#1C1917] shadow-xs'
                        : 'text-[#78716C] hover:text-[#1C1917]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Sort By Dropdown */}
              <div className="relative inline-flex items-center">
                <select
                  id="products-sort"
                  aria-label="Sort products"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')
                  }
                  className="text-[11.5px] sm:text-[12px] font-medium bg-[#FAF7F2] hover:bg-[#F6F2EA] border border-[#E7E2D8] rounded-lg py-2 pl-3 pr-7 text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#9A7B56]/20 focus:border-[#9A7B56] cursor-pointer appearance-none transition-colors"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2378716C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                  }}
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bottom Row: Category Filter Pills */}
          <div className="pt-3 overflow-x-auto no-scrollbar flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-full text-[11.5px] sm:text-[12px] font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#1C1917] text-white shadow-2xs'
                  : 'bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#57534E] hover:text-[#1C1917] border border-[#EDE7DC]'
              }`}
            >
              All Categories ({initialProducts.length})
            </button>

            {initialCategories.map((cat) => {
              const count = initialProducts.filter((p) => p.categorySlug === cat.slug).length;
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-full text-[11.5px] sm:text-[12px] font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#1C1917] text-white shadow-2xs'
                      : 'bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#57534E] hover:text-[#1C1917] border border-[#EDE7DC]'
                  }`}
                >
                  {cat.name}
                  {count > 0 && (
                    <span
                      className={`ml-1.5 text-[10px] ${
                        isSelected ? 'text-[#C5A880]' : 'text-[#A8A29E]'
                      }`}
                    >
                      ({count})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Metadata Bar */}
        <div className="flex items-center justify-between gap-4 mb-5 sm:mb-6 px-1">
          <div className="text-[12.5px] sm:text-[13px] text-[#78716C]">
            Showing <span className="font-semibold text-[#1C1917]">{sortedProducts.length}</span>{' '}
            {sortedProducts.length === 1 ? 'furnishing' : 'furnishings'}
            {activeCategoryObj && (
              <>
                {' '}in{' '}
                <span className="font-medium text-[#1C1917]">{activeCategoryObj.name}</span>
              </>
            )}
            {searchQuery && (
              <>
                {' '}matching &ldquo;<span className="text-[#1C1917] font-medium">{searchQuery}</span>&rdquo;
              </>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setSelectedType('all');
                setSearchQuery('');
                setSortBy('featured');
              }}
              className="text-[11px] sm:text-[11.5px] uppercase tracking-wider text-[#9A7B56] hover:text-[#866945] font-semibold transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* ─── 3. Product Grid ─── */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 items-stretch">
            {sortedProducts.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-2xl border border-[#EDE8DE] p-8 max-w-lg mx-auto shadow-2xs">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#FAF7F2] border border-[#EDE8DE] flex items-center justify-center">
              <Search className="w-6 h-6 text-[#9A7B56]" />
            </div>
            <h3 className="font-serif text-[20px] text-[#1C1917] font-medium mb-2">
              No matching furnishings found
            </h3>
            <p className="text-[13px] text-[#78716C] mb-6 leading-relaxed">
              We couldn’t find products matching your criteria. Try adjusting your keyword or reset filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setSelectedType('all');
                setSearchQuery('');
                setSortBy('featured');
              }}
              className="px-6 py-2.5 text-[11px] uppercase tracking-wider font-semibold bg-[#1C1917] text-white hover:bg-[#9A7B56] transition-colors rounded-lg cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* ─── 4. Showroom Consultation Banner ─── */}
        <div className="mt-14 sm:mt-20 p-6 sm:p-10 bg-gradient-to-r from-[#1C1917] via-[#24201E] to-[#1C1917] rounded-2xl border border-[#3E3834] flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_12px_32px_rgba(28,25,23,0.15)]">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#9A7B56]" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#9A7B56] font-semibold">
                Complimentary Atelier Service
              </span>
            </div>
            <h3 className="font-serif text-[20px] sm:text-[26px] text-white font-medium mb-1.5">
              Need custom dimensions or fabric swatches?
            </h3>
            <p className="text-[13px] sm:text-[14px] text-[#D6D3D1] leading-relaxed max-w-xl">
              Book our complimentary in-home laser measurement visit in Hyderabad. We bring tactile fabric books and drapery swatches straight to your space.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.14em] font-semibold bg-[#FAF7F2] text-[#1C1917] hover:bg-[#9A7B56] hover:text-white transition-all duration-200 rounded-lg shrink-0 shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Free Site Visit</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProductsClientView(props: ProductsClientViewProps) {
  return (
    <Suspense
      fallback={
        <div className="bg-[#FAF7F2] py-24 text-center">
          <p className="text-[14px] text-[#78716C] font-serif">Loading furnishing collection...</p>
        </div>
      }
    >
      <ProductsContent {...props} />
    </Suspense>
  );
}
