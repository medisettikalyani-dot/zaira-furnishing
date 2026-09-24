'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CloudflareImage } from '@/components/ui/CloudflareImage';

export function BrandStorySection() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-32 bg-[#FBF9F5] border-t border-[#EBE5DA] overflow-hidden">
      {/* Background Subtle Marbled/Organic Accents */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#E8DEC8_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* ─── Visual Showcase: 3 Overlapping Frames ─── */}
          <div className="lg:col-span-6 relative pb-8 sm:pb-12 lg:pb-0">
            {/* Top Right Mini Badge */}
            <div className="absolute -top-6 right-0 sm:right-4 z-20 hidden sm:flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-[#E8DEC8] shadow-sm">
              <Sparkles className="w-4 h-4 text-[#7D5E38]" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#4A3520]">
                Zaira Furnishing
              </span>
            </div>

            {/* Frame Collage Container */}
            <div className="relative mx-auto max-w-[480px] lg:max-w-none">
              {/* Frame 1: Grand Living & Dining Main Curved Arch */}
              <div className="relative w-full h-[420px] sm:h-[480px] lg:h-[530px] rounded-t-[90px] sm:rounded-t-[140px] rounded-b-[36px] sm:rounded-b-[48px] overflow-hidden shadow-[0_16px_40px_rgba(40,30,20,0.08)] border-4 border-white bg-[#FAF7F2]">
                <CloudflareImage
                  src="/images/about/about-main-living.jpg"
                  alt="Zaira Furnishing living and dining space"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Frame 2: Living Room Feature Wall */}
              <div className="absolute -right-3 sm:-right-6 lg:-right-8 top-[32%] sm:top-[34%] w-[44%] sm:w-[42%] lg:w-[40%] aspect-[4/3] rounded-[24px] sm:rounded-[30px] overflow-hidden border-4 sm:border-[5px] border-white shadow-[0_20px_45px_rgba(30,20,10,0.18)] z-10 bg-[#FAF7F2]">
                <CloudflareImage
                  src="/images/about/about-tv-unit.jpg"
                  alt="Zaira Furnishing wallpapers and wall decor"
                  fill
                  sizes="(max-width: 1024px) 40vw, 20vw"
                  className="object-cover object-center"
                />
              </div>

              {/* Frame 3: Lounge Sofa Corner */}
              <div className="absolute -left-3 sm:-left-5 lg:-left-6 bottom-[-10px] sm:bottom-[-14px] w-[38%] sm:w-[36%] lg:w-[34%] aspect-[4/3] rounded-[22px] sm:rounded-[26px] overflow-hidden border-4 sm:border-[5px] border-white shadow-[0_18px_40px_rgba(30,20,10,0.16)] z-20 bg-[#FAF7F2]">
                <CloudflareImage
                  src="/images/about/about-sofa-lounge.jpg"
                  alt="Zaira Furnishing sofa fabrics and cushions"
                  fill
                  sizes="(max-width: 1024px) 35vw, 18vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>

          {/* ─── Editorial Content ─── */}
          <div className="lg:col-span-6 lg:pl-4">
            {/* Small Overline Label */}
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-[1.5px] bg-[#7D5E38]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#7D5E38] font-bold">
                Furnishings & Services
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-serif text-[32px] sm:text-[42px] lg:text-[48px] text-[#1C1917] font-medium leading-[1.15] tracking-tight">
              About Zaira Furnishing
            </h2>

            {/* Horizontal Underline Accent Bar */}
            <div className="w-20 sm:w-24 h-[3.5px] bg-[#7D5E38] mt-3.5 mb-6 rounded-full" />

            {/* Main text */}
            <p className="text-[16px] sm:text-[17px] text-[#1C1917] font-medium leading-relaxed mb-4">
              Zaira Furnishing offers a wide range of furnishings and home decor for different spaces in your home.
            </p>

            {/* Supporting text */}
            <p className="text-[14px] sm:text-[15px] text-[#635B52] leading-relaxed mb-4">
              From curtains, blinds and sofa fabrics to wallpapers, rugs, flooring, mattresses, bed linen, cushions, dining products and home decor, we help you find furnishings that suit your space.
            </p>

            {/* Second supporting paragraph */}
            <p className="text-[14px] sm:text-[15px] text-[#635B52] leading-relaxed mb-8">
              Our services include home measurement, fabric and sample visits, custom stitching, professional installation, smart-home setup, remote home styling, commercial furnishing and after-sales support.
            </p>

            {/* Call to Action: Learn More → */}
            <div className="pt-1">
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 bg-[#4A3520] hover:bg-[#342414] text-[#FAF7F2] text-[13px] font-semibold tracking-wide px-7 py-3.5 rounded-full transition-all duration-300 shadow-md group/btn"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
