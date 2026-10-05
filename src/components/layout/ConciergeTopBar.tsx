'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Sparkles,
  Phone,
  MessageSquare,
  Globe,
  Clock,
  Ruler,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '@/lib/context/StoreContext';
import { ZAIRA_WHATSAPP_DISPLAY, ZAIRA_WHATSAPP_URL } from '@/lib/whatsapp';

export function ConciergeTopBar() {
  const { openBookingModal } = useStore();

  return (
    <div className="bg-[#1E1714] text-white border-b border-[#3D302A] text-[11px] sm:text-[11.5px] py-1.5 px-3 sm:px-6 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Hyderabad In-Home Measurement */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[#E2D9CF] min-w-0">
          <MapPin className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
          <span className="font-semibold text-white tracking-wide shrink-0">
            Hyderabad:
          </span>
          <span className="text-[#E8E3D8] truncate text-[10.5px] sm:text-[11.5px]">
            Free In-Home Measurement
          </span>
        </div>

        {/* Center: Value Highlight */}
        <div className="hidden lg:flex items-center gap-2 text-[#D4AF37]">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          <span className="text-[#FAF7F2] font-medium tracking-wide">
            500+ Fabric Sample Books Brought Directly To Your Home
          </span>
        </div>

        {/* Right: Quick Action Concierge Links */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Book Measurement Quick Trigger */}
          <button
            type="button"
            onClick={() => openBookingModal('Free In-Home Measurement')}
            className="inline-flex items-center gap-1.5 text-[#D4AF37] hover:text-white transition-colors font-bold tracking-wide cursor-pointer"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span className="underline underline-offset-2 decoration-[#D4AF37]/60">
              Book Free Visit
            </span>
          </button>

          {/* WhatsApp Direct */}
          <a
            href={ZAIRA_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xs:inline-flex items-center gap-1 text-[#25D366] hover:text-white transition-colors font-medium"
            title="Chat with Zaira Stylist"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline text-white font-semibold">
              WhatsApp Us
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
