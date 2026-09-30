'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Service } from '@/lib/data/types';

interface ProcessStep {
  id: string;
  number: string;
  phase: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

const PHASE_MAP: Record<string, string> = {
  'doorstep-fabric-demo': 'DISCOVER',
  'fabric-samples-at-home': 'DISCOVER',
  'free-in-home-measurement': 'MEASURE',
  'custom-tailoring-and-stitching': 'CREATE',
  'professional-installation': 'INSTALL',
  'motorization-smart-home': 'AUTOMATE',
  'nri-remote-home-styling': 'STYLE',
  'corporate-institutional-furnishings': 'CONTRACT',
  'warranty-after-sales': 'CARE',
};

interface ServicesSectionProps {
  services?: Service[];
}

export function ServicesSection({ services = [] }: ServicesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Map D1 services into the 4 presentation steps
  const processSteps: ProcessStep[] = services.slice(0, 4).map((s, idx) => ({
    id: s.id,
    number: String(idx + 1).padStart(2, '0'),
    phase: PHASE_MAP[s.slug] || `STEP 0${idx + 1}`,
    title: s.title,
    description: s.shortDesc,
    image: s.image || '/images/hero/curtains.jpg',
    href: `/services#${s.slug}`,
  }));

  if (processSteps.length === 0) {
    return null;
  }

  // Helper to render an interactive photo card
  const renderPhotoCard = (stepIndex: number, heightClass: string) => {
    const step = processSteps[stepIndex];
    if (!step) return null;
    const isActive = stepIndex === activeIndex;

    return (
      <button
        key={step.id}
        type="button"
        onClick={() => setActiveIndex(stepIndex)}
        aria-label={`Select ${step.title}`}
        className={`relative w-full ${heightClass} rounded-xl overflow-hidden bg-[#F4EFE6] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A2F] motion-reduce:transition-none text-left cursor-pointer ${
          isActive
            ? 'ring-2 ring-[#9A7B56] shadow-[0_8px_24px_rgba(30,58,47,0.16)] scale-[1.02] opacity-100 z-10'
            : 'border border-[#EAE4D8]/90 shadow-[0_3px_12px_rgba(30,58,47,0.05)] opacity-80 hover:opacity-100 hover:scale-[1.01]'
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={step.image}
          alt={step.title}
          className="w-full h-full object-cover object-center block"
          loading="eager"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/images/hero/curtains.jpg';
          }}
        />
      </button>
    );
  };

  return (
    <section
      className="py-10 sm:py-12 lg:py-14 bg-[#FDFBF7] border-t border-[#EAE4D8] overflow-hidden"
      aria-label="How We Create Your Space"
    >
      {/* ─── Embedded Scoped Responsive CSS (Guarantees Visibility Across Viewports) ─── */}
      <style>{`
        .zaira-collage-desktop {
          display: block;
          width: 100%;
        }
        .zaira-collage-mobile {
          display: none;
        }
        @media (max-width: 1023px) {
          .zaira-collage-desktop {
            display: none !important;
          }
          .zaira-collage-mobile {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
            width: 100%;
            margin-bottom: 22px;
          }
        }
      `}</style>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── Section Header ─── */}
        <div className="max-w-xl mx-auto text-center mb-8 sm:mb-9 lg:mb-10">
          <span className="text-[11px] sm:text-[12px] uppercase tracking-[0.24em] font-semibold text-[#9A7B56] block mb-2">
            THE ZAIRA PROCESS
          </span>
          <h2 className="font-serif text-[26px] sm:text-[32px] lg:text-[36px] text-[#1E3A2F] font-normal tracking-tight leading-[1.2] mb-2">
            HOW WE CREATE YOUR SPACE
          </h2>
          <p className="text-[13.5px] sm:text-[15px] text-[#6B655C] leading-relaxed font-normal">
            From choosing your style to the final detail.
          </p>
        </div>

        {/* ─── Split Layout: Balanced Photo Mosaic (Left 50%) + Interactive Service List (Right 50%) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-start">

          {/* LEFT: Compact Editorial Photo Mosaic (lg:col-span-6) */}
          <div className="w-full lg:col-span-6 flex justify-center lg:justify-start">
            <div className="w-full max-w-[480px]">
              {/* Desktop Staggered Editorial Mosaic */}
              <div className="zaira-collage-desktop">
                <div className="grid grid-cols-2 gap-3 sm:gap-3.5 w-full items-start">
                  {/* Column 1 (Left): 01 DISCOVER (Top, 180px) + 03 CREATE (Bottom, 160px) */}
                  <div className="flex flex-col gap-3 sm:gap-3.5">
                    {renderPhotoCard(0, 'h-[180px]')}
                    {renderPhotoCard(2, 'h-[160px]')}
                  </div>

                  {/* Column 2 (Right): 02 MEASURE (Top, 160px) + 04 INSTALL (Bottom, 180px) — Gently Staggered */}
                  <div className="flex flex-col gap-3 sm:gap-3.5 pt-4">
                    {renderPhotoCard(1, 'h-[160px]')}
                    {renderPhotoCard(3, 'h-[180px]')}
                  </div>
                </div>
              </div>

              {/* Mobile 2x2 Grid (Compact) */}
              <div className="zaira-collage-mobile max-w-sm mx-auto">
                {processSteps.map((step, idx) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Select ${step.title}`}
                    className={`relative aspect-[16/11] rounded-lg overflow-hidden bg-[#F4EFE6] border transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1E3A2F] motion-reduce:transition-none text-left cursor-pointer ${
                      idx === activeIndex
                        ? 'ring-2 ring-[#9A7B56] border-transparent scale-[1.02] opacity-100 shadow-md z-10'
                        : 'border-[#EAE4D8] opacity-80 hover:opacity-95'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover object-center block"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/hero/curtains.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Interactive Service List (lg:col-span-6) */}
          <div className="w-full lg:col-span-6">
            <div
              role="tablist"
              aria-label="Furnishing Process Steps"
              className="flex flex-col"
            >
              {processSteps.map((step, idx) => {
                const isActive = idx === activeIndex;
                const isLast = idx === processSteps.length - 1;

                return (
                  <div
                    key={step.id}
                    className={`py-3.5 sm:py-4 ${
                      !isLast ? 'border-b border-[#EAE4D8]' : ''
                    }`}
                  >
                    <button
                      type="button"
                      role="tab"
                      id={`service-tab-${step.id}`}
                      aria-selected={isActive}
                      aria-controls={`service-panel-${step.id}`}
                      onClick={() => setActiveIndex(idx)}
                      className="w-full text-left group/btn focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1E3A2F] rounded p-0.5 cursor-pointer"
                    >
                      {/* Top Header Line: [● / ○] [Number] [Phase] ... [− / +] */}
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2.5">
                          {/* Subtle Progress Indicator Dot */}
                          <span
                            aria-hidden="true"
                            className={`inline-block w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                              isActive
                                ? 'bg-[#1E3A2F] ring-2 ring-[#9A7B56]/40 scale-110'
                                : 'border border-[#C4B9A1] bg-[#FDFBF7] group-hover/btn:border-[#9A7B56]'
                            }`}
                          />
                          {/* Number */}
                          <span className="font-mono text-[11.5px] sm:text-[12px] font-semibold text-[#1E3A2F]/70 tracking-widest">
                            {step.number}
                          </span>
                          {/* Phase Label */}
                          <span
                            className={`text-[10.5px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors duration-200 ${
                              isActive
                                ? 'text-[#9A7B56]'
                                : 'text-[#8C8275] group-hover/btn:text-[#1E3A2F]'
                            }`}
                          >
                            {step.phase}
                          </span>
                        </div>

                        {/* Accordion State Indicator: − for active, + for inactive */}
                        <span
                          aria-hidden="true"
                          className={`font-mono text-[15px] sm:text-[16px] leading-none transition-colors duration-200 ${
                            isActive
                              ? 'text-[#1E3A2F] font-medium'
                              : 'text-[#8C8275] group-hover/btn:text-[#1E3A2F]'
                          }`}
                        >
                          {isActive ? '−' : '+'}
                        </span>
                      </div>

                      {/* Service Title */}
                      <div className="pl-5 sm:pl-5.5">
                        <h3
                          className={`text-[15.5px] sm:text-[17px] tracking-tight transition-colors duration-200 ${
                            isActive
                              ? 'font-serif text-[#1E3A2F] font-normal leading-snug'
                              : 'text-[#57534E] font-normal group-hover/btn:text-[#1E3A2F] leading-snug'
                          }`}
                        >
                          {step.title}
                        </h3>
                      </div>
                    </button>

                    {/* Active Details: Short Description & Subtle Link */}
                    <div
                      id={`service-panel-${step.id}`}
                      role="tabpanel"
                      aria-labelledby={`service-tab-${step.id}`}
                      className={`grid transition-all duration-300 ease-in-out ${
                        isActive
                          ? 'grid-rows-[1fr] opacity-100 mt-2.5 pl-5 sm:pl-5.5'
                          : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-[13px] sm:text-[13.5px] text-[#6B655C] leading-relaxed mb-3 font-normal max-w-md">
                          {step.description}
                        </p>

                        <Link
                          href={step.href}
                          className="inline-flex items-center gap-1.5 text-[11px] sm:text-[11.5px] uppercase tracking-[0.16em] font-semibold text-[#1E3A2F] hover:text-[#9A7B56] transition-colors group/link"
                          aria-label={`Explore ${step.title}`}
                        >
                          <span>EXPLORE SERVICE</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#9A7B56] transition-transform duration-200 group-hover/link:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ─── Integrated Bottom Link to /services ─── */}
        <div className="mt-8 sm:mt-9 text-center pt-5 border-t border-[#EAE4D8]/80">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-[11px] sm:text-[11.5px] uppercase tracking-[0.18em] font-semibold text-[#1E3A2F] hover:text-[#9A7B56] transition-colors group"
          >
            <span>EXPLORE ALL SERVICES</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#9A7B56] transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}
