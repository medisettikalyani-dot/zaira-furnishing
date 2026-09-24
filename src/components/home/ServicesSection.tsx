'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { CloudflareImage } from '@/components/ui/CloudflareImage';

interface ServiceItem {
  id: string;
  label: string;
  heading: string;
  description: string;
  image: string;
  href: string;
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'free-home-measurement',
    label: 'FREE VISIT',
    heading: 'Free In-Home Measurement / Site Visit',
    description: 'We visit your home and take the right measurements for your furnishings.',
    image: '/images/services/free-home-measurement.jpg',
    href: '/services#free-in-home-measurement',
  },
  {
    id: 'fabric-samples-at-home',
    label: 'AT HOME',
    heading: 'Doorstep Fabric / Sample Demo',
    description: 'See and compare fabric and furnishing samples at your home.',
    image: '/images/services/fabric-samples-at-home.jpg',
    href: '/services#doorstep-fabric-demo',
  },
  {
    id: 'custom-stitching',
    label: 'CUSTOM FIT',
    heading: 'Custom Tailoring & Stitching',
    description: 'Get curtains and other furnishings made to your required size.',
    image: '/images/services/custom-stitching.jpg',
    href: '/services#custom-tailoring-and-stitching',
  },
  {
    id: 'professional-installation',
    label: 'EXPERT FITTING',
    heading: 'Professional Installation',
    description: 'Our team installs curtains, blinds and other furnishings neatly.',
    image: '/images/services/professional-installation.jpg',
    href: '/services#professional-installation',
  },
  {
    id: 'smart-blinds-setup',
    label: 'SMART HOME',
    heading: 'Motorization / Smart Home Setup',
    description: 'Set up motorized blinds and simple smart controls for your home.',
    image: '/images/services/smart-blinds-setup.jpg',
    href: '/services#motorization-smart-home',
  },
  {
    id: 'remote-home-styling',
    label: 'REMOTE SERVICE',
    heading: 'NRI Remote Home Styling',
    description: 'Get furnishing guidance even when you are not at home.',
    image: '/images/services/remote-home-styling.jpg',
    href: '/services#nri-remote-home-styling',
  },
  {
    id: 'office-commercial-furnishing',
    label: 'FOR BUSINESS',
    heading: 'Corporate / Institutional Furnishings',
    description: 'Furnishing support for offices and other commercial spaces.',
    image: '/images/services/office-commercial-furnishing.jpg',
    href: '/services#corporate-institutional-furnishings',
  },
  {
    id: 'warranty-and-support',
    label: 'AFTER SALES',
    heading: 'Warranty & After-Sales Support',
    description: 'We provide support after your furnishing work is completed.',
    image: '/images/services/warranty-and-support.jpg',
    href: '/services#warranty-after-sales',
  },
];

