'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Grid,
  Package,
  Wrench,
  FileText,
  ShoppingBag,
  Users,
  Truck,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  FileQuestion,
  Ruler,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [newQuotesCount, setNewQuotesCount] = useState<number>(0);
  const [newMeasCount, setNewMeasCount] = useState<number>(0);

  // If on login page, render clean container without sidebar
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    // Verify session
    fetch('/api/admin/auth')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push('/admin/login');
        } else {
          setCheckingAuth(false);
        }
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [pathname, isLoginPage, router]);

  // Fetch real counts of NEW requests for badges
  useEffect(() => {
    if (checkingAuth || isLoginPage) return;
    fetch('/api/quote-requests?status=NEW&limit=1')
      .then((r) => r.json())
      .then((data) => {
        if (data?.counts?.new !== undefined) setNewQuotesCount(data.counts.new);
      })
      .catch(() => {});

    fetch('/api/measurement-requests?status=NEW&limit=1')
      .then((r) => r.json())
      .then((data) => {
        if (data?.counts?.new !== undefined) setNewMeasCount(data.counts.new);
      })
      .catch(() => {});
  }, [checkingAuth, isLoginPage, pathname]);

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#F7F4EE]">{children}</div>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#10231C] text-[#FAF7F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#9A7B56] border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] text-[#A8A29E] tracking-wider uppercase">Authenticating Atelier Console...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Quote Requests', href: '/admin/quote-requests', icon: FileQuestion, badgeCount: newQuotesCount },
    { label: 'Measurement Requests', href: '/admin/measurement-requests', icon: Ruler, badgeCount: newMeasCount },
    { label: 'Categories', href: '/admin/categories', icon: Grid },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Atelier Services', href: '/admin/services', icon: Wrench },
    { label: 'Homepage CMS', href: '/admin/cms', icon: FileText },
  ];

  const futureStages = [
    { label: 'Customers', href: '#', icon: Users, badge: 'Stage 6' },
    { label: 'Vendors', href: '#', icon: Truck, badge: 'Stage 6' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EE] flex text-[#1C1917]">
      {/* ─── Mobile Sidebar Backdrop ─── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={`fixed lg:sticky top-0 h-screen z-50 w-64 bg-[#152B23] text-[#FAF7F2] flex flex-col transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-[#234237] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#9A7B56] rounded-md flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-[15px] font-bold tracking-wider text-white uppercase block leading-none">
                ZAIRA
              </span>
              <span className="text-[7.5px] uppercase tracking-[0.25em] text-[#C4B9A1] block mt-0.5 leading-none">
                ATELIER ADMIN
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-[#A8A29E] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C4B9A1]/60 px-3 block mb-2">
              Catalog & Content
            </span>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
                      isActive
                        ? 'bg-[#1E3A2F] text-white font-semibold shadow-xs'
                        : 'text-[#A8A29E] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#9A7B56]' : 'text-[#8C827A]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badgeCount !== undefined && item.badgeCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#9A7B56] text-white">
                        {item.badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C4B9A1]/60 px-3 block mb-2">
              Upcoming Modules
            </span>
            <nav className="space-y-1">
              {futureStages.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] text-[#A8A29E]/60 select-none"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#8C827A]/50" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-[#C4B9A1]/70">
                      {item.badge}
                    </span>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Quick Actions */}
        <div className="p-4 border-t border-[#234237] space-y-2 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-[12px] text-[#A8A29E] hover:text-white hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#9A7B56]" />
              <span>Live Website</span>
            </div>
            <span className="text-[10px] text-[#8C827A]">Open ↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content Area ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 px-4 sm:px-8 bg-white border-b border-[#EAE4D8] flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 text-[#1C1917] hover:bg-[#FAF7F2] rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-[12px] uppercase tracking-[0.16em] text-[#8C827A] font-medium hidden sm:inline-block">
              Zaira Furnishing Management Atelier
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[12px] text-[#1C1917] bg-[#FAF7F2] border border-[#EAE4D8] px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
              <span className="font-semibold text-[#1E3A2F]">Admin Session Active</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
