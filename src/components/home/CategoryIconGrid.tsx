'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface TopCategory {
  id: string;
  name: string;
  href: string;
  image: string;
}

const TOP_CATEGORIES: TopCategory[] = [
  {
    id: 'bedsheet',
    name: 'Bedsheet',
    href: '/categories/bed-linen-bath',
    image: '/images/categories/bed-linen.jpg',
  },
  {
    id: 'curtain-fabric',
    name: 'Curtain Fabric',
    href: '/categories/curtains',
    image: '/images/hero/curtains.jpg',
  },
  {
    id: 'sofa-fabric',
    name: 'Sofa Fabric',
    href: '/categories/sofa-fabrics',
    image: '/images/hero/sofa_fabrics.jpg',
  },
  {
    id: 'pillows',
    name: 'Pillows',
    href: '/categories/cushions-pillows',
    image: '/images/categories/cushions.jpg',
  },
  {
    id: 'window-blinds',
    name: 'Window Blinds',
    href: '/categories/blinds',
    image: '/images/hero/blinds.jpg',
  },
  {
    id: 'wallpapers',
    name: 'Wallpapers',
    href: '/categories/wallpapers',
    image: '/images/hero/wallpapers.jpg',
  },
  {
    id: 'mattresses',
    name: 'Mattresses',
    href: '/categories/mattresses-sleep-systems',
    image: '/images/categories/mattress.jpg',
  },
  {
    id: 'carpets-rugs',
    name: 'Carpets & Rugs',
    href: '/categories/carpets',
    image: '/images/hero/rugs.jpg',
  },
];

export function CategoryIconGrid() {
  return (
    <section className="py-14 sm:py-18 lg:py-20 bg-white border-b border-[#EAE4D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── Clean Centered Title with Underline (Exactly as Reference) ─── */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="font-serif text-[30px] sm:text-[36px] lg:text-[42px] font-bold text-[#823423] tracking-tight">
            Top Categories Of This Month
          </h2>
          <div className="w-28 sm:w-40 h-0.5 bg-[#823423] mx-auto mt-2.5" />
        </div>

        {/* ─── 4-Column Split Cards Grid (Pure Category Title Left, Big Photo Right) ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {TOP_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:p-7 bg-white border border-[#E0D9D0] hover:border-[#823423] transition-all duration-300 shadow-2xs hover:shadow-md min-h-[120px] sm:min-h-[165px] rounded-xl sm:rounded-none gap-2 sm:gap-0"
            >
              {/* Left Side: Category Name Only (Bold Burgundy Serif) */}
              <div className="pr-1 sm:pr-4 flex-1 min-w-0">
                <h3 className="font-serif text-[16px] sm:text-[23px] lg:text-[25px] font-bold text-[#823423] group-hover:text-[#1C1714] transition-colors leading-tight">
                  {cat.name}
                </h3>
              </div>

              {/* Right Side: Big Clear Rectangular Product Image */}
              <div className="relative w-full sm:w-36 h-20 sm:h-28 overflow-hidden shrink-0 bg-[#F7F4EE] border border-[#EAE4D9]/60 rounded-lg sm:rounded-none">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 150px"
                  className="object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
                />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
