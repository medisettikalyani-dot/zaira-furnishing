'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Bell,
  CheckCheck,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [newQuotesCount, setNewQuotesCount] = useState<number>(0);
  const [newMeasCount, setNewMeasCount] = useState<number>(0);
  const [unreadOrdersCount, setUnreadOrdersCount] = useState<number>(0);
  const [orderNotifications, setOrderNotifications] = useState<any[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

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

  // Fetch unread WhatsApp order notifications
  const fetchNotifications = useCallback(() => {
    if (checkingAuth || isLoginPage) return;
    fetch('/api/admin/notifications?limit=8')
      .then((r) => r.json())
      .then((data) => {
        if (data?.unreadCount !== undefined) {
          setUnreadOrdersCount(data.unreadCount);
        }
        if (data?.notifications) {
          setOrderNotifications(data.notifications);
        }
      })
      .catch(() => {});
  }, [checkingAuth, isLoginPage]);

  // Periodic polling & route change update
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 25000);
    return () => clearInterval(interval);
  }, [fetchNotifications, pathname]);

  // Listen to custom refresh event (dispatched when orders change or are viewed)
  useEffect(() => {
    const handleRefresh = () => fetchNotifications();
    window.addEventListener('admin-notifications-refresh', handleRefresh);
    return () => window.removeEventListener('admin-notifications-refresh', handleRefresh);
  }, [fetchNotifications]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationsOpen]);

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      if (res.ok) {
        setUnreadOrdersCount(0);
        setOrderNotifications((prev) =>
          prev.map((n) => ({ ...n, is_read: 1 }))
        );
      }
    } catch {
      // silently handle
    }
  };

  const handleMarkSingleRead = async (notifId: string) => {
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: notifId }),
      });
      if (res.ok) {
        setOrderNotifications((prev) =>
          prev.map((n) => (n.id === notifId ? { ...n, is_read: 1 } : n))
        );
        setUnreadOrdersCount((prev) => Math.max(0, prev - 1));
      }
    } catch {
      // silently handle
    }
  };

  const handleOpenOrder = async (orderId: string, notifId?: string) => {
    setNotificationsOpen(false);
    if (notifId) {
      handleMarkSingleRead(notifId);
    }
    router.push(`/admin/orders/${orderId}`);
  };

  const formatNotifTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      const time = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      if (isToday) {
        return `Today, ${time}`;
      }
      return `${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, ${time}`;
    } catch {
      return dateStr;
    }
  };

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
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag, badgeCount: unreadOrdersCount },
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
            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifDropdownRef}>
              <button
                id="admin-notifications-toggle"
                onClick={() => setNotificationsOpen((prev) => !prev)}
                className={`relative p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 focus:outline-hidden ${
                  unreadOrdersCount > 0
                    ? 'border-[#D5CDBF] bg-[#FAF7F2] text-[#1E3A2F] hover:bg-[#F2ECE1] shadow-2xs'
                    : 'border-transparent text-[#8C827A] hover:text-[#1C1917] hover:bg-[#FAF7F2]'
                }`}
                aria-label="Order notifications"
                title={
                  unreadOrdersCount > 0
                    ? `${unreadOrdersCount} unread WhatsApp order${unreadOrdersCount > 1 ? 's' : ''}`
                    : 'Order notifications'
                }
              >
                <Bell className={`w-4 h-4 ${unreadOrdersCount > 0 ? 'text-[#1E3A2F]' : 'text-[#8C827A]'}`} />
                {unreadOrdersCount > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 bg-[#9A7B56] text-white text-[10.5px] font-bold rounded-full flex items-center justify-center leading-none shadow-2xs">
                    {unreadOrdersCount > 99 ? '99+' : unreadOrdersCount}
                  </span>
                )}
              </button>

              {/* Dropdown Panel */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#EAE4D8] shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Dropdown Header */}
                  <div className="p-3.5 bg-[#FAF7F2] border-b border-[#EDE8DE] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-[14px] font-semibold text-[#1C1917]">
                        New Orders
                      </span>
                      {unreadOrdersCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#9A7B56] text-white">
                          {unreadOrdersCount} unread
                        </span>
                      )}
                    </div>

                    {unreadOrdersCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-medium text-[#9A7B56] hover:text-[#1E3A2F] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-[360px] overflow-y-auto divide-y divide-[#F2ECE1]">
                    {orderNotifications.length === 0 ? (
                      <div className="py-8 px-4 text-center">
                        <Bell className="w-6 h-6 text-[#C4B9A1] mx-auto mb-2 opacity-60" />
                        <p className="text-[13px] font-medium text-[#1C1917]">No WhatsApp orders yet</p>
                        <p className="text-[11.5px] text-[#8C827A] mt-0.5">
                          New WhatsApp orders will alert here automatically.
                        </p>
                      </div>
                    ) : (
                      orderNotifications.map((notif) => {
                        const isUnread = notif.is_read === 0 || notif.is_read === null || !notif.is_read;
                        return (
                          <div
                            key={notif.id}
                            className={`p-3.5 transition-colors ${
                              isUnread ? 'bg-[#FAF8F5] hover:bg-[#F5EFE6]' : 'bg-white hover:bg-[#FAF9F6]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold tracking-wider uppercase">
                                  New WhatsApp Order
                                </span>
                                {isUnread && (
                                  <span className="w-2 h-2 rounded-full bg-[#9A7B56]" title="Unread" />
                                )}
                              </div>
                              <span className="text-[10.5px] text-[#8C827A] shrink-0">
                                {formatNotifTime(notif.created_at)}
                              </span>
                            </div>

                            <div className="mt-2 flex items-baseline justify-between gap-2">
                              <span className="font-mono text-[12px] font-bold text-[#1C1917]">
                                #{notif.order_number}
                              </span>
                              <span className="font-semibold text-[13px] text-[#1E3A2F]">
                                ₹{Number(notif.total_amount).toLocaleString('en-IN')}
                              </span>
                            </div>

                            <div className="text-[12px] text-[#57534E] mt-0.5 truncate">
                              {notif.customer_name}
                            </div>

                            <div className="mt-2.5 pt-2 border-t border-[#EDE8DE]/70 flex items-center justify-between">
                              <button
                                onClick={() => handleOpenOrder(notif.order_id, notif.id)}
                                className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#1E3A2F] hover:text-[#9A7B56] transition-colors cursor-pointer"
                              >
                                <span>View Order</span>
                                <span aria-hidden="true">→</span>
                              </button>
                              {isUnread && (
                                <button
                                  onClick={() => handleMarkSingleRead(notif.id)}
                                  className="text-[11px] text-[#8C827A] hover:text-[#1C1917] transition-colors cursor-pointer"
                                >
                                  Acknowledge
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Footer Link */}
                  <div className="p-2.5 bg-[#FAF7F2] border-t border-[#EDE8DE] text-center">
                    <Link
                      href="/admin/orders"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[11.5px] font-semibold text-[#1E3A2F] hover:text-[#9A7B56] transition-colors"
                    >
                      View All Orders in Ledger →
                    </Link>
                  </div>
                </div>
              )}
            </div>

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
