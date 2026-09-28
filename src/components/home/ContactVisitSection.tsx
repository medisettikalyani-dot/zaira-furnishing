import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, Navigation, ArrowRight } from 'lucide-react';
import { DbCmsContent } from '@/lib/db/types';

interface ContactVisitSectionProps {
  cmsContent?: DbCmsContent | null;
}

export function ContactVisitSection({ cmsContent }: ContactVisitSectionProps) {
  let contentParsed: any = {};
  if (cmsContent?.content) {
    try {
      contentParsed = JSON.parse(cmsContent.content);
    } catch {
      contentParsed = {};
    }
  }

  const eyebrow = contentParsed.eyebrow || 'VISIT THE SHOWROOM';
  const title = cmsContent?.title || 'Visit the Zaira Showroom';
  const subtitle =
    cmsContent?.subtitle ||
    'See fabrics, furnishings and finishes in person, and discuss your requirements with our team.';
  const address =
    contentParsed.address ||
    'Rd Number 5, Kyetian Goud Nilayam, Alkapur Twp, Puppalguda, Hyderabad, Telangana 500089';
  const phone = contentParsed.phone || '+91 63001 45763';
  const email = contentParsed.email || 'concierge@zairafurnishing.com';
  const hours = contentParsed.hours || 'Mon–Sat 10:30 AM–8:30 PM · Sunday by appointment';
  const showroomImage = cmsContent?.image_url || '/images/hero/living_room.jpg';
  const mapsUrl =
    contentParsed.maps_query ||
    'https://www.google.com/maps/search/?api=1&query=Zaira+Furnishing,+Rd+Number+5,+Kyetian+Goud+Nilayam,+Alkapur+Twp,+Puppalguda,+Hyderabad,+Telangana+500089';

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-[#FAF7F2] border-t border-[#EAE4D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-center">
          
          {/* ─── LEFT: Single Relevant Interior / Showroom Image ─── */}
          <div className="lg:col-span-6 w-full">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-[#F4EFE6] border border-[#EDE8DE] shadow-[0_8px_30px_rgba(28,25,23,0.04)]">
              <Image
                src={showroomImage}
                alt="Zaira Furnishing interior showroom space"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* ─── RIGHT: Showroom Invitation & Compact Details ─── */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left">
            {/* Small Eyebrow */}
            <span className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.22em] text-[#9A7B56] font-semibold block mb-2 sm:mb-2.5">
              {eyebrow}
            </span>

            {/* Main Heading */}
            <h2 className="font-serif text-[28px] sm:text-[34px] lg:text-[40px] text-[#1C1917] font-medium tracking-tight mb-2.5 sm:mb-3 leading-[1.2]">
              {title}
            </h2>

            {/* Short Supporting Text */}
            <p className="text-[14px] sm:text-[15px] text-[#78716C] leading-relaxed mb-6 sm:mb-7 max-w-lg">
              {subtitle}
            </p>

            {/* Compact Contact Information */}
            <div className="space-y-4 mb-7 sm:mb-8 border-y border-[#EDE8DE] py-5 sm:py-6">
              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#9A7B56] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.16em] text-[#8C827A] font-semibold mb-0.5">
                    Location
                  </span>
                  <address className="not-italic text-[13px] sm:text-[13.5px] text-[#1C1917] leading-relaxed">
                    {address}
                  </address>
                </div>
              </div>

              {/* Contact Grid: Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#9A7B56] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.16em] text-[#8C827A] font-semibold mb-0.5">
                      Phone
                    </span>
                    <a
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      className="text-[13px] sm:text-[13.5px] font-medium text-[#1C1917] hover:text-[#9A7B56] transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#9A7B56] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.16em] text-[#8C827A] font-semibold mb-0.5">
                      Email
                    </span>
                    <a
                      href={`mailto:${email}`}
                      className="text-[13px] sm:text-[13.5px] text-[#1C1917] hover:text-[#9A7B56] transition-colors break-all"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3 pt-1">
                <Clock className="w-4 h-4 text-[#9A7B56] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.16em] text-[#8C827A] font-semibold mb-0.5">
                    Hours
                  </span>
                  <p className="text-[13px] sm:text-[13.5px] text-[#1C1917] leading-relaxed">
                    {hours}
                  </p>
                </div>
              </div>
            </div>

            {/* Simple Actions: Get Directions & Contact Us */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#9A7B56] text-white text-[12.5px] sm:text-[13px] font-medium transition-colors shadow-2xs group"
              >
                <Navigation className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Get Directions</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#D5CDBF] hover:border-[#1C1917] text-[#1C1917] text-[12.5px] sm:text-[13px] font-medium transition-colors group"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#9A7B56] transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
