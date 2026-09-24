'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Calendar, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { PRODUCTS } from '@/lib/data/products';
import { CATEGORIES, normalizeCategorySlug } from '@/lib/data/categories';
import { ProductCard } from '@/components/ui/ProductCard';

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || searchParams.get('slug');
  const urlCategory = categoryParam ? normalizeCategorySlug(categoryParam) : null;

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedCategory = activeCategory !== null ? activeCategory : (urlCategory || 'all');

  // Combined Category + Search + Type filtering
  const filteredProducts = PRODUCTS.filter((product) => {
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

  return (
    <div className="bg-[#FDFBF7] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#9A7B56] font-semibold block mb-2">
            The Complete Atelier Catalog
          </span>
          <h1 className="font-serif text-[36px] sm:text-[46px] text-[#1C1917] font-medium tracking-tight mb-3">
            Furnishing Collections
          </h1>
          <p className="text-[14px] text-[#78716C] leading-relaxed">
            Explore bespoke made-to-measure drapery, motorized blinds, tailored upholstery textiles, and artisanal living decor.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="mb-10 pb-6 border-b border-[#EBE7DF]">
          {/* Search Bar + Product Type Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716C]" />
              <input
                type="text"
                placeholder="Search furnishings, materials, styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 bg-white border border-[#E7E2D8] text-[13px] text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-hidden focus:border-[#9A7B56] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917]"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Product Type Mode Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 mr-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#9A7B56]" />
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#1C1917]">
                  Mode:
                </span>
              </div>
              {[
                { id: 'all', label: 'All' },
                { id: 'custom_made', label: 'Bespoke / Custom' },
                { id: 'standard', label: 'Ready to Ship' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedType(tab.id)}
                  className={`px-3 py-1.5 text-[11.5px] uppercase tracking-wider font-medium transition-all ${
                    selectedType === tab.id
                      ? 'bg-[#1C1917] text-[#FDFBF7]'
                      : 'bg-white text-[#57534E] border border-[#E7E2D8] hover:border-[#1C1917]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 text-[11px] uppercase tracking-wider font-medium flex-shrink-0 transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#9A7B56] text-white'
                  : 'bg-[#FAF7F2] text-[#57534E] border border-[#E7E2D8] hover:border-[#9A7B56]'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-3.5 py-1.5 text-[11px] uppercase tracking-wider font-medium flex-shrink-0 transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-[#9A7B56] text-white'
                    : 'bg-[#FAF7F2] text-[#57534E] border border-[#E7E2D8] hover:border-[#9A7B56]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count & COD Notice */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-3">
          <p className="text-[12px] text-[#78716C]">
            Showing <span className="font-semibold text-[#1C1917]">{filteredProducts.length}</span> curated items
            {selectedCategory !== 'all' && (
              <span> in <strong className="text-[#1C1917]">{CATEGORIES.find((c) => c.slug === selectedCategory)?.name || selectedCategory}</strong></span>
            )}
            {searchQuery && (
              <span> matching &ldquo;<strong className="text-[#1C1917]">{searchQuery}</strong>&rdquo;</span>
            )}
          </p>
          <div className="inline-flex items-center gap-2 text-[11px] text-[#57534E] bg-[#FAF7F2] px-3 py-1 border border-[#E7E2D8]">
            <Sparkles className="w-3 h-3 text-[#9A7B56]" />
            <span>Cash on Delivery available on standard catalog pieces</span>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white border border-[#EBE7DF] p-8 max-w-lg mx-auto">
            <p className="font-serif text-[20px] text-[#1C1917] mb-2">No products match your criteria</p>
            <p className="text-[13px] text-[#78716C] mb-6">
              Try adjusting your search keywords or switching category filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setSelectedType('all');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 text-[11px] uppercase tracking-wider font-medium bg-[#1C1917] text-white hover:bg-[#9A7B56] transition-colors"
            >
              Reset All Filters
            </button>
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

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#FDFBF7] py-24 text-center">
          <p className="text-[14px] text-[#78716C]">Loading furnishing collection...</p>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
