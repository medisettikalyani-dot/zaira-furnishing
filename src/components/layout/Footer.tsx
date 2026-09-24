import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '@/lib/data/categories';

export function Footer() {
  const topCategories = CATEGORIES.slice(0, 6);

  return (
    <footer className="bg-[#1C1917] text-[#FAF7F2] border-t border-[#2E2A27]">
      {/* Top Banner Highlight */}
      <div className="border-b border-[#2E2A27] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-[22px] md:text-[24px] text-white tracking-wide">
              Bespoke Interior & Furnishing Showroom
            </h3>
            <p className="text-[13px] text-[#A8A29E] mt-1">
              Curating exceptional textiles, custom drapery, and architectural finishes.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/services"
              className="px-5 py-2.5 text-[12px] uppercase tracking-widest font-medium bg-[#FAF7F2] text-[#1C1917] hover:bg-[#9A7B56] hover:text-white transition-colors"
            >
              Book Free Site Measurement
            </Link>
            <Link
              href="/products"
              className="px-5 py-2.5 text-[12px] uppercase tracking-widest font-medium border border-[#44403C] text-white hover:border-white transition-colors"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-[24px] tracking-[0.15em] font-medium text-white uppercase">
                Zaira Furnishing
              </span>
            </Link>
            <p className="text-[13px] text-[#A8A29E] leading-relaxed max-w-sm">
              A premier furnishing showroom dedicated to timeless aesthetics, master craftsmanship, and end-to-end bespoke solutions—from laser site measurement to precision installation.
            </p>
            <div className="pt-2">
              <div className="flex items-center gap-2 text-[12px] text-[#C4B9A1]">
                <ShieldCheck className="w-4 h-4 text-[#9A7B56]" />
                <span>Quality Assured Craftsmanship & Master Atelier Tailoring</span>
              </div>
            </div>
          </div>

          {/* Catalog Categories Col */}
          <div>
            <h4 className="text-[12px] uppercase tracking-[0.2em] font-semibold text-white mb-4">
              Catalog
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#A8A29E]">
              {topCategories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories?slug=${cat.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/categories"
                  className="text-[#C4B9A1] hover:text-white inline-flex items-center gap-1 mt-1 transition-colors"
                >
                  View All 14 Categories <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Col */}
          <div>
            <h4 className="text-[12px] uppercase tracking-[0.2em] font-semibold text-white mb-4">
              Bespoke Services
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#A8A29E]">
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  In-Home Measurement
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Doorstep Fabric Demo
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Custom Tailoring & Pleating
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Smart Home Motorization
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  NRI Remote Home Styling
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Warranty & After-Sales
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom & Contact Placeholders (Strictly marked placeholders) */}
          <div>
            <h4 className="text-[12px] uppercase tracking-[0.2em] font-semibold text-white mb-4">
              Showroom Visit
            </h4>
            <div className="space-y-3 text-[13px] text-[#A8A29E]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#9A7B56] shrink-0 mt-0.5" />
                <span className="text-[#C4B9A1]">[Showroom Address Placeholder]</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#9A7B56] shrink-0" />
                <span className="text-[#C4B9A1]">[Phone Number Placeholder]</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#9A7B56] shrink-0" />
                <span className="text-[#C4B9A1]">[Email Placeholder]</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#9A7B56] shrink-0 mt-0.5" />
                <span>[Showroom Hours Placeholder: Mon - Sat 10:30 AM - 8:30 PM]</span>
              </div>
            </div>

            {/* Social Media Placeholders */}
            <div className="mt-6 pt-4 border-t border-[#2E2A27]">
              <p className="text-[11px] uppercase tracking-widest text-[#78716C] mb-2">
                Follow Our Curations
              </p>
              <div className="flex gap-3 text-[12px] text-[#A8A29E]">
                <span className="hover:text-white cursor-pointer">[Instagram]</span>
                <span className="hover:text-white cursor-pointer">[Pinterest]</span>
                <span className="hover:text-white cursor-pointer">[YouTube]</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#2E2A27] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#78716C] gap-3">
          <p>© {new Date().getFullYear()} Zaira Furnishing. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-[#A8A29E] transition-colors">
              About Zaira
            </Link>
            <Link href="/services" className="hover:text-[#A8A29E] transition-colors">
              Services
            </Link>
            <Link href="/contact" className="hover:text-[#A8A29E] transition-colors">
              Contact & Inquiries
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
