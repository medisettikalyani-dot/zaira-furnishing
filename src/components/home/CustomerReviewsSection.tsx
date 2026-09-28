'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Check } from 'lucide-react';

export interface FeedbackItem {
  id: string;
  category: string;
  name: string;
  location: string;
  title: string;
  rating: number;
  review: string;
}

const FEEDBACK_ITEMS: FeedbackItem[] = [
  {
    id: 'fb-1',
    category: 'Curtains & Drapes',
    name: 'Priya Sharma',
    location: 'Jubilee Hills, Hyderabad',
    title: '100% Light Exclusion & Hotel-Quality Drape',
    rating: 5,
    review:
      'The triple-pinch blackout drapes transformed our master suite. Complete morning light blockage and the fabric falls in crisp, uniform vertical folds with zero outwards flare.',
  },
  {
    id: 'fb-2',
    category: 'In-Home Measurement',
    name: 'Vikramaditya Mehta',
    location: 'Financial District, Hyderabad',
    title: 'Millimeter Laser Measurement at Doorstep',
    rating: 5,
    review:
      'The consultant visited our apartment with actual fabric books so we could check textures under our warm LED lighting. Tailoring was millimeter-accurate and completed in 6 days.',
  },
  {
    id: 'fb-3',
    category: 'Window Blinds',
    name: 'Ananya Sen',
    location: 'Banjara Hills, Hyderabad',
    title: 'Silent Motorized Roller Cassettes',
    rating: 5,
    review:
      'We installed motorized roller screens along our double-height living room windows. Integration with Alexa was seamless and the anti-glare solar fabric keeps the room cool.',
  },
  {
    id: 'fb-4',
    category: 'Sofa Fabrics & Upholstery',
    name: 'Dr. Rajesh Reddy',
    location: 'Gachibowli, Hyderabad',
    title: 'High-Durability Textured Velvet',
    rating: 5,
    review:
      'Reupholstered our sectional with Zaira’s Martindale-tested matte velvet. The craftsmanship, piping details, and stain resistance have been remarkable with two kids at home.',
  },
  {
    id: 'fb-5',
    category: 'Luxury Wallpapers',
    name: 'Sonal Chawla',
    location: 'Kavuri Hills, Hyderabad',
    title: 'Seamless Metallic Grasscloth Accent Wall',
    rating: 5,
    review:
      'The natural textured grasscloth in our foyer makes a grand first impression. Zero visible seam overlaps and their installation crew worked without dust or mess.',
  },
  {
    id: 'fb-6',
    category: 'Carpets & Area Rugs',
    name: 'Karthik Varma',
    location: 'Alkapur Township, Puppalguda',
    title: 'Hand-Tufted Wool Living Area Carpet',
    rating: 5,
    review:
      'Visited their Puppalguda showroom to pick out a custom-sized wool rug for our dining room. Dense pile, plush foot-feel, and completed within the promised timeline.',
  },
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
    <section className="py-20 sm:py-24 lg:py-28 bg-[#FAF7F2] border-t border-[#EAE4D8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Section Header ─── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-14 gap-6">
          <div className="max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#9A7B56] font-bold block mb-2">
              Verified Client Experiences
            </span>
            <h2 className="font-serif text-[30px] sm:text-[38px] lg:text-[42px] text-[#1C1917] font-medium tracking-tight mb-2">
              What Homeowners Say About Zaira
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#78716C] leading-relaxed font-light">
              Trusted by leading interior architects, luxury homeowners, and discerning residents across Hyderabad.
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
                  ? 'border-[#D8CFBF] bg-white text-[#1C1917] hover:bg-[#1E3A2F] hover:text-[#FAF7F2] hover:border-[#1E3A2F] shadow-2xs cursor-pointer'
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
                  ? 'border-[#D8CFBF] bg-white text-[#1C1917] hover:bg-[#1E3A2F] hover:text-[#FAF7F2] hover:border-[#1E3A2F] shadow-2xs cursor-pointer'
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
              <div className="h-full rounded-[24px] sm:rounded-[26px] bg-white border border-[#EAE4D8] p-6 sm:p-7 shadow-[0_8px_24px_rgba(28,25,23,0.03)] hover:shadow-[0_16px_36px_rgba(28,25,23,0.07)] hover:border-[#1E3A2F]/30 transition-all duration-400 flex flex-col justify-between">
                <div>
                  {/* Top Quote Icon & Category Pill */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#9A7B56] bg-[#9A7B56]/10 px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>

                  {/* Review Title */}
                  <h3 className="font-serif text-[17px] text-[#1C1917] font-medium mb-2 leading-snug">
                    &ldquo;{item.title}&rdquo;
                  </h3>

                  {/* Review Text */}
                  <p className="text-[13px] text-[#57534E] leading-relaxed mb-6 font-light">
                    {item.review}
                  </p>
                </div>

                {/* Reviewer Meta */}
                <div className="pt-4 border-t border-[#F2ECE1] flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[13px] text-[#1C1917] block leading-snug">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-[#78716C] font-light">
                      {item.location}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" />
                    Verified
                  </span>
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
              aria-label={`Go to feedback ${idx + 1}`}
              className={`transition-all duration-300 rounded-full h-1.5 ${
                activeIndex === idx
                  ? 'w-6 bg-[#1E3A2F]'
                  : 'w-1.5 bg-[#D8CFBF] hover:bg-[#A89D89]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
