import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, ShieldCheck } from 'lucide-react';
import { CURTAIN_TYPES } from '@/lib/data/curtains';

export function CurtainsSpotlight() {
  const topCurtainTypes = CURTAIN_TYPES.slice(0, 4);

  return (
    <section className="py-20 sm:py-24 bg-[#F7F4EE] border-t border-[#EAE4D8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Header: Brand Spotlight ─── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-2.5">
              <span className="w-5 h-[1.5px] bg-[#1E3A2F]" />
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#1E3A2F] font-bold">
                Flagship Category
              </span>
            </div>
            <h2 className="font-serif text-[32px] sm:text-[40px] lg:text-[46px] text-[#1E3A2F] font-medium tracking-tight mb-3 leading-tight">
              Bespoke Curtains & Drapery
            </h2>
            <p className="text-[14px] sm:text-[15.5px] text-[#57534E] leading-relaxed font-light">
              Crafted in our master atelier with corner-weighted hems, acoustic linings, and millimeter laser sizing. Explore made-to-measure drapes tailored to your exact window drop and architecture.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/categories/curtains"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[12px] uppercase tracking-wider font-semibold bg-[#1E3A2F] text-white hover:bg-[#152B23] transition-all shadow-sm group"
            >
              <span>Explore All 10 Curtain Styles</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* ─── 4 Featured Curtain Types Visual Grid ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-12">
          {topCurtainTypes.map((type) => (
            <Link
              key={type.id}
              href={`/categories/curtains/${type.slug}`}
              className="group flex flex-col bg-white rounded-2xl border border-[#EAE4D8] hover:border-[#1E3A2F] transition-all duration-300 overflow-hidden shadow-2xs hover:shadow-lg hover:-translate-y-1 block"
            >
              {/* Product Photograph */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#FAF7F2]">
                <Image
                  src={type.image}
                  alt={type.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                />
                {type.badge && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider bg-white/95 text-[#1E3A2F] rounded-full shadow-2xs backdrop-blur-xs">
                      {type.badge}
                    </span>
                  </div>
                )}
              </div>

              {/* Text Meta */}
              <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-serif text-[17px] font-medium text-[#1C1917] group-hover:text-[#1E3A2F] transition-colors mb-1">
                    {type.name}
                  </h3>
                  <p className="text-[12px] text-[#78716C] line-clamp-2 leading-relaxed mb-3 font-light">
                    {type.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#9A7B56]">
                    Made-to-Measure
                  </span>
                  <span className="text-[11px] font-semibold text-[#1C1917] group-hover:text-[#1E3A2F] inline-flex items-center gap-1">
                    <span>View Styles</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ─── Atelier Service Guarantee Strip ─── */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#EAE4D8] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1E3A2F]/10 text-[#1E3A2F] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="font-serif text-[18px] text-[#1C1917] font-medium mb-1">
                Complimentary In-Home Laser Measurement & Doorstep Swatches
              </h4>
              <p className="text-[13px] text-[#78716C] max-w-xl leading-relaxed font-light">
                Our specialists bring full fabric catalogues directly to your Hyderabad home, take exact window dimensions, and provide tailored heading advice before tailoring.
              </p>
            </div>
          </div>

          <Link
            href="/services#free-in-home-measurement"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[12px] uppercase tracking-wider font-semibold bg-[#1E3A2F] text-white hover:bg-[#152B23] transition-all shrink-0 shadow-2xs"
          >
            <Calendar className="w-4 h-4 text-[#C4B9A1]" />
            <span>Book Free Site Visit</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
