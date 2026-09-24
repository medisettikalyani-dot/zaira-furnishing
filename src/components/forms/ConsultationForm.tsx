'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

export function ConsultationForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white border border-[#9A7B56] text-center shadow-xs">
        <div className="w-10 h-10 mx-auto bg-[#FAF7F2] flex items-center justify-center text-[#9A7B56] mb-3">
          <Sparkles className="w-5 h-5" />
        </div>
        <h4 className="font-serif text-[22px] text-[#1C1917] mb-2">
          Consultation Request Confirmed
        </h4>
        <p className="text-[13px] text-[#57534E] leading-relaxed max-w-md mx-auto mb-6">
          Thank you. Our showroom coordinator has received your request and will contact you via phone/WhatsApp to confirm your laser measurement schedule.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="px-6 py-2.5 text-[11px] uppercase tracking-wider font-medium bg-[#1C1917] text-white"
        >
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] uppercase tracking-wider text-[#1C1917] font-medium mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            required
            placeholder="Your full name"
            className="w-full px-4 py-3 bg-white border border-[#E7E2D8] text-[13px] text-[#1C1917] focus:outline-hidden focus:border-[#1C1917]"
          />
        </div>
        <div>
          <label className="block text-[12px] uppercase tracking-wider text-[#1C1917] font-medium mb-1.5">
            Phone Number
          </label>
          <input
            type="tel"
            required
            placeholder="Your mobile number"
            className="w-full px-4 py-3 bg-white border border-[#E7E2D8] text-[13px] text-[#1C1917] focus:outline-hidden focus:border-[#1C1917]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] uppercase tracking-wider text-[#1C1917] font-medium mb-1.5">
            Service Requested
          </label>
          <select className="w-full px-4 py-3 bg-white border border-[#E7E2D8] text-[13px] text-[#1C1917] focus:outline-hidden focus:border-[#1C1917]">
            <option>Free In-Home Measurement / Site Visit</option>
            <option>Doorstep Fabric / Sample Demo</option>
            <option>Custom Tailoring & Stitching</option>
            <option>Motorization / Smart Home Setup</option>
            <option>NRI Remote Home Styling</option>
            <option>Corporate / Institutional Furnishings</option>
          </select>
        </div>
        <div>
          <label className="block text-[12px] uppercase tracking-wider text-[#1C1917] font-medium mb-1.5">
            Preferred Timeframe
          </label>
          <input
            type="text"
            placeholder="e.g. This Weekend / Next Tuesday"
            className="w-full px-4 py-3 bg-white border border-[#E7E2D8] text-[13px] text-[#1C1917] focus:outline-hidden focus:border-[#1C1917]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[12px] uppercase tracking-wider text-[#1C1917] font-medium mb-1.5">
          Site Location & Project Scope
        </label>
        <textarea
          rows={3}
          placeholder="Describe your rooms, number of windows, or specific fabric styles you wish to view..."
          className="w-full px-4 py-3 bg-white border border-[#E7E2D8] text-[13px] text-[#1C1917] focus:outline-hidden focus:border-[#1C1917]"
        />
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-[#1C1917] text-[#FDFBF7] text-[12px] uppercase tracking-[0.2em] font-medium hover:bg-[#9A7B56] transition-colors"
      >
        Submit Consultation Request
      </button>
    </form>
  );
}
