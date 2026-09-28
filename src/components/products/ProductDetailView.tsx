'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  Heart,
  Check,
  ShoppingBag,
  MessageCircle,
  ChevronDown,
  Ruler,
  Share2,
  Minus,
  Plus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Layers,
  Clock,
  FileText,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  X,
  Send,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Product } from '@/lib/data/types';
import { useStore } from '@/lib/context/StoreContext';
import { ProductCard } from '@/components/ui/ProductCard';
import { getCurtainTypeBySlug } from '@/lib/data/curtains';
import { getBlindTypeBySlug } from '@/lib/data/blinds';
import { getWallpaperTypeBySlug } from '@/lib/data/wallpapers';
import { getCarpetTypeBySlug } from '@/lib/data/carpets';
import { getSofaFabricTypeBySlug } from '@/lib/data/sofa-fabrics';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const router = useRouter();
  const { addToCart, isWishlisted, toggleWishlist, customer, setIsCartOpen } = useStore();

  const isCustom = product.productType === 'custom_made';
  const isCurtain = product.categorySlug === 'curtains-drapes';
  const isBlind = product.categorySlug === 'window-blinds-shades';
  const isWallpaper = product.categorySlug === 'wallpapers-wall-coverings';
  const isCarpet = product.categorySlug === 'carpets-rugs';
  const isSofaFabric = product.categorySlug === 'sofa-fabrics-upholstery';

  // ─── CONFIRMED HEADING/PLEAT STYLES (from product data only) ───
  const confirmedHeadingStyles = useMemo(() => {
    if (!isCurtain || !product.specifications) return [];
    const headingSpec = product.specifications.find(
      (s) =>
        s.label.toLowerCase().includes('heading') ||
        s.label.toLowerCase().includes('pleat') ||
        s.label.toLowerCase().includes('stitch')
    );
    if (!headingSpec || !headingSpec.value) return [];
    return headingSpec.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }, [isCurtain, product.specifications]);

  // ─── DYNAMIC VARIANT LABEL ───
  // Determined from actual product variant data only — never assumed from category.
  const variantLabel = useMemo(() => {
    const vars = product.variations;
    if (!vars || vars.length <= 1) return '';

    // Size indicators — check names and attributes first
    const hasSize =
      product.categorySlug === 'mattresses-sleep-systems' ||
      vars.some(
        (v) =>
          v.name.toLowerCase().includes('king') ||
          v.name.toLowerCase().includes('queen') ||
          v.name.toLowerCase().includes('single') ||
          v.name.toLowerCase().includes('double') ||
          v.name.toLowerCase().includes(' inch') ||
          v.name.toLowerCase().includes('x ') ||
          v.attributes?.Size
      );
    if (hasSize) return 'Select Size:';

    // Colour indicators — from actual variant data (type field or colorHex), not category
    const hasColor = vars.some(
      (v) => v.type === 'color' || v.colorHex
    );
    if (hasColor) return 'Select Colour:';

    // Pattern / design / material — from variant_type in data
    const firstType = vars[0]?.type;
    if (firstType === 'pattern') return 'Select Pattern:';
    if (firstType === 'design') return 'Select Design:';
    if (firstType === 'material') return 'Select Material:';

    return 'Select Option:';
  }, [product]);

  // ─── COLOR & IMAGE GALLERY STATE ───
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const currentVariant = product.variations?.[selectedVariantIdx] || product.variations?.[0];

  // Primary image starts with variant image if present, else product.mainImage
  const [activeImage, setActiveImage] = useState<string>(
    currentVariant?.image || product.mainImage
  );

  // ─── CRITICAL: Reset variant selection and image whenever the product changes ───
  // Prevents cross-product state leak when navigating between product pages.
  // React may reuse this component instance, keeping stale selectedVariantIdx.
  useEffect(() => {
    setSelectedVariantIdx(0);
    const firstVariant = product.variations?.[0];
    setActiveImage(firstVariant?.image || product.mainImage);
  }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Gallery thumbnails: combine all unique images (mainImage, galleryImages, variant images)
  const galleryImages = useMemo(() => {
    const list: string[] = [];
    if (product.mainImage) list.push(product.mainImage);
    if (product.galleryImages) {
      product.galleryImages.forEach((img) => {
        if (!list.includes(img)) list.push(img);
      });
    }
    if (product.variations) {
      product.variations.forEach((v) => {
        if (v.image && !list.includes(v.image)) list.push(v.image);
      });
    }
    return list.length > 0 ? list : [product.mainImage];
  }, [product]);

  // ─── PURCHASE / CUSTOMIZATION OPTIONS STATE ───
  const [sizeType, setSizeType] = useState<'standard' | 'custom'>('standard');
  const [customWidth, setCustomWidth] = useState('60');
  const [customHeight, setCustomHeight] = useState('96');
  const [selectedStitching, setSelectedStitching] = useState('');
  const activeStitching = selectedStitching || confirmedHeadingStyles[0] || '';
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Stage 2 & 3: MODAL FLOWS STATE
  // Quote Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteName, setQuoteName] = useState(customer?.name || '');
  const [quotePhone, setQuotePhone] = useState(customer?.phone || '');
  const [quoteEmail, setQuoteEmail] = useState(customer?.email || '');
  const [quoteMessage, setQuoteMessage] = useState('');
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteRequestNumber, setQuoteRequestNumber] = useState<string | null>(null);
  const [isQuoteSubmitting, setIsQuoteSubmitting] = useState(false);

  // Measurement Modal State
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

  const [minBookingDate, setMinBookingDate] = useState('');
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setMinBookingDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  // ─── ACCORDIONS STATE ───
  const [openSection, setOpenSection] = useState<string | null>('desc');

  // Subcategory metadata resolution for breadcrumbs
  const curtainType = useMemo(
    () => (isCurtain && product.curtainType ? getCurtainTypeBySlug(product.curtainType) : null),
    [isCurtain, product.curtainType]
  );
  const blindType = useMemo(
    () => (isBlind && product.blindType ? getBlindTypeBySlug(product.blindType) : null),
    [isBlind, product.blindType]
  );
  const wallpaperType = useMemo(
    () => (isWallpaper && product.wallpaperType ? getWallpaperTypeBySlug(product.wallpaperType) : null),
    [isWallpaper, product.wallpaperType]
  );
  const carpetType = useMemo(
    () => (isCarpet && product.carpetType ? getCarpetTypeBySlug(product.carpetType) : null),
    [isCarpet, product.carpetType]
  );
  const sofaFabricType = useMemo(
    () => (isSofaFabric && product.sofaFabricType ? getSofaFabricTypeBySlug(product.sofaFabricType) : null),
    [isSofaFabric, product.sofaFabricType]
  );

  const subcategoryName =
    curtainType?.name ||
    blindType?.name ||
    wallpaperType?.name ||
    carpetType?.name ||
    sofaFabricType?.name;

  const subcategoryUrl =
    curtainType ? `/categories/curtains/${curtainType.slug}` :
    blindType ? `/categories/blinds/${blindType.slug}` :
    wallpaperType ? `/categories/wallpapers/${wallpaperType.slug}` :
    carpetType ? `/categories/carpets/${carpetType.slug}` :
    sofaFabricType ? `/categories/sofa-fabrics/${sofaFabricType.slug}` :
    null;

  // ─── COLOR SELECTION HANDLER (swaps large image) ───
  const handleSelectColor = (idx: number) => {
    setSelectedVariantIdx(idx);
    const variant = product.variations?.[idx];
    if (variant?.image) {
      setActiveImage(variant.image);
    }
  };

  // ─── THUMBNAIL CLICK HANDLER ───
  const handleThumbnailClick = (img: string) => {
    setActiveImage(img);
    if (product.variations) {
      const matchedIdx = product.variations.findIndex(
        (v) => v.image === img || v.images?.includes(img)
      );
      if (matchedIdx >= 0) {
        setSelectedVariantIdx(matchedIdx);
      }
    }
  };

  // ─── RESOLVE SIZE LABEL HELPER ───
  const getResolvedSizeLabel = () => {
    if (isCurtain || isBlind) {
      return sizeType === 'custom'
        ? `Custom (${customWidth}″W × ${customHeight}″H)`
        : 'Standard Size';
    }
    if (isSofaFabric) {
      return `${quantity} Metre${quantity > 1 ? 's' : ''}`;
    }
    if (currentVariant?.attributes?.Size) {
      return currentVariant.attributes.Size;
    }
    return 'Standard Size';
  };

  // ─── ADD TO CART HANDLER (STANDARD PRODUCTS) ───
  const handleAddToCart = async () => {
    const sizeLabel = getResolvedSizeLabel();

    await addToCart({
      productId: product.id,
      variantId: currentVariant?.id,
      name: product.displayName || product.name,
      slug: product.slug,
      image: activeImage,
      variantName: currentVariant?.name,
      sku: currentVariant?.sku || product.id,
      sizeLabel,
      headingStyle: isCurtain && confirmedHeadingStyles.length > 0 ? activeStitching : undefined,
      customDimensions:
        sizeType === 'custom' ? `${customWidth}″ Width × ${customHeight}″ Height` : undefined,
      quantity,
      unitPrice: product.price,
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2800);
  };

  // ─── BUY NOW HANDLER (STANDARD PRODUCTS) ───
  const handleBuyNow = async () => {
    if (isBuyingNow) return;
    setIsBuyingNow(true);

    try {
      const sizeLabel = getResolvedSizeLabel();

      await addToCart({
        productId: product.id,
        variantId: currentVariant?.id,
        name: product.displayName || product.name,
        slug: product.slug,
        image: activeImage,
        variantName: currentVariant?.name,
        sku: currentVariant?.sku || product.id,
        sizeLabel,
        headingStyle: isCurtain && confirmedHeadingStyles.length > 0 ? activeStitching : undefined,
        customDimensions:
          sizeType === 'custom' ? `${customWidth}″ Width × ${customHeight}″ Height` : undefined,
        quantity,
        unitPrice: product.price,
      });

      // Close cart drawer if opened by addToCart and redirect straight to checkout
      setIsCartOpen(false);
      router.push('/checkout');
    } catch (err) {
      console.error('Buy Now navigation failed:', err);
      setIsBuyingNow(false);
    }
  };

  // ─── STANDARDIZED WHATSAPP URL (PRESERVES CONFIG PHONE: 916300145763) ───
  const whatsappUrl = useMemo(() => {
    const phone = '916300145763';
    const productName = product.displayName || product.name;
    const currentUrl =
      typeof window !== 'undefined'
        ? window.location.href
        : `https://zairafurnishing.com/products/${product.slug}`;

    let qtyText = `${quantity} ${quantity > 1 ? 'units' : 'unit'}`;
    if (isSofaFabric) {
      qtyText = `${quantity} Metre${quantity > 1 ? 's' : ''}`;
    } else if (isCurtain) {
      qtyText = `${quantity} Panel${quantity > 1 ? 's' : ''}`;
    } else if (isWallpaper) {
      qtyText = `${quantity} Roll${quantity > 1 ? 's' : ''}`;
    }

    if (!isCustom) {
      // STANDARD PRODUCT: DIRECT ORDER PLACEMENT ENQUIRY
      const messageLines = [
        'Hello Zaira Furnishing,',
        '',
        `I would like to order: ${productName}`,
        `Category: ${product.categoryName}`,
      ];

      if (currentVariant?.name && product.variations && product.variations.length > 1) {
        const isSizeVariant =
          product.categorySlug === 'mattresses-sleep-systems' ||
          Boolean(currentVariant.attributes?.Size);
        messageLines.push(`${isSizeVariant ? 'Selected Size' : 'Selected Option'}: ${currentVariant.name}`);
      }

      messageLines.push(`Quantity: ${qtyText}`);
      messageLines.push(
        `Price: ${product.currency}${product.price.toLocaleString('en-IN')} (Total: ${product.currency}${(
          product.price * quantity
        ).toLocaleString('en-IN')})`
      );
      messageLines.push(`Product Link: ${currentUrl}`);
      messageLines.push('');
      messageLines.push('Please confirm availability and dispatch details (Cash on Delivery).');

      return `https://wa.me/${phone}?text=${encodeURIComponent(messageLines.join('\n'))}`;
    }

    // CUSTOM / MADE-TO-MEASURE PRODUCT: QUOTATION & SAMPLES ENQUIRY
    const messageLines = [
      'Hello Zaira Furnishing,',
      '',
      `I would like to enquire about bespoke order: ${productName}`,
      `Category: ${product.categoryName}`,
    ];

    if (currentVariant?.name && product.variations && product.variations.length > 0) {
      messageLines.push(`Selected Variant: ${currentVariant.name}`);
    }

    if (isCurtain || isBlind) {
      if (sizeType === 'custom') {
        messageLines.push(`Custom Size: ${customWidth}″ Width × ${customHeight}″ Height`);
      } else {
        messageLines.push('Size: Standard Size');
      }
    }

    if (isCurtain && confirmedHeadingStyles.length > 0 && activeStitching) {
      messageLines.push(`Heading Pleat Style: ${activeStitching}`);
    }

    messageLines.push(`Quantity: ${qtyText}`);
    messageLines.push(
      `Starting Price: ${product.startingPrice ? 'From ' : ''}${product.currency}${product.price.toLocaleString('en-IN')}`
    );
    messageLines.push(`Product Link: ${currentUrl}`);
    messageLines.push('');
    messageLines.push('Please share fabric samples, laser measurement scheduling, and bespoke quotation.');

    return `https://wa.me/${phone}?text=${encodeURIComponent(messageLines.join('\n'))}`;
  }, [
    product,
    currentVariant,
    sizeType,
    customWidth,
    customHeight,
    isCurtain,
    isBlind,
    isSofaFabric,
    isWallpaper,
    isCustom,
    confirmedHeadingStyles,
    activeStitching,
    quantity,
  ]);

  // ─── MODAL SUBMISSION WHATSAPP URLS ───
  const getQuoteWhatsAppUrl = () => {
    const phone = '916300145763';
    const productName = product.displayName || product.name;

    let dimsText = '';
    if (isCurtain || isBlind) {
      dimsText = sizeType === 'custom' ? `${customWidth}″ Width × ${customHeight}″ Height` : 'Standard Size';
    }

    const lines = [
      'Hello Zaira Furnishing,',
      '',
      'I have submitted a Quote Request:',
      quoteRequestNumber ? `Request Ref: ${quoteRequestNumber}` : '',
      `Product: ${productName}`,
      `Category: ${product.categoryName}`,
      currentVariant?.name ? `Variant: ${currentVariant.name}` : '',
      dimsText ? `Dimensions: ${dimsText}` : '',
      `Quantity: ${quantity}`,
      `Customer Name: ${quoteName}`,
      quoteMessage ? `Requirements / Notes: ${quoteMessage}` : '',
      '',
      'Please review and share a tailored quote.',
    ].filter(Boolean);

    return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const getMeasurementWhatsAppUrl = () => {
    const phone = '916300145763';
    const productName = product.displayName || product.name;

    const lines = [
      'Hello Zaira Furnishing,',
      '',
      'I have submitted a Free Measurement Request:',
      measRequestNumber ? `Request Ref: ${measRequestNumber}` : '',
      `Product: ${productName}`,
      `Category: ${product.categoryName}`,
      currentVariant?.name ? `Variant: ${currentVariant.name}` : '',
      `Preferred Date: ${measDate}`,
      `Preferred Time: ${measTimeSlot}`,
      `Address / Location: ${measAddress}`,
      measNotes ? `Notes: ${measNotes}` : '',
      '',
      'Our team will contact you to confirm the visit.',
    ].filter(Boolean);

    return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  // ─── FORM SUBMISSIONS (CONNECTED TO BACKEND) ───
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteError(null);

    if (!quoteName.trim()) {
      setQuoteError('Please enter your full name.');
      return;
    }
    const cleanPhone = quotePhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setQuoteError('Please enter a valid 10-digit phone number.');
      return;
    }
    if ((isCurtain || isBlind) && sizeType === 'custom') {
      if (!customWidth || !customHeight || Number(customWidth) <= 0 || Number(customHeight) <= 0) {
        setQuoteError('Please enter valid width and drop dimensions in inches.');
        return;
      }
    }

    if (isQuoteSubmitting) return;
    setIsQuoteSubmitting(true);

    try {
      const idempotencyKey = `quote_${product.id}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const dimensionsText = (isCurtain || isBlind)
        ? (sizeType === 'custom' ? `${customWidth}″ Width × ${customHeight}″ Height` : 'Standard Size')
        : undefined;

      const customizationDetailsText = (isCurtain && confirmedHeadingStyles.length > 0 && activeStitching)
        ? `Heading Pleat Style: ${activeStitching}`
        : undefined;

      const res = await fetch('/api/quote-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          variantId: currentVariant?.id,
          quantity,
          customerName: quoteName.trim(),
          phone: cleanPhone,
          email: quoteEmail.trim() || undefined,
          dimensions: dimensionsText,
          customizationDetails: customizationDetailsText,
          customerNotes: quoteMessage.trim() || undefined,
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

  const handleMeasurementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMeasError(null);

    if (!measName.trim()) {
      setMeasError('Please enter your full name.');
      return;
    }
    const cleanPhone = measPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setMeasError('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!measAddress.trim()) {
      setMeasError('Please enter your address or location.');
      return;
    }
    if (!measDate) {
      setMeasError('Please select your preferred visit date.');
      return;
    }
    if (!measTimeSlot) {
      setMeasError('Please select a preferred time slot.');
      return;
    }

    if (isMeasSubmitting) return;
    setIsMeasSubmitting(true);

    try {
      const idempotencyKey = `meas_${product.id}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const dimensionsText = (isCurtain || isBlind) && sizeType === 'custom'
        ? `${customWidth}″ Width × ${customHeight}″ Height`
        : undefined;

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
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const toggleAccordion = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const isFav = isWishlisted(product.id);

  const careSpec = product.specifications?.find((s) =>
    s.label.toLowerCase().includes('care')
  );

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#1C1917] selection:bg-[#9A7B56] selection:text-white">
      {/* ─── 1. BREADCRUMBS ─── */}
      <div className="border-b border-[#EAE4D8] bg-[#F7F4EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-[11.5px] sm:text-[12px] text-[#78716C] flex-wrap font-normal">
            <Link href="/" className="hover:text-[#1C1917] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />

            <Link href="/products" className="hover:text-[#1C1917] transition-colors">
              Catalog
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />

            {isCurtain && (
              <>
                <Link href="/categories/curtains" className="hover:text-[#1C1917] transition-colors">
                  Curtains & Drapes
                </Link>
                {curtainType && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
                    <Link
                      href={`/categories/curtains/${curtainType.slug}`}
                      className="hover:text-[#1C1917] transition-colors"
                    >
                      {curtainType.name}
                    </Link>
                  </>
                )}
              </>
            )}

            {isBlind && (
              <>
                <Link href="/categories/blinds" className="hover:text-[#1C1917] transition-colors">
                  Window Blinds
                </Link>
                {blindType && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
                    <Link
                      href={`/categories/blinds/${blindType.slug}`}
                      className="hover:text-[#1C1917] transition-colors"
                    >
                      {blindType.name}
                    </Link>
                  </>
                )}
              </>
            )}

            {isWallpaper && (
              <>
                <Link href="/categories/wallpapers" className="hover:text-[#1C1917] transition-colors">
                  Wallpapers
                </Link>
                {wallpaperType && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
                    <Link
                      href={`/categories/wallpapers/${wallpaperType.slug}`}
                      className="hover:text-[#1C1917] transition-colors"
                    >
                      {wallpaperType.name}
                    </Link>
                  </>
                )}
              </>
            )}

            {isSofaFabric && (
              <>
                <Link href="/categories/sofa-fabrics" className="hover:text-[#1C1917] transition-colors">
                  Sofa Fabrics
                </Link>
                {sofaFabricType && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
                    <Link
                      href={`/categories/sofa-fabrics/${sofaFabricType.slug}`}
                      className="hover:text-[#1C1917] transition-colors"
                    >
                      {sofaFabricType.name}
                    </Link>
                  </>
                )}
              </>
            )}

            {isCarpet && (
              <>
                <Link href="/categories/carpets" className="hover:text-[#1C1917] transition-colors">
                  Carpets & Rugs
                </Link>
                {carpetType && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
                    <Link
                      href={`/categories/carpets/${carpetType.slug}`}
                      className="hover:text-[#1C1917] transition-colors"
                    >
                      {carpetType.name}
                    </Link>
                  </>
                )}
              </>
            )}

            {!isCurtain && !isBlind && !isWallpaper && !isSofaFabric && !isCarpet && (
              <>
                <Link
                  href={`/categories/${product.categorySlug}`}
                  className="hover:text-[#1C1917] transition-colors"
                >
                  {product.categoryName || 'Categories'}
                </Link>
              </>
            )}

            <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
            <span className="text-[#1C1917] font-semibold truncate max-w-[200px] sm:max-w-none">
              {product.displayName || product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ─── 2. MAIN PRODUCT SECTION (2-COL DESKTOP) ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-start">
          
          {/* ─── LEFT: LARGE PRODUCT GALLERY ─── */}
          <div className="lg:col-span-7 flex flex-col gap-3.5 lg:sticky lg:top-24">
            {/* Main Product Image Container */}
            <div className="relative aspect-[4/4.8] sm:aspect-[4/4.5] w-full bg-gradient-to-b from-[#F7F4EE] to-[#EDE7DC] rounded-xl sm:rounded-2xl border border-[#EDE8DE] overflow-hidden shadow-[0_4px_24px_rgba(28,25,23,0.04)]">
              <Image
                src={activeImage}
                alt={product.displayName || product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center transition-all duration-500 ease-out"
              />

              {/* Badges on Image (Top-Left) */}
              <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 pointer-events-none">
                {isCustom ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] font-semibold bg-[#1C1917]/85 text-[#FDFBF7] backdrop-blur-md rounded-sm border border-white/10 shadow-xs">
                    <Sparkles className="w-3 h-3 text-[#9A7B56]" />
                    <span>Custom Made</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] font-semibold bg-[#1E3A2F]/90 text-white backdrop-blur-md rounded-sm border border-white/10 shadow-xs">
                    Ready to Order
                  </span>
                )}
              </div>

              {/* Top Quick Actions (Wishlist & Share) */}
              <div className="absolute top-3.5 right-3.5 z-10 flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  aria-label={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all shadow-xs backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95 ${
                    isFav
                      ? 'bg-white text-[#B43D3D] shadow-md border border-[#EAE4D8]'
                      : 'bg-white/90 hover:bg-white text-[#57534E] hover:text-[#B43D3D] border border-white/60'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isFav ? 'fill-[#B43D3D] text-[#B43D3D]' : 'text-[#57534E]'
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share product link"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#57534E] hover:text-[#1C1917] flex items-center justify-center transition-all shadow-xs backdrop-blur-md border border-white/60 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Toast when link copied */}
              {copiedLink && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#1C1917] text-white text-[11.5px] font-medium shadow-md">
                  Link copied to clipboard!
                </div>
              )}
            </div>

            {/* Clearly Clickable Thumbnails Underneath */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
                {galleryImages.map((img, idx) => {
                  const isSelected = activeImage === img;
                  return (
                    <button
                      key={img + idx}
                      type="button"
                      onClick={() => handleThumbnailClick(img)}
                      aria-label={`View image ${idx + 1}`}
                      className={`relative w-18 h-22 sm:w-20 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0 bg-white cursor-pointer ${
                        isSelected
                          ? 'border-[#1C1917] ring-2 ring-[#9A7B56]/30 shadow-xs opacity-100 scale-102'
                          : 'border-[#EDE8DE] opacity-75 hover:opacity-100 hover:border-[#9A7B56]'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} gallery image ${idx + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover object-center"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ─── RIGHT: PRODUCT INFORMATION & PURCHASE CONTROLS ─── */}
          <div className="lg:col-span-5 flex flex-col pt-0 sm:pt-1">
            {/* Category / Subcategory Eyebrow */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B56]" />
              <span className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.22em] text-[#9A7B56] font-semibold">
                {subcategoryName || product.categoryName}
              </span>
            </div>

            {/* Product Title Heading */}
            <h1 className="font-serif text-[26px] sm:text-[32px] lg:text-[36px] text-[#1C1917] font-medium tracking-tight leading-[1.2] mb-3">
              {product.displayName || product.name}
            </h1>

            {/* Short Product Description */}
            <p className="text-[13.5px] sm:text-[14px] text-[#57534E] leading-relaxed mb-4">
              {product.shortDescription}
            </p>

            {/* Price Area */}
            <div className="mb-5 pb-5 border-b border-[#EDE8DE]">
              <div className="flex items-baseline gap-2">
                {isCustom && product.startingPrice && (
                  <span className="text-[11.5px] sm:text-[12px] font-semibold text-[#8C827A] uppercase tracking-wider">
                    From
                  </span>
                )}
                <span className="font-serif text-[26px] sm:text-[30px] font-bold text-[#1C1917] tracking-tight">
                  {product.currency}{product.price.toLocaleString('en-IN')}
                </span>
                {isCustom && product.startingPrice && (
                  <span className="text-[12px] text-[#78716C] font-normal">
                    {isSofaFabric ? '/ metre' : isCurtain ? '/ panel' : isWallpaper ? '/ roll' : 'onwards'}
                  </span>
                )}
              </div>
              <p className="text-[11.5px] text-[#8C827A] mt-1 font-light">
                {isCurtain && isCustom
                  ? 'Includes standard tailoring & GST. Final price tailored to your exact measurements.'
                  : 'All taxes included. Complimentary white-glove doorstep delivery.'}
              </p>
            </div>

            {/* ─── 3. COLOR / VARIANT SELECTION (Only when multiple confirmed variants exist) ─── */}
            {product.variations && product.variations.length > 1 && (
              <div className="mb-5 pb-5 border-b border-[#EDE8DE]">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11.5px] sm:text-[12px] uppercase tracking-wider font-semibold text-[#1C1917]">
                    {variantLabel}
                  </span>
                  <span className="text-[12px] sm:text-[12.5px] text-[#9A7B56] font-medium">
                    {currentVariant?.name}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.variations.map((variant, idx) => {
                    const isSelected = selectedVariantIdx === idx;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => handleSelectColor(idx)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-[#1C1917] bg-white ring-1 ring-[#1C1917] shadow-xs font-semibold text-[#1C1917]'
                            : 'border-[#EDE8DE] bg-white/70 hover:border-[#9A7B56] hover:bg-white text-[#57534E]'
                        }`}
                      >
                        {variant.colorHex && (
                          <span
                            className={`w-3.5 h-3.5 rounded-full border shadow-2xs transition-transform ${
                              isSelected ? 'scale-110 border-[#1C1917]' : 'border-black/20'
                            }`}
                            style={{ backgroundColor: variant.colorHex }}
                          />
                        )}
                        <span className="text-[12px] sm:text-[12.5px]">{variant.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#1C1917]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ─── 4. CUSTOMIZATION (Curtains & Blinds) ─── */}
            {(isCurtain || isBlind) && (
              <div className="mb-5 pb-5 border-b border-[#EDE8DE]">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11.5px] sm:text-[12px] uppercase tracking-wider font-semibold text-[#1C1917]">
                    Sizing Method:
                  </span>
                  <span className="text-[11.5px] text-[#9A7B56] flex items-center gap-1 font-medium">
                    <Sparkles className="w-3 h-3" />
                    <span>Free Laser Measurement</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mb-3">
                  <button
                    type="button"
                    onClick={() => setSizeType('standard')}
                    className={`py-2.5 px-3 rounded-lg border text-center text-[12px] sm:text-[12.5px] font-medium transition-all cursor-pointer ${
                      sizeType === 'standard'
                        ? 'border-[#1C1917] bg-white ring-1 ring-[#1C1917] font-semibold text-[#1C1917] shadow-xs'
                        : 'border-[#EDE8DE] bg-white/70 text-[#57534E] hover:border-[#9A7B56]'
                    }`}
                  >
                    Standard Size
                  </button>

                  <button
                    type="button"
                    onClick={() => setSizeType('custom')}
                    className={`py-2.5 px-3 rounded-lg border text-center text-[12px] sm:text-[12.5px] font-medium transition-all cursor-pointer ${
                      sizeType === 'custom'
                        ? 'border-[#1C1917] bg-white ring-1 ring-[#1C1917] font-semibold text-[#1C1917] shadow-xs'
                        : 'border-[#EDE8DE] bg-white/70 text-[#57534E] hover:border-[#9A7B56]'
                    }`}
                  >
                    Custom Size (Bespoke)
                  </button>
                </div>

                {/* Standard Size Details (Curtains Only) */}
                {sizeType === 'standard' && isCurtain && (
                  <p className="text-[11.5px] text-[#78716C] bg-white/60 p-2.5 rounded-lg border border-[#EDE8DE] font-light">
                    Standard panel dimensions: <strong>48″ Width × 84″ Drop (Window)</strong> or <strong>48″ Width × 108″ Drop (Door)</strong>.
                  </p>
                )}

                {/* Custom Size Inputs (Inches) */}
                {sizeType === 'custom' && (
                  <div className="p-3.5 rounded-xl bg-white border border-[#EDE8DE] space-y-3 shadow-2xs">
                    <div className="flex items-center gap-2 text-[12px] font-semibold text-[#1C1917]">
                      <Ruler className="w-3.5 h-3.5 text-[#9A7B56]" />
                      <span>Approximate Window Measurements (Inches)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#78716C] font-medium mb-1">
                          Width (inches):
                        </label>
                        <input
                          type="number"
                          min="20"
                          max="300"
                          value={customWidth}
                          onChange={(e) => setCustomWidth(e.target.value)}
                          className="w-full h-10 text-[13px] px-3 rounded-lg border border-[#D8CFBF] focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] bg-[#FAF7F2] outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#78716C] font-medium mb-1">
                          Drop / Height (inches):
                        </label>
                        <input
                          type="number"
                          min="20"
                          max="300"
                          value={customHeight}
                          onChange={(e) => setCustomHeight(e.target.value)}
                          className="w-full h-10 text-[13px] px-3 rounded-lg border border-[#D8CFBF] focus:border-[#1C1917] focus:ring-1 focus:ring-[#1C1917] bg-[#FAF7F2] outline-none transition-all"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-[#8C827A] font-light">
                      Don’t worry about exact millimeter precision — our master tailor will re-verify all dimensions during your complimentary in-home laser measurement visit.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ─── HEADING PLEAT STYLE (Curtains with confirmed styles only) ─── */}
            {isCurtain && confirmedHeadingStyles.length > 0 && (
              <div className="mb-5 pb-5 border-b border-[#EDE8DE]">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11.5px] sm:text-[12px] uppercase tracking-wider font-semibold text-[#1C1917]">
                    Heading Pleat Style:
                  </span>
                  <span className="text-[12px] sm:text-[12.5px] text-[#9A7B56] font-medium">
                    {activeStitching}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {confirmedHeadingStyles.map((style) => {
                    const isSelected = activeStitching === style;
                    return (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setSelectedStitching(style)}
                        className={`py-2 px-2.5 rounded-lg border text-center text-[11.5px] sm:text-[12px] transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#1C1917] bg-white ring-1 ring-[#1C1917] text-[#1C1917] font-semibold shadow-xs'
                            : 'border-[#EDE8DE] bg-white/70 text-[#57534E] hover:border-[#9A7B56]'
                        }`}
                      >
                        {style}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ─── QUANTITY STEPPER ─── */}
            <div className="mb-6 flex items-center justify-between">
              <span className="text-[11.5px] sm:text-[12px] uppercase tracking-wider font-semibold text-[#1C1917]">
                {isSofaFabric
                  ? 'Quantity (Metres):'
                  : isCurtain
                  ? 'Quantity (Panels):'
                  : isWallpaper
                  ? 'Quantity (Rolls):'
                  : 'Quantity:'}
              </span>
              <div className="inline-flex items-center border border-[#E2DBD0] rounded-lg bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-9 h-9 flex items-center justify-center text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-[13px] font-semibold text-[#1C1917]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-9 h-9 flex items-center justify-center text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ─── 5. PURCHASE / ENQUIRY ACTIONS (STAGE 2 DATA-DRIVEN CTAS) ─── */}
            <div className="space-y-2.5 mb-6">
              {isCustom ? (
                /* ─── CUSTOM / MADE-TO-MEASURE PRODUCT CTAS ─── */
                <>
                  {product.customMeasurementAvailable ? (
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* [ Request a Quote ] */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsQuoteModalOpen(true);
                          setQuoteSubmitted(false);
                          setQuoteError(null);
                        }}
                        className="w-full py-3.5 px-3 sm:px-4 rounded-xl font-semibold text-[11.5px] sm:text-[12.5px] uppercase tracking-[0.12em] bg-[#1C1917] hover:bg-[#9A7B56] text-[#FAF7F2] hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-xs active:scale-[0.99] cursor-pointer text-center"
                      >
                        <FileText className="w-4 h-4 text-[#9A7B56]" />
                        <span>Request a Quote</span>
                      </button>

                      {/* [ Book Free Measurement ] */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsMeasurementModalOpen(true);
                          setMeasSubmitted(false);
                          setMeasError(null);
                        }}
                        className="w-full py-3.5 px-3 sm:px-4 rounded-xl font-semibold text-[11.5px] sm:text-[12.5px] uppercase tracking-[0.12em] border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-xs active:scale-[0.99] cursor-pointer text-center bg-white"
                      >
                        <Ruler className="w-4 h-4 text-[#9A7B56]" />
                        <span>Book Free Measurement</span>
                      </button>
                    </div>
                  ) : (
                    /* [ Request a Quote ] (Full Width when measurement not applicable) */
                    <button
                      type="button"
                      onClick={() => {
                        setIsQuoteModalOpen(true);
                        setQuoteSubmitted(false);
                        setQuoteError(null);
                      }}
                      className="w-full py-3.5 px-4 rounded-xl font-semibold text-[12px] sm:text-[12.5px] uppercase tracking-[0.14em] bg-[#1C1917] hover:bg-[#9A7B56] text-[#FAF7F2] hover:text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] cursor-pointer text-center"
                    >
                      <FileText className="w-4 h-4 text-[#9A7B56]" />
                      <span>Request a Quote</span>
                    </button>
                  )}

                  {/* [ Order on WhatsApp ] */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl border border-[#25D366]/40 hover:border-[#25D366] bg-[#25D366]/5 hover:bg-[#25D366]/10 text-[#15803D] text-[12px] sm:text-[12.5px] uppercase tracking-[0.14em] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                    <span>Order on WhatsApp</span>
                  </a>

                  {/* Auxiliary Wishlist Button */}
                  <div className="flex justify-end pt-0.5">
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className="inline-flex items-center gap-1.5 text-[11.5px] text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-[#B43D3D] text-[#B43D3D]' : 'text-[#78716C]'}`} />
                      <span>{isFav ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
                    </button>
                  </div>
                </>
              ) : (
                /* ─── STANDARD PRODUCT CTAS ─── */
                <>
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* [ Add to Cart ] */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`w-full py-3.5 px-3 sm:px-4 rounded-xl font-semibold text-[11.5px] sm:text-[12.5px] uppercase tracking-[0.14em] transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-xs active:scale-[0.99] cursor-pointer border border-[#EDE8DE] ${
                        addedNotice
                          ? 'bg-[#15803D] text-white shadow-sm'
                          : 'bg-white hover:border-[#1C1917] text-[#1C1917]'
                      }`}
                    >
                      {addedNotice ? (
                        <>
                          <Check className="w-4 h-4 stroke-[2.5]" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4 stroke-[2]" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>

                    {/* [ Buy Now ] */}
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      disabled={isBuyingNow}
                      className="w-full py-3.5 px-3 sm:px-4 rounded-xl font-semibold text-[11.5px] sm:text-[12.5px] uppercase tracking-[0.14em] transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-xs active:scale-[0.99] cursor-pointer bg-[#1E3A2F] hover:bg-[#152B23] text-white disabled:opacity-75"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>{isBuyingNow ? 'Proceeding...' : 'Buy Now'}</span>
                    </button>
                  </div>

                  {/* [ Order on WhatsApp ] */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl border border-[#25D366]/40 hover:border-[#25D366] bg-[#25D366]/5 hover:bg-[#25D366]/10 text-[#15803D] text-[12px] sm:text-[12.5px] uppercase tracking-[0.14em] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                    <span>Order on WhatsApp</span>
                  </a>

                  {/* Auxiliary Wishlist Button */}
                  <div className="flex justify-end pt-0.5">
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      className="inline-flex items-center gap-1.5 text-[11.5px] text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-[#B43D3D] text-[#B43D3D]' : 'text-[#78716C]'}`} />
                      <span>{isFav ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Quick Brand Trust Features */}
            <div className="pt-4 border-t border-[#EDE8DE] grid grid-cols-2 gap-3 text-[11.5px] sm:text-[12px] text-[#78716C]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#9A7B56] shrink-0" />
                <span>{isCurtain || isSofaFabric ? '100% Genuine Fabrics' : '100% Certified Materials'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#9A7B56] shrink-0" />
                <span>{product.customMeasurementAvailable ? 'Free In-Home Measurement' : 'Doorstep Delivery'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#9A7B56] shrink-0" />
                <span>{isCustom ? '5–7 Days Handcrafted' : 'Showroom Inspected'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#9A7B56] shrink-0" />
                <span>{isCurtain || isBlind || isSofaFabric || isWallpaper ? 'Doorstep Swatches' : 'Atelier Standard'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 6. EXPANDABLE SPECIFICATIONS & DETAILS ACCORDION ─── */}
        <section className="mt-14 sm:mt-20 pt-10 border-t border-[#EAE4D8] max-w-4xl mx-auto">
          <div className="text-center mb-7">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#9A7B56] font-semibold block mb-1">
              Specifications & Atelier Craftsmanship
            </span>
            <h2 className="font-serif text-[22px] sm:text-[26px] text-[#1C1917] font-medium">
              {(isCurtain || isBlind) && product.customMeasurementAvailable ? 'Product Details & Sizing' : 'Product Details'}
            </h2>
          </div>

          <div className="divide-y divide-[#EDE8DE] border border-[#EDE8DE] bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-2xs">
            {/* Description Accordion */}
            <div className="p-4 sm:p-5">
              <button
                type="button"
                onClick={() => toggleAccordion('desc')}
                className="w-full flex items-center justify-between text-left font-serif text-[16px] sm:text-[17px] font-medium text-[#1C1917] cursor-pointer"
              >
                <span>Full Description & Craftsmanship</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#8C827A] transition-transform duration-200 ${
                    openSection === 'desc' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSection === 'desc' && (
                <div className="mt-3 text-[13.5px] text-[#57534E] leading-relaxed font-light">
                  <p>{product.description}</p>
                </div>
              )}
            </div>

            {/* Material & Fabric Specifications Accordion */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="p-4 sm:p-5">
                <button
                  type="button"
                  onClick={() => toggleAccordion('material')}
                  className="w-full flex items-center justify-between text-left font-serif text-[16px] sm:text-[17px] font-medium text-[#1C1917] cursor-pointer"
                >
                  <span>Technical Specifications & Materials</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8C827A] transition-transform duration-200 ${
                      openSection === 'material' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openSection === 'material' && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[13px] text-[#57534E]">
                    {product.specifications.map((s) => (
                      <div key={s.label} className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#EDE8DE]">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C827A] block mb-0.5">
                          {s.label}
                        </span>
                        <span className="text-[13px] font-medium text-[#1C1917]">
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sizing & Measurement Service Accordion (Curtains & Blinds only) */}
            {(isCurtain || isBlind) && product.customMeasurementAvailable && (
              <div className="p-4 sm:p-5">
                <button
                  type="button"
                  onClick={() => toggleAccordion('size')}
                  className="w-full flex items-center justify-between text-left font-serif text-[16px] sm:text-[17px] font-medium text-[#1C1917] cursor-pointer"
                >
                  <span>Made-to-Measure & Sizing Guidance</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8C827A] transition-transform duration-200 ${
                      openSection === 'size' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openSection === 'size' && (
                  <div className="mt-3 text-[13.5px] text-[#57534E] leading-relaxed space-y-2">
                    <p>
                      Every residential window and living suite is architecturally distinct. Our Hyderabad showroom provides made-to-measure tailoring for all window drops and widths.
                    </p>
                    <p className="text-[#9A7B56] font-medium">
                      • Complimentary in-home laser measurement visit available across Hyderabad.
                    </p>
                    <p>
                      • We bring fabric swatch books directly to your space so you can compare textures against your wall paint and daylight conditions.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Care Instructions Accordion */}
            {careSpec && (
              <div className="p-4 sm:p-5">
                <button
                  type="button"
                  onClick={() => toggleAccordion('care')}
                  className="w-full flex items-center justify-between text-left font-serif text-[16px] sm:text-[17px] font-medium text-[#1C1917] cursor-pointer"
                >
                  <span>Care Guidelines</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8C827A] transition-transform duration-200 ${
                      openSection === 'care' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openSection === 'care' && (
                  <div className="mt-3 text-[13.5px] text-[#57534E] leading-relaxed">
                    <p>{careSpec.value}</p>
                  </div>
                )}
              </div>
            )}

            {/* Delivery & White-Glove Installation Accordion */}
            <div className="p-4 sm:p-5">
              <button
                type="button"
                onClick={() => toggleAccordion('delivery')}
                className="w-full flex items-center justify-between text-left font-serif text-[16px] sm:text-[17px] font-medium text-[#1C1917] cursor-pointer"
              >
                <span>Delivery & Professional Installation</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#8C827A] transition-transform duration-200 ${
                    openSection === 'delivery' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSection === 'delivery' && (
                <div className="mt-3 text-[13.5px] text-[#57534E] leading-relaxed space-y-2">
                  <p>
                    • <strong>Standard Orders:</strong> Carefully packaged and dispatched in 2–4 business days with doorstep delivery.
                  </p>
                  <p>
                    • <strong>Bespoke Tailored Pieces:</strong> Handcrafted to your exact dimensions in 5–7 business days.
                  </p>
                  <p>
                    • <strong>Showroom & Site Visit:</strong> Visit our Puppalguda showroom or request fabric swatches and measurement via WhatsApp.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─── 7. AUTHENTIC SHOWROOM CONSULTATION (No fake reviews) ─── */}
        <section className="mt-14 sm:mt-20 pt-10 border-t border-[#EAE4D8] max-w-4xl mx-auto">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#EDE8DE] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
            <div>
              <span className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.2em] font-semibold text-[#9A7B56] block mb-1">
                Atelier Styling Consultation
              </span>
              <h3 className="font-serif text-[18px] sm:text-[22px] text-[#1C1917] font-medium mb-1.5">
                Questions about fabric weights or measurements?
              </h3>
              <p className="text-[13px] sm:text-[13.5px] text-[#78716C] leading-relaxed max-w-xl">
                Connect directly with our Hyderabad showroom team for curated recommendations, custom measurements, and sample swatches.
              </p>
            </div>
            <a
              href={`https://wa.me/916300145763?text=Hello%20Zaira%20Furnishing%2C%20I%20would%20like%20to%20consult%20about%20${encodeURIComponent(
                product.displayName || product.name
              )}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[11.5px] uppercase tracking-wider font-semibold bg-[#1C1917] hover:bg-[#9A7B56] text-white transition-colors rounded-xl shrink-0"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Consultation</span>
            </a>
          </div>
        </section>

        {/* ─── 8. RELATED PRODUCTS ("YOU MAY ALSO LIKE") ─── */}
        {relatedProducts.length > 0 && (
          <section className="mt-14 sm:mt-20 pt-10 border-t border-[#EAE4D8]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
              <div>
                <span className="text-[10.5px] uppercase tracking-[0.2em] text-[#9A7B56] font-semibold block mb-1">
                  Curated Suggestions
                </span>
                <h2 className="font-serif text-[22px] sm:text-[26px] text-[#1C1917] font-medium">
                  You May Also Like
                </h2>
              </div>
              {subcategoryUrl && (
                <Link
                  href={subcategoryUrl}
                  className="text-[11.5px] sm:text-[12px] uppercase tracking-wider font-semibold text-[#1E3A2F] hover:text-[#9A7B56] transition-colors inline-flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Browse More {subcategoryName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6 items-stretch">
              {relatedProducts.slice(0, 4).map((item) => (
                <div key={item.id} className="h-full">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ─── 9. REQUEST A QUOTE MODAL (CUSTOM PRODUCTS) ─── */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#FAF7F2] rounded-2xl sm:rounded-3xl border border-[#EDE8DE] shadow-2xl p-5 sm:p-7 overflow-y-auto max-h-[92vh] text-[#1C1917]">
            {/* Close Button */}
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
                {/* Modal Header */}
                <div className="mb-5 pr-6">
                  <span className="text-[10.5px] uppercase tracking-[0.2em] font-semibold text-[#9A7B56] block mb-1">
                    Bespoke Atelier Service
                  </span>
                  <h3 className="font-serif text-[20px] sm:text-[23px] font-medium text-[#1C1917]">
                    Request a Customized Quote
                  </h3>
                  <p className="text-[12.5px] text-[#78716C] mt-1 leading-relaxed">
                    Provide your requirements below and our Hyderabad showroom team will prepare an exact bespoke quotation.
                  </p>
                </div>

                {/* Selected Item Summary Card */}
                <div className="mb-5 p-3.5 rounded-xl bg-white border border-[#EDE8DE] flex items-center gap-3.5 shadow-2xs">
                  <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#EAE4D8]">
                    <Image
                      src={activeImage}
                      alt={product.displayName || product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 text-[12px]">
                    <h4 className="font-semibold text-[#1C1917] truncate">
                      {product.displayName || product.name}
                    </h4>
                    <p className="text-[#78716C] text-[11px] truncate">{product.categoryName}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {currentVariant?.name && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-[#FAF7F2] border border-[#EAE4D8] font-medium text-[#57534E]">
                          Variant: {currentVariant.name}
                        </span>
                      )}
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-[#FAF7F2] border border-[#EAE4D8] font-medium text-[#57534E]">
                        Qty: {quantity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleQuoteSubmit} className="space-y-3.5">
                  {quoteError && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[12px] flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{quoteError}</span>
                    </div>
                  )}

                  {/* Dimensions fields (only where relevant: curtains & blinds) */}
                  {(isCurtain || isBlind) && (
                    <div className="p-3 rounded-xl bg-white border border-[#EDE8DE] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11.5px] font-semibold text-[#1C1917] flex items-center gap-1.5">
                          <Ruler className="w-3.5 h-3.5 text-[#9A7B56]" />
                          <span>Window Dimensions (Inches)</span>
                        </span>
                        <span className="text-[10.5px] text-[#78716C]">Approximate</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] text-[#78716C] font-medium mb-1">
                            Width (inches):
                          </label>
                          <input
                            type="number"
                            min="10"
                            max="500"
                            value={customWidth}
                            onChange={(e) => setCustomWidth(e.target.value)}
                            className="w-full h-9 text-[12.5px] px-3 rounded-lg border border-[#D8CFBF] focus:border-[#1C1917] bg-[#FAF7F2] outline-none"
                            placeholder="e.g. 60"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-[#78716C] font-medium mb-1">
                            Drop / Height (inches):
                          </label>
                          <input
                            type="number"
                            min="10"
                            max="500"
                            value={customHeight}
                            onChange={(e) => setCustomHeight(e.target.value)}
                            className="w-full h-9 text-[12.5px] px-3 rounded-lg border border-[#D8CFBF] focus:border-[#1C1917] bg-[#FAF7F2] outline-none"
                            placeholder="e.g. 96"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11.5px] font-semibold text-[#1C1917] mb-1">
                        Your Full Name <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#A8A29E] absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={quoteName}
                          onChange={(e) => setQuoteName(e.target.value)}
                          placeholder="e.g. Priya Sharma"
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#D8CFBF] focus:border-[#1C1917] bg-white text-[12.5px] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11.5px] font-semibold text-[#1C1917] mb-1">
                        Phone Number <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#A8A29E] absolute left-3 top-2.5" />
                        <input
                          type="tel"
                          required
                          value={quotePhone}
                          onChange={(e) => setQuotePhone(e.target.value)}
                          placeholder="10-digit mobile number"
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#D8CFBF] focus:border-[#1C1917] bg-white text-[12.5px] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-semibold text-[#1C1917] mb-1">
                      Email Address <span className="text-[10.5px] text-[#78716C] font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#A8A29E] absolute left-3 top-2.5" />
                      <input
                        type="email"
                        value={quoteEmail}
                        onChange={(e) => setQuoteEmail(e.target.value)}
                        placeholder="e.g. priya@example.com"
                        className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#D8CFBF] focus:border-[#1C1917] bg-white text-[12.5px] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-semibold text-[#1C1917] mb-1">
                      Specific Requirements / Notes <span className="text-[10.5px] text-[#78716C] font-normal">(Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={quoteMessage}
                      onChange={(e) => setQuoteMessage(e.target.value)}
                      placeholder="e.g., Need blackout lining for master bedroom, motorized track option, etc."
                      className="w-full p-3 rounded-xl border border-[#D8CFBF] focus:border-[#1C1917] bg-white text-[12.5px] outline-none resize-none"
                    />
                  </div>

                  <p className="text-[11px] text-[#78716C] leading-normal pt-1">
                    * Cash on delivery & bespoke showroom consultations available across Hyderabad. No obligation.
                  </p>

                  <button
                    type="submit"
                    disabled={isQuoteSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl font-semibold text-[12px] uppercase tracking-[0.14em] bg-[#1C1917] hover:bg-[#9A7B56] text-white transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.99] flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isQuoteSubmitting ? 'Submitting Request...' : 'Submit Quote Request'}</span>
                  </button>
                </form>
              </>
            ) : (
              /* Success / Confirmation Screen */
              <div className="py-4 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div>
                  <h3 className="font-serif text-[22px] font-medium text-[#1C1917]">
                    Your quote request has been received.
                  </h3>
                  <p className="text-[13px] text-[#57534E] mt-1.5 max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong>{quoteName}</strong>. We have received your quotation request for <strong>{product.displayName || product.name}</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#EDE8DE] text-left text-[12px] space-y-1.5 shadow-2xs">
                  {quoteRequestNumber && (
                    <div className="flex justify-between items-center text-[#78716C] pb-1.5 mb-1.5 border-b border-[#F0EBE1]">
                      <span className="font-semibold text-[#1C1917]">Request Number:</span>
                      <span className="font-mono font-bold text-[#9A7B56]">{quoteRequestNumber}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#78716C]">
                    <span>Item:</span>
                    <span className="font-medium text-[#1C1917]">{product.displayName || product.name}</span>
                  </div>
                  {currentVariant?.name && (
                    <div className="flex justify-between text-[#78716C]">
                      <span>Variant:</span>
                      <span className="font-medium text-[#1C1917]">{currentVariant.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#78716C]">
                    <span>Quantity:</span>
                    <span className="font-medium text-[#1C1917]">{quantity}</span>
                  </div>
                  <div className="flex justify-between text-[#78716C]">
                    <span>Phone:</span>
                    <span className="font-medium text-[#1C1917]">{quotePhone}</span>
                  </div>
                </div>

                <p className="text-[11.5px] text-[#78716C] leading-relaxed">
                  Our showroom team will review your specifications and get in touch with you shortly. You may also connect instantly on WhatsApp with your request reference.
                </p>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <a
                    href={getQuoteWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#15803D] text-[12px] font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                    <span>Open in WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setIsQuoteModalOpen(false);
                      setQuoteSubmitted(false);
                    }}
                    className="py-3 px-6 rounded-xl bg-[#1C1917] text-white hover:bg-[#9A7B56] text-[12px] font-semibold uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── 10. BOOK FREE MEASUREMENT MODAL (ONLY WHERE SUPPORTED) ─── */}
      {isMeasurementModalOpen && product.customMeasurementAvailable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#FAF7F2] rounded-2xl sm:rounded-3xl border border-[#EDE8DE] shadow-2xl p-5 sm:p-7 overflow-y-auto max-h-[92vh] text-[#1C1917]">
            {/* Close Button */}
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
                {/* Modal Header */}
                <div className="mb-5 pr-6">
                  <span className="text-[10.5px] uppercase tracking-[0.2em] font-semibold text-[#9A7B56] block mb-1">
                    Atelier In-Home Service
                  </span>
                  <h3 className="font-serif text-[20px] sm:text-[23px] font-medium text-[#1C1917]">
                    Book Free Laser Measurement
                  </h3>
                  <p className="text-[12.5px] text-[#78716C] mt-1 leading-relaxed">
                    Our master tailor visits your residence with physical swatch books and millimeter laser tools. No visit charge.
                  </p>
                </div>

                {/* Selected Item Summary Card */}
                <div className="mb-5 p-3.5 rounded-xl bg-white border border-[#EDE8DE] flex items-center gap-3.5 shadow-2xs">
                  <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#EAE4D8]">
                    <Image
                      src={activeImage}
                      alt={product.displayName || product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 text-[12px]">
                    <h4 className="font-semibold text-[#1C1917] truncate">
                      {product.displayName || product.name}
                    </h4>
                    <p className="text-[#78716C] text-[11px] truncate">{product.categoryName}</p>
                    {currentVariant?.name && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-[#FAF7F2] border border-[#EAE4D8] font-medium text-[#57534E] mt-1">
                        Variant: {currentVariant.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleMeasurementSubmit} className="space-y-3.5">
                  {measError && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[12px] flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{measError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11.5px] font-semibold text-[#1C1917] mb-1">
                        Your Full Name <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#A8A29E] absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={measName}
                          onChange={(e) => setMeasName(e.target.value)}
                          placeholder="e.g. Ramesh Reddy"
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#D8CFBF] focus:border-[#1C1917] bg-white text-[12.5px] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11.5px] font-semibold text-[#1C1917] mb-1">
                        Phone Number <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#A8A29E] absolute left-3 top-2.5" />
                        <input
                          type="tel"
                          required
                          value={measPhone}
                          onChange={(e) => setMeasPhone(e.target.value)}
                          placeholder="10-digit mobile number"
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#D8CFBF] focus:border-[#1C1917] bg-white text-[12.5px] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-semibold text-[#1C1917] mb-1">
                      Address / Location <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#A8A29E] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={measAddress}
                        onChange={(e) => setMeasAddress(e.target.value)}
                        placeholder="e.g., Villa 14, Rainbow Vistas / Jubilee Hills, Hyderabad"
                        className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#D8CFBF] focus:border-[#1C1917] bg-white text-[12.5px] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-semibold text-[#1C1917] mb-1">
                      Email Address <span className="text-[10.5px] text-[#78716C] font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#A8A29E] absolute left-3 top-2.5" />
                      <input
                        type="email"
                        value={measEmail}
                        onChange={(e) => setMeasEmail(e.target.value)}
                        placeholder="e.g. ramesh@example.com"
                        className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#D8CFBF] focus:border-[#1C1917] bg-white text-[12.5px] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11.5px] font-semibold text-[#1C1917] mb-1">
                        Preferred Date <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-[#A8A29E] absolute left-3 top-2.5" />
                        <input
                          type="date"
                          required
                          value={measDate}
                          min={minBookingDate || undefined}
                          onChange={(e) => setMeasDate(e.target.value)}
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#D8CFBF] focus:border-[#1C1917] bg-white text-[12.5px] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11.5px] font-semibold text-[#1C1917] mb-1">
                        Preferred Time Slot <span className="text-rose-600">*</span>
                      </label>
                      <select
                        value={measTimeSlot}
                        onChange={(e) => setMeasTimeSlot(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-[#D8CFBF] focus:border-[#1C1917] bg-white text-[12.5px] outline-none cursor-pointer"
                      >
                        <option value="Morning (10:00 AM – 1:00 PM)">Morning (10:00 AM – 1:00 PM)</option>
                        <option value="Afternoon (1:00 PM – 4:00 PM)">Afternoon (1:00 PM – 4:00 PM)</option>
                        <option value="Evening (4:00 PM – 7:00 PM)">Evening (4:00 PM – 7:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-semibold text-[#1C1917] mb-1">
                      Optional Notes <span className="text-[10.5px] text-[#78716C] font-normal">(e.g., number of rooms, fabric preferences)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={measNotes}
                      onChange={(e) => setMeasNotes(e.target.value)}
                      placeholder="e.g., Need consultation for living room and 2 bedrooms; bring blackout and sheer books."
                      className="w-full p-3 rounded-xl border border-[#D8CFBF] focus:border-[#1C1917] bg-white text-[12.5px] outline-none resize-none"
                    />
                  </div>

                  <p className="text-[11px] text-[#78716C] leading-normal pt-1">
                    * In-home measurements are scheduled by our team upon review.
                  </p>

                  <button
                    type="submit"
                    disabled={isMeasSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl font-semibold text-[12px] uppercase tracking-[0.14em] bg-[#1C1917] hover:bg-[#9A7B56] text-white transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.99] flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Ruler className="w-4 h-4 text-[#9A7B56]" />
                    <span>{isMeasSubmitting ? 'Submitting Request...' : 'Submit Measurement Request'}</span>
                  </button>
                </form>
              </>
            ) : (
              /* Success / Confirmation Screen */
              <div className="py-4 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div>
                  <h3 className="font-serif text-[22px] font-medium text-[#1C1917]">
                    Your measurement request has been received.
                  </h3>
                  <p className="text-[13px] text-[#57534E] mt-1.5 max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong>{measName}</strong>. Our team will contact you to confirm the visit for <strong>{product.displayName || product.name}</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#EDE8DE] text-left text-[12px] space-y-1.5 shadow-2xs">
                  {measRequestNumber && (
                    <div className="flex justify-between items-center text-[#78716C] pb-1.5 mb-1.5 border-b border-[#F0EBE1]">
                      <span className="font-semibold text-[#1C1917]">Request Number:</span>
                      <span className="font-mono font-bold text-[#9A7B56]">{measRequestNumber}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#78716C]">
                    <span>Address / Location:</span>
                    <span className="font-medium text-[#1C1917] truncate max-w-[200px]">{measAddress}</span>
                  </div>
                  <div className="flex justify-between text-[#78716C]">
                    <span>Preferred Date:</span>
                    <span className="font-medium text-[#1C1917]">{measDate}</span>
                  </div>
                  <div className="flex justify-between text-[#78716C]">
                    <span>Preferred Time Slot:</span>
                    <span className="font-medium text-[#1C1917]">{measTimeSlot}</span>
                  </div>
                  <div className="flex justify-between text-[#78716C]">
                    <span>Contact Phone:</span>
                    <span className="font-medium text-[#1C1917]">{measPhone}</span>
                  </div>
                </div>

                <p className="text-[11.5px] text-[#78716C] leading-relaxed">
                  Our team will contact you to confirm the visit and schedule. You may also connect via WhatsApp with your request reference.
                </p>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <a
                    href={getMeasurementWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#15803D] text-[12px] font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                    <span>Share Location via WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMeasurementModalOpen(false);
                      setMeasSubmitted(false);
                    }}
                    className="py-3 px-6 rounded-xl bg-[#1C1917] text-white hover:bg-[#9A7B56] text-[12px] font-semibold uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    Done
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
