'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
} from 'lucide-react';
import { PRODUCTS } from '@/lib/data/products';

export function Header() {
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // Close menus on route change during render
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setCartOpen(false);
    setAccountOpen(false);
  }

  // Handle scroll shadow/padding effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  // Quick search filter
  const filteredProducts = searchQuery.trim()
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      {/* Main Clean Sticky Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E7E2D8] shadow-xs py-3'
            : 'bg-transparent border-b border-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile: Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-[#1C1917] hover:text-[#1E3A2F] transition-colors focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand Logo - Styled to match reference design */}
            <div className="flex items-center">
              <Link href="/" className="group inline-flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <svg viewBox="0 0 36 36" className="w-8 h-8 fill-none">
                    {/* Top faceted diamond in warm olive-gold */}
                    <path d="M18 3 L31 14 L18 22 L5 14 Z" fill="#9CA488" />
                    {/* Left lower facet in deep forest green */}
                    <path d="M5 14 L18 22 L18 33 L5 25 Z" fill="#243F34" />
                    {/* Right lower facet in medium sage */}
                    <path d="M31 14 L18 22 L18 33 L31 25 Z" fill="#587465" />
                    {/* Interior delicate architectural line */}
                    <path d="M18 10 L23 14 L23 24 L13 24 L13 14 Z" stroke="#FAF7F2" strokeWidth="1.2" strokeOpacity="0.6" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-[22px] sm:text-[23px] tracking-[0.16em] font-semibold text-[#1E3A2F] uppercase leading-none">
                    ZAIRA
                  </span>
                  <span className="text-[8.5px] sm:text-[9px] uppercase tracking-[0.32em] text-[#6E6862] font-semibold mt-1 leading-none">
                    FURNISHING
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-[13.5px] tracking-[0.04em] font-medium transition-colors relative py-1.5 flex flex-col items-center ${
                      isActive
                        ? 'text-[#1E3A2F] font-semibold'
                        : 'text-[#57534E] hover:text-[#1E3A2F]'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute -bottom-0.5 w-6 h-[2px] rounded-full bg-[#1E3A2F]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Trigger */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 text-[#1C1917] hover:text-[#1E3A2F] transition-colors rounded-full hover:bg-black/5"
                aria-label="Search catalog"
              >
                <Search className="w-5 h-5 stroke-[1.6]" />
              </button>

              {/* Cart Drawer Trigger with Badge */}
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-[#1C1917] hover:text-[#1E3A2F] transition-colors rounded-full hover:bg-black/5 ml-0.5"
                aria-label="View shopping bag"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[10px] font-bold text-white bg-[#1E3A2F] rounded-full shadow-2xs">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FDFBF7] shadow-xl z-50 flex flex-col justify-between p-6 border-r border-[#E7E2D8] overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E7E2D8]">
                <div className="flex flex-col">
                  <span className="font-serif text-[20px] tracking-wider text-[#1C1917] font-medium">
                    ZAIRA FURNISHING
                  </span>
                  <span className="text-[8px] uppercase tracking-[0.25em] text-[#78716C]">
                    Showroom & Atelier
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#1C1917] hover:text-[#9A7B56]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="py-6 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-[15px] uppercase tracking-[0.15em] font-medium text-[#1C1917] hover:text-[#9A7B56] py-2 border-b border-[#F2EFE9] flex items-center justify-between"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-4 h-4 text-[#78716C]" />
                  </Link>
                ))}
              </div>

              {/* Quick Highlights for Mobile */}
              <div className="bg-[#FAF7F2] p-4 border border-[#EBE7DF] rounded-xs mb-6">
                <p className="text-[12px] font-medium text-[#1C1917] mb-1">
                  Need In-Home Measurement?
                </p>
                <p className="text-[11px] text-[#78716C] leading-relaxed mb-3">
                  Our specialists bring laser tools and fabric swatches directly to your doorstep.
                </p>
                <Link
                  href="/services"
                  className="inline-block w-full py-2 text-center text-[11px] uppercase tracking-wider font-medium bg-[#1C1917] text-[#FDFBF7]"
                >
                  Book Free Visit
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E7E2D8] text-[11px] text-[#78716C] space-y-1">
              <p>Zaira Furnishing Showroom</p>
              <p>[Showroom Contact Placeholder]</p>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setSearchOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-[#FDFBF7] border border-[#E7E2D8] shadow-2xl p-6 z-50">
            <div className="flex items-center justify-between pb-4 border-b border-[#E7E2D8]">
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-5 h-5 text-[#78716C]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search curtains, fabrics, blinds, wall clocks..."
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
                  <p className="font-medium text-[#1C1917] mb-1">Explore our collections</p>
                  <p>Type to search products across all 14 furnishing categories.</p>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {['Curtains', 'Blinds', 'Upholstery', 'Marble Clock', 'Wool Rug'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSearchQuery(tag)}
                        className="px-3 py-1 text-[11px] bg-[#FAF7F2] border border-[#E7E2D8] text-[#57534E] hover:border-[#1C1917]"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-[11px] uppercase tracking-wider text-[#78716C]">
                    Found {filteredProducts.length} results
                  </p>
                  {filteredProducts.map((prod) => (
                    <Link
                      key={prod.id}
                      href={`/products/${prod.slug}`}
                      className="flex items-center justify-between p-2.5 hover:bg-[#FAF7F2] border border-transparent hover:border-[#E7E2D8] transition-colors"
                    >
                      <div>
                        <p className="text-[14px] font-medium text-[#1C1917]">{prod.name}</p>
                        <p className="text-[11px] text-[#78716C]">{prod.categoryName}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[13px] font-semibold text-[#1C1917]">
                          {prod.currency}
                          {prod.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-[#78716C] text-[13px]">
                  No products found for &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer (COD-ready architecture preview) */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setCartOpen(false)}
          />

          <div className="relative w-full max-w-md bg-[#FDFBF7] shadow-2xl z-50 flex flex-col justify-between p-6 border-l border-[#E7E2D8] overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E7E2D8]">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#1C1917]" />
                  <span className="font-serif text-[18px] text-[#1C1917]">Shopping Bag</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="p-1 text-[#78716C] hover:text-[#1C1917]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* COD Notice */}
              <div className="mt-4 p-3 bg-[#FAF7F2] border border-[#E7E2D8] text-[11px] text-[#57534E] leading-relaxed">
                <span className="font-semibold text-[#1C1917]">Cash on Delivery (COD):</span>
                <p className="mt-0.5">
                  Standard items support seamless Cash on Delivery at checkout. Custom made-to-measure items include complimentary site measurement and consultation prior to final stitching.
                </p>
              </div>

              <div className="py-12 text-center text-[#78716C]">
                <ShoppingBag className="w-10 h-10 mx-auto text-[#C4B9A1] stroke-[1.25] mb-3" />
                <p className="text-[14px] text-[#1C1917] font-medium mb-1">Your bag is empty</p>
                <p className="text-[12px]">Explore our catalog to add items or book a free measurement.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E7E2D8] space-y-2">
              <Link
                href="/products"
                onClick={() => setCartOpen(false)}
                className="block w-full py-3 text-center text-[12px] uppercase tracking-widest font-medium bg-[#1C1917] text-[#FDFBF7] hover:bg-[#9A7B56] transition-colors"
              >
                Browse Catalog
              </Link>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="block w-full py-2.5 text-center text-[11px] uppercase tracking-wider font-medium text-[#78716C] hover:text-[#1C1917]"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Modal (Placeholder Architecture) */}
      {accountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setAccountOpen(false)}
          />

          <div className="relative w-full max-w-sm bg-[#FDFBF7] border border-[#E7E2D8] shadow-2xl p-6 z-50">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E2D8] mb-4">
              <span className="font-serif text-[18px] text-[#1C1917]">Customer Area</span>
              <button
                type="button"
                onClick={() => setAccountOpen(false)}
                className="p-1 text-[#78716C] hover:text-[#1C1917]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[12px] text-[#57534E] leading-relaxed mb-4">
              Order tracking, quotation requests, and consultation history will be connected in future stages.
            </p>
            <div className="space-y-3">
              <Link
                href="/contact"
                onClick={() => setAccountOpen(false)}
                className="block w-full py-2.5 text-center text-[11px] uppercase tracking-wider font-medium bg-[#1C1917] text-[#FDFBF7]"
              >
                Contact Showroom
              </Link>
              <Link
                href="/services"
                onClick={() => setAccountOpen(false)}
                className="block w-full py-2.5 text-center text-[11px] uppercase tracking-wider font-medium border border-[#1C1917] text-[#1C1917]"
              >
                Request Consultation
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
