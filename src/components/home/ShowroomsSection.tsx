'use client';

import React from 'react';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  Sparkles,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '@/lib/context/StoreContext';
import { ZAIRA_WHATSAPP_DISPLAY } from '@/lib/whatsapp';

const SHOWROOMS = [
  {
    id: 'banjara-hills',
    name: 'Banjara Hills Flagship',
    locality: 'Road No. 12, Banjara Hills',
    description: 'Our 8,000 sq.ft flagship experience center featuring live motorized drapery tracks, 2,000+ luxury fabric library, and curated living room vignettes.',
    image: '/images/hero/living_room.jpg',
    features: ['Curtain & Drapery Atelier', 'Motorization Testing Lounge', 'Full Fabric Library'],
    hours: 'Mon–Sat: 10:30 AM – 8:30 PM · Sunday by Appointment',
    mapsUrl: 'https://maps.google.com/?q=Banjara+Hills+Road+No+12+Hyderabad',
  },
  {
    id: 'jubilee-hills',
    name: 'Jubilee Hills Atelier',
    locality: 'Road No. 36, Jubilee Hills',
    description: 'An exclusive boutique studio dedicated to designer wallpapers, European engineered hardwood parquet, hand-knotted silk rugs, and bridal bed linen.',
    image: '/images/hero/curtains.jpg',
    features: ['Sabyasachi & Nilaya Wallpapers', 'Hardwood Parquet Studio', 'Hand-Knotted Silk Rugs'],
    hours: 'Mon–Sat: 10:30 AM – 8:30 PM · Sunday by Appointment',
    mapsUrl: 'https://maps.google.com/?q=Jubilee+Hills+Road+No+36+Hyderabad',
  },
  {
    id: 'gachibowli',
    name: 'Gachibowli Experience Center',
    locality: 'Financial District & Puppalguda',
    description: 'Tailored for contemporary high-rise apartments, villas, and penthouses. Showcasing acoustic blinds, outdoor balcony decking, and spine-care mattresses.',
    image: '/images/hero/bedroom.jpg',
    features: ['High-Rise Window Solutions', 'Acoustic Blinds & Shades', 'Outdoor Balcony WPC Decking'],
    hours: 'Mon–Sat: 10:30 AM – 8:30 PM · Sunday by Appointment',
    mapsUrl: 'https://maps.google.com/?q=Gachibowli+Puppalguda+Hyderabad',
  },
];

export function ShowroomsSection() {
  const { openBookingModal } = useStore();

  return (
    <section id="showrooms" className="py-14 sm:py-20 bg-[#FDFBF7] border-t border-[#EAE4D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 sm:pb-12 border-b border-[#EAE4D9] gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#C5A059] text-[11px] uppercase tracking-widest font-semibold mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>Hyderabad Flagship Locations</span>
            </div>
            <h2 className="font-serif text-[28px] sm:text-[36px] lg:text-[42px] font-normal text-[#1C1714] tracking-tight">
              Visit Our Flagship Experience Centers
            </h2>
            <p className="mt-2 text-[14px] sm:text-[15.5px] text-[#78716C] leading-relaxed max-w-xl">
              Experience the tactile drape of luxury fabrics, test motorized Somfy tracks in action, and consult with our master interior stylists in person.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openBookingModal('Showroom VIP Consultation')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#1C1714] text-white hover:bg-[#C5A059] hover:text-[#1C1714] text-[13px] font-medium shadow-md transition-all self-start md:self-end cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#C5A059]" />
            <span>Book Private Walkthrough</span>
          </button>
        </div>

        {/* Showrooms Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 pt-10">
          {SHOWROOMS.map((showroom) => (
            <div
              key={showroom.id}
              className="group rounded-3xl bg-white border border-[#EAE4D9] overflow-hidden hover:shadow-atelier-hover hover:border-[#C5A059] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Photo Preview */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F4EFE6]">
                  <Image
                    src={showroom.image}
                    alt={showroom.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#1C1714]/90 backdrop-blur-xs text-[#FDFBF7] text-[10.5px] uppercase font-bold tracking-wider border border-[#C5A059]/40">
                    {showroom.name}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#C5A059] mb-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{showroom.locality}</span>
                  </div>

                  <p className="text-[12.5px] text-[#57534E] leading-relaxed mt-2.5 mb-4">
                    {showroom.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-3 border-t border-[#EAE4D9] mb-4">
                    {showroom.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11.5px] text-[#1C1714]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-2 text-[11px] text-[#78716C] pt-2 border-t border-[#EAE4D9]">
                    <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#C5A059]" />
                    <span>{showroom.hours}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-[#FDFBF7] border-t border-[#EAE4D9] flex items-center justify-between gap-2">
                <a
                  href={showroom.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#EAE4D9] text-[#1C1714] hover:bg-white text-[11.5px] font-medium transition-colors"
                >
                  <Navigation className="w-3 h-3 text-[#C5A059]" />
                  <span>Directions</span>
                </a>

                <a
                  href={`tel:${ZAIRA_WHATSAPP_DISPLAY}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#1C1714] text-[#FDFBF7] hover:bg-[#C5A059] hover:text-[#1C1714] text-[11.5px] font-medium transition-colors"
                >
                  <Phone className="w-3 h-3 text-[#C5A059]" />
                  <span>Call Atelier</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
