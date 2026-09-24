'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/data/types';
import { CloudflareImage } from './CloudflareImage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const currentVariant = product.variations[selectedVariantIndex] || product.variations[0];
  const activeImage = currentVariant?.images?.[0] || product.mainImage;
  const isCustom = product.productType === 'custom_made';

  return (
    <div className="group flex flex-col bg-white border border-[#EBE7DF] hover:border-[#D4CEB8] transition-all duration-300">
      {/* Product Image Container */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-[#F7F4EE]"
      >
        <CloudflareImage
          src={activeImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badge indicator */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span
            className={`inline-block px-2.5 py-1 text-[11px] uppercase tracking-wider font-medium backdrop-blur-md ${
              isCustom
                ? 'bg-[#1C1917]/85 text-[#FDFBF7]'
                : 'bg-white/90 text-[#1C1917] border border-[#EBE7DF]'
            }`}
          >
            {isCustom ? 'Custom Made' : 'Ready to Ship'}
          </span>
        </div>
      </Link>

      {/* Product Meta Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category */}
        <span className="text-[11px] uppercase tracking-widest text-[#78716C] font-medium mb-1.5">
          {product.categoryName}
        </span>

        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-serif text-[18px] text-[#1C1917] leading-snug hover:text-[#9A7B56] transition-colors mb-2">
            {product.displayName || product.name}
          </h3>
        </Link>

        {/* Price display */}
        <div className="flex items-baseline gap-1.5 mb-3">
          {product.startingPrice && (
            <span className="text-[12px] text-[#78716C]">Starting from</span>
          )}
          <span className="text-[16px] font-semibold text-[#1C1917]">
            {product.currency}
            {product.price.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Variation Image Thumbnails Preview */}
        {product.variations && product.variations.length > 0 && (
          <div className="mb-4 pt-2 border-t border-[#F0EDE6]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-[#78716C]">
                {product.variations.length} {product.variations.length === 1 ? 'Option' : 'Options'}
              </span>
              <span className="text-[11px] text-[#57534E] font-medium truncate max-w-[140px]">
                {currentVariant?.name}
              </span>
            </div>

            {/* Thumbnail Swatches (Real Image Thumbnails) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {product.variations.map((variant, idx) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariantIndex(idx);
                  }}
                  title={variant.name}
                  className={`relative h-7 w-7 rounded-sm overflow-hidden flex-shrink-0 border transition-all ${
                    selectedVariantIndex === idx
                      ? 'border-[#1C1917] ring-1 ring-[#1C1917] scale-105'
                      : 'border-[#D4CEB8] opacity-75 hover:opacity-100'
                  }`}
                >
                  {variant.thumbnailImage ? (
                    <Image
                      src={variant.thumbnailImage}
                      alt={variant.name}
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  ) : (
                    <span
                      className="w-full h-full block"
                      style={{ backgroundColor: variant.colorHex || '#D4CEB8' }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Card CTA */}
        <div className="mt-auto pt-2">
          <Link
            href={`/products/${product.slug}`}
            className="block w-full py-2.5 px-4 text-center text-[12px] uppercase tracking-widest font-medium border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FDFBF7] transition-all duration-200"
          >
            View Product
          </Link>
        </div>
      </div>
    </div>
  );
}
