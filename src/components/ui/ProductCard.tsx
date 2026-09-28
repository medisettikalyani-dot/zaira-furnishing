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
  const isFeatured = product.featured;

  // Aspect ratio mapping
  const aspectClass =
    aspectRatio === '1/1'
      ? 'aspect-square'
      : aspectRatio === '3/4'
        ? 'aspect-[3/4]'
        : 'aspect-[4/5]';

  // Extract a clean 1-2 line descriptive snippet
  const materialSpec = product.specifications?.find(
    (s) =>
      s.label.toLowerCase().includes('fabric') ||
      s.label.toLowerCase().includes('material') ||
      s.label.toLowerCase().includes('composition')
  )?.value;

  const descriptionSnippet = product.shortDescription || materialSpec || product.categoryName;

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
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div
      className={`group relative flex flex-col h-full bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#EDE8DE] shadow-[0_2px_10px_rgba(28,25,23,0.03)] hover:shadow-[0_16px_36px_rgba(28,25,23,0.08)] hover:border-[#D5CBB9] transition-all duration-300 ease-out hover:-translate-y-1 ${className}`}
    >
      {/* ─── 1. Image Container ─── */}
      <div className={`relative ${aspectClass} w-full overflow-hidden bg-gradient-to-b from-[#F7F4EE] to-[#EDE7DC]`}>
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
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
          {/* Subtle soft gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/[0.04] via-transparent to-transparent pointer-events-none" />
        </Link>

        {/* Product Badges — top-left */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          {isCustom && (
            <span className="inline-flex items-center px-2 sm:px-2.5 py-1 text-[8.5px] sm:text-[9px] uppercase tracking-[0.15em] font-semibold bg-[#1C1917]/85 text-[#FDFBF7] backdrop-blur-md rounded-sm border border-white/10 shadow-xs leading-none">
              Custom Made
            </span>
          )}
          {isFeatured && !isCustom && (
            <span className="inline-flex items-center px-2 sm:px-2.5 py-1 text-[8.5px] sm:text-[9px] uppercase tracking-[0.15em] font-semibold bg-[#9A7B56]/90 text-white backdrop-blur-md rounded-sm border border-white/10 shadow-xs leading-none">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Heart — top-right */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={isFav ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isFav
              ? 'bg-white shadow-[0_2px_8px_rgba(28,25,23,0.12)] border border-[#EAE4D8] opacity-100 scale-100'
              : 'bg-white/90 backdrop-blur-md border border-white/60 shadow-[0_2px_8px_rgba(28,25,23,0.06)] opacity-95 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-white hover:scale-105 active:scale-95'
          }`}
        >
          <Heart
            className={`w-[14px] h-[14px] sm:w-[15px] sm:h-[15px] transition-all duration-200 ${
              isFav
                ? 'fill-[#B43D3D] text-[#B43D3D] scale-110'
                : 'text-[#57534E] hover:text-[#B43D3D]'
            }`}
          />
        </button>
      </div>

      {/* ─── 2. Product Information Hierarchy ─── */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {/* Category / Type */}
        {showCategory && (
          <div className="mb-1 sm:mb-1.5 flex items-center justify-between gap-1">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em] font-semibold text-[#9A7B56] truncate">
              {product.categoryName}
            </span>
            {isCustom && (
              <span className="text-[8.5px] sm:text-[9px] text-[#A8A29E] uppercase tracking-wider font-medium hidden sm:inline">
                Bespoke
              </span>
            )}
          </div>
        )}

        {/* Product Name */}
        <Link href={`/products/${product.slug}`} className="block mb-1 sm:mb-1.5 group/title">
          <h3 className="font-serif text-[13.5px] sm:text-[15.5px] font-semibold text-[#1C1917] leading-[1.3] line-clamp-1 sm:line-clamp-2 min-h-[1.3rem] sm:min-h-[2.6rem] group-hover/title:text-[#9A7B56] transition-colors duration-200">
            {product.displayName || product.name}
          </h3>
        </Link>

        {/* Short Material / Style Description */}
        <p className="text-[11px] sm:text-[11.5px] text-[#78716C] line-clamp-1 sm:line-clamp-2 leading-relaxed min-h-[1rem] sm:min-h-[2rem] mb-3 sm:mb-3.5">
          {descriptionSnippet}
        </p>

        {/* ─── 3. Pinned Footer: Price & Primary Action ─── */}
        <div className="mt-auto pt-1 sm:pt-2">
          {/* Price */}
          <div className="mb-2.5 sm:mb-3">
            {isCustom ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-[10px] sm:text-[11px] font-medium text-[#78716C] uppercase tracking-wider">
                  From
                </span>
                <span className="font-serif text-[15.5px] sm:text-[17.5px] font-bold text-[#1C1917] tracking-tight">
                  {product.currency}{product.price.toLocaleString('en-IN')}
                </span>
              </div>
            ) : (
              <div className="flex items-baseline">
                <span className="font-serif text-[15.5px] sm:text-[17.5px] font-bold text-[#1C1917] tracking-tight">
                  {product.currency}{product.price.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          {isCustom ? (
            <Link
              href={`/products/${product.slug}`}
              className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:py-2.5 rounded-lg text-[10.5px] sm:text-[11px] uppercase tracking-[0.12em] font-semibold transition-all duration-200 bg-[#1C1917] text-[#FAF7F2] hover:bg-[#9A7B56] hover:text-white shadow-xs active:scale-[0.98] min-h-[38px] sm:min-h-[40px]"
            >
              <span>Enquire Now</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:py-2.5 rounded-lg text-[10.5px] sm:text-[11px] uppercase tracking-[0.12em] font-semibold transition-all duration-200 cursor-pointer active:scale-[0.98] min-h-[38px] sm:min-h-[40px] ${
                added
                  ? 'bg-[#15803D] text-white shadow-xs'
                  : 'bg-[#1C1917] text-[#FAF7F2] hover:bg-[#9A7B56] hover:text-white shadow-xs'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
