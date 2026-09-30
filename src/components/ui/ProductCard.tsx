'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '@/lib/data/types';
import { useStore } from '@/lib/context/StoreContext';

interface ProductCardProps {
  product: Product;
  aspectRatio?: '4/5' | '1/1' | '3/4';
  className?: string;
  showCategory?: boolean;
}

export function ProductCard({
  product,
  aspectRatio = '4/5',
  className = '',
  showCategory = true,
}: ProductCardProps) {
  const { isWishlisted, toggleWishlist, addToCart } = useStore();
  const [added, setAdded] = useState(false);

  const isFav = isWishlisted(product.id);
  const activeImage = product.mainImage;
  const isCustom = product.productType === 'custom_made';

  // Aspect ratio mapping
  const aspectClass =
    aspectRatio === '1/1'
      ? 'aspect-square'
      : aspectRatio === '3/4'
        ? 'aspect-[3/4]'
        : 'aspect-[4/5]';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: product.id,
      variantId: product.variations?.[0]?.id,
      name: product.displayName || product.name,
      slug: product.slug,
      image: activeImage,
      variantName: product.variations?.[0]?.name,
      sku: product.variations?.[0]?.sku || product.id,
      sizeLabel: 'Standard',
      quantity: 1,
      unitPrice: product.price,
      productType: product.productType,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div
      className={`group relative flex flex-col h-full bg-white rounded-xl overflow-hidden border border-[#EDE8DE] hover:border-[#D5CBB9] shadow-2xs hover:shadow-xs transition-all duration-200 ${className}`}
    >
      {/* ─── 1. Image Container (Main Visual Focus) ─── */}
      <div className={`relative ${aspectClass} w-full overflow-hidden bg-[#F7F4EE]`}>
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0 block w-full h-full"
          tabIndex={-1}
        >
          <Image
            src={activeImage}
            alt={product.displayName || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </Link>

        {/* Wishlist Heart — top-right */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={isFav ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isFav
              ? 'bg-white shadow-xs border border-[#EAE4D8] opacity-100 scale-100'
              : 'bg-white/90 backdrop-blur-xs border border-white/80 shadow-2xs opacity-90 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-white hover:scale-105 active:scale-95'
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isFav ? 'fill-[#B43D3D] text-[#B43D3D]' : 'text-[#57534E] hover:text-[#B43D3D]'
            }`}
          />
        </button>
      </div>

      {/* ─── 2. Product Information ─── */}
      <div className="p-3.5 flex flex-col flex-1">
        {/* Category */}
        {showCategory && (
          <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#9A7B56] mb-1 truncate">
            {product.categoryName}
          </span>
        )}

        {/* Product Name */}
        <Link href={`/products/${product.slug}`} className="block mb-2 group/title">
          <h3 className="font-serif text-[14px] sm:text-[15px] font-medium text-[#1C1917] leading-[1.3] line-clamp-2 min-h-[2.6rem] group-hover/title:text-[#1E3A2F] transition-colors">
            {product.displayName || product.name}
          </h3>
        </Link>

        {/* ─── 3. Footer: Price & Clean Action ─── */}
        <div className="mt-auto pt-1 flex items-center justify-between gap-2 border-t border-[#F2ECE1]">
          {/* Price */}
          <div className="min-w-0">
            {isCustom && product.startingPrice ? (
              <div className="flex items-baseline gap-1 text-[11px] text-[#78716C]">
                <span>From</span>
                <span className="font-serif text-[14.5px] sm:text-[15.5px] font-semibold text-[#1E3A2F]">
                  {product.currency}{product.price.toLocaleString('en-IN')}
                </span>
              </div>
            ) : (
              <span className="font-serif text-[14.5px] sm:text-[15.5px] font-semibold text-[#1E3A2F]">
                {product.currency}{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Quick Action */}
          {isCustom ? (
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold text-[#1E3A2F] hover:text-[#9A7B56] transition-colors py-1"
            >
              <span>Enquire</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                added
                  ? 'bg-[#15803D] text-white'
                  : 'bg-[#1E3A2F]/10 hover:bg-[#1E3A2F] text-[#1E3A2F] hover:text-white'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3" />
                  <span>Add</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
