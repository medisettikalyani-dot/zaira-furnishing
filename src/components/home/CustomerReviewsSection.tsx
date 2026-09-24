'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Quote, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export interface FeedbackItem {
  id: string;
  category: string;
}

const FEEDBACK_ITEMS: FeedbackItem[] = [
  { id: 'fb-1', category: 'Curtains & Drapes' },
  { id: 'fb-2', category: 'Window Blinds & Shades' },
  { id: 'fb-3', category: 'Sofa Fabrics & Upholstery' },
  { id: 'fb-4', category: 'Wallpapers & Wall Decor' },
  { id: 'fb-5', category: 'Wooden Flooring' },
  { id: 'fb-6', category: 'In-Home Measurement' },
];

export function CustomerReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse drag state
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);

  // Dynamic card step measurement
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
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);

    const step = getCardStep();
    if (step > 0) {
      const idx = Math.min(
        FEEDBACK_ITEMS.length - 1,
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setInitialScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = initialScrollLeft - walk;
  };

  const handleMouseUp = () => setIsMouseDown(false);
  const handleMouseLeave = () => setIsMouseDown(false);

  return (
    <section className="py-20 sm:py-24 lg:py-28 bg-[#FAF7F2] border-t border-[#EBE5DA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Section Header ─── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-14 gap-6">
          <div className="max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#7D5E38] font-bold block mb-2">
              Customer Feedback
            </span>
            <h2 className="font-serif text-[30px] sm:text-[38px] lg:text-[44px] text-[#1C1917] font-medium tracking-tight mb-2">
              What Our Customers Say
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#78716C] leading-relaxed">
              We&apos;d love to hear about your experience with Zaira Furnishing.
            </p>
          </div>

          {/* Desktop/Tablet Arrow Controls */}
          <div className="flex items-center gap-2 self-start sm:self-end shrink-0">
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous review"
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                canScrollLeft
                  ? 'border-[#D8CFBF] bg-white text-[#1C1917] hover:bg-[#7D5E38] hover:text-[#FAF7F2] hover:border-[#7D5E38] shadow-2xs'
                  : 'border-[#EAE0D0] bg-white/50 text-[#C4B9A1] cursor-not-allowed opacity-40'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Next review"
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                canScrollRight
                  ? 'border-[#D8CFBF] bg-white text-[#1C1917] hover:bg-[#7D5E38] hover:text-[#FAF7F2] hover:border-[#7D5E38] shadow-2xs'
                  : 'border-[#EAE0D0] bg-white/50 text-[#C4B9A1] cursor-not-allowed opacity-40'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ─── Feedback Cards Carousel Track ─── */}
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
          {FEEDBACK_ITEMS.map((item) => (
            <div
              key={item.id}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc((100%-48px)/3)] shrink-0 snap-start"
            >
              <div className="h-full rounded-[24px] sm:rounded-[28px] bg-white border border-[#EBE5DA] p-6 sm:p-7 shadow-[0_8px_24px_rgba(28,25,23,0.03)] hover:shadow-[0_16px_36px_rgba(28,25,23,0.07)] hover:border-[#D5CBB9] transition-all duration-400 flex flex-col justify-between">
                <div>
                  {/* Top Quote Icon & Service Category */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#EBE5DA] flex items-center justify-center text-[#7D5E38]">
                      <Quote className="w-4 h-4 rotate-180" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#7D5E38] bg-[#7D5E38]/8 px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="font-serif text-[18px] sm:text-[19px] text-[#1C1917] font-medium mb-2.5">
                    Customer Feedback
                  </h3>

                  {/* Neutral Placeholder Description */}
                  <p className="text-[13.5px] sm:text-[14px] text-[#78716C] leading-relaxed mb-3">
                    Real customer feedback will appear here.
                  </p>

                  {/* Supporting Prompt */}
                  <p className="text-[12.5px] text-[#A8A29E] leading-relaxed mb-6">
                    Share your experience with Zaira Furnishing.
                  </p>
                </div>

                {/* Card Bottom CTA Link */}
                <div className="pt-4 border-t border-[#F2ECE1]">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#7D5E38] hover:text-[#1C1917] transition-colors group/link"
                  >
                    <span>Share Your Experience</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Pagination Dots ─── */}
        <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
          {FEEDBACK_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToCard(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full h-1.5 ${
                activeIndex === idx
                  ? 'w-6 bg-[#7D5E38]'
                  : 'w-1.5 bg-[#D8CFBF] hover:bg-[#A89D89]'
              }`}
            />
          ))}
        </div>

        {/* ─── Section Level CTA Link to Contact Page ─── */}
        <div className="text-center mt-8">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-[#7D5E38] hover:bg-[#1C1917] text-[#FAF7F2] text-[12.5px] sm:text-[13px] font-semibold tracking-wide px-7 py-3 rounded-full transition-all duration-300 shadow-xs group"
          >
            <span>Share Your Experience</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