export function ServicesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse drag state
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  // Measure dynamic card step (card width + gap)
  const getCardStep = useCallback(() => {
    if (!scrollRef.current) return 320;
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

  // Update scroll navigation and active dot
  const updateScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);

    const step = getCardStep();
    if (step > 0) {
      const idx = Math.min(
        SERVICES_DATA.length - 1,
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

  // Arrow button click handlers
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const step = getCardStep();
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    });
  };

  // Dot click handler
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
    <section className="relative bg-[#F4EDE2] overflow-hidden">
      {/* ─── Organic Torn / Deckled Paper Top Edge (Matching Reference) ─── */}
      <div className="w-full overflow-hidden leading-none select-none pointer-events-none -mt-px text-[#FAF7F2]">
        <svg
          viewBox="0 0 1440 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-5 sm:h-7 lg:h-8 block"
        >
          <path
            d="M0,0 L1440,0 L1440,14 C1410,19 1375,12 1335,18 C1290,25 1250,11 1205,17 C1160,23 1120,9 1075,19 C1030,26 990,13 945,18 C900,23 860,8 815,16 C770,24 730,10 685,18 C640,25 600,12 555,17 C510,22 470,7 425,16 C380,24 340,11 295,18 C250,23 210,8 165,17 C120,25 80,12 35,16 L0,14 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="pt-10 sm:pt-14 pb-16 sm:pb-20 lg:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Centered Section Header (Matching Reference Image) ─── */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="font-serif text-[32px] sm:text-[40px] lg:text-[46px] text-[#1C1917] font-medium tracking-tight mb-2.5">
            Our Services
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#78716C] leading-relaxed">
            We help you choose, measure and install your furnishings.
          </p>
        </div>

        {/* ─── Carousel Controls (Prev/Next Header & Mobile) ─── */}
        <div className="relative">
          {/* Subtle Left Arrow Button */}
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous service"
            className={`hidden md:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center border transition-all duration-300 shadow-md ${
              canScrollLeft
                ? 'border-[#EAE0D0] bg-white text-[#1C1917] hover:bg-[#7D5E38] hover:text-white hover:border-[#7D5E38]'
                : 'border-[#EAE0D0] bg-white/70 text-[#C4B9A1] opacity-40 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Subtle Right Arrow Button */}
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Next service"
            className={`hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center border transition-all duration-300 shadow-md ${
              canScrollRight
                ? 'border-[#EAE0D0] bg-white text-[#1C1917] hover:bg-[#7D5E38] hover:text-white hover:border-[#7D5E38]'
                : 'border-[#EAE0D0] bg-white/70 text-[#C4B9A1] opacity-40 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* ─── Horizontal Carousel Track ─── */}
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
            {SERVICES_DATA.map((service) => (
              <div
                key={service.id}
                className="w-[82vw] sm:w-[calc(50%-12px)] lg:w-[calc((100%-72px)/4)] shrink-0 snap-start"
              >
                {/* ─── Rounded Squircle White Card (Matching Reference Image) ─── */}
                <div className="group relative h-full rounded-[30px] sm:rounded-[34px] overflow-hidden bg-white border border-[#EDE4D6] shadow-[0_10px_28px_rgba(50,38,25,0.06)] hover:shadow-[0_20px_42px_rgba(50,38,25,0.12)] hover:-translate-y-1 transition-all duration-400 p-4 sm:p-5 flex flex-col justify-between text-center">
                  <div>
                    {/* Top Image Container */}
                    <div className="relative w-full aspect-[4/3] rounded-[22px] sm:rounded-[24px] overflow-hidden bg-[#FAF7F2] mb-4">
                      <CloudflareImage
                        src={service.image}
                        alt={service.heading}
                        fill
                        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 25vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      {/* Pill Badge on Image */}
                      <div className="absolute top-2.5 right-2.5 z-10">
                        <span className="px-2.5 py-0.5 text-[9.5px] uppercase tracking-wider font-bold bg-white/95 text-[#7D5E38] rounded-full shadow-2xs backdrop-blur-xs">
                          {service.label}
                        </span>
                      </div>
                    </div>

                    {/* Card Heading */}
                    <h3 className="font-serif text-[17px] sm:text-[18px] text-[#1C1917] font-medium leading-snug tracking-tight mb-1.5 px-1">
                      {service.heading}
                    </h3>

                    {/* Card Description */}
                    <p className="text-[12px] sm:text-[12.5px] text-[#78716C] leading-relaxed line-clamp-2 px-2 mb-4">
                      {service.description}
                    </p>
                  </div>

                  {/* ─── Subtle "Learn More →" Text Link ─── */}
                  <div className="pt-2">
                    <Link
                      href={service.href}
                      onClick={(e) => {
                        if (hasDragged) e.preventDefault();
                      }}
                      className="inline-flex items-center justify-center gap-1.5 text-[12.5px] sm:text-[13px] font-medium text-[#7D5E38] hover:text-[#1C1917] transition-colors duration-200 group/link mx-auto"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Mobile Prev / Next Controls & Dots ─── */}
        <div className="flex items-center justify-between sm:justify-center gap-3 mt-8 sm:mt-10">
          {/* Mobile Prev Arrow */}
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous service"
            className={`md:hidden w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
              canScrollLeft
                ? 'border-[#D8CFBF] bg-white text-[#1C1917]'
                : 'border-[#EAE0D0] bg-white/60 text-[#C4B9A1] opacity-40'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Carousel Pagination Dots */}
          <div className="flex items-center gap-2">
            {SERVICES_DATA.map((service, idx) => (
              <button
                key={service.id}
                type="button"
                onClick={() => scrollToCard(idx)}
                aria-label={`Go to service ${idx + 1}`}
                className={`transition-all duration-300 rounded-full h-1.5 ${
                  activeIndex === idx
                    ? 'w-6 bg-[#7D5E38]'
                    : 'w-1.5 bg-[#D8CFBF] hover:bg-[#A89D89]'
                }`}
              />
            ))}
          </div>

          {/* Mobile Next Arrow */}
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Next service"
            className={`md:hidden w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
              canScrollRight
                ? 'border-[#D8CFBF] bg-white text-[#1C1917]'
                : 'border-[#EAE0D0] bg-white/60 text-[#C4B9A1] opacity-40'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
