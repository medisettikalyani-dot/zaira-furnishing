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
  Compass,
  CheckCircle2,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  Banknote,
  Truck,
  Copy,
  Check,
  MessageCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useStore, Order } from '@/lib/context/StoreContext';

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = (params?.id as string) || '';
  const { getOrderById } = useStore();
  const [mounted, setMounted] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [remoteOrder, setRemoteOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    const local = getOrderById(orderId);
    if (local && local.items && local.items.length > 0) {
      setRemoteOrder(local);
    }

    // Always fetch latest authoritative snapshots from D1
    fetch(`/api/orders/${orderId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.order) {
          const o = data.order;
          const mappedItems = (o.items || []).map((it: any) => {
            let customData: any = undefined;
            if (it.customization_data) {
              try {
                customData = typeof it.customization_data === 'string' ? JSON.parse(it.customization_data) : it.customization_data;
              } catch {
                customData = undefined;
              }
            }
            return {
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
              customizationData: customData,
              customDimensions: customData?.customDimensions,
              sizeLabel: customData?.sizeLabel,
              headingStyle: customData?.headingStyle,
            };
          });

          setRemoteOrder({
            id: o.order_number || o.id,
            createdAt: o.created_at,
            items: mappedItems,
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
            status: (() => {
              const s = (o.status || '').toUpperCase();
              if (s === 'PENDING') return 'order_received';
              if (s === 'CONFIRMED') return 'details_confirmed';
              if (s === 'PROCESSING') return 'tailoring_preparation';
              if (s === 'READY') return 'ready_for_dispatch';
              if (s === 'COMPLETED') return 'delivered_installed';
              if (s === 'CANCELLED') return 'cancelled';
              return 'details_confirmed';
            })(),
            hasCustomProducts: mappedItems.some(
              (it: any) => it.customDimensions || it.customizationData
            ),
          });
        }
      })
      .catch((err) => console.error('Error loading order from D1:', err))
      .finally(() => setIsLoading(false));
  }, [orderId, getOrderById]);

  const order = remoteOrder || getOrderById(orderId);

  const copyRef = () => {
    if (!orderId) return;
    navigator.clipboard.writeText(`#${orderId}`);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  if (!mounted || isLoading) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen pt-12 pb-24 text-[#1C1917]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-8 h-8 border-2 border-[#1E3A2F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[13px] text-[#78716C]">Loading order details...</p>
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
            We could not find an order record for reference <strong className="text-[#1C1917]">#{orderId}</strong>. Please ensure you are logged into the customer account associated with this order.
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

  const formattedDateTime = new Date(order.createdAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

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

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'order_received':
        return 'Order Received';
      case 'details_confirmed':
        return 'Details Confirmed';
      case 'tailoring_preparation':
        return 'Preparation / Tailoring';
      case 'ready_for_dispatch':
        return 'Ready for Delivery';
      case 'delivered_installed':
        return 'Delivered & Installed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Order Processing';
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen pt-6 sm:pt-10 pb-16 sm:pb-24 text-[#1C1917]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
          <span className="text-[#1C1917] font-medium truncate max-w-[150px] sm:max-w-none">
            Order #{order.id}
          </span>
        </nav>

        {/* ─── TOP HEADER BAR ─── */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#EDE8DE] p-5 sm:p-7 shadow-[0_2px_12px_rgba(28,25,23,0.03)] mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Order Identifiers */}
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#866945]">
                  Order Reference
                </span>
                <span className="font-mono text-[20px] sm:text-[22px] font-bold text-[#1C1917]">
                  #{order.id}
                </span>
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

              <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#78716C]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#9A7B56]" />
                  <span>Placed on {formattedDateTime}</span>
                </span>
                <span className="text-[#D8CFBF]">·</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#1E3A2F]/10 text-[#1E3A2F]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A2F]" />
                  <span>{getStatusLabel(order.status)}</span>
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href={`/account/orders/${order.id}/track`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E3A2F] hover:bg-[#152B23] text-white text-[11.5px] uppercase tracking-wider font-semibold transition-all shadow-xs"
              >
                <Compass className="w-4 h-4" />
                <span>Track Order Progress</span>
              </Link>

              <a
                href={`https://wa.me/916300145763?text=${encodeURIComponent(
                  `Hello Zaira Furnishing, I am enquiring about my order reference #${order.id} (${order.customer.fullName}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#D8CFBF] hover:border-[#1E3A2F] text-[#1C1917] hover:text-[#1E3A2F] text-[11.5px] uppercase tracking-wider font-semibold transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp Concierge</span>
              </a>
            </div>

          </div>
        </div>

        {/* ─── BESPOKE ORDER NOTICE (IF APPLICABLE) ─── */}
        {order.hasCustomProducts && (
          <div className="bg-[#FAF0E6] rounded-xl border border-[#E8DCCB] p-4 sm:p-5 mb-6 sm:mb-8 text-left">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-[#9A7B56]" />
              <span className="font-serif text-[13.5px] uppercase font-bold tracking-wider text-[#866945]">
                BESPOKE ORDER
              </span>
            </div>
            <p className="text-[12.5px] text-[#866945] font-medium leading-relaxed mb-0.5">
              Your customization details have been recorded.
            </p>
            <p className="text-[12px] text-[#78716C] leading-relaxed">
              Final measurements and customization will be confirmed before production.
            </p>
          </div>
        )}

        {/* ─── TWO-COLUMN GRID: ITEMS + CUSTOMIZATION VS ORDER INFO ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* LEFT: ORDER ITEMS & CUSTOMIZATION DETAILS (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-[#EDE8DE] p-5 sm:p-6 shadow-[0_2px_12px_rgba(28,25,23,0.03)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE1]">
                <h2 className="font-serif text-[17px] sm:text-[19px] font-semibold text-[#1C1917]">
                  Order Items ({order.items.length})
                </h2>
                <span className="text-[11px] text-[#8C827A] uppercase tracking-wider">
                  Handcrafted Furnishings
                </span>
              </div>

              <div className="divide-y divide-[#F2ECE1]">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                    <div className="flex gap-3.5 sm:gap-4 items-start">
                      <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden bg-[#FAF7F2] border border-[#EDE8DE] shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-[14.5px] sm:text-[16px] font-semibold text-[#1C1917]">
                          {item.name}
                        </h3>

                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-[#78716C] mt-1">
                          {item.variantName && (
                            <span>Color/Pattern: <strong className="text-[#1C1917]">{item.variantName}</strong></span>
                          )}
                          {item.headingStyle && (
                            <span>Heading: <strong className="text-[#1C1917]">{item.headingStyle}</strong></span>
                          )}
                          {item.sizeLabel && !item.customDimensions && (
                            <span>Size: <strong className="text-[#1C1917]">{item.sizeLabel}</strong></span>
                          )}
                          <span>Qty: <strong className="text-[#1C1917]">{item.quantity}</strong></span>
                        </div>

                        <div className="mt-2 text-[12.5px] font-serif text-[#1C1917]">
                          <span className="text-[#8C827A] font-sans text-[11.5px] mr-1">Unit:</span>
                          ₹{item.unitPrice.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-serif text-[15px] sm:text-[17px] font-bold text-[#1C1917]">
                          ₹{item.totalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Dedicated Bespoke Customization Box */}
                    {item.customDimensions && (
                      <div className="bg-[#FAF7F2] rounded-lg p-3 border border-[#EDE8DE] text-[11.5px] space-y-1">
                        <div className="flex items-center gap-1.5 text-[#866945] font-semibold uppercase tracking-wider text-[10.5px]">
                          <Sparkles className="w-3 h-3" />
                          <span>Recorded Customization Details:</span>
                        </div>
                        <p className="text-[#1C1917] font-medium">
                          {item.customDimensions}
                        </p>
                        {item.headingStyle && (
                          <p className="text-[#78716C]">
                            Pleat Configuration: <span className="text-[#1C1917]">{item.headingStyle}</span>
                          </p>
                        )}
                        <p className="text-[10px] text-[#8C827A] pt-0.5">
                          * Master tailors confirm exact drapery drop and rod clearances prior to stitching.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: CUSTOMER, DELIVERY & BILLING SUMMARY (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Customer & Address Tile */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-[#EDE8DE] p-5 sm:p-6 shadow-[0_2px_12px_rgba(28,25,23,0.03)] space-y-4">
              <h2 className="font-serif text-[16px] sm:text-[17px] font-semibold text-[#1C1917] pb-2.5 border-b border-[#F2ECE1]">
                Customer & Destination
              </h2>

              <div className="space-y-3 text-[12.5px]">
                <div className="flex items-start gap-2.5">
                  <User className="w-4 h-4 text-[#9A7B56] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1C1917] block">{order.customer.fullName}</span>
                    <span className="text-[#78716C]">{order.customer.phone}</span>
                    {order.customer.email && (
                      <span className="text-[#78716C] block">{order.customer.email}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-[#F8F5EE]">
                  <MapPin className="w-4 h-4 text-[#9A7B56] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1C1917] block">Delivery Address</span>
                    <p className="text-[#78716C] leading-relaxed">
                      {order.deliveryAddress.addressLine1}, {order.deliveryAddress.addressLine2}
                      <br />
                      {order.deliveryAddress.city}, {order.deliveryAddress.state} – {order.deliveryAddress.pincode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-[#F8F5EE]">
                  <Truck className="w-4 h-4 text-[#9A7B56] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1C1917] block">Service Method</span>
                    <span className="text-[#1E3A2F] font-medium block">
                      {order.deliveryOption === 'service_visit'
                        ? `In-Home Sizing & Installation (${getSlotLabel(order.timeSlot)})`
                        : 'Standard White-Glove Doorstep Delivery'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-[#F8F5EE]">
                  <Banknote className="w-4 h-4 text-[#9A7B56] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1C1917] block">Payment Method</span>
                    <span className="text-[#78716C] block">
                      {order.paymentMethod === 'cod'
                        ? 'Cash on Delivery (COD) / On-Site Inspection'
                        : 'Online Payment (Frontend Demo)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Summary Tile */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-[#EDE8DE] p-5 sm:p-6 shadow-[0_2px_12px_rgba(28,25,23,0.03)] space-y-3 text-[12.5px] sm:text-[13px]">
              <h2 className="font-serif text-[16px] sm:text-[17px] font-semibold text-[#1C1917] pb-2.5 border-b border-[#F2ECE1]">
                Payment Summary
              </h2>

              <div className="flex justify-between text-[#78716C]">
                <span>Items Subtotal</span>
                <span className="font-medium text-[#1C1917]">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-[#78716C]">
                <span>White-Glove Delivery</span>
                <span className="font-semibold text-[#1E3A2F]">Complimentary</span>
              </div>

              <div className="flex justify-between text-[#78716C]">
                <span>GST (Included)</span>
                <span className="font-medium text-[#1C1917]">Included in Price</span>
              </div>

              <div className="pt-3 border-t border-[#F2ECE1] flex justify-between items-baseline font-serif">
                <span className="text-[16px] font-semibold text-[#1C1917]">Total Paid / Payable</span>
                <span className="text-[20px] font-bold text-[#1C1917]">
                  ₹{order.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Navigation & Help Links */}
            <div className="space-y-2 pt-2">
              <Link
                href={`/account/orders/${order.id}/track`}
                className="w-full py-3.5 rounded-xl font-semibold text-[12px] uppercase tracking-widest bg-[#1E3A2F] hover:bg-[#152B23] text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Track Order Progress</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-between gap-2 pt-1">
                <Link
                  href="/account/orders"
                  className="text-[11.5px] uppercase tracking-wider font-semibold text-[#78716C] hover:text-[#1C1917] transition-colors"
                >
                  ← Back to My Orders
                </Link>

                <Link
                  href="/products"
                  className="text-[11.5px] uppercase tracking-wider font-semibold text-[#9A7B56] hover:text-[#866945] transition-colors"
                >
                  Continue Shopping →
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
