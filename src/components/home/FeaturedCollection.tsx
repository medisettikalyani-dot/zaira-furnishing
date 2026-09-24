import React from 'react';
import Link from 'next/link';
import { getFeaturedProducts } from '@/lib/data/products';
import { ShowroomProductCard } from './ShowroomProductCard';

export function FeaturedCollection() {
  const featuredProducts = getFeaturedProducts();
  // 4 Curated Best Sellers displayed prominently
  const bestSellers = featuredProducts.slice(0, 4);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#FAF7F2] border-t border-[#EBE7DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Header: Heading on Left, View All → on Right ─── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <h2 className="font-serif text-[28px] sm:text-[36px] lg:text-[42px] text-[#1C1917] font-medium tracking-tight mb-2">
              Best Sellers
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#78716C] leading-relaxed">
              Popular products for your home.
            </p>
          </div>

          <Link
            href="/products"
            className="group inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#1C1917] hover:text-[#9A7B56] transition-colors self-start sm:self-end"
          >
            <span>View All</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* ─── 4 Featured Products Grid on Desktop with Generous Spacing ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-8">
          {bestSellers.map((product) => (
            <ShowroomProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
