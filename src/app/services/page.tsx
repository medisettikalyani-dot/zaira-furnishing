import React from 'react';
import {
  Ruler,
  Sparkles,
  Scissors,
  Hammer,
  Cpu,
  Globe,
  Building2,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { SERVICES } from '@/lib/data/services';
import { ConsultationForm } from '@/components/forms/ConsultationForm';

export const metadata = {
  title: 'Bespoke Services | Zaira Furnishing',
  description:
    'Comprehensive furnishing services: In-home laser measurement, doorstep fabric demos, custom tailoring, smart motorization, and professional installation.',
};

const ICON_MAP: Record<string, React.ElementType> = {
  Ruler,
  Sparkles,
  Scissors,
  Hammer,
  Cpu,
  Globe,
  Building2,
  ShieldCheck,
};

export default function ServicesPage() {
  return (
    <div className="bg-[#FDFBF7] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#9A7B56] font-semibold block mb-2">
            Showroom Services
          </span>
          <h1 className="font-serif text-[36px] sm:text-[46px] text-[#1C1917] font-medium tracking-tight mb-3">
            Atelier & Technical Services
          </h1>
          <p className="text-[14px] text-[#78716C] leading-relaxed">
            From millimeter site visits to smart home motorization and turnkey remote styling, we bring master artisans and specialized technicians directly to your project.
          </p>
        </div>

        {/* 8 Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {SERVICES.map((service) => {
            const IconComponent = ICON_MAP[service.iconName] || Ruler;
            return (
              <div
                key={service.id}
                id={service.slug}
                className="scroll-mt-24 bg-white p-8 border border-[#EBE7DF] hover:border-[#C4B9A1] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 bg-[#FAF7F2] border border-[#E7E2D8] flex items-center justify-center text-[#9A7B56]">
                      <IconComponent className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    {service.requiresSiteVisit && (
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 bg-[#FAF7F2] text-[#9A7B56] border border-[#E7E2D8]">
                        On-Site Visit
                      </span>
                    )}
                  </div>

                  <h2 className="font-serif text-[22px] text-[#1C1917] font-medium mb-3">
                    {service.title}
                  </h2>
                  <p className="text-[14px] text-[#57534E] leading-relaxed mb-6">
                    {service.fullDesc}
                  </p>
                </div>

                <div className="pt-5 border-t border-[#F2EFE9]">
                  <h4 className="text-[11px] uppercase tracking-wider font-semibold text-[#1C1917] mb-2.5">
                    Key Deliverables:
                  </h4>
                  <ul className="space-y-1.5">
                    {service.highlights.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-[12px] text-[#78716C]">
                        <Check className="w-3.5 h-3.5 text-[#9A7B56] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Consultation Request Form Section */}
        <div className="bg-[#FAF7F2] border border-[#EBE7DF] p-8 sm:p-12">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#9A7B56] font-semibold block mb-1">
              Complimentary Appointment
            </span>
            <h3 className="font-serif text-[28px] sm:text-[34px] text-[#1C1917] font-medium mb-2">
              Book a Free Measurement or Consultation
            </h3>
            <p className="text-[13px] text-[#78716C]">
              Select your required service and preferred date. Our showroom coordinator will confirm details.
            </p>
          </div>

          <ConsultationForm />

          {/* Placeholders note */}
          <div className="mt-8 pt-6 border-t border-[#E7E2D8] text-center text-[12px] text-[#78716C]">
            <span>Direct Showroom Helpline: </span>
            <span className="font-medium text-[#1C1917]">[Phone Number Placeholder]</span>
            <span className="mx-2">|</span>
            <span>Showroom: </span>
            <span className="font-medium text-[#1C1917]">[Showroom Address Placeholder]</span>
          </div>
        </div>
      </div>
    </div>
  );
}
