'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Heart,
  Check,
  ShoppingBag,
  MessageCircle,
  Ruler,
  Share2,
  Minus,
  Plus,
  ArrowRight,
  FileText,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  X,
  Send,
  AlertCircle,
  Maximize2,
  Scissors,
} from 'lucide-react';
import { Product } from '@/lib/data/types';
import { useStore } from '@/lib/context/StoreContext';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductTrustBenefits } from './ProductTrustBenefits';
import { ProductCustomerReviews } from './ProductCustomerReviews';
import { ZAIRA_WHATSAPP_NUMBER } from '@/lib/whatsapp';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const router = useRouter();
  const { addToCart, isWishlisted, toggleWishlist, customer, setIsCartOpen } = useStore();

  // ─── DATA-DRIVEN PRODUCT PROPERTIES ───
  const isCustom = product.productType === 'custom_made';
  const isCurtain = product.categorySlug === 'curtains-drapes';
  const isBlind = product.categorySlug === 'window-blinds-shades';
  const isWallpaper = product.categorySlug === 'wallpapers-wall-coverings';
  const isCarpet = product.categorySlug === 'carpets-rugs';
  const isSofaFabric = product.categorySlug === 'sofa-fabrics-upholstery';
  const isMattress = product.categorySlug === 'mattresses-sleep-systems';

  // ─── CONFIRMED HEADING/PLEAT STYLES (FROM PRODUCT DATA ONLY) ───
  const confirmedHeadingStyles = useMemo(() => {
    if (!isCurtain || !product.specifications) return [];
    const headingSpec = product.specifications.find(
      (s) =>
        s.label.toLowerCase().includes('heading') ||
        s.label.toLowerCase().includes('pleat') ||
        s.label.toLowerCase().includes('stitch')
    );
    if (!headingSpec?.value) return [];
    return headingSpec.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }, [isCurtain, product.specifications]);

  // ─── DYNAMIC VARIANT LABEL (FROM PRODUCT VARIANT DATA ONLY) ───
  const variantLabel = useMemo(() => {
    const vars = product.variations;
    if (!vars || vars.length <= 1) return '';

    const hasSize =
      isMattress ||
      vars.some(
        (v) =>
          v.name.toLowerCase().includes('king') ||
          v.name.toLowerCase().includes('queen') ||
          v.name.toLowerCase().includes('single') ||
          v.name.toLowerCase().includes('double') ||
          v.name.toLowerCase().includes(' inch') ||
          v.attributes?.Size
      );
    if (hasSize) return 'Select Size';

    const hasColor = vars.some((v) => v.type === 'color' || v.colorHex);
    if (hasColor) return 'Select Colour';

    const firstType = vars[0]?.type;
    if (firstType === 'pattern') return 'Select Pattern';
    if (firstType === 'design') return 'Select Design';
    if (firstType === 'material') return 'Select Material';

    return 'Select Option';
  }, [product, isMattress]);

  // ─── VARIANT & IMAGE STATE ───
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const currentVariant = product.variations?.[selectedVariantIdx] || product.variations?.[0];

  // Active image: primary product image
  const [activeImage, setActiveImage] = useState<string>(
    product.image || product.mainImage || currentVariant?.image || ''
  );
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Sync activeImage whenever product changes (keep main product view as primary)
  useEffect(() => {
    setSelectedVariantIdx(0);
    const initialImg =
      product.image ||
      product.mainImage ||
      product.variations?.[0]?.image ||
      '';
    setActiveImage(initialImg);
  }, [product.id, product.image, product.mainImage, product.variations]);

  // Gallery: exactly 2–3 images representing the SAME product (main view, room angle, fabric detail)
  const galleryImages = useMemo(() => {
    const primaryImg = product.image || product.mainImage;
    const list: string[] = [];
    if (primaryImg) list.push(primaryImg);

    if (product.additionalImages && product.additionalImages.length > 0) {
      product.additionalImages.forEach((img) => {
        if (img && !list.includes(img) && list.length < 3) {
          list.push(img);
        }
      });
    } else if (product.galleryImages && product.galleryImages.length > 0) {
      product.galleryImages.forEach((img) => {
        if (img && !list.includes(img) && list.length < 3) {
          list.push(img);
        }
      });
    }

    return list.length > 0 ? list : [primaryImg];
  }, [product]);

  const currentImgIdx = useMemo(() => {
    const idx = galleryImages.indexOf(activeImage);
    return idx >= 0 ? idx : 0;
  }, [galleryImages, activeImage]);

  const handlePrevImage = () => {
    const prevIdx = (currentImgIdx - 1 + galleryImages.length) % galleryImages.length;
    setActiveImage(galleryImages[prevIdx]);
  };

  const handleNextImage = () => {
    const nextIdx = (currentImgIdx + 1) % galleryImages.length;
    setActiveImage(galleryImages[nextIdx]);
  };

  const handleThumbnailClick = (img: string) => {
    setActiveImage(img);
  };

  const handleSelectVariant = (idx: number) => {
    setSelectedVariantIdx(idx);
    const v = product.variations?.[idx];
    if (v?.image) {
      setActiveImage(v.image);
    } else if (v?.thumbnailImage) {
      setActiveImage(v.thumbnailImage);
    } else if (v?.images?.[0]) {
      setActiveImage(v.images[0]);
    }
  };

  // ─── REAL CUSTOMIZATION OPTIONS (CURTAINS / BLINDS) ───
  const [sizeType, setSizeType] = useState<'standard' | 'custom'>('standard');
  const [customWidth, setCustomWidth] = useState('60');
  const [customHeight, setCustomHeight] = useState('84');
  const activeHeadingStyle = confirmedHeadingStyles[0] || 'French Pinch Pleat';

  // ─── QUANTITY & ACTION STATE ───
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // ─── ACCORDIONS STATE (CLEAN DIVIDERS) ───
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(
    new Set(['specs', 'details'])
  );

  const toggleAccordion = useCallback((key: string) => {
    setOpenAccordions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  // ─── MODAL FLOWS STATE (QUOTE & MEASUREMENT) ───
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteName, setQuoteName] = useState(customer?.name || '');
  const [quotePhone, setQuotePhone] = useState(customer?.phone || '');
  const [quoteEmail, setQuoteEmail] = useState(customer?.email || '');
  const [quoteMessage, setQuoteMessage] = useState('');
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteRequestNumber, setQuoteRequestNumber] = useState<string | null>(null);
  const [isQuoteSubmitting, setIsQuoteSubmitting] = useState(false);

  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [measName, setMeasName] = useState(customer?.name || '');
  const [measPhone, setMeasPhone] = useState(customer?.phone || '');
  const [measEmail, setMeasEmail] = useState(customer?.email || '');
  const [measAddress, setMeasAddress] = useState('');
  const [measDate, setMeasDate] = useState('');
  const [measTimeSlot, setMeasTimeSlot] = useState('Morning (10:00 AM – 1:00 PM)');
  const [measNotes, setMeasNotes] = useState('');
  const [measError, setMeasError] = useState<string | null>(null);
  const [measSubmitted, setMeasSubmitted] = useState(false);
  const [measRequestNumber, setMeasRequestNumber] = useState<string | null>(null);
  const [isMeasSubmitting, setIsMeasSubmitting] = useState(false);

  // Subcategory metadata resolution for breadcrumbs directly from dynamic product
  const subcategoryUrl = useMemo(() => {
    const slug = product.subcategorySlug || product.curtainType || product.blindType || product.sofaFabricType || product.wallpaperType || product.carpetType;
    if (!slug) return null;
    if (isCurtain) return `/categories/curtains/${slug}`;
    if (isBlind) return `/categories/blinds/${slug}`;
    if (isSofaFabric) return `/categories/sofa-fabrics/${slug}`;
    if (isWallpaper) return `/categories/wallpapers/${slug}`;
    if (isCarpet) return `/categories/carpets/${slug}`;
    return null;
  }, [isCurtain, isBlind, isSofaFabric, isWallpaper, isCarpet, product]);

  const subcategoryName = useMemo(() => {
    return product.subcategoryName || null;
  }, [product.subcategoryName]);

  // Sizing label helper
  const getResolvedSizeLabel = useCallback(() => {
    if (isCurtain || isBlind) {
      if (sizeType === 'custom') {
        return `Custom (${customWidth}″W × ${customHeight}″H)${activeHeadingStyle ? ` • ${activeHeadingStyle}` : ''}`;
      }
      return `Standard Size${activeHeadingStyle ? ` • ${activeHeadingStyle}` : ''}`;
    }
    if (isSofaFabric) {
      return `${quantity} Metre${quantity > 1 ? 's' : ''}`;
    }
    if (currentVariant?.attributes?.Size) {
      return currentVariant.attributes.Size;
    }
    return 'Standard Size';
  }, [
    isCurtain,
    isBlind,
    sizeType,
    customWidth,
    customHeight,
    activeHeadingStyle,
    isSofaFabric,
    quantity,
    currentVariant,
  ]);

  const getResolvedDimensions = useCallback((): string | undefined => {
    if ((isCurtain || isBlind) && sizeType === 'custom') {
      return `${customWidth}″ Width × ${customHeight}″ Height`;
    }
    return undefined;
  }, [isCurtain, isBlind, sizeType, customWidth, customHeight]);

  // Quantity unit label
  const quantityUnit = useMemo(() => {
    if (isSofaFabric) return quantity === 1 ? 'metre' : 'metres';
    if (isCurtain) return quantity === 1 ? 'panel' : 'panels';
    if (isWallpaper) return quantity === 1 ? 'roll' : 'rolls';
    if (isBlind) return quantity === 1 ? 'unit' : 'units';
    if (isCarpet) return quantity === 1 ? 'rug' : 'rugs';
    if (isMattress) return quantity === 1 ? 'mattress' : 'mattresses';
    if (product.categorySlug === 'bed-linen-bath') return quantity === 1 ? 'set' : 'sets';
    if (product.categorySlug === 'cushions-pillows') return quantity === 1 ? 'cover' : 'covers';
    return quantity === 1 ? 'unit' : 'units';
  }, [isSofaFabric, isCurtain, isWallpaper, isBlind, isCarpet, isMattress, product.categorySlug, quantity]);

  // Real unit price directly from product data
  const effectivePrice = currentVariant?.price || product.price;

  // Pricing unit helper
  const pricingUnit = useMemo(() => {
    if (isSofaFabric) return '/ metre';
    if (isCurtain && product.startingPrice) return '/ panel';
    if (isWallpaper && product.startingPrice) return '/ roll';
    if (product.startingPrice) return 'onwards';
    return '';
  }, [isSofaFabric, isCurtain, isWallpaper, product.startingPrice]);

  // Add to cart handler
  const handleAddToCart = async () => {
    const sizeLabel = getResolvedSizeLabel();
    const customDimensions = getResolvedDimensions();

    await addToCart({
      productId: product.id,
      variantId: currentVariant?.id,
      name: product.displayName || product.name,
      slug: product.slug,
      image: activeImage,
      variantName: currentVariant?.name,
      sku: currentVariant?.sku || product.id,
      sizeLabel,
      headingStyle: isCurtain && confirmedHeadingStyles.length > 0 ? activeHeadingStyle : undefined,
      customDimensions,
      quantity,
      unitPrice: effectivePrice,
      productType: product.productType,
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2600);
  };

  // Buy now handler
  const handleBuyNow = async () => {
    if (isBuyingNow) return;
    setIsBuyingNow(true);

    try {
      const sizeLabel = getResolvedSizeLabel();
      const customDimensions = getResolvedDimensions();

      await addToCart({
        productId: product.id,
        variantId: currentVariant?.id,
        name: product.displayName || product.name,
        slug: product.slug,
        image: activeImage,
        variantName: currentVariant?.name,
        sku: currentVariant?.sku || product.id,
        sizeLabel,
        headingStyle: isCurtain && confirmedHeadingStyles.length > 0 ? activeHeadingStyle : undefined,
        customDimensions,
        quantity,
        unitPrice: effectivePrice,
        productType: product.productType,
      });

      setIsCartOpen(false);
      router.push('/checkout');
    } catch (err) {
      console.error('Buy Now navigation failed:', err);
      setIsBuyingNow(false);
    }
  };

  // Standardized WhatsApp URL
  const whatsappUrl = useMemo(() => {
    const phone = ZAIRA_WHATSAPP_NUMBER;
    const productName = product.displayName || product.name;
    const currentUrl =
      typeof window !== 'undefined'
        ? window.location.href
        : `https://zairafurnishing.com/products/${product.slug}`;
    const qtyText = `${quantity} ${quantityUnit}`;
    const sizeLabel = getResolvedSizeLabel();

    const messageLines = [
      'Hello Zaira Furnishing,',
      '',
      `I am interested in: ${productName}`,
      `Category: ${product.categoryName}`,
    ];

    if (currentVariant?.name && product.variations && product.variations.length > 1) {
      messageLines.push(`Selected Option: ${currentVariant.name}`);
    }

    if (isCurtain || isBlind || currentVariant?.attributes?.Size) {
      messageLines.push(`Specification: ${sizeLabel}`);
    }

    if (isCurtain && confirmedHeadingStyles.length > 0 && activeHeadingStyle) {
      messageLines.push(`Heading Style: ${activeHeadingStyle}`);
    }

    messageLines.push(`Quantity: ${qtyText}`);
    messageLines.push(
      `Price: ${product.currency}${effectivePrice.toLocaleString('en-IN')}${pricingUnit ? ` ${pricingUnit}` : ''}`
    );
    messageLines.push(`Product Link: ${currentUrl}`);

    return `https://wa.me/${phone}?text=${encodeURIComponent(messageLines.join('\n'))}`;
  }, [
    product,
    currentVariant,
    isCurtain,
    isBlind,
    confirmedHeadingStyles,
    activeHeadingStyle,
    quantity,
    quantityUnit,
    pricingUnit,
    effectivePrice,
    getResolvedSizeLabel,
  ]);

  // Modal WhatsApp URLs
  const getQuoteWhatsAppUrl = () => {
    const phone = ZAIRA_WHATSAPP_NUMBER;
    const productName = product.displayName || product.name;
    const sizeLabel = getResolvedSizeLabel();

    const lines = [
      'Hello Zaira Furnishing,',
      '',
      'I have submitted a Quote Request:',
      quoteRequestNumber ? `Request Ref: ${quoteRequestNumber}` : '',
      `Product: ${productName}`,
      `Category: ${product.categoryName}`,
      currentVariant?.name && product.variations && product.variations.length > 1
        ? `Option: ${currentVariant.name}`
        : '',
      sizeLabel ? `Size/Style: ${sizeLabel}` : '',
      `Quantity: ${quantity} ${quantityUnit}`,
      `Customer Name: ${quoteName}`,
      quoteMessage ? `Notes: ${quoteMessage}` : '',
      '',
      'Please review and share a quote.',
    ].filter(Boolean);

    return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const getMeasurementWhatsAppUrl = () => {
    const phone = ZAIRA_WHATSAPP_NUMBER;
    const productName = product.displayName || product.name;
    const sizeLabel = getResolvedSizeLabel();

    const lines = [
      'Hello Zaira Furnishing,',
      '',
      'I booked an In-Home Measurement Visit:',
      measRequestNumber ? `Request Ref: ${measRequestNumber}` : '',
      `Product: ${productName}`,
      `Category: ${product.categoryName}`,
      sizeLabel ? `Specification: ${sizeLabel}` : '',
      `Customer: ${measName}`,
      `Phone: ${measPhone}`,
      `Address: ${measAddress}`,
      measDate ? `Preferred Date: ${measDate} (${measTimeSlot})` : '',
      measNotes ? `Notes: ${measNotes}` : '',
      '',
      'Please confirm the appointment visit.',
    ].filter(Boolean);

    return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  // Submit quote request
  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteError(null);

    const cleanPhone = quotePhone.replace(/\D/g, '');
    if (!quoteName.trim()) {
      setQuoteError('Please enter your name.');
      return;
    }
    if (cleanPhone.length < 10) {
      setQuoteError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsQuoteSubmitting(true);

    try {
      const sizeLabel = getResolvedSizeLabel();
      const idempotencyKey = `quote_${product.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const fullNotes = [
        quoteMessage.trim(),
        currentVariant?.name ? `Option: ${currentVariant.name}` : '',
        `Requested Qty: ${quantity} ${quantityUnit}`,
      ]
        .filter(Boolean)
        .join(' | ');

      const res = await fetch('/api/quote-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          variantId: currentVariant?.id,
          customerName: quoteName.trim(),
          phone: cleanPhone,
          email: quoteEmail.trim() || undefined,
          message: fullNotes,
          dimensions: sizeLabel,
          quantity,
          idempotencyKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setQuoteError(data.error || 'Failed to submit quote request. Please try again.');
        setIsQuoteSubmitting(false);
        return;
      }

      const generatedNum = data.quoteRequest?.request_number || data.requestNumber || '';
      setQuoteRequestNumber(generatedNum);
      setQuoteSubmitted(true);
    } catch (err: any) {
      console.error('Quote request submission error:', err);
      setQuoteError('Network error occurred while submitting your request. Please try again.');
    } finally {
      setIsQuoteSubmitting(false);
    }
  };

  // Submit measurement request
  const handleSubmitMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    setMeasError(null);

    const cleanPhone = measPhone.replace(/\D/g, '');
    if (!measName.trim()) {
      setMeasError('Please enter your name.');
      return;
    }
    if (cleanPhone.length < 10) {
      setMeasError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!measAddress.trim()) {
      setMeasError('Please enter your address or location.');
      return;
    }

    setIsMeasSubmitting(true);

    try {
      const sizeLabel = getResolvedSizeLabel();
      const idempotencyKey = `meas_${product.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const dimensionsText = sizeLabel || `Approx ${quantity} ${quantityUnit}`;

      const res = await fetch('/api/measurement-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          variantId: currentVariant?.id,
          customerName: measName.trim(),
          phone: cleanPhone,
          email: measEmail.trim() || undefined,
          address: measAddress.trim(),
          preferredDate: measDate,
          preferredTimeSlot: measTimeSlot,
          dimensions: dimensionsText,
          customerNotes: measNotes.trim() || undefined,
          idempotencyKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMeasError(data.error || 'Failed to submit measurement request. Please try again.');
        setIsMeasSubmitting(false);
        return;
      }

      const generatedNum = data.measurementRequest?.request_number || data.requestNumber || '';
      setMeasRequestNumber(generatedNum);
      setMeasSubmitted(true);
    } catch (err: any) {
      console.error('Measurement request submission error:', err);
      setMeasError('Network error occurred while submitting your request. Please try again.');
    } finally {
      setIsMeasSubmitting(false);
    }
  };

  // Share link handler
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2400);
    }
  };

  const isFav = isWishlisted(product.id);

  // Specifications strictly from product data
  const careSpec = product.specifications?.find(
    (s) =>
      s.label.toLowerCase().includes('care') ||
      s.label.toLowerCase().includes('maintenance') ||
      s.label.toLowerCase().includes('cleaning')
  );

  const technicalSpecs = useMemo(() => {
    if (!product.specifications) return [];
    return careSpec ? product.specifications.filter((s) => s !== careSpec) : product.specifications;
  }, [product.specifications, careSpec]);

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#1C1917] selection:bg-[#9A7B56] selection:text-white pb-24 lg:pb-20">

      {/* ──────────────────────────────────────────────────────────
          1. BREADCRUMB NAVIGATION
         ────────────────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-3">
        <ol className="flex items-center gap-1.5 text-[11.5px] sm:text-[12px] text-[#8C827A] flex-wrap list-none p-0 m-0 font-normal">
          <li>
            <Link href="/" className="hover:text-[#1E3A2F] transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-[#C4B9A1]">/</li>
          <li>
            {subcategoryUrl ? (
              <Link href={subcategoryUrl} className="hover:text-[#1E3A2F] transition-colors">
                {subcategoryName}
              </Link>
            ) : (
              <Link href={`/categories/${product.categorySlug}`} className="hover:text-[#1E3A2F] transition-colors">
                {product.categoryName}
              </Link>
            )}
          </li>
          <li aria-hidden="true" className="text-[#C4B9A1]">/</li>
          <li aria-current="page" className="text-[#1E3A2F] font-medium truncate max-w-[220px] sm:max-w-none">
            {product.displayName || product.name}
          </li>
        </ol>
      </nav>

      {/* ──────────────────────────────────────────────────────────
          2. MAIN PRODUCT HERO SHOWROOM (55% GALLERY / 45% SHOPPING PANEL)
         ────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-start">

          {/* ─── LEFT: DOMINANT SHOWROOM PRODUCT GALLERY (55%) ─── */}
          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <div className="flex flex-col lg:flex-row gap-3.5 sm:gap-4 items-start">

              {/* Thumbnails: Desktop (Vertical Column on Left), Mobile (Horizontal Row Below Main Image) */}
              {galleryImages.length > 1 && (
                <div className="order-2 lg:order-1 flex flex-row lg:flex-col gap-2.5 sm:gap-3 shrink-0 overflow-x-auto lg:overflow-visible w-full lg:w-auto scrollbar-none pb-1 lg:pb-0">
                  {galleryImages.map((img, idx) => {
                    const isSelected = activeImage === img;
                    const labels = ['Main product view', 'Room view perspective', 'Fabric & detail texture'];
                    const ariaLabel = labels[idx] || `View product image ${idx + 1}`;
                    return (
                      <button
                        key={img + idx}
                        type="button"
                        onClick={() => handleThumbnailClick(img)}
                        aria-label={ariaLabel}
                        className={`relative w-[70px] h-[70px] sm:w-[76px] sm:h-[76px] lg:w-[82px] lg:h-[82px] rounded-lg overflow-hidden shrink-0 cursor-pointer transition-all duration-200 bg-[#F4EFE6] ${
                          isSelected
                            ? 'border-2 border-[#1E3A2F] ring-2 ring-[#1E3A2F]/20 opacity-100 shadow-2xs'
                            : 'border border-[#E5DEC9] opacity-75 hover:opacity-100 hover:border-[#8C7A6B]'
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${product.displayName || product.name} thumbnail ${idx + 1}`}
                          fill
                          sizes="(max-width: 640px) 70px, (max-width: 1024px) 76px, 82px"
                          className="object-cover object-center"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Main Showroom Image Area (Guaranteed Height, High Aspect Ratio) */}
              <div
                onClick={() => setIsLightboxOpen(true)}
                style={{
                  minHeight: '480px',
                  height: 'clamp(480px, 50vw, 640px)',
                  width: '100%',
                }}
                className="order-1 lg:order-2 relative flex-1 min-w-0 w-full rounded-2xl overflow-hidden bg-[#F4EFE6] border border-[#E8E1D3] cursor-zoom-in group select-none shadow-[0_4px_20px_rgba(28,25,23,0.04)]"
              >
                <Image
                  key={activeImage}
                  src={activeImage}
                  alt={product.displayName || product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 ease-out animate-gallery-fade group-hover:scale-105"
                />

                {/* Showroom Badge in Top-Left (Real Data Only) */}
                <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 pointer-events-none">
                  {product.customMeasurementAvailable ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1E3A2F]/90 backdrop-blur-md text-[#FAF7F2] text-[10.5px] uppercase tracking-wider font-semibold shadow-xs border border-white/10">
                      <Ruler className="w-3.5 h-3.5 text-[#E6C687]" />
                      <span>Free Measurement</span>
                    </div>
                  ) : isCustom ? (
                    <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[#FAF7F2] text-[10.5px] uppercase tracking-wider font-medium border border-white/10 w-fit">
                      <span>Custom Made</span>
                    </div>
                  ) : null}
                </div>

                {/* Floating Top-Right Actions */}
                <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLightboxOpen(true);
                    }}
                    aria-label="View fullscreen image"
                    className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#57534E] hover:text-[#1E3A2F] flex items-center justify-center transition-all shadow-xs backdrop-blur-xs border border-white/80 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    aria-label={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-xs backdrop-blur-xs cursor-pointer hover:scale-105 active:scale-95 border ${isFav
                      ? 'bg-white text-[#B43D3D] border-rose-200'
                      : 'bg-white/90 hover:bg-white text-[#57534E] hover:text-[#B43D3D] border-white/80'
                      }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-colors ${isFav ? 'fill-[#B43D3D] text-[#B43D3D]' : 'text-[#57534E]'
                        }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare();
                    }}
                    aria-label="Share product link"
                    className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#57534E] hover:text-[#1E3A2F] flex items-center justify-center transition-all shadow-xs backdrop-blur-xs border border-white/80 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Left / Right Arrow Navigation */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage();
                      }}
                      aria-label="Previous image"
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1E3A2F] shadow-sm flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer backdrop-blur-xs"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage();
                      }}
                      aria-label="Next image"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1E3A2F] shadow-sm flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer backdrop-blur-xs"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Image Counter Badge */}
                {galleryImages.length > 1 && (
                  <div className="absolute bottom-3.5 right-3.5 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium tracking-wider pointer-events-none">
                    {currentImgIdx + 1} / {galleryImages.length}
                  </div>
                )}

                {/* Share Toast */}
                {copiedLink && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 rounded-full bg-[#1E3A2F] text-white text-[11px] font-medium shadow-md">
                    Link copied to clipboard
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── RIGHT: MODERN E-COMMERCE SHOPPING PANEL (45%) ─── */}
          <div className="lg:col-span-5 flex flex-col">

            {/* 1. Category Eyebrow */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#9A7B56]">
                {subcategoryName || product.categoryName}
              </span>
            </div>

            {/* 2. Product Name */}
            <h1 className="font-serif text-[28px] sm:text-[32px] lg:text-[36px] font-normal text-[#1E3A2F] tracking-tight leading-[1.15] mb-2.5">
              {product.displayName || product.name}
            </h1>

            {/* 3. Short Description */}
            {product.shortDescription && (
              <p className="text-[14px] sm:text-[14.5px] text-[#57534E] leading-relaxed mb-4 font-normal">
                {product.shortDescription}
              </p>
            )}

            {/* 4. Real Price Display (Strictly from Product Data) */}
            <div className="pb-4 mb-5 border-b border-[#EAE4D8]">
              <div className="flex items-baseline gap-2 flex-wrap">
                {product.startingPrice && (
                  <span className="text-[11.5px] uppercase tracking-wider font-semibold text-[#8C827A]">
                    From
                  </span>
                )}
                <span className="font-serif text-[30px] sm:text-[34px] font-semibold text-[#1E3A2F] tracking-tight leading-none">
                  {product.currency}{effectivePrice.toLocaleString('en-IN')}
                </span>
                {pricingUnit && (
                  <span className="text-[14px] text-[#78716C] font-normal">
                    {pricingUnit}
                  </span>
                )}
                <span className="text-[11.5px] text-[#8C827A] ml-auto">
                  Inclusive of all taxes
                </span>
              </div>

              {quantity > 1 && (
                <div className="mt-2 text-[12px] text-[#78716C]">
                  Estimated Subtotal: <strong className="font-semibold text-[#1E3A2F] text-[13px]">₹{(effectivePrice * quantity).toLocaleString('en-IN')}</strong> for {quantity} {quantityUnit}
                </div>
              )}
            </div>

            {/* 5. Real Product Options (Strictly From Product Data) */}

            {/* ─── Curtains: Heading Style (Fixed Product Specification) ─── */}
            {isCurtain && (
              <div className="mb-5 space-y-1">
                <span className="block text-[11px] uppercase tracking-wider font-semibold text-[#8C827A]">
                  Heading Style
                </span>
                <p className="text-[14px] sm:text-[14.5px] font-medium text-[#1E3A2F]">
                  French Pinch Pleat
                </p>
              </div>
            )}

            {/* ─── Curtains / Blinds: Custom Dimensions (When Made to Measure) ─── */}
            {(isCurtain || isBlind) && isCustom && (
              <div className="mb-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#1C1917]">
                    Dimensions
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSizeType('standard')}
                      className={`text-[11px] font-medium px-2 py-0.5 rounded cursor-pointer transition-colors ${sizeType === 'standard'
                        ? 'bg-[#1E3A2F] text-white'
                        : 'text-[#78716C] hover:text-[#1E3A2F]'
                        }`}
                    >
                      Standard
                    </button>
                    <button
                      type="button"
                      onClick={() => setSizeType('custom')}
                      className={`text-[11px] font-medium px-2 py-0.5 rounded cursor-pointer transition-colors ${sizeType === 'custom'
                        ? 'bg-[#1E3A2F] text-white'
                        : 'text-[#78716C] hover:text-[#1E3A2F]'
                        }`}
                    >
                      Custom Size
                    </button>
                  </div>
                </div>

                {sizeType === 'custom' && (
                  <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-white border border-[#E0D7C6] animate-in fade-in duration-150">
                    <div>
                      <label className="block text-[10.5px] text-[#78716C] mb-1 font-medium">
                        Width (inches)
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="300"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(e.target.value)}
                        className="w-full h-8.5 text-[12px] px-2.5 rounded-lg border border-[#D5CCBA] focus:border-[#1E3A2F] bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] text-[#78716C] mb-1 font-medium">
                        Height / Drop (inches)
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="300"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(e.target.value)}
                        className="w-full h-8.5 text-[12px] px-2.5 rounded-lg border border-[#D5CCBA] focus:border-[#1E3A2F] bg-white outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── Real Color/Pattern/Size Variants From Product Data ─── */}
            {product.variations && product.variations.length > 1 && (
              <div className="mb-5">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#1C1917]">
                    {variantLabel}
                  </span>
                  <span className="text-[12px] text-[#9A7B56] font-medium">
                    {currentVariant?.name}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.variations.map((variant, idx) => {
                    const isSelected = selectedVariantIdx === idx;
                    const variantImg = variant.thumbnailImage || variant.image;

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => handleSelectVariant(idx)}
                        className={`group relative flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${isSelected
                          ? 'border-[#1E3A2F] bg-white ring-1.5 ring-[#1E3A2F] shadow-2xs font-medium text-[#1E3A2F]'
                          : 'border-[#EDE8DE] bg-white/70 hover:bg-white hover:border-[#9A7B56] text-[#57534E]'
                          }`}
                      >
                        {variantImg ? (
                          <div className="relative w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-black/10">
                            <Image
                              src={variantImg}
                              alt={variant.name}
                              fill
                              sizes="28px"
                              className="object-cover"
                            />
                          </div>
                        ) : variant.colorHex ? (
                          <span
                            className="w-7 h-7 rounded-lg border border-black/15 shadow-2xs shrink-0"
                            style={{ backgroundColor: variant.colorHex }}
                          />
                        ) : (
                          <span className="w-7 h-7 rounded-lg bg-[#F5EFE4] border border-[#E5DEC9] flex items-center justify-center text-[10px] font-serif text-[#1E3A2F]">
                            {idx + 1}
                          </span>
                        )}
                        <span className="text-[11.5px] truncate max-w-[120px]">{variant.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. Quantity Stepper */}
            <div className="flex items-center justify-between mb-5 pb-5 border-b border-[#EAE4D8]">
              <div>
                <span className="block text-[11px] uppercase tracking-wider font-semibold text-[#1C1917]">
                  Quantity ({quantityUnit})
                </span>
                <span className="text-[11.5px] text-[#78716C]">
                  {quantity > 1
                    ? `${quantity} ${quantityUnit} • ₹${(effectivePrice * quantity).toLocaleString('en-IN')}`
                    : `Single ${quantityUnit}`}
                </span>
              </div>

              <div className="inline-flex items-center border border-[#D5CCBA] rounded-xl bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="w-9 h-9 flex items-center justify-center text-[#57534E] hover:text-[#1E3A2F] hover:bg-[#FAF7F2] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3.5 min-w-[50px] text-center text-[13px] font-semibold text-[#1E3A2F] select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-9 h-9 flex items-center justify-center text-[#57534E] hover:text-[#1E3A2F] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 7. Action Buttons (Strictly by Product Type) */}
            <div className="space-y-2.5 mb-6">
              {!isCustom ? (
                /* ─── STANDARD PRODUCTS: ADD TO CART & BUY NOW ─── */
                <>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`w-full h-12 rounded-xl font-semibold text-[12px] uppercase tracking-[0.14em] transition-all duration-200 flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] cursor-pointer ${addedNotice
                      ? 'bg-[#15803D] text-white'
                      : 'bg-[#1E3A2F] hover:bg-[#152B23] text-white'
                      }`}
                  >
                    {addedNotice ? (
                      <>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 stroke-[2]" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      disabled={isBuyingNow}
                      className="h-10.5 rounded-xl font-semibold text-[11px] uppercase tracking-wider border border-[#1E3A2F] text-[#1E3A2F] bg-white hover:bg-[#FAF7F2] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-75"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-[#1E3A2F]" />
                      <span>{isBuyingNow ? 'Proceeding...' : 'Buy Now'}</span>
                    </button>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10.5 rounded-xl border border-[#25D366] bg-white hover:bg-[#25D366]/5 text-[#15803D] text-[11px] uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>Order on WhatsApp</span>
                    </a>
                  </div>
                </>
              ) : (
                /* ─── CUSTOM / MADE TO MEASURE PRODUCTS: REQUEST QUOTE & MEASUREMENT ─── */
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsQuoteModalOpen(true);
                      setQuoteSubmitted(false);
                      setQuoteError(null);
                    }}
                    className="w-full h-12 rounded-xl font-semibold text-[12px] uppercase tracking-[0.14em] bg-[#1E3A2F] hover:bg-[#152B23] text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-[#C4B9A1]" />
                    <span>Request a Quote</span>
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.customMeasurementAvailable && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsMeasurementModalOpen(true);
                          setMeasSubmitted(false);
                          setMeasError(null);
                        }}
                        className="h-10.5 rounded-xl font-semibold text-[11px] uppercase tracking-wider border border-[#1E3A2F] text-[#1E3A2F] bg-white hover:bg-[#FAF7F2] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs hover:border-[#152B23]"
                      >
                        <Ruler className="w-3.5 h-3.5 text-[#9A7B56]" />
                        <span>Book Free Measurement</span>
                      </button>
                    )}

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`h-10.5 rounded-xl border border-[#25D366] bg-white hover:bg-[#25D366]/5 text-[#15803D] text-[11px] uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${!product.customMeasurementAvailable ? 'sm:col-span-2' : ''
                        }`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>Order on WhatsApp</span>
                    </a>
                  </div>
                </>
              )}
            </div>

            {/* 8. Service Reassurance (Strictly Real Supported Services) */}
            <div className="border-t border-b border-[#EDE8DE] py-3.5 mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-[#EDE8DE] text-center">
                {product.customMeasurementAvailable && (
                  <div className="px-2">
                    <Ruler className="w-4 h-4 mx-auto mb-1 text-[#9A7B56]" />
                    <span className="block text-[11.5px] font-semibold text-[#1E3A2F] leading-tight">Free Measurement</span>
                    <span className="block text-[10px] text-[#78716C] mt-0.5">In-home visit</span>
                  </div>
                )}
                {isCustom && (
                  <div className="px-2">
                    <Scissors className="w-4 h-4 mx-auto mb-1 text-[#9A7B56]" />
                    <span className="block text-[11.5px] font-semibold text-[#1E3A2F] leading-tight">Custom Tailoring</span>
                    <span className="block text-[10px] text-[#78716C] mt-0.5">Made to measure</span>
                  </div>
                )}
                <div className="px-2">
                  <MessageCircle className="w-4 h-4 mx-auto mb-1 text-[#9A7B56]" />
                  <span className="block text-[11.5px] font-semibold text-[#1E3A2F] leading-tight">WhatsApp Support</span>
                  <span className="block text-[10px] text-[#78716C] mt-0.5">Direct team assistance</span>
                </div>
              </div>
            </div>

            {/* 9. Product Details & Specifications (Strictly Real Data) */}
            <div className="divide-y divide-[#EAE4D8] border-t border-b border-[#EAE4D8]">

              {/* Quick Specs (Only if specifications exist) */}
              {technicalSpecs.length > 0 && (
                <div>
                  <button
                    type="button"
                    onClick={() => toggleAccordion('specs')}
                    className="w-full flex items-center justify-between py-3.5 text-left cursor-pointer hover:text-[#1E3A2F] transition-colors"
                  >
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-[#1C1917]">
                      Specifications
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#78716C] transition-transform duration-200 ${openAccordions.has('specs') ? 'rotate-180' : ''
                        }`}
                    />
                  </button>
                  {openAccordions.has('specs') && (
                    <div className="pb-3.5">
                      <div className="divide-y divide-[#F2ECE1]">
                        {technicalSpecs.map((s) => (
                          <div key={s.label} className="py-1.5 flex justify-between items-baseline gap-2">
                            <span className="text-[11.5px] text-[#8C827A] font-medium">{s.label}</span>
                            <span className="text-[12px] text-[#1E3A2F] font-medium text-right">{s.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Product Details (Only if description exists) */}
              {product.description && (
                <div>
                  <button
                    type="button"
                    onClick={() => toggleAccordion('details')}
                    className="w-full flex items-center justify-between py-3.5 text-left cursor-pointer hover:text-[#1E3A2F] transition-colors"
                  >
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-[#1C1917]">
                      Product Details
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#78716C] transition-transform duration-200 ${openAccordions.has('details') ? 'rotate-180' : ''
                        }`}
                    />
                  </button>
                  {openAccordions.has('details') && (
                    <div className="pb-3.5 text-[13px] text-[#57534E] leading-relaxed">
                      <p>{product.description}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Care & Maintenance (Only if care spec exists) */}
              {careSpec && (
                <div>
                  <button
                    type="button"
                    onClick={() => toggleAccordion('care')}
                    className="w-full flex items-center justify-between py-3.5 text-left cursor-pointer hover:text-[#1E3A2F] transition-colors"
                  >
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-[#1C1917]">
                      Care &amp; Maintenance
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#78716C] transition-transform duration-200 ${openAccordions.has('care') ? 'rotate-180' : ''
                        }`}
                    />
                  </button>
                  {openAccordions.has('care') && (
                    <div className="pb-3.5 text-[12.5px] text-[#57534E] leading-relaxed">
                      <p className="font-medium text-[#1E3A2F] mb-0.5">{careSpec.label}</p>
                      <p>{careSpec.value}</p>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────
            9B. COMPACT TRUST & BENEFITS ("WHY SHOP FROM ZAIRA?")
           ────────────────────────────────────────────────────────── */}
        <ProductTrustBenefits />

        {/* ──────────────────────────────────────────────────────────
            9C. CUSTOMER REVIEWS
           ────────────────────────────────────────────────────────── */}
        <ProductCustomerReviews
          productId={product.id}
          productSlug={product.slug}
          productName={product.displayName || product.name}
        />

        {/* ──────────────────────────────────────────────────────────
            10. RELATED PRODUCTS ("COMPLETE THE LOOK")
           ────────────────────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="mt-14 sm:mt-18 pt-8 border-t border-[#EAE4D8]">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#9A7B56] font-semibold block mb-1">
                  Curated Collection
                </span>
                <h2 className="font-serif text-[22px] sm:text-[26px] text-[#1E3A2F] font-medium">
                  Complete the Look
                </h2>
              </div>
              {subcategoryUrl && (
                <Link
                  href={subcategoryUrl}
                  className="text-[11.5px] uppercase tracking-wider font-semibold text-[#1E3A2F] hover:text-[#9A7B56] transition-colors inline-flex items-center gap-1"
                >
                  <span>View All {subcategoryName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 4).map((item) => (
                <div key={item.id} className="h-full">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* ──────────────────────────────────────────────────────────
          11. MOBILE STICKY PURCHASE BAR
         ────────────────────────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE4D8] px-4 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="block text-[10px] text-[#8C827A] uppercase tracking-wider font-medium truncate">
            {product.displayName || product.name}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-[17px] font-bold text-[#1E3A2F]">
              {product.currency}{effectivePrice.toLocaleString('en-IN')}
            </span>
            {pricingUnit && (
              <span className="text-[11px] text-[#78716C]">{pricingUnit}</span>
            )}
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          {!isCustom ? (
            <button
              type="button"
              onClick={handleAddToCart}
              className={`h-10 px-4 rounded-xl font-semibold text-[11.5px] uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${addedNotice
                ? 'bg-[#15803D] text-white'
                : 'bg-[#1E3A2F] text-white hover:bg-[#152B23]'
                }`}
            >
              {addedNotice ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsQuoteModalOpen(true);
                setQuoteSubmitted(false);
                setQuoteError(null);
              }}
              className="h-10 px-4 rounded-xl font-semibold text-[11.5px] uppercase tracking-wider bg-[#1E3A2F] text-white hover:bg-[#152B23] transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#C4B9A1]" />
              <span>Request Quote</span>
            </button>
          )}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          12. FULLSCREEN IMAGE LIGHTBOX MODAL
         ────────────────────────────────────────────────────────── */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image Lightbox"
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close fullscreen view"
              className="absolute top-2 right-2 z-10 p-2.5 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="relative w-full h-[75vh] flex items-center justify-center">
              <Image
                src={activeImage}
                alt={product.displayName || product.name}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>

            {galleryImages.length > 1 && (
              <div className="mt-3 text-white/70 text-[12px] font-medium tracking-wider">
                {currentImgIdx + 1} / {galleryImages.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          13. REQUEST A QUOTE MODAL (CUSTOM PRODUCTS)
         ────────────────────────────────────────────────────────── */}
      {isQuoteModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Request a Customized Quote"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-lg bg-[#FAF7F2] rounded-2xl border border-[#EDE8DE] shadow-2xl p-5 sm:p-7 overflow-y-auto max-h-[92vh] text-[#1C1917]">
            <button
              type="button"
              onClick={() => {
                setIsQuoteModalOpen(false);
                setQuoteSubmitted(false);
                setQuoteError(null);
              }}
              className="absolute top-4 right-4 p-2 text-[#78716C] hover:text-[#1C1917] rounded-full hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!quoteSubmitted ? (
              <>
                <div className="mb-5 pr-6">
                  <h3 className="font-serif text-[21px] font-medium text-[#1E3A2F]">
                    Request a Quote
                  </h3>
                  <p className="text-[12.5px] text-[#78716C] mt-1 leading-relaxed">
                    Provide your contact details below and our team will prepare a quotation for you.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="p-3 rounded-xl bg-white border border-[#EAE3D5] mb-5 flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-[#F4EFE6]">
                    <Image
                      src={activeImage}
                      alt={product.displayName || product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-medium text-[13px] text-[#1E3A2F] truncate">
                      {product.displayName || product.name}
                    </span>
                    <span className="block text-[11px] text-[#78716C]">
                      Qty: {quantity} {quantityUnit} • {getResolvedSizeLabel()}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmitQuote} className="space-y-3.5">
                  {quoteError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[12px] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{quoteError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-medium text-[#44403C] uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C827A]" />
                      <input
                        type="text"
                        required
                        value={quoteName}
                        onChange={(e) => setQuoteName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#D5CCBA] focus:border-[#1E3A2F] bg-white text-[12.5px] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#44403C] uppercase tracking-wider mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C827A]" />
                        <input
                          type="tel"
                          required
                          value={quotePhone}
                          onChange={(e) => setQuotePhone(e.target.value)}
                          placeholder="10-digit phone number"
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#D5CCBA] focus:border-[#1E3A2F] bg-white text-[12.5px] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#44403C] uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C827A]" />
                        <input
                          type="email"
                          value={quoteEmail}
                          onChange={(e) => setQuoteEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#D5CCBA] focus:border-[#1E3A2F] bg-white text-[12.5px] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#44403C] uppercase tracking-wider mb-1">
                      Notes / Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={quoteMessage}
                      onChange={(e) => setQuoteMessage(e.target.value)}
                      placeholder="Specify dimensions, room type, or specific requirements..."
                      className="w-full p-3 rounded-xl border border-[#D5CCBA] focus:border-[#1E3A2F] bg-white text-[12.5px] outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isQuoteSubmitting}
                      className="w-full h-11 rounded-xl bg-[#1E3A2F] hover:bg-[#152B23] text-white text-[12px] uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                    >
                      {isQuoteSubmitting ? (
                        <span>Submitting Request...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-[#E6C687]" />
                          <span>Submit Quote Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-6 animate-in fade-in duration-200">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#15803D] flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="font-serif text-[22px] font-medium text-[#1E3A2F] mb-1">
                  Quote Request Received
                </h3>
                <p className="text-[13px] text-[#57534E] mb-2">
                  Thank you, <strong>{quoteName}</strong>. Our team will contact you shortly with your quotation.
                </p>
                {quoteRequestNumber && (
                  <p className="text-[11.5px] text-[#8C827A] mb-5">
                    Reference Number: <strong className="font-mono text-[#1E3A2F]">{quoteRequestNumber}</strong>
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
                  <a
                    href={getQuoteWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 px-5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-[11.5px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send on WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setIsQuoteModalOpen(false);
                      setQuoteSubmitted(false);
                    }}
                    className="h-10 px-5 rounded-xl border border-[#D5CCBA] text-[#1E3A2F] hover:bg-[#FAF7F2] text-[11.5px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          14. BOOK FREE MEASUREMENT MODAL (ONLY IF AVAILABLE)
         ────────────────────────────────────────────────────────── */}
      {isMeasurementModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Book Free Measurement Visit"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-lg bg-[#FAF7F2] rounded-2xl border border-[#EDE8DE] shadow-2xl p-5 sm:p-7 overflow-y-auto max-h-[92vh] text-[#1C1917]">
            <button
              type="button"
              onClick={() => {
                setIsMeasurementModalOpen(false);
                setMeasSubmitted(false);
                setMeasError(null);
              }}
              className="absolute top-4 right-4 p-2 text-[#78716C] hover:text-[#1C1917] rounded-full hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!measSubmitted ? (
              <>
                <div className="mb-5 pr-6">
                  <h3 className="font-serif text-[21px] font-medium text-[#1E3A2F]">
                    Book Free Measurement
                  </h3>
                  <p className="text-[12.5px] text-[#78716C] mt-1 leading-relaxed">
                    Schedule an in-home visit from our measurement specialist.
                  </p>
                </div>

                <form onSubmit={handleSubmitMeasurement} className="space-y-3.5">
                  {measError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[12px] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{measError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-medium text-[#44403C] uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C827A]" />
                      <input
                        type="text"
                        required
                        value={measName}
                        onChange={(e) => setMeasName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#D5CCBA] focus:border-[#1E3A2F] bg-white text-[12.5px] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#44403C] uppercase tracking-wider mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C827A]" />
                        <input
                          type="tel"
                          required
                          value={measPhone}
                          onChange={(e) => setMeasPhone(e.target.value)}
                          placeholder="10-digit phone number"
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#D5CCBA] focus:border-[#1E3A2F] bg-white text-[12.5px] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#44403C] uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C827A]" />
                        <input
                          type="email"
                          value={measEmail}
                          onChange={(e) => setMeasEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#D5CCBA] focus:border-[#1E3A2F] bg-white text-[12.5px] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#44403C] uppercase tracking-wider mb-1">
                      Address / Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#8C827A]" />
                      <textarea
                        required
                        rows={2}
                        value={measAddress}
                        onChange={(e) => setMeasAddress(e.target.value)}
                        placeholder="Your residential address or locality"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D5CCBA] focus:border-[#1E3A2F] bg-white text-[12.5px] outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#44403C] uppercase tracking-wider mb-1">
                        Preferred Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C827A]" />
                        <input
                          type="date"
                          value={measDate}
                          onChange={(e) => setMeasDate(e.target.value)}
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#D5CCBA] focus:border-[#1E3A2F] bg-white text-[12.5px] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#44403C] uppercase tracking-wider mb-1">
                        Preferred Time
                      </label>
                      <select
                        value={measTimeSlot}
                        onChange={(e) => setMeasTimeSlot(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-[#D5CCBA] focus:border-[#1E3A2F] bg-white text-[12.5px] outline-none cursor-pointer"
                      >
                        <option value="Morning (10:00 AM – 1:00 PM)">Morning (10:00 AM – 1:00 PM)</option>
                        <option value="Afternoon (1:00 PM – 4:00 PM)">Afternoon (1:00 PM – 4:00 PM)</option>
                        <option value="Evening (4:00 PM – 7:00 PM)">Evening (4:00 PM – 7:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#44403C] uppercase tracking-wider mb-1">
                      Notes
                    </label>
                    <textarea
                      rows={2}
                      value={measNotes}
                      onChange={(e) => setMeasNotes(e.target.value)}
                      placeholder="Any specific instructions for our specialist..."
                      className="w-full p-3 rounded-xl border border-[#D5CCBA] focus:border-[#1E3A2F] bg-white text-[12.5px] outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isMeasSubmitting}
                      className="w-full h-11 rounded-xl bg-[#1E3A2F] hover:bg-[#152B23] text-white text-[12px] uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                    >
                      {isMeasSubmitting ? (
                        <span>Submitting Request...</span>
                      ) : (
                        <>
                          <Ruler className="w-3.5 h-3.5 text-[#E6C687]" />
                          <span>Confirm Measurement Visit</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-6 animate-in fade-in duration-200">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#15803D] flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="font-serif text-[22px] font-medium text-[#1E3A2F] mb-1">
                  Measurement Visit Scheduled
                </h3>
                <p className="text-[13px] text-[#57534E] mb-2">
                  Thank you, <strong>{measName}</strong>. Our team will contact you to confirm the appointment.
                </p>
                {measRequestNumber && (
                  <p className="text-[11.5px] text-[#8C827A] mb-5">
                    Appointment Reference: <strong className="font-mono text-[#1E3A2F]">{measRequestNumber}</strong>
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
                  <a
                    href={getMeasurementWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 px-5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-[11.5px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send on WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMeasurementModalOpen(false);
                      setMeasSubmitted(false);
                    }}
                    className="h-10 px-5 rounded-xl border border-[#D5CCBA] text-[#1E3A2F] hover:bg-[#FAF7F2] text-[11.5px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
