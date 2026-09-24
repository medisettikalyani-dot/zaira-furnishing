'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  ArrowRight,
  Navigation,
  CheckCircle2,
  User,
  Mail,
  MessageSquare,
} from 'lucide-react';

export function ContactVisitSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="relative py-20 sm:py-24 lg:py-28 bg-[#FAF7F2] border-t border-[#EBE5DA] overflow-hidden"
    >
      {/* Subtle Ambient Radial Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#DECBB6_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Centered Section Intro ─── */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-2.5">
            <span className="w-5 h-[1.5px] bg-[#7D5E38]" />
            <span className="text-[11px] uppercase tracking-[0.24em] text-[#7D5E38] font-bold">
              Connect & Visit
            </span>
            <span className="w-5 h-[1.5px] bg-[#7D5E38]" />
          </div>
          <h2 className="font-serif text-[32px] sm:text-[40px] lg:text-[44px] text-[#1C1917] font-medium tracking-tight mb-3">
            Visit Our Showroom or Send an Inquiry
          </h2>
          <p className="text-[14px] sm:text-[15.5px] text-[#78716C] leading-relaxed">
            Experience our fabric collections in person, or reach out directly to our furnishing team.
          </p>
        </div>

        {/* ─── Two Equal Showroom Columns ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {/* ─── Left Column: Contact Us ─── */}
          <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-[#EDE4D6] p-7 sm:p-9 lg:p-10 shadow-[0_12px_36px_rgba(40,30,20,0.04)] hover:shadow-[0_18px_46px_rgba(40,30,20,0.07)] transition-all duration-400 flex flex-col justify-between">
            <div>
              {/* Overline Label */}
              <div className="inline-flex items-center gap-2 mb-2.5">
                <span className="w-4 h-[1.5px] bg-[#7D5E38]" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#7D5E38] font-bold">
                  Get in Touch
                </span>
              </div>

              <h3 className="font-serif text-[26px] sm:text-[30px] text-[#1C1917] font-medium tracking-tight mb-2">
                Contact Us
              </h3>
              <p className="text-[13.5px] sm:text-[14px] text-[#78716C] leading-relaxed mb-6 sm:mb-8">
                Have a question about our products or services? Get in touch with us.
              </p>

              {submitted ? (
                <div className="p-8 sm:p-10 rounded-[22px] bg-[#FAF7F2] border border-[#7D5E38]/25 text-center my-4">
                  <div className="w-12 h-12 rounded-full bg-[#7D5E38]/10 text-[#7D5E38] flex items-center justify-center mx-auto mb-3.5">
                    <CheckCircle2 className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h4 className="font-serif text-[22px] text-[#1C1917] font-medium mb-1.5">
                    Message Received
                  </h4>
                  <p className="text-[13.5px] text-[#635B52] leading-relaxed max-w-sm mx-auto mb-6">
                    Thank you for reaching out. Our furnishing specialists will respond to your inquiry shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setMessage('');
                    }}
                    className="inline-flex items-center justify-center text-[12px] uppercase tracking-[0.14em] font-semibold text-[#7D5E38] hover:text-[#1C1917] border-b border-[#7D5E38]/40 pb-0.5 hover:border-[#1C1917] transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-[11px] uppercase tracking-[0.14em] text-[#1C1917] font-semibold mb-1.5"
                    >
                      Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A89E8C]">
                        <User className="w-4 h-4 stroke-[1.8]" />
                      </div>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full pl-10 pr-4 py-3 rounded-[13px] bg-[#FAF7F2] hover:bg-white focus:bg-white border border-[#E2D8C7] focus:border-[#7D5E38] focus:ring-3 focus:ring-[#7D5E38]/10 text-[13.5px] text-[#1C1917] placeholder:text-[#A89E8C] transition-all outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-[11px] uppercase tracking-[0.14em] text-[#1C1917] font-semibold mb-1.5"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A89E8C]">
                        <Mail className="w-4 h-4 stroke-[1.8]" />
                      </div>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        className="w-full pl-10 pr-4 py-3 rounded-[13px] bg-[#FAF7F2] hover:bg-white focus:bg-white border border-[#E2D8C7] focus:border-[#7D5E38] focus:ring-3 focus:ring-[#7D5E38]/10 text-[13.5px] text-[#1C1917] placeholder:text-[#A89E8C] transition-all outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-[11px] uppercase tracking-[0.14em] text-[#1C1917] font-semibold mb-1.5"
                    >
                      Message
                    </label>
                    <div className="relative">
                      <div className="absolute top-3.5 left-0 pl-3.5 pointer-events-none text-[#A89E8C]">
                        <MessageSquare className="w-4 h-4 stroke-[1.8]" />
                      </div>
                      <textarea
                        id="contact-message"
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="How can we help you?"
                        className="w-full pl-10 pr-4 py-3 rounded-[13px] bg-[#FAF7F2] hover:bg-white focus:bg-white border border-[#E2D8C7] focus:border-[#7D5E38] focus:ring-3 focus:ring-[#7D5E38]/10 text-[13.5px] text-[#1C1917] placeholder:text-[#A89E8C] transition-all outline-hidden resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#7D5E38] hover:bg-[#1C1917] text-[#FAF7F2] text-[12.5px] font-semibold tracking-[0.14em] uppercase py-3.5 px-8 rounded-full transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group"
                    >
                      <span>Send Message</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </form>
              )}
            </div>

            <p className="text-center text-[11.5px] text-[#A89E8C] pt-4 border-t border-[#F2ECE1] mt-6">
              Inquiries are answered directly by our showroom specialists.
            </p>
          </div>

          {/* ─── Right Column: Visit Us ─── */}
          <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-[#EDE4D6] p-7 sm:p-9 lg:p-10 shadow-[0_12px_36px_rgba(40,30,20,0.04)] hover:shadow-[0_18px_46px_rgba(40,30,20,0.07)] transition-all duration-400 flex flex-col justify-between">
            <div>
              {/* Overline Label */}
              <div className="inline-flex items-center gap-2 mb-2.5">
                <span className="w-4 h-[1.5px] bg-[#7D5E38]" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#7D5E38] font-bold">
                  Our Showroom
                </span>
              </div>

              <h3 className="font-serif text-[26px] sm:text-[30px] text-[#1C1917] font-medium tracking-tight mb-4">
                Visit Us
              </h3>

              {/* Framed Interactive Map Visual */}
              <div className="rounded-[20px] overflow-hidden border border-[#E5DDCF] bg-[#FAF7F2] shadow-2xs mb-5">
                {/* Micro Header Bar over Map */}
                <div className="px-4 py-2 bg-[#FAF7F2] border-b border-[#EAE0D0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#7D5E38] animate-pulse" />
                    <span className="text-[11px] font-semibold tracking-wide text-[#1C1917]">
                      Puppalguda Showroom
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C8270] font-medium">
                    Hyderabad, Telangana
                  </span>
                </div>

                {/* Map Embed Frame */}
                <div className="relative w-full h-[180px] sm:h-[195px] bg-[#FAF7F2]">
                  <iframe
                    title="Zaira Furnishing Showroom Location Map"
                    src="https://maps.google.com/maps?q=Zaira+Furnishing,+Rd+Number+5,+Kyetian+Goud+Nilayam,+Alkapur+Twp,+Puppalguda,+Hyderabad,+Telangana+500089&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              {/* Showroom Identity */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-serif text-[21px] sm:text-[22px] text-[#1C1917] font-medium">
                    Zaira Furnishing
                  </h4>
                  <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#7D5E38] bg-[#7D5E38]/8 px-2.5 py-0.5 rounded-full border border-[#7D5E38]/15">
                    Flagship
                  </span>
                </div>
                <p className="text-[12.5px] text-[#78716C] leading-relaxed">
                  Retailer of mattresses, curtains and sofa covers, along with blinds and bedding.
                </p>
              </div>

              {/* Address & Phone Card */}
              <div className="rounded-[16px] bg-[#FAF7F2] border border-[#EAE0D0] p-4 space-y-3 mb-4">
                {/* Address Row */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-white border border-[#DECBB6] flex items-center justify-center text-[#7D5E38] shrink-0 mt-0.5 shadow-2xs">
                    <MapPin className="w-3.5 h-3.5 stroke-[1.8]" />
                  </div>
                  <div className="text-[12.5px] text-[#44403C] leading-relaxed">
                    <span className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8270] mb-0.5">
                      Showroom Address
                    </span>
                    <address className="not-italic text-[#1C1917] font-normal">
                      Rd Number 5, Kyetian Goud Nilayam,
                      <br />
                      Alkapur Twp, Puppalguda,
                      <br />
                      Hyderabad, Telangana 500089
                    </address>
                  </div>
                </div>

                <div className="h-px bg-[#EAE0D0] w-full" />

                {/* Phone Row */}
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white border border-[#DECBB6] flex items-center justify-center text-[#7D5E38] shrink-0 shadow-2xs">
                    <Phone className="w-3.5 h-3.5 stroke-[1.8]" />
                  </div>
                  <div className="text-[12.5px]">
                    <span className="block text-[10px] uppercase tracking-wider font-bold text-[#8C8270] mb-0.5">
                      Phone
                    </span>
                    <a
                      href="tel:06300145763"
                      className="font-semibold text-[#1C1917] hover:text-[#7D5E38] transition-colors"
                    >
                      063001 45763
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Get Directions Action Button */}
            <div className="pt-2">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Zaira+Furnishing,+Rd+Number+5,+Kyetian+Goud+Nilayam,+Alkapur+Twp,+Puppalguda,+Hyderabad,+Telangana+500089"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 bg-[#7D5E38] hover:bg-[#1C1917] text-[#FAF7F2] text-[12.5px] font-semibold tracking-[0.14em] uppercase py-3.5 px-6 rounded-full transition-all duration-300 shadow-sm hover:shadow-md group/btn"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
