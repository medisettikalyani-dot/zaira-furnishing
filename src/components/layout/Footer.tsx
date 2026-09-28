import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { DbCmsContent } from '@/lib/db/types';

interface FooterProps {
  cmsContent?: DbCmsContent | null;
}

export function Footer({ cmsContent }: FooterProps) {
  let contentParsed: any = {};
  if (cmsContent?.content) {
    try {
      contentParsed = JSON.parse(cmsContent.content);
    } catch {
      contentParsed = {};
    }
  }

  const tagline =
    cmsContent?.subtitle ||
    'Curtains, blinds, fabrics and furnishings for thoughtfully designed spaces.';
  const address =
    contentParsed.address ||
    'Rd Number 5, Kyetian Goud Nilayam, Alkapur Twp, Puppalguda, Hyderabad, Telangana 500089';
  const phone = contentParsed.phone || '+91 63001 45763';
  const email = contentParsed.email || 'concierge@zairafurnishing.com';
  const hours = contentParsed.hours || 'Mon–Sat 10:30 AM–8:30 PM · Sunday by appointment';
  const copyright = contentParsed.copyright || '© 2026 Zaira Furnishing. All rights reserved.';

  const shopLinks = [
    { name: 'All Products', href: '/products' },
    { name: 'Curtains & Drapes', href: '/categories/curtains' },
    { name: 'Window Blinds & Shades', href: '/categories/blinds' },
    { name: 'Sofa Fabrics & Upholstery', href: '/categories/sofa-fabrics' },
    { name: 'Wallpapers & Wall Coverings', href: '/categories/wallpapers' },
    { name: 'Carpets & Rugs', href: '/categories/carpets' },
    { name: 'Mattresses & Sleep Systems', href: '/categories/mattresses-sleep-systems' },
    { name: 'View All Categories', href: '/categories' },
  ];

  const exploreLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
    { name: 'My Orders', href: '/account/orders' },
  ];

  return (
    <footer className="bg-[#152B23] text-[#FAF7F2] border-t border-[#234237]">
      {/* ─── Main Footer Columns ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-9 lg:gap-12">
          
          {/* COLUMN 1 — BRAND (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 36 36" className="w-7 h-7 fill-none" aria-hidden="true">
                  <path d="M18 3 L31 14 L18 22 L5 14 Z" fill="#9CA488" />
                  <path d="M5 14 L18 22 L18 33 L5 25 Z" fill="#3D6352" />
                  <path d="M31 14 L18 22 L18 33 L31 25 Z" fill="#6E8F7F" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-[20px] tracking-[0.16em] font-semibold text-white uppercase leading-none">
                  ZAIRA
                </span>
                <span className="text-[7.5px] uppercase tracking-[0.32em] text-[#C4B9A1] font-medium mt-1 leading-none">
                  FURNISHING
                </span>
              </div>
            </Link>

            <p className="text-[13.5px] text-[#A8A29E] leading-relaxed max-w-sm font-light">
              {tagline}
            </p>
          </div>

          {/* COLUMN 2 — SHOP (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] sm:text-[11.5px] uppercase tracking-[0.2em] font-semibold text-[#EAE4D8] mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#A8A29E]">
              {shopLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-white transition-colors block py-0.5"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3 — EXPLORE (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] sm:text-[11.5px] uppercase tracking-[0.2em] font-semibold text-[#EAE4D8] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#A8A29E]">
              {exploreLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-white transition-colors block py-0.5"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4 — CONTACT (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] sm:text-[11.5px] uppercase tracking-[0.2em] font-semibold text-[#EAE4D8] mb-4">
              Contact
            </h4>
            <div className="space-y-3.5 text-[13px] text-[#A8A29E]">
              {/* Address */}
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#9A7B56] shrink-0 mt-0.5" />
                <address className="not-italic text-[#E5E0D8] leading-relaxed whitespace-pre-line">
                  {address}
                </address>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#9A7B56] shrink-0" />
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="text-white hover:text-[#9A7B56] transition-colors font-medium"
                >
                  {phone}
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#9A7B56] shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-white transition-colors break-all"
                >
                  {email}
                </a>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-2.5 text-[12.5px] pt-0.5">
                <Clock className="w-4 h-4 text-[#9A7B56] shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <p className="text-white whitespace-pre-line">{hours}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ─── Bottom Bar ─── */}
        <div className="mt-12 pt-6 border-t border-[#234237] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#8C827A]">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
