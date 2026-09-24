import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] text-[#1C1917] pt-2 sm:pt-4 lg:pt-6 pb-8 sm:pb-12 lg:pb-16">
      {/* ─── Organic Background Waves & Botanical Illustrations ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Sweeping Organic Curved Almond/Beige Backdrop - visible and scaled across mobile, tablet, and desktop */}
        <div
          className="absolute -top-10 sm:-top-16 right-0 w-[88vw] sm:w-[72vw] lg:w-[58vw] h-[65%] sm:h-[95%] lg:h-[115%] bg-[#EFE7DC] opacity-95 block"
          style={{
            borderBottomLeftRadius: '220px',
            borderTopLeftRadius: '140px',
            transform: 'rotate(-2deg)',
          }}
        />

        {/* Top-Right Deep Forest Green Organic Arch Shape - visible on mobile with scaled proportions */}
        <div
          className="absolute -top-10 -right-10 sm:-top-14 sm:-right-14 w-40 h-40 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-[#233F33] opacity-95 block"
          style={{
            borderRadius: '45% 55% 40% 60% / 50% 45% 55% 50%',
          }}
        />

        {/* Top-Right Lush Botanical Leaf Branch (overlaying green arch) */}
        <svg
          viewBox="0 0 160 160"
          className="absolute top-2 right-2 sm:top-5 sm:right-5 w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 text-[#6E8F7F] opacity-90 block z-10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M140 15 Q100 55 65 125" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          {/* Leaves */}
          <path d="M130 30 Q120 12 105 18 Q115 35 130 30" fill="currentColor" opacity="0.9" />
          <path d="M115 45 Q100 30 86 38 Q100 54 115 45" fill="currentColor" opacity="0.9" />
          <path d="M102 65 Q85 52 72 60 Q86 75 102 65" fill="currentColor" opacity="0.9" />
          <path d="M88 88 Q72 76 60 86 Q75 99 88 88" fill="currentColor" opacity="0.9" />
          <path d="M74 112 Q60 102 50 112 Q64 124 74 112" fill="currentColor" opacity="0.9" />
        </svg>

        {/* Middle-Left Botanical Olive-Sage Branch */}
        <svg
          viewBox="0 0 180 180"
          className="absolute top-[40%] sm:top-[42%] -left-6 w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 text-[#7E9688] opacity-60 pointer-events-none block"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M10 90 Q65 95 130 60" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M35 88 Q50 72 65 78 Q50 94 35 88" fill="currentColor" opacity="0.8" />
          <path d="M65 82 Q82 66 96 74 Q80 90 65 82" fill="currentColor" opacity="0.8" />
          <path d="M96 74 Q114 58 126 68 Q110 82 96 74" fill="currentColor" opacity="0.8" />
          <path d="M48 92 Q62 108 78 104 Q64 88 48 92" fill="currentColor" opacity="0.8" />
          <path d="M80 84 Q95 102 110 96 Q96 80 80 84" fill="currentColor" opacity="0.8" />
        </svg>

        {/* Far-Right Botanical Branch (behind bedroom card) */}
        <svg
          viewBox="0 0 160 160"
          className="absolute top-[32%] sm:top-[34%] -right-5 sm:-right-6 w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 text-[#6E8F7F] opacity-75 pointer-events-none block z-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          style={{ transform: 'scaleX(-1)' }}
        >
          <path d="M140 20 Q95 60 65 130" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M125 35 Q115 18 100 24 Q110 40 125 35" fill="currentColor" opacity="0.85" />
          <path d="M110 52 Q95 38 82 46 Q95 60 110 52" fill="currentColor" opacity="0.85" />
          <path d="M98 72 Q82 60 70 68 Q82 82 98 72" fill="currentColor" opacity="0.85" />
          <path d="M84 94 Q70 82 58 92 Q72 104 84 94" fill="currentColor" opacity="0.85" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Split Hero Layout ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center pt-2 sm:pt-4 pb-2 sm:pb-4">
          {/* Left Column: Eyebrow, Main Heading, Supporting Text, and Buttons */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left py-1 sm:py-2">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 sm:gap-2.5 mb-2.5 sm:mb-4">
              <span className="text-[10.5px] sm:text-[12px] uppercase tracking-[0.22em] text-[#78716C] font-semibold">
                ZAIRA FURNISHING
              </span>
              <span className="h-[1.5px] w-8 sm:w-14 bg-[#C4B9A1] inline-block" />
            </div>

            {/* Main Heading in Refined Serif */}
            <h1 className="font-serif text-[32px] sm:text-[44px] lg:text-[50px] xl:text-[54px] text-[#1E3A2F] font-medium leading-[1.12] tracking-tight mb-3.5 sm:mb-5">
              Beautiful Furnishings
              <br />
              <span className="font-medium text-[#1E3A2F]">for Your Home</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-[14px] sm:text-[15.5px] text-[#57534E] font-normal leading-relaxed max-w-md mb-6 sm:mb-9">
              Curtains, blinds, wallpapers, rugs, flooring and more for your home.
            </p>

            {/* Buttons: Primary Shop Now + Secondary Book a Free Visit */}
            <div className="flex flex-row items-center gap-2.5 sm:gap-3.5 w-full sm:w-auto">
              <Link
                href="/products"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center px-5 sm:px-8 py-3.5 sm:py-4 text-[13px] font-medium text-white bg-[#1E3A2F] hover:bg-[#152B23] rounded-full transition-all duration-300 shadow-md hover:shadow-lg group text-center"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/services"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 sm:px-7 py-3.5 sm:py-4 text-[12.5px] sm:text-[13px] font-medium text-[#1E3A2F] bg-white hover:bg-[#FAF7F2] border border-[#C4B9A1] rounded-full transition-all duration-300 shadow-2xs hover:shadow-xs text-center whitespace-nowrap"
              >
                <Calendar className="w-3.5 h-3.5 text-[#9A7B56]" />
                <span>Book a Free Visit</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 3-Image Composition */}
          <div className="lg:col-span-7 relative mt-2 sm:mt-4 lg:mt-0">
            <div className="relative w-full max-w-lg sm:max-w-2xl mx-auto lg:max-w-none pt-2 pb-8 sm:pb-12 px-1 sm:px-4">
              {/* Main Living Room Image */}
              <div className="relative aspect-[16/11] sm:aspect-[16/10.5] w-full rounded-[24px] sm:rounded-[38px] lg:rounded-[48px] overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.12)] border border-white/80 bg-[#EDE5DB]">
                <Image
                  src="/images/hero/living_room.jpg"
                  alt="Beautiful Furnished Living Room with Pleated Curtains, Sofa, and Coffee Table"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover object-center"
                />
              </div>

              {/* Floating Image 1 (Left Lower: Curtains) */}
              <div className="group absolute -bottom-4 sm:-bottom-7 lg:-bottom-8 -left-1 sm:-left-3 lg:-left-4 w-[28%] sm:w-[27%] lg:w-[27%] aspect-[3/4] rounded-[16px] sm:rounded-[26px] lg:rounded-[30px] overflow-hidden border-[3px] sm:border-[5px] border-white shadow-[0_12px_30px_rgba(0,0,0,0.16)] z-20 bg-white transition-transform duration-300 hover:scale-[1.02]">
                <Image
                  src="/images/hero/curtains.jpg"
                  alt="Curtains and Window Treatment Detail with Sunlight and Chair"
                  fill
                  sizes="(max-width: 640px) 30vw, (max-width: 1024px) 22vw, 16vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Floating Image 2 (Right Lower: Bedroom) */}
              <div className="group absolute -bottom-4 sm:-bottom-7 lg:-bottom-8 -right-1 sm:-right-3 lg:-right-4 w-[27%] sm:w-[26%] lg:w-[26%] aspect-[3/4] rounded-[16px] sm:rounded-[26px] lg:rounded-[30px] overflow-hidden border-[3px] sm:border-[5px] border-white shadow-[0_12px_30px_rgba(0,0,0,0.16)] z-20 bg-white transition-transform duration-300 hover:scale-[1.02]">
                <Image
                  src="/images/hero/bedroom.jpg"
                  alt="Serene Luxury Bedroom with Upholstered Headboard and Ambient Lamps"
                  fill
                  sizes="(max-width: 640px) 30vw, (max-width: 1024px) 22vw, 16vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
