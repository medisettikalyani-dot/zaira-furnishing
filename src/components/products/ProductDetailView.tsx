'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  Star,
  Heart,
  Check,
  Truck,
  ShieldCheck,
  Ruler,
  Calendar,
  ArrowRight,
  Minus,
  Plus,
  MessageCircle,
  X,
  ShoppingBag,
  RotateCcw,
  Sparkles,
  MapPin,
  Lock,
  ChevronDown,
  ThumbsUp,
  Share2,
} from 'lucide-react';
import { Product } from '@/lib/data/types';
import { getCurtainTypeBySlug } from '@/lib/data/curtains';
import { getBlindTypeBySlug } from '@/lib/data/blinds';
import { getSofaFabricTypeBySlug } from '@/lib/data/sofa-fabrics';
import { getWallpaperTypeBySlug } from '@/lib/data/wallpapers';
import { getCarpetTypeBySlug } from '@/lib/data/carpets';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

interface CartItem {
  id: string;
  name: string;
  image: string;
  variantName?: string;
  sku: string;
  sizeLabel: string;
  headingStyle?: string;
  customDimensions?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  // ─── VARIANT & GALLERY STATE ───
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    product.variations?.[0]?.image || null
  );
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // ─── SELECTION OPTIONS STATE ───
  const [quantity, setQuantity] = useState(1);
  const [selectedSizeId, setSelectedSizeId] = useState<string>('std-1');
  const [selectedHeading, setSelectedHeading] = useState<string>('French Pinch Pleat');
  const [customWidth, setCustomWidth] = useState<string>('60');
  const [customHeight, setCustomHeight] = useState<string>('96');
  const [customLining, setCustomLining] = useState<string>('Thermal Blackout (+₹450/m)');

  // ─── PIN CODE DELIVERY STATE ───
  const [pinCode, setPinCode] = useState('');
  const [pinChecked, setPinChecked] = useState(false);
  const [pinMessage, setPinMessage] = useState<string | null>(null);

  // ─── ACCORDION & TABS STATE ───
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'care' | 'returns'>('desc');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // ─── CART & CHECKOUT MODAL STATE ───
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [buyNowModalOpen, setBuyNowModalOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  // ─── COD CHECKOUT FORM STATE ───
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerPin, setCustomerPin] = useState('');

  // ─── DERIVED CONSTANTS & CATEGORY DATA ───
  const isCurtain = product.categorySlug === 'curtains-drapes';
  const isBlind = product.categorySlug === 'window-blinds-shades';
  const isSofaFabric = product.categorySlug === 'sofa-fabrics-upholstery';
  const isWallpaper = product.categorySlug === 'wallpapers-wall-coverings';
  const isCarpet = product.categorySlug === 'carpets-rugs';
  const isCustomProduct = product.productType === 'custom_made';
  const currentVariant = product.variations?.[selectedVariantIndex] || product.variations?.[0];

  const curtainTypeData = useMemo(() => {
    if (isCurtain && product.curtainType) {
      return getCurtainTypeBySlug(product.curtainType);
    }
    return undefined;
  }, [isCurtain, product.curtainType]);

  const blindTypeData = useMemo(() => {
    if (isBlind && product.blindType) {
      return getBlindTypeBySlug(product.blindType);
    }
    return undefined;
  }, [isBlind, product.blindType]);

  const sofaFabricTypeData = useMemo(() => {
    if (isSofaFabric && product.sofaFabricType) {
      return getSofaFabricTypeBySlug(product.sofaFabricType);
    }
    return undefined;
  }, [isSofaFabric, product.sofaFabricType]);

  const wallpaperTypeData = useMemo(() => {
    if (isWallpaper && product.wallpaperType) {
      return getWallpaperTypeBySlug(product.wallpaperType);
    }
    return undefined;
  }, [isWallpaper, product.wallpaperType]);

  const carpetTypeData = useMemo(() => {
    if (isCarpet && product.carpetType) {
      return getCarpetTypeBySlug(product.carpetType);
    }
    return undefined;
  }, [isCarpet, product.carpetType]);

  // Gallery images: strictly the product's own authentic gallery images (Image 1, Image 2)
  const galleryImages = useMemo(() => {
    const images: string[] = [];
    if (product.mainImage) images.push(product.mainImage);
    if (product.galleryImages) {
      product.galleryImages.forEach((img) => {
        if (!images.includes(img)) images.push(img);
      });
    }
    return images.length > 0 ? images : [product.mainImage];
  }, [product.mainImage, product.galleryImages]);

  const activeImage = selectedImage || galleryImages[activeImageIndex] || galleryImages[0] || product.mainImage;

  const handleSelectVariant = (idx: number) => {
    setSelectedVariantIndex(idx);
    const variant = product.variations?.[idx];
    if (variant?.image) {
      setSelectedImage(variant.image);
    } else {
      setSelectedImage(product.mainImage);
    }
  };

  const handleSelectThumbnail = (img: string, idx: number) => {
    setActiveImageIndex(idx);
    setSelectedImage(img);
  };

  // ─── DYNAMIC SIZING OPTIONS BASED ON CATEGORY ───
  const sizeOptions = useMemo(() => {
    if (isCurtain) {
      return [
        { id: '5x7', label: '5 × 7 ft', sublabel: 'Window Drop', priceDiff: 0 },
        { id: '6x7', label: '6 × 7 ft', sublabel: 'Wide Window', priceDiff: 450 },
        { id: '7x9', label: '7 × 9 ft', sublabel: 'Standard Door', priceDiff: 1100 },
        { id: '8x10', label: '8 × 10 ft', sublabel: 'Grand High Ceiling', priceDiff: 1850 },
        { id: 'custom', label: 'Custom Dimensions', sublabel: 'Made to Measure', priceDiff: 600 },
      ];
    }
    if (product.categorySlug === 'carpets-rugs') {
      return [
        { id: '5x8', label: '5 × 8 ft', sublabel: 'Accent Area', priceDiff: 0 },
        { id: '6x9', label: '6 × 9 ft', sublabel: 'Living Room', priceDiff: 4200 },
        { id: '8x10', label: '8 × 10 ft', sublabel: 'Dining Expanses', priceDiff: 9500 },
        { id: 'custom', label: 'Custom Dimension', sublabel: 'Bespoke Weave', priceDiff: 2500 },
      ];
    }
    if (product.categorySlug === 'bed-linen-bath') {
      return [
        { id: 'queen', label: 'Queen Bed Set', sublabel: 'Duvet + 2 Shams', priceDiff: 0 },
        { id: 'king', label: 'King Bed Set', sublabel: 'Duvet + 2 King Shams', priceDiff: 850 },
        { id: 'super-king', label: 'Super King Set', sublabel: 'Grand Master Suite', priceDiff: 1400 },
      ];
    }
    if (product.categorySlug === 'window-blinds-shades') {
      return [
        { id: 'win-std', label: 'Standard (4 × 5 ft)', sublabel: 'Window Cassette', priceDiff: 0 },
        { id: 'win-wide', label: 'Wide (6 × 6 ft)', sublabel: 'Patio Sliders', priceDiff: 1950 },
        { id: 'custom', label: 'Custom Dimension', sublabel: 'Laser Measured', priceDiff: 800 },
      ];
    }
    return [];
  }, [isCurtain, product.categorySlug]);

  const selectedSizeObj = sizeOptions.find((s) => s.id === selectedSizeId) || sizeOptions[0];

  // ─── DYNAMIC PRICE CALCULATION ───
  const basePrice = currentVariant?.price || product.price;
  const sizeDiff = selectedSizeObj ? selectedSizeObj.priceDiff : 0;
  const unitPrice = basePrice + sizeDiff;
  const totalPrice = unitPrice * quantity;
  const originalUnitPrice = Math.round(unitPrice * 1.2);
  const originalTotalPrice = originalUnitPrice * quantity;
  const savings = originalTotalPrice - totalPrice;

  // ─── PIN CODE CHECK HANDLER ───
  const handleCheckPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCode || pinCode.trim().length < 6) {
      setPinChecked(true);
      setPinMessage('Please enter a valid 6-digit Indian postal PIN code.');
      return;
    }
    setPinChecked(true);
    setPinMessage(`✓ Delivery available to ${pinCode.trim()}. Estimated delivery in 3–5 business days. Cash on Delivery available.`);
  };

  // ─── SHARE LINK HANDLER ───
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  // ─── WHATSAPP ORDER URL GENERATION ───
  const whatsappUrl = useMemo(() => {
    const phone = '919876543210';
    const sizeDescription =
      selectedSizeId === 'custom'
        ? `Custom Dimensions (${customWidth}″ Width × ${customHeight}″ Drop, Lining: ${customLining})`
        : selectedSizeObj?.label || 'Standard';

    const lines = [
      'Hi Zaira Furnishing,',
      '',
      'I would like to order:',
      '',
      `Product: ${product.displayName || product.name}`,
      `Colour: ${currentVariant?.name || 'Standard'}`,
      `Size: ${sizeDescription}`,
      isCurtain && selectedHeading ? `Heading Style: ${selectedHeading}` : '',
      `Quantity: ${quantity}`,
      `Price: ${product.currency}${totalPrice.toLocaleString('en-IN')}`,
      `Product ID: ${product.id}`,
      `Variant ID: ${currentVariant?.sku || currentVariant?.id || product.id}`,
      '',
      'Please confirm availability and delivery details.',
    ]
      .filter(Boolean)
      .join('\n');

    return `https://wa.me/${phone}?text=${encodeURIComponent(lines)}`;
  }, [
    product,
    currentVariant,
    selectedSizeId,
    selectedSizeObj,
    customWidth,
    customHeight,
    customLining,
    isCurtain,
    selectedHeading,
    quantity,
    totalPrice,
  ]);

  // ─── ADD TO CART HANDLER ───
  const handleAddToCart = () => {
    const sizeDescription =
      selectedSizeId === 'custom'
        ? `Custom (${customWidth}W × ${customHeight}H in)`
        : selectedSizeObj?.label || 'Standard';

    const newItem: CartItem = {
      id: `${product.id}-${selectedVariantIndex}-${selectedSizeId}-${Date.now()}`,
      name: product.displayName || product.name,
      image: activeImage,
      variantName: currentVariant?.name,
      sku: currentVariant?.sku || product.id,
      sizeLabel: sizeDescription,
      headingStyle: isCurtain ? selectedHeading : undefined,
      customDimensions:
        selectedSizeId === 'custom' ? `${customWidth}″W × ${customHeight}″H, ${customLining}` : undefined,
      quantity,
      unitPrice,
      totalPrice,
    };

    setCartItems((prev) => [newItem, ...prev]);
    setCartDrawerOpen(true);
  };

  // ─── BUY NOW HANDLER ───
  const handleBuyNow = () => {
    setBuyNowModalOpen(true);
  };

  // ─── COD ORDER SUBMISSION ───
  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const fakeOrderId = `ZF-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(fakeOrderId);
    setOrderConfirmed(true);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#1C1917] selection:bg-[#9A7B56] selection:text-white">
      {/* ─── 1. DYNAMIC BREADCRUMB ─── */}
      <div className="border-b border-[#EAE4D8] bg-[#F7F4EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <nav className="flex items-center gap-1.5 text-[12px] text-[#78716C] flex-wrap">
            <Link href="/" className="hover:text-[#1C1917] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />

            {isCurtain ? (
              <>
                <Link href="/categories/curtains" className="hover:text-[#1C1917] transition-colors">
                  Curtains & Drapes
                </Link>
                {curtainTypeData && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
                    <Link
                      href={`/categories/curtains/${curtainTypeData.slug}`}
                      className="hover:text-[#1C1917] transition-colors"
                    >
                      {curtainTypeData.name}
                    </Link>
                  </>
                )}
              </>
            ) : isBlind ? (
              <>
                <Link href="/categories/blinds" className="hover:text-[#1C1917] transition-colors">
                  Window Blinds & Shades
                </Link>
                {blindTypeData && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
                    <Link
                      href={`/categories/blinds/${blindTypeData.slug}`}
                      className="hover:text-[#1C1917] transition-colors"
                    >
                      {blindTypeData.name}
                    </Link>
                  </>
                )}
              </>
            ) : isSofaFabric ? (
              <>
                <Link href="/categories/sofa-fabrics" className="hover:text-[#1C1917] transition-colors">
                  Sofa Fabrics & Upholstery
                </Link>
                {sofaFabricTypeData && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
                    <Link
                      href={`/categories/sofa-fabrics/${sofaFabricTypeData.slug}`}
                      className="hover:text-[#1C1917] transition-colors"
                    >
                      {sofaFabricTypeData.name}
                    </Link>
                  </>
                )}
              </>
            ) : isWallpaper ? (
              <>
                <Link href="/categories/wallpapers" className="hover:text-[#1C1917] transition-colors">
                  Wallpapers & Wall Coverings
                </Link>
                {wallpaperTypeData && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
                    <Link
                      href={`/categories/wallpapers/${wallpaperTypeData.slug}`}
                      className="hover:text-[#1C1917] transition-colors"
                    >
                      {wallpaperTypeData.name}
                    </Link>
                  </>
                )}
              </>
            ) : isCarpet ? (
              <>
                <Link href="/categories/carpets" className="hover:text-[#1C1917] transition-colors">
                  Carpets & Rugs
                </Link>
                {carpetTypeData && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
                    <Link
                      href={`/categories/carpets/${carpetTypeData.slug}`}
                      className="hover:text-[#1C1917] transition-colors"
                    >
                      {carpetTypeData.name}
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link href="/categories" className="hover:text-[#1C1917] transition-colors">
                  Categories
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
                <Link
                  href={`/categories?slug=${product.categorySlug}`}
                  className="hover:text-[#1C1917] transition-colors"
                >
                  {product.categoryName}
                </Link>
              </>
            )}

            <ChevronRight className="w-3.5 h-3.5 text-[#A8A29E]" />
            <span className="text-[#1C1917] font-medium truncate max-w-[200px] sm:max-w-none">
              {product.displayName || product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ─── 2. MAIN PRODUCT SECTION (2-COL DESKTOP, STACKED MOBILE) ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* ─── LEFT: IMAGE GALLERY (7 COLS ON DESKTOP) ─── */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 lg:sticky lg:top-24">
            {/* Thumbnail Column */}
            {galleryImages.length > 1 && (
              <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:max-h-[580px] pb-1 sm:pb-0 scrollbar-none shrink-0">
                {galleryImages.map((img, idx) => (
                  <button
                    key={img + idx}
                    type="button"
                    onClick={() => handleSelectThumbnail(img, idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border transition-all duration-200 shrink-0 bg-white ${activeImage === img
                      ? 'border-[#1C1917] ring-2 ring-[#1C1917]/20 shadow-xs'
                      : 'border-[#EAE4D8] opacity-75 hover:opacity-100 hover:border-[#9A7B56]'
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Showcase Image Container */}
            <div className="relative aspect-[4/5] flex-1 bg-white rounded-2xl border border-[#EAE4D8] overflow-hidden shadow-xs group">
              <Image
                src={activeImage}
                alt={product.displayName || product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Status Badge */}
              <div className="absolute top-3.5 left-3.5 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-semibold bg-white/95 text-[#1C1917] border border-[#EAE4D8] shadow-xs backdrop-blur-md">
                  <Sparkles className="w-3 h-3 text-[#9A7B56]" />
                  <span>{isCustomProduct ? 'Bespoke Atelier' : 'Ready to Ship'}</span>
                </span>
              </div>

              {/* Wishlist & Share Quick Action Buttons */}
              <div className="absolute top-3.5 right-3.5 z-10 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1C1917] flex items-center justify-center transition-all shadow-xs backdrop-blur-md"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-[#9A7B56] text-[#9A7B56]' : 'text-[#78716C]'
                      }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share product"
                  className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1C1917] flex items-center justify-center transition-all shadow-xs backdrop-blur-md"
                >
                  <Share2 className="w-4 h-4 text-[#78716C] hover:text-[#1C1917]" />
                </button>
              </div>

              {copiedLink && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#1C1917] text-white text-[11px] font-medium shadow-md">
                  Product link copied to clipboard!
                </div>
              )}
            </div>
          </div>

          {/* ─── RIGHT: PRODUCT INFO & PURCHASE CONTROLS (5 COLS) ─── */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Category / Subcategory Eyebrow */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#9A7B56] font-semibold">
                {curtainTypeData ? curtainTypeData.name : product.categoryName}
              </span>
              <span className="text-[11px] font-mono text-[#8C827A]">
                SKU: {currentVariant?.sku || product.id}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="font-serif text-[28px] sm:text-[34px] text-[#1C1917] font-medium tracking-tight leading-tight mb-3">
              {product.displayName || product.name}
            </h1>

            {/* Ratings & Verified Reviews Summary */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#EAE4D8]">
              <div className="flex items-center gap-1 bg-[#1C1917] text-white px-2 py-0.5 rounded-sm text-[12px] font-semibold">
                <span>4.9</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </div>
              <span className="text-[12.5px] text-[#78716C]">
                28 Verified Customer Reviews
              </span>
              <span className="text-[#D8CFBF]">·</span>
              <span className="text-[12px] text-[#16A34A] font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                In Stock & Handcrafted
              </span>
            </div>

            {/* Dynamic Price Display */}
            <div className="mb-5 pb-5 border-b border-[#EAE4D8]">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-serif text-[30px] sm:text-[34px] font-semibold text-[#1C1917]">
                  {product.currency}{totalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[16px] text-[#A8A29E] line-through font-normal">
                  {product.currency}{originalTotalPrice.toLocaleString('en-IN')}
                </span>
                <span className="px-2 py-0.5 text-[10.5px] uppercase tracking-wider font-semibold rounded-sm bg-[#FAF0E6] text-[#9A7B56] border border-[#E7D6C4]">
                  Save {product.currency}{savings.toLocaleString('en-IN')} (17% OFF)
                </span>
              </div>
              <p className="text-[12px] text-[#78716C]">
                Inclusive of all taxes. Free doorstep laser measurement & doorstep delivery included.
              </p>
            </div>

            {/* Short Description */}
            <p className="text-[14px] text-[#57534E] leading-relaxed mb-6 font-light">
              {product.shortDescription}
            </p>

            {/* ─── DYNAMIC PRODUCT-SPECIFIC OPTIONS ─── */}
            <div className="space-y-5 mb-6">
              {/* Option 1: Colour / Pattern Variations */}
              {product.variations && product.variations.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-[12px] uppercase tracking-wider font-semibold text-[#1C1917]">
                      Colour / Finish:
                    </label>
                    <span className="text-[12px] text-[#9A7B56] font-medium">
                      {currentVariant?.name}
                    </span>
                  </div>

                  {/* All available colours represented with authentic colour swatches */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {product.variations.map((variant, idx) => {
                      const isSelected = selectedVariantIndex === idx;

                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => handleSelectVariant(idx)}
                          title={variant.name}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-all ${isSelected
                              ? 'border-[#1C1917] bg-white ring-2 ring-[#1C1917]/20 shadow-xs'
                              : 'border-[#EAE4D8] bg-white/70 hover:border-[#9A7B56] hover:bg-white'
                            }`}
                        >
                          {/* Colour Swatch Circle */}
                          <span
                            className={`w-5 h-5 rounded-full shrink-0 border shadow-2xs transition-transform ${isSelected ? 'scale-110 border-[#1C1917]' : 'border-black/15'
                              }`}
                            style={{ backgroundColor: variant.colorHex || '#D6D3D1' }}
                          />

                          <span
                            className={`text-[12px] truncate flex-1 ${isSelected ? 'font-semibold text-[#1C1917]' : 'font-medium text-[#57534E]'
                              }`}
                          >
                            {variant.name}
                          </span>

                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-[#1C1917] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Option 2: Sizing Options (Curtains, Rugs, Bed Linen, etc.) */}
              {sizeOptions.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-[12px] uppercase tracking-wider font-semibold text-[#1C1917]">
                      {isCurtain ? 'Window Drop & Size:' : 'Select Dimension:'}
                    </label>
                    <span className="text-[12px] text-[#9A7B56] font-medium">
                      {selectedSizeObj?.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {sizeOptions.map((opt) => {
                      const isSelected = selectedSizeId === opt.id;
                      const isAvailable = !currentVariant?.availableSizes || currentVariant.availableSizes.includes(opt.id);

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => setSelectedSizeId(opt.id)}
                          className={`flex flex-col p-2.5 rounded-lg border text-left transition-all ${!isAvailable
                              ? 'opacity-40 cursor-not-allowed bg-stone-100 border-[#EAE4D8]'
                              : isSelected
                                ? 'border-[#1C1917] bg-white ring-1 ring-[#1C1917] shadow-xs'
                                : 'border-[#EAE4D8] bg-white/70 hover:border-[#9A7B56]'
                            }`}
                        >
                          <span className="text-[12px] font-semibold text-[#1C1917]">
                            {opt.label}
                          </span>
                          <span className="text-[10px] text-[#78716C] mt-0.5">
                            {isAvailable ? opt.sublabel : 'Unavailable in this colour'}
                          </span>
                          {isAvailable && opt.priceDiff > 0 && (
                            <span className="text-[10px] text-[#9A7B56] font-medium mt-1">
                              +{product.currency}{opt.priceDiff}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Custom Dimensions Input (When 'custom' size is active) */}
              {selectedSizeId === 'custom' && (
                <div className="p-4 rounded-xl bg-white border border-[#EAE4D8] space-y-3.5">
                  <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#1C1917]">
                    <Ruler className="w-3.5 h-3.5 text-[#9A7B56]" />
                    <span>Enter Custom Window Dimensions (Inches)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#78716C] mb-1">
                        Width (inches):
                      </label>
                      <input
                        type="number"
                        min="20"
                        max="300"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(e.target.value)}
                        className="w-full text-[13px] px-3 py-2 rounded-md border border-[#EAE4D8] focus:border-[#9A7B56] focus:outline-hidden bg-[#FAF7F2]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#78716C] mb-1">
                        Drop / Height (inches):
                      </label>
                      <input
                        type="number"
                        min="20"
                        max="300"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(e.target.value)}
                        className="w-full text-[13px] px-3 py-2 rounded-md border border-[#EAE4D8] focus:border-[#9A7B56] focus:outline-hidden bg-[#FAF7F2]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#78716C] mb-1">
                      Lining & Backing Selection:
                    </label>
                    <select
                      value={customLining}
                      onChange={(e) => setCustomLining(e.target.value)}
                      className="w-full text-[12px] px-3 py-2 rounded-md border border-[#EAE4D8] focus:border-[#9A7B56] focus:outline-hidden bg-[#FAF7F2]"
                    >
                      <option value="Thermal Blackout (+₹450/m)">100% Thermal Blackout Backing (+₹450/m)</option>
                      <option value="Cotton Sateen Underlay (+₹300/m)">Cotton Sateen Soft Underlay (+₹300/m)</option>
                      <option value="Unlined Natural Drape">Unlined Natural Single Drape</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Option 3: Curtain Heading Style (Curtains Only) */}
              {isCurtain && (
                <div>
                  <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#1C1917] mb-2.5">
                    Curtain Heading / Pleat Style:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'French Pinch Pleat',
                      'Wave Fold / S-Wave',
                      'Eyelet / Rings',
                      'American Pleat',
                    ].map((style) => {
                      const isSelected = selectedHeading === style;
                      return (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setSelectedHeading(style)}
                          className={`py-2 px-3 rounded-lg border text-left text-[11.5px] font-medium transition-all ${isSelected
                            ? 'border-[#1C1917] bg-white ring-1 ring-[#1C1917] text-[#1C1917] font-semibold'
                            : 'border-[#EAE4D8] bg-white/70 text-[#57534E] hover:border-[#9A7B56]'
                            }`}
                        >
                          {style}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Option 4: Quantity Selector */}
              <div>
                <label className="block text-[12px] uppercase tracking-wider font-semibold text-[#1C1917] mb-2">
                  Quantity:
                </label>
                <div className="inline-flex items-center border border-[#EAE4D8] rounded-lg bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="p-2.5 text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF7F2] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-[13px] font-semibold text-[#1C1917]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="p-2.5 text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF7F2] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* ─── 3 CLEAR ACTION BUTTONS: CART, BUY NOW, WHATSAPP ─── */}
            <div className="space-y-2.5 mb-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="py-3.5 px-5 rounded-lg border-2 border-[#1C1917] text-[#1C1917] hover:bg-[#FAF7F2] font-semibold text-[12px] uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                {/* 2. Buy Now */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="py-3.5 px-5 rounded-lg bg-[#1C1917] hover:bg-[#9A7B56] text-white font-semibold text-[12px] uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-xs hover:shadow-md"
                >
                  <span>Buy Now — COD</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* 3. Order via WhatsApp (Dynamically Configured) */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] hover:text-[#075E54] font-medium text-[12px] uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-[#25D366] text-[#25D366]" />
                <span>Order via WhatsApp (Instant Assistance)</span>
              </a>
            </div>

            {/* ─── COMPACT DELIVERY & PIN CHECKER ─── */}
            <div className="p-4 rounded-xl bg-white border border-[#EAE4D8] mb-6 space-y-3">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-[#1C1917]">
                <Truck className="w-4 h-4 text-[#9A7B56]" />
                <span>Check Delivery Availability & Timelines</span>
              </div>

              <form onSubmit={handleCheckPin} className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="w-3.5 h-3.5 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit PIN Code"
                    value={pinCode}
                    onChange={(e) => {
                      setPinCode(e.target.value.replace(/\D/g, ''));
                      setPinChecked(false);
                    }}
                    className="w-full text-[12px] pl-8 pr-3 py-2 rounded-md border border-[#EAE4D8] bg-[#FAF7F2] focus:border-[#9A7B56] focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#1C1917] text-white hover:bg-[#9A7B56] text-[11px] uppercase tracking-wider font-semibold transition-colors shrink-0"
                >
                  Check
                </button>
              </form>

              {pinChecked && pinMessage && (
                <p className="text-[11.5px] text-[#16A34A] font-medium leading-relaxed">
                  {pinMessage}
                </p>
              )}

              {/* Compact Trust Indicators */}
              <div className="pt-3 border-t border-[#F2ECE1] grid grid-cols-2 gap-2 text-[11px] text-[#78716C]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#9A7B56] shrink-0" />
                  <span>100% Genuine Fabrics</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-[#9A7B56] shrink-0" />
                  <span>7-Day Easy Exchange</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#9A7B56] shrink-0" />
                  <span>Secure COD & Online Pay</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#9A7B56] shrink-0" />
                  <span>Free Home Laser Sizing</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 3. TABBED PRODUCT INFORMATION SECTION ─── */}
        <section className="mt-14 sm:mt-20 pt-10 border-t border-[#EAE4D8]">
          {/* Tab Navigation Headers */}
          <div className="flex items-center gap-2 border-b border-[#EAE4D8] overflow-x-auto pb-px scrollbar-none">
            {[
              { id: 'desc', label: 'Description & Craft' },
              { id: 'specs', label: 'Specifications' },
              { id: 'shipping', label: 'Shipping & Delivery' },
              { id: 'care', label: 'Care Instructions' },
              { id: 'returns', label: 'Returns & Guarantee' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-4 sm:px-6 text-[12.5px] sm:text-[13px] font-semibold tracking-wider uppercase transition-all border-b-2 whitespace-nowrap ${isActive
                    ? 'border-[#1C1917] text-[#1C1917]'
                    : 'border-transparent text-[#78716C] hover:text-[#1C1917] hover:border-[#D8CFBF]'
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab 1: Description & Craftsmanship */}
          {activeTab === 'desc' && (
            <div className="py-8 max-w-4xl space-y-4 text-[14px] text-[#57534E] leading-relaxed">
              <h2 className="font-serif text-[22px] sm:text-[26px] text-[#1C1917] font-medium">
                Artisanal Craftsmanship & Design Philosophy
              </h2>
              <p>{product.description}</p>
              <p>
                Each bespoke creation at Zaira Furnishing is calibrated to your home&rsquo;s architectural proportions. We source premium yarn-dyed European flax, high-density blackout membranes, and supple velvet weaves that drape with seamless fluid elegance. Bottom hems are hand-turned and corner weighted to guarantee crisp vertical drape lines that do not flair outward.
              </p>
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#EAE4D8]">
                  <h4 className="font-serif text-[15px] font-medium text-[#1C1917] mb-1">
                    Light & Acoustic Control
                  </h4>
                  <p className="text-[12px] text-[#78716C]">
                    Engineered to soften room reverberation and regulate thermal climate comfort year-round.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#EAE4D8]">
                  <h4 className="font-serif text-[15px] font-medium text-[#1C1917] mb-1">
                    Corner Weighted Hems
                  </h4>
                  <p className="text-[12px] text-[#78716C]">
                    Precision weighted corner tabs ensure perfectly balanced vertical wave drops.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#EAE4D8]">
                  <h4 className="font-serif text-[15px] font-medium text-[#1C1917] mb-1">
                    Atelier Tailoring
                  </h4>
                  <p className="text-[12px] text-[#78716C]">
                    Double-turned blind stitches with zero visible exterior seams for quiet luxury.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Specifications Table */}
          {activeTab === 'specs' && (
            <div className="py-8 max-w-3xl">
              <div className="rounded-xl bg-white border border-[#EAE4D8] overflow-hidden">
                <dl className="divide-y divide-[#F2ECE1] text-[13px]">
                  <div className="grid grid-cols-3 p-3.5 bg-[#FAF7F2]">
                    <dt className="text-[#78716C] font-medium">SKU Identifier</dt>
                    <dd className="col-span-2 text-[#1C1917] font-mono font-medium">
                      {currentVariant?.sku || product.id}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 p-3.5">
                    <dt className="text-[#78716C] font-medium">Category</dt>
                    <dd className="col-span-2 text-[#1C1917] font-medium">
                      {product.categoryName}
                    </dd>
                  </div>
                  {curtainTypeData && (
                    <div className="grid grid-cols-3 p-3.5 bg-[#FAF7F2]">
                      <dt className="text-[#78716C] font-medium">Curtain Type</dt>
                      <dd className="col-span-2 text-[#1C1917] font-medium">
                        {curtainTypeData.name} ({curtainTypeData.badge || 'Tailored'})
                      </dd>
                    </div>
                  )}
                  {product.specifications?.map((spec, idx) => (
                    <div
                      key={spec.label}
                      className={`grid grid-cols-3 p-3.5 ${idx % 2 === 1 ? 'bg-[#FAF7F2]' : 'bg-white'}`}
                    >
                      <dt className="text-[#78716C] font-medium">{spec.label}</dt>
                      <dd className="col-span-2 text-[#1C1917] font-medium">{spec.value}</dd>
                    </div>
                  ))}
                  <div className="grid grid-cols-3 p-3.5 bg-[#FAF7F2]">
                    <dt className="text-[#78716C] font-medium">Country of Origin</dt>
                    <dd className="col-span-2 text-[#1C1917] font-medium">
                      India (Crafted in Zaira Atelier)
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* Tab 3: Shipping & Delivery */}
          {activeTab === 'shipping' && (
            <div className="py-8 max-w-3xl space-y-4 text-[13.5px] text-[#57534E] leading-relaxed">
              <h3 className="font-serif text-[20px] text-[#1C1917] font-medium">
                Transparent Delivery & White-Glove Installation
              </h3>
              <p>
                • <strong>Ready-to-Ship Standard Items:</strong> Dispatched within 24 to 48 hours via premium express couriers with tracking. Expected transit is 3 to 5 business days nationwide.
              </p>
              <p>
                • <strong>Bespoke / Made-to-Measure Drapery:</strong> Handcrafted to exact dimensions within 5 to 7 business days following laser measurement verification.
              </p>
              <p>
                • <strong>Cash on Delivery (COD):</strong> Available across 18,000+ PIN codes in India. Pay conveniently when your order arrives.
              </p>
              <p>
                • <strong>White-Glove Installation:</strong> Complimentary hanging, steam de-wrinkling, and track tuning available upon request in metro cities.
              </p>
            </div>
          )}

          {/* Tab 4: Care Instructions */}
          {activeTab === 'care' && (
            <div className="py-8 max-w-3xl space-y-4 text-[13.5px] text-[#57534E] leading-relaxed">
              <h3 className="font-serif text-[20px] text-[#1C1917] font-medium">
                Fabric Care & Longevity Recommendations
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Professional eco-friendly dry clean is recommended once every 12 to 18 months to preserve drape body and acoustic coatings.</li>
                <li>For sheer day curtains: Gentle machine wash on delicate cycle at 30°C using mild liquid detergent. Hang damp for natural wrinkle release.</li>
                <li>Vacuum lightly with a soft upholstery brush attachment once monthly along the folds to eliminate dust accumulation.</li>
                <li>Steam lightly on low heat settings; never apply direct high iron heat to blackout thermal backing.</li>
              </ul>
            </div>
          )}

          {/* Tab 5: Returns & Guarantee */}
          {activeTab === 'returns' && (
            <div className="py-8 max-w-3xl space-y-4 text-[13.5px] text-[#57534E] leading-relaxed">
              <h3 className="font-serif text-[20px] text-[#1C1917] font-medium">
                7-Day Hassle-Free Exchange & Tailoring Guarantee
              </h3>
              <p>
                We stand behind every stitch. For standard catalogue items, we offer an effortless 7-day doorstep replacement or exchange if the tone or texture does not match your interior lighting.
              </p>
              <p>
                For Made-to-Measure bespoke drapery, we offer our <strong>Millimeter Fit Guarantee</strong>: if your drapes require length adjustment or re-hemming, our master tailors will alter them free of charge.
              </p>
            </div>
          )}
        </section>

        {/* ─── 4. REVIEWS SECTION ─── */}
        <section className="mt-14 sm:mt-20 pt-10 border-t border-[#EAE4D8]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="font-serif text-[24px] sm:text-[28px] text-[#1C1917] font-medium">
                Customer Reviews
              </h3>
              <p className="text-[13px] text-[#78716C]">
                Verified purchases from residential homeowners and interior architects.
              </p>
            </div>
            <button
              type="button"
              className="px-5 py-2.5 rounded-lg border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-white transition-colors text-[11px] uppercase tracking-wider font-semibold self-start sm:self-auto"
            >
              Write a Review
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
            {/* Rating Breakdown Card */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-[#EAE4D8]">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-serif text-[42px] font-semibold text-[#1C1917] leading-none">
                  4.9
                </span>
                <div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[12px] text-[#78716C] mt-1 block">
                    Based on 28 verified orders
                  </span>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-2 text-[11.5px]">
                <div className="flex items-center gap-2">
                  <span className="w-12 text-[#78716C]">5 Star</span>
                  <div className="flex-1 h-2 rounded-full bg-[#FAF7F2] overflow-hidden">
                    <div className="h-full bg-[#1C1917] rounded-full w-[89%]" />
                  </div>
                  <span className="w-8 text-right font-medium">89%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-12 text-[#78716C]">4 Star</span>
                  <div className="flex-1 h-2 rounded-full bg-[#FAF7F2] overflow-hidden">
                    <div className="h-full bg-[#1C1917] rounded-full w-[11%]" />
                  </div>
                  <span className="w-8 text-right font-medium">11%</span>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                  <span className="w-12 text-[#78716C]">3 Star</span>
                  <div className="flex-1 h-2 rounded-full bg-[#FAF7F2]" />
                  <span className="w-8 text-right font-medium">0%</span>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                  <span className="w-12 text-[#78716C]">2 Star</span>
                  <div className="flex-1 h-2 rounded-full bg-[#FAF7F2]" />
                  <span className="w-8 text-right font-medium">0%</span>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                  <span className="w-12 text-[#78716C]">1 Star</span>
                  <div className="flex-1 h-2 rounded-full bg-[#FAF7F2]" />
                  <span className="w-8 text-right font-medium">0%</span>
                </div>
              </div>
            </div>

            {/* Curated Customer Review Cards */}
            <div className="lg:col-span-8 space-y-4">
              {[
                {
                  name: 'Priya Sharma',
                  location: 'South Mumbai',
                  rating: 5,
                  date: '2 weeks ago',
                  title: 'Exceptional blackout performance and hotel-quality drape',
                  text: 'The fabric density on these curtains is wonderful. We have east-facing bedroom windows with intense morning sunlight, and this blocks 100% of the glare. The French pinch pleat waves fall so neatly.',
                },
                {
                  name: 'Vikramaditya Mehta',
                  location: 'Indiranagar, Bangalore',
                  rating: 5,
                  date: '1 month ago',
                  title: 'Doorstep laser measurement made the drop millimeter perfect',
                  text: 'The in-home consultant brought the actual fabric swatch booklets so we could verify the color under our home’s warm lighting. Tailoring took 6 days and the installation was silent and seamless.',
                },
                {
                  name: 'Ananya Sen',
                  location: 'Vasant Vihar, New Delhi',
                  rating: 5,
                  date: '2 months ago',
                  title: 'Rich tactile weave with great acoustic dampening',
                  text: 'We live near a busy avenue and immediately noticed a reduction in street reverberation. Beautiful craftsmanship and weighted bottom hems that do not flare.',
                },
              ].map((rev) => (
                <div
                  key={rev.name}
                  className="p-5 rounded-2xl bg-white border border-[#EAE4D8] space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[13.5px] text-[#1C1917] block">
                        {rev.name}
                      </span>
                      <span className="text-[11px] text-[#78716C]">
                        {rev.location} · {rev.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <h4 className="font-serif text-[15px] text-[#1C1917] font-medium">
                    &ldquo;{rev.title}&rdquo;
                  </h4>
                  <p className="text-[13px] text-[#57534E] leading-relaxed font-light">
                    {rev.text}
                  </p>
                  <div className="pt-2 flex items-center gap-3 text-[11px] text-[#16A34A]">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Check className="w-3 h-3" />
                      Verified Zaira Customer
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 5. FREQUENTLY ASKED QUESTIONS (ACCORDION) ─── */}
        <section className="mt-14 sm:mt-20 pt-10 border-t border-[#EAE4D8]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#9A7B56] font-semibold block mb-2">
                Common Inquiries
              </span>
              <h3 className="font-serif text-[26px] sm:text-[32px] text-[#1C1917] font-medium">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: 'How do I choose the right size and window drop length?',
                  a: 'For standard window heights, a 5 × 7 ft or 6 × 7 ft panel is ideal. For floor-to-ceiling glass walls or high doors, 7 × 9 ft or 8 × 10 ft is recommended. We suggest mounting your curtain rod or track 4 to 6 inches above the window frame to create an expansive, spacious illusion.',
                },
                {
                  q: 'Are in-home laser measurement visits free of charge?',
                  a: 'Yes! Zaira Furnishing offers complimentary in-home laser measurement visits across major Indian cities. Our coordinator brings physical fabric swatches directly to your doorstep so you can assess textures in your room’s actual ambient light.',
                },
                {
                  q: 'Can I order customized headings like motorized ripplefold tracks?',
                  a: 'Absolutely. We specialize in custom heading architectures including French double and triple pleats, motorized quiet tracks (Somfy/Tuya compatible), and concealed ceiling pelmet tracks.',
                },
                {
                  q: 'How does Cash on Delivery (COD) work for this item?',
                  a: 'You can simply select "Buy Now — COD" and enter your shipping address. You pay upon delivery to your doorstep. For bespoke custom orders, our team confirms measurements before commencing tailoring.',
                },
                {
                  q: 'How long does bespoke tailoring and delivery take?',
                  a: 'Standard sizes ship within 2 to 3 business days. Custom made-to-measure drapery requires 5 to 7 business days from measurement confirmation to final hand-pressing and dispatch.',
                },
              ].map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={faq.q}
                    className="rounded-xl bg-white border border-[#EAE4D8] overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-serif text-[15px] sm:text-[16px] font-medium text-[#1C1917] hover:text-[#9A7B56] transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#8C827A] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''
                          }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 pt-1 text-[13px] text-[#57534E] leading-relaxed border-t border-[#F2ECE1] font-light">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── 6. RELATED PRODUCTS ("YOU MAY ALSO LIKE") ─── */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 sm:mt-24 pt-12 border-t border-[#EAE4D8]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#9A7B56] font-semibold block mb-1">
                  Tailored Curations
                </span>
                <h3 className="font-serif text-[24px] sm:text-[28px] text-[#1C1917] font-medium">
                  You May Also Like
                </h3>
              </div>
              <Link
                href={`/categories?slug=${product.categorySlug}`}
                className="text-[11.5px] uppercase tracking-wider font-semibold text-[#1C1917] hover:text-[#9A7B56] transition-colors inline-flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Explore {product.categoryName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Strictly relevant related products grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col bg-white rounded-xl border border-[#EAE4D8] hover:border-[#1C1917] transition-all duration-300 overflow-hidden shadow-2xs hover:shadow-md"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    className="relative aspect-[4/5] w-full overflow-hidden bg-[#F4EFE6] block"
                  >
                    <Image
                      src={item.mainImage}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </Link>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#9A7B56] font-semibold mb-1">
                      {item.categoryName}
                    </span>
                    <Link href={`/products/${item.slug}`}>
                      <h4 className="font-serif text-[15px] sm:text-[16px] text-[#1C1917] font-medium line-clamp-1 group-hover:text-[#9A7B56] transition-colors mb-1">
                        {item.displayName || item.name}
                      </h4>
                    </Link>
                    <p className="text-[12px] text-[#78716C] line-clamp-2 mb-3 flex-1 font-light">
                      {item.shortDescription}
                    </p>
                    <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between">
                      <span className="font-serif text-[15px] font-semibold text-[#1C1917]">
                        {item.currency}{item.price.toLocaleString('en-IN')}
                      </span>
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-[11px] uppercase tracking-wider font-semibold text-[#1C1917] group-hover:text-[#9A7B56] transition-colors inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ─── 7. SLIDE-OVER CART DRAWER ─── */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setCartDrawerOpen(false)}
          />

          <div className="relative w-full max-w-md bg-[#FDFBF7] shadow-2xl z-50 flex flex-col justify-between p-6 border-l border-[#EAE4D8] overflow-y-auto">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE4D8]">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#1C1917]" />
                  <span className="font-serif text-[18px] text-[#1C1917] font-medium">
                    Your Shopping Bag ({cartItems.length})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCartDrawerOpen(false)}
                  className="p-1 text-[#78716C] hover:text-[#1C1917]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Added item notice */}
              <div className="mt-4 p-3 rounded-lg bg-[#FAF0E6] border border-[#E7D6C4] flex items-center gap-2 text-[12px] text-[#9A7B56] font-medium">
                <Check className="w-4 h-4 shrink-0 text-[#16A34A]" />
                <span>Item successfully configured and added to your bag!</span>
              </div>

              {/* Cart Items List */}
              <div className="mt-4 space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-white border border-[#EAE4D8] flex gap-3"
                  >
                    <div className="relative w-16 h-20 rounded-md overflow-hidden bg-[#F4EFE6] shrink-0 border border-[#EAE4D8]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-[14px] font-semibold text-[#1C1917] truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#78716C] mt-0.5">
                        {item.variantName ? `${item.variantName} · ` : ''}{item.sizeLabel}
                      </p>
                      {item.headingStyle && (
                        <p className="text-[10px] text-[#8C827A]">
                          Heading: {item.headingStyle}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F2ECE1]">
                        <span className="text-[11px] text-[#78716C]">
                          Qty: {item.quantity}
                        </span>
                        <span className="font-serif text-[13.5px] font-semibold text-[#1C1917]">
                          ₹{item.totalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#EAE4D8] space-y-2 mt-6">
              <div className="flex justify-between items-center text-[14px] font-semibold text-[#1C1917] mb-2">
                <span>Subtotal</span>
                <span>
                  ₹{cartItems.reduce((acc, it) => acc + it.totalPrice, 0).toLocaleString('en-IN')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCartDrawerOpen(false);
                  setBuyNowModalOpen(true);
                }}
                className="w-full py-3.5 rounded-lg text-center text-[12px] uppercase tracking-widest font-semibold bg-[#1C1917] text-white hover:bg-[#9A7B56] transition-colors"
              >
                Proceed to Checkout (COD)
              </button>
              <button
                type="button"
                onClick={() => setCartDrawerOpen(false)}
                className="w-full py-2.5 text-center text-[11px] uppercase tracking-wider font-medium text-[#78716C] hover:text-[#1C1917]"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 8. CASH ON DELIVERY (COD) BUY NOW CHECKOUT MODAL ─── */}
      {buyNowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => {
              if (!orderConfirmed) setBuyNowModalOpen(false);
            }}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl z-50 p-6 sm:p-8 border border-[#EAE4D8] max-h-[90vh] overflow-y-auto">
            {!orderConfirmed ? (
              <div>
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#EAE4D8] mb-5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#9A7B56]" />
                    <h3 className="font-serif text-[20px] font-semibold text-[#1C1917]">
                      Cash on Delivery Checkout
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBuyNowModalOpen(false)}
                    className="p-1 text-[#78716C] hover:text-[#1C1917]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Selected Item Summary */}
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE4D8] flex gap-3 mb-5">
                  <div className="relative w-16 h-20 rounded-md overflow-hidden bg-white shrink-0 border border-[#EAE4D8]">
                    <Image
                      src={activeImage}
                      alt={product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-[12px]">
                    <h4 className="font-serif text-[14px] font-semibold text-[#1C1917] truncate">
                      {product.displayName || product.name}
                    </h4>
                    <p className="text-[#78716C] mt-0.5">
                      {currentVariant?.name ? `${currentVariant.name} · ` : ''}{selectedSizeObj?.label}
                    </p>
                    {isCurtain && (
                      <p className="text-[#8C827A] text-[11px]">
                        Heading: {selectedHeading}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2 pt-1 font-semibold text-[#1C1917]">
                      <span>Qty: {quantity}</span>
                      <span>Total: ₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Details Form */}
                <form onSubmit={handleConfirmOrder} className="space-y-3.5">
                  <h4 className="text-[12px] uppercase tracking-wider font-semibold text-[#1C1917]">
                    Delivery Address Details:
                  </h4>

                  <div>
                    <label className="block text-[11px] text-[#78716C] mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-[13px] px-3.5 py-2 rounded-lg border border-[#EAE4D8] bg-[#FAF7F2] focus:border-[#9A7B56] focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#78716C] mb-1">
                        Mobile Number *
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="10-digit number"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full text-[13px] px-3.5 py-2 rounded-lg border border-[#EAE4D8] bg-[#FAF7F2] focus:border-[#9A7B56] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#78716C] mb-1">
                        PIN Code *
                      </label>
                      <input
                        required
                        type="text"
                        maxLength={6}
                        placeholder="6-digit PIN"
                        value={customerPin}
                        onChange={(e) => setCustomerPin(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-[13px] px-3.5 py-2 rounded-lg border border-[#EAE4D8] bg-[#FAF7F2] focus:border-[#9A7B56] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#78716C] mb-1">
                      Street Address & Landmark *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Apartment, building, street, landmark"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full text-[13px] px-3.5 py-2 rounded-lg border border-[#EAE4D8] bg-[#FAF7F2] focus:border-[#9A7B56] focus:outline-hidden resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#78716C] mb-1">
                      City & State *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Mumbai, Maharashtra"
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className="w-full text-[13px] px-3.5 py-2 rounded-lg border border-[#EAE4D8] bg-[#FAF7F2] focus:border-[#9A7B56] focus:outline-hidden"
                    />
                  </div>

                  {/* Payment notice */}
                  <div className="p-3 rounded-lg bg-[#FAF0E6] border border-[#E7D6C4] text-[11.5px] text-[#9A7B56] leading-relaxed">
                    <span className="font-semibold block text-[#1C1917] mb-0.5">Payment Method:</span>
                    Cash on Delivery (COD). You only pay ₹{totalPrice.toLocaleString('en-IN')} upon delivery to your doorstep. Free shipping included.
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-lg bg-[#1C1917] hover:bg-[#9A7B56] text-white font-semibold text-[12px] uppercase tracking-widest transition-colors mt-2"
                  >
                    Confirm Cash on Delivery Order
                  </button>
                </form>
              </div>
            ) : (
              /* Order Confirmation Receipt */
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-[24px] font-semibold text-[#1C1917]">
                  Order Placed Successfully!
                </h3>
                <p className="text-[13px] text-[#78716C] max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{customerName}</strong>. Your Cash on Delivery order has been registered under Order ID: <span className="font-mono font-semibold text-[#1C1917]">{orderId}</span>.
                </p>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE4D8] text-[12px] text-[#57534E] text-left space-y-1.5">
                  <div className="flex justify-between">
                    <span>Order Total:</span>
                    <span className="font-semibold text-[#1C1917]">₹{totalPrice.toLocaleString('en-IN')} (COD)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Address:</span>
                    <span className="truncate max-w-[200px]">{customerAddress}, {customerCity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Delivery:</span>
                    <span className="font-medium text-[#16A34A]">3–5 Business Days</span>
                  </div>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href={`https://wa.me/919876543210?text=${encodeURIComponent(
                      `Hi Zaira Furnishing, I just placed COD Order #${orderId} for ${product.displayName || product.name} (₹${totalPrice.toLocaleString('en-IN')}). Please confirm.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-lg bg-[#25D366] hover:bg-[#1ebd59] text-white text-[12px] uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Track Order on WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setBuyNowModalOpen(false);
                      setOrderConfirmed(false);
                    }}
                    className="w-full py-2.5 text-[12px] uppercase tracking-wider font-medium text-[#78716C] hover:text-[#1C1917]"
                  >
                    Done & Return to Store
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
