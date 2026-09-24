'use client';

import React, { useState } from 'react';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8 bg-[#FAF7F2] border border-[#9A7B56] text-center">
        <h3 className="font-serif text-[20px] text-[#1C1917] mb-2">Message Received</h3>
        <p className="text-[13px] text-[#57534E] mb-4">
          Thank you for reaching out. Our showroom coordinator will respond to your inquiry shortly.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="px-5 py-2 text-[11px] uppercase tracking-wider font-medium border border-[#1C1917] text-[#1C1917]"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#1C1917] font-medium mb-1.5">
            Your Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Eleanor Vance"
            className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E7E2D8] text-[13px] text-[#1C1917] focus:outline-hidden focus:border-[#1C1917]"
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#1C1917] font-medium mb-1.5">
            Phone Number
          </label>
          <input
            type="tel"
            required
            placeholder="e.g. +91 98765 43210"
            className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E7E2D8] text-[13px] text-[#1C1917] focus:outline-hidden focus:border-[#1C1917]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#1C1917] font-medium mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder="e.g. eleanor@example.com"
            className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E7E2D8] text-[13px] text-[#1C1917] focus:outline-hidden focus:border-[#1C1917]"
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#1C1917] font-medium mb-1.5">
            Nature of Inquiry
          </label>
          <select className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E7E2D8] text-[13px] text-[#1C1917] focus:outline-hidden focus:border-[#1C1917]">
            <option>Bespoke Drapery & Blinds</option>
            <option>Sofa Re-upholstery & Fabric Selection</option>
            <option>In-Home Laser Site Measurement</option>
            <option>Wooden Flooring / Carpet Inquiry</option>
            <option>Architect / Interior Designer Collaboration</option>
            <option>Other Catalog Inquiry</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[11px] uppercase tracking-wider text-[#1C1917] font-medium mb-1.5">
          Message / Project Scope
        </label>
        <textarea
          rows={4}
          required
          placeholder="Tell us about your rooms, number of windows, preferred textures, or timeline..."
          className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E7E2D8] text-[13px] text-[#1C1917] focus:outline-hidden focus:border-[#1C1917]"
        />
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-[#1C1917] text-[#FDFBF7] text-[12px] uppercase tracking-[0.2em] font-medium hover:bg-[#9A7B56] transition-colors shadow-sm"
      >
        Send Message
      </button>
    </form>
  );
}
