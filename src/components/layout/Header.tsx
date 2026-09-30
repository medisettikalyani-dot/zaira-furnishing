'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Plus,
  Minus,
  Trash2,
  Calendar,
  Sparkles,
  PackageCheck,
  User,
} from 'lucide-react';
import { useStore } from '@/lib/context/StoreContext';
import { getCategoryHref } from '@/lib/data/categories';
import { DbCategory } from '@/lib/db/types';

interface HeaderProductResult {
  id: string;
  name: string;
  display_name?: string | null;
  slug: string;
  starting_price?: number | null;
  base_price?: number | null;
  currency?: string | null;
  category_name?: string | null;
}

export function Header() {
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const {
    cart,
    cartCount,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    wishlistCount,
  } = useStore();

  const shopMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setShopMenuOpen(false);
    setIsCartOpen(false);
  }

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close shop dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shopMenuRef.current && !shopMenuRef.current.contains(e.target as Node)) {
        setShopMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dynamic D1 categories state
  const [categories, setCategories] = useState<DbCategory[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to load categories');
        const json = await res.json();
        if (isMounted && Array.isArray(json.data)) {
          setCategories(json.data);
        }
      } catch (err) {
        console.error('Header categories fetch error:', err);
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamic D1 search state
  const [searchResults, setSearchResults] = useState<HeaderProductResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    const abortController = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=8`, {
          signal: abortController.signal,
        });
        if (!res.ok) throw new Error('Search request failed');
        const json = await res.json();
        if (Array.isArray(json.data)) {
          setSearchResults(json.data);
        } else {
          setSearchResults([]);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Header search error:', err);
          setSearchError('Unable to complete search. Please try again.');
          setSearchResults([]);
        }
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => {
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [searchQuery]);

  return (
    <>
      {/* ─── Sticky Navigation Header ─── */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE4D8] shadow-xs py-3'
            : 'bg-[#FDFBF7]/90 backdrop-blur-xs border-b border-[#F0ECE1] py-3.5 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile: Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 -ml-1 text-[#1C1917] hover:text-[#1E3A2F] transition-colors focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand Logo */}
            <div className="flex items-center">
              <Link href="/" className="group inline-flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 fill-none">
                    <path d="M18 3 L31 14 L18 22 L5 14 Z" fill="#9CA488" />
                    <path d="M5 14 L18 22 L18 33 L5 25 Z" fill="#1E3A2F" />
                    <path d="M31 14 L18 22 L18 33 L31 25 Z" fill="#587465" />
                    <path
                      d="M18 10 L23 14 L23 24 L13 24 L13 14 Z"
                      stroke="#FAF7F2"
                      strokeWidth="1.2"
                      strokeOpacity="0.7"
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-[19px] sm:text-[23px] tracking-[0.15em] font-semibold text-[#1E3A2F] uppercase leading-none">
                    ZAIRA
                  </span>
                  <span className="text-[7.5px] sm:text-[9px] uppercase tracking-[0.3em] text-[#6E6862] font-semibold mt-0.5 sm:mt-1 leading-none">
                    FURNISHING
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-8">
              <Link
                href="/"
                className={`text-[13.5px] tracking-[0.04em] font-medium transition-colors ${
                  pathname === '/' ? 'text-[#1E3A2F] font-semibold' : 'text-[#57534E] hover:text-[#1E3A2F]'
                }`}
              >
                Home
              </Link>

              {/* Shop Dropdown */}
              <div className="relative" ref={shopMenuRef}>
                <button
                  type="button"
                  onClick={() => setShopMenuOpen(!shopMenuOpen)}
                  onMouseEnter={() => setShopMenuOpen(true)}
                  className={`inline-flex items-center gap-1 text-[13.5px] tracking-[0.04em] font-medium transition-colors ${
                    pathname.startsWith('/categories') || pathname.startsWith('/products')
                      ? 'text-[#1E3A2F] font-semibold'
                      : 'text-[#57534E] hover:text-[#1E3A2F]'
                  }`}
                >
                  <span>Shop</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      shopMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {shopMenuOpen && (
                  <div
                    onMouseLeave={() => setShopMenuOpen(false)}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[560px] bg-white rounded-2xl shadow-xl border border-[#EAE4D8] p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE1] mb-3.5">
                      <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#9A7B56]">
                        Furnishing Collections
                      </span>
                      <Link
                        href="/categories"
                        onClick={() => setShopMenuOpen(false)}
                        className="text-[11.5px] uppercase tracking-wider font-semibold text-[#1E3A2F] hover:text-[#9A7B56] inline-flex items-center gap-1 transition-colors"
                      >
                        <span>All {categories.length || 9} Categories</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={getCategoryHref(cat.slug)}
                          onClick={() => setShopMenuOpen(false)}
                          className="p-3 rounded-xl hover:bg-[#FAF7F2] border border-transparent hover:border-[#EAE4D8] transition-all group/item"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-serif text-[14.5px] font-medium text-[#1C1917] group-hover/item:text-[#1E3A2F]">
                              {cat.name}
                            </span>
                          </div>
                          <p className="text-[11.5px] text-[#78716C] line-clamp-1 mt-1 font-light">
                            {cat.description || cat.tagline || ''}
                          </p>
                        </Link>
                      ))}
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-[#F2ECE1] flex items-center justify-between bg-[#FAF7F2] -mx-5 -mb-5 p-4 rounded-b-2xl">
                      <div className="flex items-center gap-2 text-[12px] text-[#57534E]">
                        <Sparkles className="w-3.5 h-3.5 text-[#9A7B56]" />
                        <span>Complimentary in-home laser measurement included</span>
                      </div>
                      <Link
                        href="/products"
                        className="text-[11px] uppercase tracking-widest font-semibold text-[#1E3A2F] hover:underline"
                      >
                        Explore All Products
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Curtains Highlight */}
              <Link
                href="/categories/curtains"
                className={`text-[13.5px] tracking-[0.04em] font-medium transition-colors ${
                  pathname.startsWith('/categories/curtains')
                    ? 'text-[#1E3A2F] font-semibold'
                    : 'text-[#57534E] hover:text-[#1E3A2F]'
                }`}
              >
                Curtains
              </Link>

              <Link
                href="/services"
                className={`text-[13.5px] tracking-[0.04em] font-medium transition-colors ${
                  pathname === '/services' ? 'text-[#1E3A2F] font-semibold' : 'text-[#57534E] hover:text-[#1E3A2F]'
                }`}
              >
                Services
              </Link>

              <Link
                href="/about"
                className={`text-[13.5px] tracking-[0.04em] font-medium transition-colors ${
                  pathname === '/about' ? 'text-[#1E3A2F] font-semibold' : 'text-[#57534E] hover:text-[#1E3A2F]'
                }`}
              >
                About
              </Link>

              <Link
                href="/contact"
                className={`text-[13.5px] tracking-[0.04em] font-medium transition-colors ${
                  pathname === '/contact' ? 'text-[#1E3A2F] font-semibold' : 'text-[#57534E] hover:text-[#1E3A2F]'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2.5">
              {/* Search Trigger */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-1.5 sm:p-2 text-[#1C1917] hover:text-[#1E3A2F] transition-colors rounded-full hover:bg-black/5 cursor-pointer"
                aria-label="Search catalog"
              >
                <Search className="w-5 h-5 stroke-[1.6]" />
              </button>

              {/* Wishlist Trigger */}
              <Link
                href="/account"
                className="relative p-1.5 sm:p-2 text-[#1C1917] hover:text-[#1E3A2F] transition-colors rounded-full hover:bg-black/5"
                aria-label="View wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.6]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[10px] font-bold text-white bg-[#9A7B56] rounded-full shadow-2xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* My Orders Trigger */}
              <Link
                href="/account/orders"
                className="p-1.5 sm:p-2 text-[#1C1917] hover:text-[#1E3A2F] transition-colors rounded-full hover:bg-black/5"
                aria-label="My Orders"
                title="My Orders & Tracking"
              >
                <PackageCheck className="w-5 h-5 stroke-[1.6]" />
              </Link>

              {/* Shopping Bag Trigger */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 sm:p-2 text-[#1C1917] hover:text-[#1E3A2F] transition-colors rounded-full hover:bg-black/5 cursor-pointer"
                aria-label="View shopping bag"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
                {cartCount > 0 ? (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[10px] font-bold text-white bg-[#1E3A2F] rounded-full shadow-2xs animate-in zoom-in duration-200">
                    {cartCount}
                  </span>
                ) : (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[10px] font-bold text-white bg-[#1E3A2F] rounded-full shadow-2xs">
                    0
                  </span>
                )}
              </button>

              {/* Book Measurement CTA Button (Desktop) */}
              <Link
                href="/services#free-in-home-measurement"
                className="hidden xl:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[11.5px] uppercase tracking-wider font-semibold bg-[#1E3A2F] text-white hover:bg-[#152B23] transition-all ml-1.5 shadow-2xs"
              >
                <Calendar className="w-3.5 h-3.5 text-[#C4B9A1]" />
                <span>Book Visit</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Mobile Slide-Over Menu ─── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FDFBF7] shadow-2xl z-50 flex flex-col justify-between p-6 border-r border-[#EAE4D8] overflow-y-auto">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#EAE4D8]">
                <div className="flex flex-col">
                  <span className="font-serif text-[20px] tracking-wider text-[#1E3A2F] font-semibold">
                    ZAIRA FURNISHING
                  </span>
                  <span className="text-[8.5px] uppercase tracking-[0.25em] text-[#78716C] font-medium">
                    Atelier & Showroom
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#1C1917] hover:text-[#1E3A2F]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="py-6 flex flex-col space-y-3">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[14px] uppercase tracking-[0.14em] font-semibold text-[#1C1917] hover:text-[#1E3A2F] py-2 border-b border-[#F2ECE1] flex items-center justify-between"
                >
                  <span>Home</span>
                  <ArrowRight className="w-4 h-4 text-[#A8A29E]" />
                </Link>
                <Link
                  href="/categories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[14px] uppercase tracking-[0.14em] font-semibold text-[#9A7B56] hover:text-[#1E3A2F] py-2 border-b border-[#F2ECE1] flex items-center justify-between"
                >
                  <span>Shop by Category</span>
                  <ArrowRight className="w-4 h-4 text-[#9A7B56]" />
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={getCategoryHref(cat.slug)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[14px] uppercase tracking-[0.14em] font-semibold text-[#1C1917] hover:text-[#1E3A2F] py-2 border-b border-[#F2ECE1] flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    <ArrowRight className="w-4 h-4 text-[#A8A29E]" />
                  </Link>
                ))}

                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[14px] uppercase tracking-[0.14em] font-semibold text-[#1C1917] hover:text-[#1E3A2F] py-2 border-b border-[#F2ECE1] flex items-center justify-between"
                >
                  <span>All Products</span>
                  <ArrowRight className="w-4 h-4 text-[#A8A29E]" />
                </Link>

                <Link
                  href="/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[14px] uppercase tracking-[0.14em] font-semibold text-[#1C1917] hover:text-[#1E3A2F] py-2 border-b border-[#F2ECE1] flex items-center justify-between"
                >
                  <span>Services</span>
                  <ArrowRight className="w-4 h-4 text-[#A8A29E]" />
                </Link>

                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[14px] uppercase tracking-[0.14em] font-semibold text-[#1C1917] hover:text-[#1E3A2F] py-2 border-b border-[#F2ECE1] flex items-center justify-between"
                >
                  <span>About</span>
                  <ArrowRight className="w-4 h-4 text-[#A8A29E]" />
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[14px] uppercase tracking-[0.14em] font-semibold text-[#1C1917] hover:text-[#1E3A2F] py-2 border-b border-[#F2ECE1] flex items-center justify-between"
                >
                  <span>Contact</span>
                  <ArrowRight className="w-4 h-4 text-[#A8A29E]" />
                </Link>

                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[14px] uppercase tracking-[0.14em] font-semibold text-[#1C1917] hover:text-[#1E3A2F] py-2 border-b border-[#F2ECE1] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#9A7B56]" />
                    <span>My Account</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#A8A29E]" />
                </Link>

                <Link
                  href="/account/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[14px] uppercase tracking-[0.14em] font-semibold text-[#866945] hover:text-[#1E3A2F] py-2 border-b border-[#F2ECE1] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-[#9A7B56]" />
                    <span>My Orders & Tracking</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#A8A29E]" />
                </Link>
              </div>

              {/* Consultation Callout */}
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EAE4D8] mb-6">
                <p className="text-[12px] font-semibold text-[#1E3A2F] mb-1">
                  Book In-Home Measurement
                </p>
                <p className="text-[11px] text-[#78716C] leading-relaxed mb-3">
                  We bring fabric swatches and laser tools directly to your doorstep.
                </p>
                <Link
                  href="/services#free-in-home-measurement"
                  className="block w-full py-2.5 text-center text-[11px] uppercase tracking-wider font-semibold bg-[#1E3A2F] text-white rounded-lg"
                >
                  Book Free Visit
                </Link>
              </div>
            </div>

            {/* Showroom Details */}
            <div className="pt-4 border-t border-[#EAE4D8] text-[11px] text-[#78716C] space-y-1">
              <p className="font-semibold text-[#1C1917]">Puppalguda Showroom</p>
              <p>Alkapur Twp, Hyderabad 500089</p>
              <p className="font-medium text-[#1E3A2F]">+91 63001 45763</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Search Dialog Modal ─── */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setSearchOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#EAE4D8] shadow-2xl p-6 z-50">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE4D8]">
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-5 h-5 text-[#9A7B56]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search curtains, fabrics, blinds, wallpapers, rugs..."
                  autoFocus
                  className="w-full bg-transparent text-[16px] text-[#1C1917] placeholder-[#A8A29E] focus:outline-hidden"
                />
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 text-[#78716C] hover:text-[#1C1917]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Results Preview */}
            <div className="mt-4 max-h-80 overflow-y-auto">
              {searchQuery.trim() === '' ? (
                <div className="py-8 text-center text-[#78716C] text-[13px]">
                  <p className="font-serif text-[16px] text-[#1C1917] font-medium mb-1">
                    Explore our collections
                  </p>
                  <p>Type to search across all catalog products and furnishings.</p>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {['Blackout Curtains', 'Sheer Voile', 'Velvet', 'Roller Blinds', 'Grasscloth Wallpaper', 'Sofa Fabric'].map(
                      (tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSearchQuery(tag)}
                          className="px-3 py-1.5 text-[11px] bg-[#FAF7F2] border border-[#EAE4D8] rounded-full text-[#57534E] hover:border-[#1E3A2F] hover:text-[#1E3A2F]"
                        >
                          {tag}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : isSearching ? (
                <div className="py-8 text-center text-[#78716C] text-[13px]">
                  <p className="font-serif text-[15px] text-[#1C1917] font-medium mb-1">
                    Searching catalog...
                  </p>
                  <p className="text-[11.5px] text-[#A8A29E]">Querying our atelier collections</p>
                </div>
              ) : searchError ? (
                <div className="py-8 text-center text-[#78716C] text-[13px]">
                  {searchError}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-wider text-[#78716C] mb-2">
                    Found {searchResults.length} items
                  </p>
                  {searchResults.map((prod) => {
                    const priceValue = prod.base_price || prod.starting_price || 0;
                    const currencySymbol = prod.currency || '₹';
                    return (
                      <Link
                        key={prod.id}
                        href={`/products/${prod.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center justify-between p-3 hover:bg-[#FAF7F2] rounded-xl border border-transparent hover:border-[#EAE4D8] transition-colors"
                      >
                        <div>
                          <p className="text-[14px] font-serif font-medium text-[#1C1917]">
                            {prod.display_name || prod.name}
                          </p>
                          <p className="text-[11px] text-[#9A7B56]">{prod.category_name || 'Bespoke Collection'}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-serif text-[14px] font-semibold text-[#1C1917]">
                            {currencySymbol}
                            {priceValue.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-[#78716C] text-[13px]">
                  No products found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Global Slide-Over Shopping Cart Drawer ─── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="relative w-full max-w-md bg-[#FDFBF7] shadow-2xl z-50 flex flex-col justify-between p-4 sm:p-6 border-l border-[#EAE4D8] overflow-y-auto">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE4D8]">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#1E3A2F]" />
                  <span className="font-serif text-[17px] sm:text-[18px] text-[#1C1917] font-medium">
                    Your Shopping Bag ({cartCount})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 text-[#78716C] hover:text-[#1C1917] rounded-full hover:bg-black/5 cursor-pointer"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              {cart.length > 0 ? (
                <div className="mt-4 sm:mt-5 space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 sm:p-3.5 rounded-xl bg-white border border-[#EAE4D8] flex gap-3 shadow-2xs"
                    >
                      <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#EAE4D8]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-serif text-[13.5px] sm:text-[14px] font-medium text-[#1C1917] truncate">
                              {item.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-[#A8A29E] hover:text-rose-600 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {item.variantName && (
                            <p className="text-[11.5px] text-[#9A7B56] font-medium">
                              {item.variantName}
                            </p>
                          )}
                          {item.sizeLabel && (
                            <p className="text-[11px] text-[#78716C]">
                              Size: {item.sizeLabel}
                            </p>
                          )}
                          {item.headingStyle && (
                            <p className="text-[10.5px] text-[#8C827A]">
                              Heading: {item.headingStyle}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F2ECE1]">
                          <div className="inline-flex items-center border border-[#EAE4D8] rounded-md bg-[#FAF7F2] overflow-hidden">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 flex items-center justify-center text-[#57534E] hover:bg-white text-[12px] active:bg-neutral-200"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-[12px] font-semibold text-[#1C1917]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 flex items-center justify-center text-[#57534E] hover:bg-white text-[12px] active:bg-neutral-200"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-serif text-[14px] font-semibold text-[#1C1917]">
                            ₹{item.totalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center text-[#78716C]">
                  <ShoppingBag className="w-10 h-10 mx-auto text-[#C4B9A1] stroke-[1.25] mb-3" />
                  <p className="font-serif text-[16px] text-[#1C1917] font-medium mb-1">
                    Your bag is empty
                  </p>
                  <p className="text-[12px] max-w-xs mx-auto">
                    Explore our catalog to add items or book a complimentary site measurement.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#EAE4D8] space-y-2 mt-6">
              {cart.length > 0 && (
                <div className="flex justify-between items-center text-[14px] font-semibold text-[#1C1917] mb-2">
                  <span>Subtotal</span>
                  <span className="font-serif text-[18px]">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {cart.length > 0 ? (
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full py-3.5 rounded-full text-center text-[12px] uppercase tracking-widest font-semibold bg-[#1E3A2F] text-white hover:bg-[#152B23] transition-colors shadow-xs"
                >
                  View Bag & Checkout (COD)
                </Link>
              ) : (
                <Link
                  href="/products"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full py-3 text-center text-[12px] uppercase tracking-widest font-medium bg-[#1E3A2F] text-white hover:bg-[#152B23] rounded-full transition-colors"
                >
                  Browse Catalog
                </Link>
              )}

              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="block w-full py-2.5 text-center text-[11px] uppercase tracking-wider font-medium text-[#78716C] hover:text-[#1C1917]"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
