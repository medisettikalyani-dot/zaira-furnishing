'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Compass,
  FileText,
  MessageCircle,
  HelpCircle,
  Check,
  Circle,
  Copy,
  Info,
  Truck,
} from 'lucide-react';
import { useStore, Order } from '@/lib/context/StoreContext';

type StageKey =
  | 'order_received'
  | 'details_confirmed'
  | 'tailoring_preparation'
  | 'ready_for_dispatch'
  | 'delivered_installed';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = (params?.id as string) || '';
  const { getOrderById } = useStore();
  const [mounted, setMounted] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [remoteOrder, setRemoteOrder] = useState<Order | null>(null);
  
  // Local stage override for frontend demonstration/testing
  const [demoStageOverride, setDemoStageOverride] = useState<StageKey | null>(null);

  useEffect(() => {
    setMounted(true);
    if (!orderId) return;

    const local = getOrderById(orderId);
    if (local && local.items && local.items.length > 0) {
      setRemoteOrder(local);
    }

    fetch(`/api/orders/${orderId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.order) {
          const o = data.order;
          setRemoteOrder({
            id: o.order_number || o.id,
            createdAt: o.created_at,
            items: (o.items || []).map((it: any) => ({
              id: it.id,
              productId: it.product_id,
              name: it.product_name_snapshot,
              slug: it.product_slug || '',
              image: it.product_image || '/images/products/curtains/blackout-curtains/main.jpg',
              variantName: it.variant_name_snapshot || undefined,
              sku: it.product_id,
              quantity: it.quantity,
              unitPrice: it.unit_price_snapshot,
              totalPrice: it.line_total,
            })),
            subtotal: o.subtotal,
            shippingCost: o.delivery_charge || 0,
            total: o.total_amount,
            customer: {
              fullName: o.customer_name,
              phone: o.customer_phone,
              email: o.customer_email,
            },
            deliveryAddress: {
              addressLine1: o.delivery_address,
              addressLine2: '',
              city: o.city,
              state: o.state,
              pincode: o.pincode,
              country: 'India',
            },
            deliveryOption: (o.delivery_option as any) || 'standard',
            timeSlot: o.site_visit_time || undefined,
            paymentMethod: o.payment_method === 'COD' ? 'cod' : 'online_demo',
            status:
              o.status === 'CONFIRMED' || o.status === 'PENDING'
                ? 'order_received'
                : (o.status.toLowerCase() as any),
            hasCustomProducts: (o.items || []).some(
              (it: any) => it.customization_data || it.product_type === 'custom_made'
            ),
          });
        }
      })
      .catch((err) => console.error('Error loading order tracking:', err));
  }, [orderId, getOrderById]);

  const order = remoteOrder || getOrderById(orderId);

  const copyRef = () => {
    if (!orderId) return;
    navigator.clipboard.writeText(`#${orderId}`);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  if (!mounted) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen pt-12 pb-24 text-[#1C1917]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-8 h-8 border-2 border-[#1E3A2F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[13px] text-[#78716C]">Loading tracking progress...</p>
        </div>
      </div>
    );
  }

  // Fallback if order not found
  if (!order) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen pt-10 pb-24 text-[#1C1917]">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-14 h-14 rounded-full bg-white border border-[#EDE8DE] flex items-center justify-center mx-auto mb-4 text-[#8C827A]">
            <HelpCircle className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h1 className="font-serif text-[24px] text-[#1C1917] font-semibold mb-2">
            Order Reference Not Found
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[#78716C] leading-relaxed mb-6 font-light">
            We could not locate tracking records for reference <strong className="text-[#1C1917]">#{orderId}</strong> on this browser session.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E3A2F] hover:bg-[#152B23] text-white text-[11.5px] uppercase tracking-wider font-semibold transition-all shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to My Orders</span>
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-[#D8CFBF] text-[#1C1917] hover:border-[#1E3A2F] text-[11.5px] uppercase tracking-wider font-semibold transition-all"
            >
              <span>Explore Products</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active status (respecting demo stage override if user tests progression)
  const currentStatus: StageKey =
    demoStageOverride ||
    (order.status === 'cancelled' ? 'order_received' : order.status);

  const stageKeys: StageKey[] = [
    'order_received',
    'details_confirmed',
    'tailoring_preparation',
    'ready_for_dispatch',
    'delivered_installed',
  ];

  const currentStageIndex = stageKeys.indexOf(currentStatus);

  const getSlotLabel = (slot?: 'morning' | 'afternoon' | 'evening') => {
    switch (slot) {
      case 'morning':
        return 'Morning (10:00 AM – 1:00 PM)';
      case 'afternoon':
        return 'Afternoon (2:00 PM – 5:00 PM)';
      case 'evening':
        return 'Evening (5:00 PM – 8:00 PM)';
      default:
        return 'Standard Timing';
    }
  };

  // Timeline stage definitions customized to product types
  const timelineStages = [
    {
      key: 'order_received',
      name: 'Order Received',
      shortExplanation: 'Your order has been submitted and recorded in our store system.',
      note: `Reference #${order.id} logged.`,
    },
    {
      key: 'details_confirmed',
      name: order.hasCustomProducts ? 'Details & Measurements Confirmed' : 'Details Confirmed',
      shortExplanation: order.hasCustomProducts
        ? 'Your selected fabrics, window measurements, and pleat styling are recorded.'
        : 'Catalog product availability and delivery destination verified.',
      note: order.hasCustomProducts
        ? 'Tailors will review specifications before cutting fabric.'
        : 'Preparing order batch for inspection.',
    },
    {
      key: 'tailoring_preparation',
      name: order.hasCustomProducts ? 'Preparation & Tailoring' : 'Preparation & Quality Check',
      shortExplanation: order.hasCustomProducts
        ? 'Your furnishing item will move to preparation and tailoring after final confirmation.'
        : 'Furnishings are carefully inspected, pressed, and wrapped in protective covers.',
      note: order.hasCustomProducts
        ? 'Handcrafted to exact dimensions in our atelier.'
        : 'Packed for safe white-glove transport.',
    },
    {
      key: 'ready_for_dispatch',
      name: order.deliveryOption === 'service_visit' ? 'Ready for Delivery & Fitting' : 'Ready for Delivery',
      shortExplanation: order.deliveryOption === 'service_visit'
        ? 'Furnishings are ready. Installation specialists will coordinate delivery and on-site fitting.'
        : 'Order is packaged and prepared for direct doorstep dispatch.',
      note: order.deliveryOption === 'service_visit'
        ? `Scheduled service slot: ${getSlotLabel(order.timeSlot)}`
        : 'White-glove courier dispatch.',
    },
    {
      key: 'delivered_installed',
      name: order.deliveryOption === 'service_visit' ? 'Delivered & Installed' : 'Delivered',
      shortExplanation: order.deliveryOption === 'service_visit'
        ? 'Furnishings delivered and fitted on site to your complete satisfaction.'
        : 'Package delivered safely to your specified address.',
      note: 'Completion confirmed.',
    },
  ];

  return (
    <div className="bg-[#FAF7F2] min-h-screen pt-6 sm:pt-10 pb-16 sm:pb-24 text-[#1C1917]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── BREADCRUMB ─── */}
        <nav className="flex items-center gap-1.5 text-[11.5px] sm:text-[12px] text-[#78716C] mb-5 sm:mb-6 font-normal">
          <Link href="/" className="hover:text-[#1C1917] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
          <Link href="/account/orders" className="hover:text-[#1C1917] transition-colors">
            My Orders
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
          <Link href={`/account/orders/${order.id}`} className="hover:text-[#1C1917] transition-colors">
            Order #{order.id}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
          <span className="text-[#1C1917] font-medium">Order Progress</span>
        </nav>

        {/* ─── HEADER SUMMARY CARD ─── */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#EDE8DE] p-5 sm:p-7 shadow-[0_2px_12px_rgba(28,25,23,0.03)] mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2ECE1]">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#866945] block mb-1">
                Order Progress & Status
              </span>
              <div className="flex items-center gap-2.5">
                <h1 className="font-serif text-[22px] sm:text-[26px] font-semibold text-[#1C1917]">
                  Order #{order.id}
                </h1>
                <button
                  type="button"
                  onClick={copyRef}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FAF7F2] border border-[#D8CFBF] hover:bg-white text-[10.5px] font-semibold text-[#1E3A2F] transition-colors cursor-pointer"
                  title="Copy Reference"
                >
                  {copiedRef ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/account/orders/${order.id}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#FAF7F2] border border-[#D8CFBF] hover:border-[#1E3A2F] text-[#1C1917] hover:text-[#1E3A2F] text-[11px] uppercase tracking-wider font-semibold transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Full Details</span>
              </Link>

              <a
                href={`https://wa.me/916300145763?text=${encodeURIComponent(
                  `Hello Zaira Furnishing, I would like to check the progress of order reference #${order.id}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#D8CFBF] hover:border-[#1E3A2F] text-[#1C1917] hover:text-[#1E3A2F] text-[11px] uppercase tracking-wider font-semibold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp Assistance</span>
              </a>
            </div>
          </div>

          {/* Quick Context Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-[12px] text-[#78716C]">
            <div>
              <span className="text-[#8C827A] block text-[10.5px] uppercase font-semibold">Recipient</span>
              <span className="text-[#1C1917] font-medium">{order.customer.fullName}</span>
            </div>
            <div>
              <span className="text-[#8C827A] block text-[10.5px] uppercase font-semibold">Destination City</span>
              <span className="text-[#1C1917] font-medium">{order.deliveryAddress.city}, {order.deliveryAddress.state}</span>
            </div>
            <div>
              <span className="text-[#8C827A] block text-[10.5px] uppercase font-semibold">Service Type</span>
              <span className="text-[#1E3A2F] font-medium">
                {order.deliveryOption === 'service_visit' ? 'In-Home Sizing & Installation' : 'White-Glove Delivery'}
              </span>
            </div>
          </div>
        </div>

        {/* ─── BESPOKE ORDER NOTICE (IF BESPOKE) ─── */}
        {order.hasCustomProducts && (
          <div className="bg-[#FAF0E6] rounded-xl border border-[#E8DCCB] p-4 sm:p-5 mb-6 sm:mb-8 text-left">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-[#9A7B56]" />
              <span className="font-serif text-[13.5px] uppercase font-bold tracking-wider text-[#866945]">
                BESPOKE ORDER PROGRESSION
              </span>
            </div>
            <p className="text-[12.5px] text-[#866945] font-medium leading-relaxed mb-0.5">
              Your customization details have been recorded.
            </p>
            <p className="text-[12px] text-[#78716C] leading-relaxed">
              Final measurements and customization will be confirmed before production. Furnishings transition into hand-tailoring once fabric widths and rod clearances are verified.
            </p>
          </div>
        )}

        {/* ─── VERTICAL TRACKING TIMELINE ─── */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#EDE8DE] p-6 sm:p-8 shadow-[0_2px_12px_rgba(28,25,23,0.03)] mb-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F2ECE1]">
            <div>
              <h2 className="font-serif text-[18px] sm:text-[20px] font-semibold text-[#1C1917]">
                Order Progress Timeline
              </h2>
              <p className="text-[12px] text-[#78716C] mt-0.5">
                Current State: <strong className="text-[#1E3A2F]">{timelineStages[currentStageIndex]?.name}</strong>
              </p>
            </div>
            <span className="text-[11px] text-[#8C827A] bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#EDE8DE]">
              Stage {currentStageIndex + 1} of 5
            </span>
          </div>

          {/* Vertical Step Sequence */}
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-[11px] sm:before:left-[15px] before:top-3 before:bottom-3 before:w-0.5 before:bg-[#EDE8DE]">
            {timelineStages.map((stage, idx) => {
              const isCompleted = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div key={stage.key} className="relative flex items-start gap-4">
                  {/* Timeline Node Symbol */}
                  <div
                    className={`absolute -left-6 sm:-left-8 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-colors z-10 ${
                      isCompleted
                        ? 'bg-[#1E3A2F] text-white shadow-xs ring-4 ring-white'
                        : 'bg-white border-2 border-[#D8CFBF] text-[#A8A29E]'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-[#D8CFBF]" />
                    )}
                  </div>

                  {/* Stage Text Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3
                        className={`font-serif text-[15px] sm:text-[16px] font-semibold ${
                          isCompleted ? 'text-[#1C1917]' : 'text-[#8C827A]'
                        }`}
                      >
                        {stage.name}
                      </h3>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded text-[9.5px] uppercase font-bold tracking-wider bg-[#1E3A2F] text-white">
                          Current Stage
                        </span>
                      )}
                      {isCompleted && !isCurrent && (
                        <span className="text-[11px] text-emerald-700 font-medium">
                          ✓ Completed
                        </span>
                      )}
                      {!isCompleted && (
                        <span className="text-[11px] text-[#A8A29E] font-medium">
                          ○ Upcoming
                        </span>
                      )}
                    </div>

                    <p className="text-[12.5px] sm:text-[13px] text-[#78716C] leading-relaxed">
                      {stage.shortExplanation}
                    </p>

                    {stage.note && (
                      <p className="text-[11px] text-[#8C827A] mt-1 italic">
                        {stage.note}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Honest Status Language Note */}
          <div className="mt-8 pt-4 border-t border-[#F2ECE1] flex items-start gap-2.5 text-[11.5px] text-[#78716C]">
            <Info className="w-4 h-4 text-[#9A7B56] shrink-0 mt-0.5" />
            <p>
              <strong>Notice:</strong> This progress timeline represents the standard workflow for Zaira Furnishing orders. In-home tailoring visits and deliveries are confirmed directly via phone or WhatsApp prior to dispatch.
            </p>
          </div>
        </div>

        {/* ─── FRONTEND DEMONSTRATION: STAGE SWITCHER TOOL ─── */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#EDE8DE] mb-8 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#866945]">
              Frontend Demonstration Tool: Preview Stages
            </span>
            <span className="text-[10.5px] text-[#8C827A]">
              Test any stage without affecting real data
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {stageKeys.map((stKey, idx) => (
              <button
                key={stKey}
                type="button"
                onClick={() => setDemoStageOverride(stKey)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                  currentStatus === stKey
                    ? 'border-[#1E3A2F] bg-[#1E3A2F] text-white shadow-2xs'
                    : 'border-[#EDE8DE] bg-[#FAF7F2] text-[#57534E] hover:border-[#9A7B56]'
                }`}
              >
                {idx + 1}. {timelineStages[idx].name}
              </button>
            ))}
            {demoStageOverride && (
              <button
                type="button"
                onClick={() => setDemoStageOverride(null)}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                Reset to Recorded Status
              </button>
            )}
          </div>
        </div>

        {/* ─── BOTTOM NAVIGATION ACTIONS ─── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <Link
            href={`/account/orders/${order.id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#D8CFBF] text-[#1C1917] hover:border-[#1E3A2F] text-[11.5px] uppercase tracking-wider font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Order Details</span>
          </Link>

          <Link
            href="/account/orders"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#EDE8DE] text-[#78716C] hover:text-[#1C1917] text-[11.5px] uppercase tracking-wider font-semibold transition-all"
          >
            <span>My Orders List</span>
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1E3A2F] hover:bg-[#152B23] text-white text-[11.5px] uppercase tracking-wider font-semibold transition-all shadow-xs"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
