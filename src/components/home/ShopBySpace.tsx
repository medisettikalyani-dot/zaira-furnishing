'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { CloudflareImage } from '@/components/ui/CloudflareImage';

interface RoomCard {
  id: string;
  roomName: string;
  heading: string;
  supportingText: string;
  ctaText: string;
  image: string;
  href: string;
}

const ROOM_CARDS: RoomCard[] = [
  {
    id: 'living-room',
    roomName: 'Living Room',
    heading: 'Beautiful Living Spaces',
    supportingText: 'Curtains, rugs, sofa fabrics and more for your living room.',
    ctaText: 'Shop Now',
    image: '/images/hero/living_room.jpg',
    href: '/categories/curtains',
  },
  {
    id: 'bedroom',
    roomName: 'Bedroom',
    heading: 'Comfort for Your Bedroom',
    supportingText: 'Curtains, mattresses, bed linen and more for your bedroom.',
    ctaText: 'Shop Now',
    image: '/images/hero/bedroom.jpg',
    href: '/categories?slug=mattresses-sleep-systems',
  },
  {
    id: 'dining',
    roomName: 'Dining',
    heading: 'Make Dining Special',
    supportingText: 'Table linen, crockery, glassware and dining decor.',
    ctaText: 'Shop Now',
    image: '/images/categories/table-linen.jpg',
    href: '/categories?slug=table-linen-dining-decor',
  },
  {
    id: 'windows',
    roomName: 'Windows',
    heading: 'Beautiful Windows',
    supportingText: 'Curtains, blinds and window shades for every space.',
    ctaText: 'Shop Now',
    image: '/images/services/smart-blinds-setup.jpg',
    href: '/categories/blinds',
  },
  {
    id: 'outdoor',
    roomName: 'Outdoor',
    heading: 'Better Outdoor Spaces',
    supportingText: 'Artificial turf, outdoor flooring and furnishings.',
    ctaText: 'Shop Now',
    image: '/images/categories/artificial-turf.jpg',
    href: '/categories?slug=artificial-turf-green-walls',
  },
  {
    id: 'office-and-commercial',
    roomName: 'Office & Commercial',
    heading: 'Furnish Your Work Space',
    supportingText: 'Furnishing support for offices and commercial spaces.',
    ctaText: 'Shop Now',
    image: '/images/services/office-commercial-furnishing.jpg',
    href: '/categories?slug=wooden-flooring-sports-floor',
  },
];

export function ShopBySpace() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse drag state
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  // Measure dynamic card step
  const getCardStep = useCallback(() => {
    if (!scrollRef.current) return 360;
    const firstCard = scrollRef.current.children[0] as HTMLElement | undefined;
    const secondCard = scrollRef.current.children[1] as HTMLElement | undefined;
    if (firstCard && secondCard) {
      return secondCard.offsetLeft - firstCard.offsetLeft;
    }
    if (firstCard) {
      return firstCard.offsetWidth + 24;
    }
    return scrollRef.current.clientWidth;
  }, []);

  const updateScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const step = getCardStep();
    if (step > 0) {
      const idx = Math.min(
        ROOM_CARDS.length - 1,
        Math.max(0, Math.round(scrollLeft / step))
      );
      setActiveIndex(idx);
    }
  }, [getCardStep]);

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
    const step = getCardStep();
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    });
  };

  const scrollToCard = (index: number) => {
    if (!scrollRef.current) return;
    const step = getCardStep();
    scrollRef.current.scrollTo({
      left: index * step,
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
    <section className="py-16 sm:py-20 lg:py-24 bg-[#FAF7F2] border-t border-[#EBE7DF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Section Header ─── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-5">
          <div>
            <h2 className="font-serif text-[28px] sm:text-[36px] lg:text-[42px] text-[#1C1917] font-medium tracking-tight mb-2">
              Shop by Room
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#78716C] leading-relaxed">
              Find furnishings for every space in your home.
            </p>
          </div>

          {/* Left/Right Arrow Navigation Controls */}
          <div className="flex items-center gap-2 self-start sm:self-end shrink-0">
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous rooms"
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                canScrollLeft
                  ? 'border-[#D8CFBF] bg-white text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FAF7F2] hover:border-[#1C1917] shadow-2xs cursor-pointer'
                  : 'border-[#EAE0D0] bg-white/50 text-[#C4B9A1] opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Next rooms"
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                canScrollRight
                  ? 'border-[#D8CFBF] bg-white text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FAF7F2] hover:border-[#1C1917] shadow-2xs cursor-pointer'
                  : 'border-[#EAE0D0] bg-white/50 text-[#C4B9A1] opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ─── Horizontal Room Editorial Carousel Track ─── */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className={`flex gap-5 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory select-none pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
            isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {ROOM_CARDS.map((room) => (
            <div
              key={room.id}
              className="w-full sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-48px)/3)] shrink-0 snap-start"
            >
              <Link
                href={room.href}
                onClick={(e) => {
                  if (hasDragged) e.preventDefault();
                }}
                className="group relative block w-full h-[360px] sm:h-[400px] lg:h-[430px] rounded-[22px] sm:rounded-[26px] overflow-hidden border border-[#EAE3D6] shadow-[0_6px_22px_rgba(28,25,23,0.04)] hover:shadow-[0_16px_36px_rgba(28,25,23,0.1)] transition-all duration-500 focus:outline-hidden"
              >
                {/* Large Background Lifestyle Photograph */}
                <CloudflareImage
                  src={room.image}
                  alt={room.heading}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                />

                {/* Editorial Gradient Scrim for Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/5 group-hover:from-black/85 group-hover:via-black/40 transition-colors duration-500" />

                {/* Room Category Pill Tag (Top Left) */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 text-[10px] sm:text-[10.5px] uppercase font-bold tracking-[0.18em] bg-white/90 text-[#1C1917] backdrop-blur-xs rounded-full shadow-2xs">
                    {room.roomName}
                  </span>
                </div>

                {/* Bottom Editorial Content */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-10 flex flex-col justify-end">
                  <h3 className="font-serif text-[21px] sm:text-[23px] lg:text-[25px] text-white font-medium leading-snug tracking-tight mb-1.5 group-hover:text-[#F3ECE1] transition-colors">
                    {room.heading}
                  </h3>

                  <p className="text-[12.5px] sm:text-[13px] text-[#FAF7F2]/85 leading-relaxed line-clamp-2 mb-4">
                    {room.supportingText}
                  </p>

                  <div className="pt-3 border-t border-white/20">
                    <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-[11.5px] uppercase tracking-[0.16em] font-semibold text-white group-hover:text-[#D5CBB9] transition-colors">
                      <span>{room.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* ─── Pagination Dots ─── */}
        <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
          {ROOM_CARDS.map((room, idx) => (
            <button
              key={room.id}
              type="button"
              onClick={() => scrollToCard(idx)}
              aria-label={`Go to room ${idx + 1}`}
              className={`transition-all duration-300 rounded-full h-1.5 ${
                activeIndex === idx
                  ? 'w-6 bg-[#1C1917]'
                  : 'w-1.5 bg-[#D8CFBF] hover:bg-[#A89D89]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
