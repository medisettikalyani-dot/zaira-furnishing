'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Star, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface HomeStory {
  id: string;
  author: string;
  location: string;
  rating: number;
  content: string;
}

const STORIES: HomeStory[] = [
  {
    id: 'story-1',
    author: 'SUSANT KUMAR',
    location: 'Banjara Hills, Hyderabad',
    rating: 5,
    content:
      'Big range of Collections. Awesome variety for the selection. The staff seems to understand ur requirements quite fast and gives fair suggestions considering the budget and the style requirements.',
  },
  {
    id: 'story-2',
    author: 'VENKATA RAMANA & GEETHA',
    location: 'My Home Bhooja, Gachibowli',
    rating: 5,
    content:
      'We wanted floor-to-ceiling motorized ripple fold curtains for our 34th-floor penthouse. Zaira’s team did millimeter laser drop measurements and synced Somfy motors seamlessly with our smart home setup. Truly high-end atelier craftsmanship!',
  },
  {
    id: 'story-3',
    author: 'DR. SRINIVAS & ANANYA RAO',
    location: 'Jubilee Hills, Road No. 45',
    rating: 5,
    content:
      'The doorstep fabric demo was a game changer. Seeing the Nilaya wallpaper textures and European oak parquet samples in our ambient daylight made selecting effortless. Their dust-free installation left our home immaculate without a trace of drill dust.',
  },
  {
    id: 'story-4',
    author: 'PRADEEP & MEGHANA VARMA',
    location: 'Boulder Hills Golf Sanctuary',
    rating: 5,
    content:
      'Living in the US, we were anxious about furnishing our villa in Hyderabad. Zaira assigned us a dedicated concierge who conducted 4K video walkthroughs of fabric weaves. When we landed, every curtain was hung, steamed, and ready. 10/10 service!',
  },
  {
    id: 'story-5',
    author: 'SUNITA & VIKRAM REDDY',
    location: 'Jayabheri Silicon County, Hitec City',
    rating: 5,
    content:
      'Reupholstered our sectional sofa in Italian bouclé and got custom orthopedic pocket spring mattresses. The comfort and durability are unmatched. Their 5-year warranty gives genuine peace of mind.',
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? STORIES.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % STORIES.length);
  }, []);

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [handleNext]);

  const currentStory = STORIES[currentIndex];

  return (
    <section className="relative w-full overflow-hidden min-h-[440px] sm:min-h-[500px] flex items-center justify-center py-16 sm:py-20 border-y border-[#EAE4D9]">

      {/* ─── Full-Bleed Living Room Photographic Background ─── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/living_room.jpg"
          alt="Share your Stunning Home Stories with Zaira"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.70] contrast-[1.05]"
        />
        {/* Soft Ambient Vignette for Crisp Contrast */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── Header: Share your #StunningHomeStories with us ─── */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="font-serif text-[26px] sm:text-[34px] lg:text-[42px] text-white tracking-tight drop-shadow-md">
            Share your <span className="font-bold">#StunningHomeStories</span> with us
          </h2>
        </div>

        {/* ─── Floating Review Card with Carousel Controls ─── */}
        <div className="relative w-full max-w-3xl mx-auto">

          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous home story"
            className="absolute -left-3 sm:-left-6 lg:-left-8 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-[#1C1714] hover:text-[#823423] shadow-lg hover:shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Floating White Card */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl p-6 sm:p-8 sm:py-7 border border-white/80 transition-all duration-300">

            {/* Card Header: Avatar + Author & Rating + Green Verified Checkmark */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
              <div className="flex items-center gap-3.5">
                {/* User Avatar Circle */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#E5E0D8] text-[#7A7570] flex items-center justify-center font-bold text-sm shrink-0">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#9A948D]">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>

                <div>
                  <h3 className="font-serif text-[15px] sm:text-[17px] font-bold text-[#823423] tracking-wide uppercase leading-tight">
                    {currentStory.author}
                  </h3>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[...Array(currentStory.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Green Verified Review Checkmark */}
              <div
                className="flex items-center justify-center w-6 h-6 rounded-full bg-[#00C853] text-white shadow-xs shrink-0"
                title="Verified Customer Review"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>

            {/* Review Content */}
            <p className="pt-4 text-[13.5px] sm:text-[15px] text-[#4A423B] leading-relaxed font-sans">
              {currentStory.content}
            </p>
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next home story"
            className="absolute -right-3 sm:-right-6 lg:-right-8 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-[#1C1714] hover:text-[#823423] shadow-lg hover:shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

        </div>

        {/* ─── Dot Indicators ─── */}
        <div className="flex items-center justify-center gap-2 mt-5 sm:mt-6">
          {STORIES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to story ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-7 bg-white shadow-sm'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
