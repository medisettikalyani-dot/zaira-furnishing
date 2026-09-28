'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Product } from '@/lib/data/types';
import { useStore } from '@/lib/context/StoreContext';

interface FeaturedProductCardProps {
  product: Product;
}

export function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  const { isWishlisted, toggleWishlist } = useStore();
  const isFav = isWishlisted(product.id);
  const isCustom = product.productType === 'custom_made';

  return (
    <div className="group flex flex-col shrink-0 w-[72vw] sm:w-[45vw] md:w-[32vw] lg:w-[calc(25%-15px)] snap-start">
      <Link
        href={`/products/${product.slug}`}
        className="block flex flex-col group/link text-left"
        aria-label={`View ${product.displayName || product.name}`}
      >
        {/* ─── 1. Clean, Dominant Product Image (No badges) ─── */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#F7F4EE] border border-[#EAE3D6] shadow-[0_4px_16px_rgba(28,25,23,0.03)] group-hover:shadow-[0_16px_36px_rgba(28,25,23,0.08)] group-hover:border-[#C5A880]/60 transition-all duration-500 ease-out group-hover:-translate-y-1">
          <Image
            src={product.mainImage}
            alt={product.displayName || product.name}
            fill
            sizes="(max-width: 640px) 72vw, (max-width: 1024px) 32vw, 25vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />

          {/* Minimal Wishlist Heart Button (Top-Right) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-label={isFav ? 'Remove from Wishlist' : 'Add to Wishlist'}
            className={`absolute top-3 right-3 sm:top-3.5 sm:right-3.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
              isFav
                ? 'bg-white shadow-[0_2px_8px_rgba(28,25,23,0.15)] border border-[#EAE4D8] opacity-100 scale-105'
                : 'bg-white/85 backdrop-blur-md border border-white/70 shadow-[0_2px_6px_rgba(28,25,23,0.06)] opacity-90 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-white hover:scale-110 active:scale-95'
            }`}
          >
            <Heart
              className={`w-[13.5px] h-[13.5px] transition-colors duration-200 ${
                isFav ? 'fill-[#B43D3D] text-[#B43D3D]' : 'text-[#44403C] hover:text-[#B43D3D]'
              }`}
            />
          </button>
        </div>

        {/* ─── 2. Clean E-Commerce Details Under Card ─── */}
        <div className="pt-3.5 px-0.5 flex flex-col">
          {/* Product Name (Up to 2 lines without single-line truncation, consistent min-height for alignment) */}
          <h3 className="font-serif text-[14.5px] sm:text-[15.5px] font-medium text-[#1C1917] leading-snug line-clamp-2 min-h-[2.5rem] sm:min-h-[2.75rem] group-hover/link:text-[#9A7B56] transition-colors duration-200">
            {product.displayName || product.name}
          </h3>

          {/* Price & Subtle Secondary Custom Made */}
          <div className="mt-1 flex items-baseline justify-between gap-2">
            <span className="font-sans text-[13.5px] sm:text-[14.5px] font-bold text-[#1C1917] tracking-tight">
              {isCustom || product.startingPrice ? 'From ' : ''}
              {product.currency}{product.price.toLocaleString('en-IN')}
            </span>

            {isCustom && (
              <span className="text-[11px] sm:text-[11.5px] text-[#78716C] font-normal tracking-tight shrink-0">
                Custom Made
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
