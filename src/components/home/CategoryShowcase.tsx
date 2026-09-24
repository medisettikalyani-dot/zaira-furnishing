'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from '@/lib/data/categories';

export function CategoryShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Mouse drag state
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  // Measure dynamic card step (card width + gap)
  const getCardStep = useCallback(() => {
    if (!scrollRef.current) return 330;
    const firstCard = scrollRef.current.children[0] as HTMLElement | undefined;
    const secondCard = scrollRef.current.children[1] as HTMLElement | undefined;
    if (firstCard && secondCard) {
      return secondCard.offsetLeft - firstCard.offsetLeft;
    }
    if (firstCard) {
      return firstCard.offsetWidth + 24;
    }
    return scrollRef.current.clientWidth * 0.75;
  }, []);

  const updateScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100)));
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const step = getCardStep() * 1.5;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    });
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsMouseDown(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setInitialScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    if (Math.abs(walk) > 6) {
      setHasDragged(true);
    }
    scrollRef.current.scrollLeft = initialScrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setTimeout(() => setHasDragged(false), 80);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
    setTimeout(() => setHasDragged(false), 80);
  };

  return (
    <section className="py-20 sm:py-24 lg:py-28 bg-[#FAF7F2] border-t border-[#EAE3D6] overflow-hidden relative">
      {/* Decorative ambient subtle glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#EBE0D0]/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#F2EAE0]/50 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ─── Luxury Editorial Section Header ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-6 h-[1px] bg-[#9A7B56]" />
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#9A7B56] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#9A7B56]" />
                Atelier Collections
              </span>
            </div>
            <h2 className="font-serif text-[32px] sm:text-[42px] lg:text-[48px] text-[#1C1917] font-normal tracking-tight leading-[1.15] mb-3">
              Shop by Category
            </h2>
            <p className="text-[14.5px] sm:text-[15.5px] text-[#78716C] leading-relaxed font-light">
              Fourteen bespoke furnishing disciplines crafted to elevate residential and hospitality spaces — tailored to perfection.
            </p>
          </div>

          {/* Action Links & Navigation Controls */}
          <div className="flex items-center gap-3.5 self-start md:self-end shrink-0">
            {/* View All Categories Button */}
            <Link
              href="/categories"
              className="group inline-flex items-center gap-2.5 px-6 py-3 text-[11px] sm:text-[11.5px] uppercase tracking-[0.18em] font-semibold text-[#1C1917] bg-white border border-[#D8CFBF] hover:bg-[#1C1917] hover:text-[#FAF7F2] hover:border-[#1C1917] rounded-full transition-all duration-300 shadow-2xs hover:shadow-md"
            >
              <span>View All 14 Categories</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#9A7B56] group-hover:text-white transition-colors duration-300" />
            </Link>

            {/* Carousel Navigation Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Previous categories"
                className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  canScrollLeft
                    ? 'border-[#D8CFBF] bg-white text-[#1C1917] hover:bg-[#1C1917] hover:text-white hover:border-[#1C1917] shadow-xs cursor-pointer hover:scale-105 active:scale-95'
                    : 'border-[#EAE0D0] bg-white/40 text-[#C4B9A1] opacity-40 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4 stroke-[2]" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="Next categories"
                className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  canScrollRight
                    ? 'border-[#D8CFBF] bg-white text-[#1C1917] hover:bg-[#1C1917] hover:text-white hover:border-[#1C1917] shadow-xs cursor-pointer hover:scale-105 active:scale-95'
                    : 'border-[#EAE0D0] bg-white/40 text-[#C4B9A1] opacity-40 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Immersive Editorial Lookbook Carousel Track ─── */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className={`flex gap-5 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory select-none pb-6 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
            isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {CATEGORIES.map((category, index) => {
            const categoryIndex = String(index + 1).padStart(2, '0');
            const targetHref =
              category.slug === 'curtains-drapes'
                ? '/categories/curtains'
                : category.slug === 'window-blinds-shades'
                ? '/categories/blinds'
                : category.slug === 'sofa-fabrics-upholstery'
                ? '/categories/sofa-fabrics'
                : category.slug === 'wallpapers-wall-coverings'
                ? '/categories/wallpapers'
                : category.slug === 'carpets-rugs'
                ? '/categories/carpets'
                : `/categories?slug=${category.slug}`;

            return (
              <Link
                key={category.id}
                href={targetHref}
                onClick={(e) => {
                  if (hasDragged) e.preventDefault();
                }}
                className="group relative flex flex-col flex-shrink-0 w-[78vw] sm:w-[48vw] md:w-[35vw] lg:w-[310px] xl:w-[335px] aspect-[3/4.15] rounded-[22px] sm:rounded-[26px] overflow-hidden border border-[#E2DBD0] hover:border-[#C5A880] transition-all duration-500 shadow-[0_8px_24px_rgba(28,25,23,0.06)] hover:shadow-[0_22px_48px_rgba(28,25,23,0.18)] snap-start focus:outline-hidden hover:-translate-y-1.5"
              >
                {/* ─── Background Full-Bleed Image ─── */}
                <Image
                  src={category.image}
                  alt={`${category.name} showroom collection`}
                  fill
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 38vw, 335px"
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                {/* ─── Multi-stop Cinematic Gradient Scrim ─── */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D]/95 via-[#120F0D]/40 to-black/15 group-hover:from-[#120F0D]/98 group-hover:via-[#120F0D]/45 transition-colors duration-500 pointer-events-none" />

                {/* Subtle warm golden ambient overlay on hover */}
                <div className="absolute inset-0 bg-[#9A7B56]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay" />

                {/* ─── Top Badges Header ─── */}
                <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between">
                  {/* Category Index Number */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[#FAF7F2] text-[10px] font-mono tracking-wider font-medium shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                    {categoryIndex}
                  </span>

                  {/* Discipline Tag Pill */}
                  <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[9.5px] uppercase tracking-[0.16em] font-medium">
                    {category.itemCountText || 'Collection'}
                  </span>
                </div>

                {/* ─── Bottom Content Overlay (Inside Card) ─── */}
                <div className="relative z-10 mt-auto p-5 sm:p-6 flex flex-col justify-end">
                  {/* Category Subtitle / Discipline Eyebrow */}
                  <span className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.22em] text-[#D4AF37] font-semibold mb-1.5 drop-shadow-xs">
                    Curated Collection
                  </span>

                  {/* Grand Luxury Serif Title */}
                  <h3 className="font-serif text-[21px] sm:text-[23px] lg:text-[25px] text-white font-normal leading-[1.2] tracking-tight group-hover:text-[#F6ECE0] transition-colors drop-shadow-sm mb-2">
                    {category.name}
                  </h3>

                  {/* Evocative Tagline */}
                  <p className="text-[12px] sm:text-[12.5px] text-white/80 line-clamp-2 leading-relaxed font-light mb-4 group-hover:text-white/95 transition-colors">
                    {category.tagline}
                  </p>

                  {/* Illuminated Action Button Row */}
                  <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                    <span className="text-[11px] sm:text-[11.5px] uppercase tracking-[0.16em] font-semibold text-white group-hover:text-[#E8CF9F] transition-colors flex items-center gap-1">
                      <span>Explore Collection</span>
                    </span>

                    {/* Illuminated Circular Arrow Icon */}
                    <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:bg-[#C5A880] group-hover:border-[#C5A880] group-hover:text-[#120F0D] transition-all duration-300 group-hover:scale-105 shadow-sm">
                      <ArrowUpRight className="w-4 h-4 stroke-[2]" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ─── Carousel Progress Indicator & Counter ─── */}
        <div className="mt-8 flex items-center justify-between gap-4 pt-3 border-t border-[#EAE3D6]">
          <div className="flex items-center gap-3 flex-1 max-w-xs sm:max-w-sm">
            <div className="h-1 w-full bg-[#EAE3D6] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#9A7B56] transition-all duration-150 ease-out rounded-full shadow-2xs"
                style={{ width: `${Math.max(10, scrollProgress)}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] sm:text-[11.5px] uppercase tracking-[0.16em] text-[#8C827A] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B56]" />
            <span>14 Bespoke Disciplines</span>
          </div>
        </div>

        {/* ─── Mobile View All Link ─── */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-[11.5px] uppercase tracking-[0.18em] font-semibold text-[#1C1917] bg-white border border-[#D8CFBF] rounded-full shadow-xs w-full justify-center"
          >
            <span>View All 14 Categories</span>
            <ArrowUpRight className="w-4 h-4 text-[#9A7B56]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
