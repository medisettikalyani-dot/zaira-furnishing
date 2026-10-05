'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Heart, ShoppingBag, Calendar } from 'lucide-react';
import { useStore } from '@/lib/context/StoreContext';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, wishlistCount, setIsCartOpen, openBookingModal } = useStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe">
      <div className="grid grid-cols-5 items-center h-15 px-2">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            pathname === '/' ? 'text-[#1E3A2F] font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Home className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] tracking-tight mt-0.5">Home</span>
        </Link>

        {/* Categories */}
        <Link
          href="/categories"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            pathname.startsWith('/categories') ? 'text-[#1E3A2F] font-bold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <LayoutGrid className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] tracking-tight mt-0.5">Categories</span>
        </Link>

        {/* Book Visit Center Action Button */}
        <button
          type="button"
          onClick={() => openBookingModal('Free In-Home Measurement')}
          className="flex flex-col items-center justify-center py-1 text-[#1E3A2F] transition-transform active:scale-95 cursor-pointer -mt-3"
          aria-label="Book Free In-Home Measurement"
        >
          <div className="w-11 h-11 rounded-full bg-[#1E3A2F] text-white flex items-center justify-center shadow-md border-2 border-white">
            <Calendar className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#1E3A2F] mt-0.5">
            Book Visit
          </span>
        </button>

        {/* Wishlist */}
        <Link
          href="/account"
          className="relative flex flex-col items-center justify-center py-1 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <Heart className="w-5 h-5 stroke-[2]" />
          {wishlistCount > 0 && (
            <span className="absolute top-0 right-4 min-w-[16px] h-[16px] px-1 text-[9px] font-bold text-white bg-[#D97706] rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
          <span className="text-[10px] tracking-tight mt-0.5">Wishlist</span>
        </Link>

        {/* Cart Bag */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 text-gray-500 hover:text-[#1E3A2F] transition-colors cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[2]" />
            <span className="absolute -top-1 -right-2 min-w-[16px] h-[16px] px-1 text-[9px] font-bold text-white bg-[#1E3A2F] rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Bag</span>
        </button>
      </div>
    </div>
  );
}
