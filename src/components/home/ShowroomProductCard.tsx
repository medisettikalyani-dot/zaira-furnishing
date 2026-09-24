'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { Product } from '@/lib/data/types';
import { CloudflareImage } from '@/components/ui/CloudflareImage';

interface ShowroomProductCardProps {
  product: Product;
}

export function ShowroomProductCard({ product }: ShowroomProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const displayName = product.name;

  return (
    <div className="group flex flex-col justify-between h-full bg-white rounded-[22px] sm:rounded-[26px] p-4 sm:p-5 border border-[#EBE5DA] shadow-[0_4px_18px_rgba(28,25,23,0.03)] hover:shadow-[0_14px_32px_rgba(28,25,23,0.08)] hover:border-[#D5CBB9] transition-all duration-400">
      <div>
        {/* ─── Large Product Image Container with Wishlist Icon ─── */}
        <div className="relative aspect-[4/5] w-full rounded-[16px] sm:rounded-[20px] overflow-hidden bg-[#F8F6F2] border border-[#EFEBE4] mb-4">
          <Link href={`/products/${product.slug}`} className="relative block w-full h-full">
            <CloudflareImage
              src={product.mainImage}
              alt={displayName}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Wishlist Heart Icon (Top Right) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#1C1917] hover:scale-110 shadow-xs transition-all cursor-pointer"
          >
            <Heart
              strokeWidth={1.5}
              className={`w-4 h-4 transition-colors ${
                isWishlisted ? 'fill-[#9A7B56] text-[#9A7B56]' : 'text-[#1C1917]'
              }`}
            />
          </button>
        </div>

        {/* ─── Product Title (Readable 2-Line Maximum, No Ellipsis) ─── */}
        <Link href={`/products/${product.slug}`} className="block mb-1.5">
          <h3 className="font-serif text-[15px] sm:text-[16px] text-[#1C1917] font-medium leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-[#9A7B56] transition-colors">
            {displayName}
          </h3>
        </Link>

        {/* ─── Price / Starting Price Display ─── */}
        <div className="flex items-baseline gap-1.5 text-[#1C1917]">
          {product.startingPrice && (
            <span className="text-[12px] sm:text-[12.5px] text-[#78716C] font-normal">
              Starting from
            </span>
          )}
          <span className="text-[15px] sm:text-[16px] font-semibold tracking-tight">
            {product.currency}
            {product.price.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* ─── View Product Action ─── */}
      <div className="mt-4 pt-3 border-t border-[#F2ECE1]">
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center gap-1.5 text-[11px] sm:text-[11.5px] uppercase tracking-[0.14em] font-semibold text-[#78716C] group-hover:text-[#1C1917] transition-colors"
        >
          <span>View Product</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 text-[#9A7B56]" />
        </Link>
      </div>
    </div>
  );
}
