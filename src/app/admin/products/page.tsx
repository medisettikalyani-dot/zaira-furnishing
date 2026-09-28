'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  Sparkles,
  Package,
} from 'lucide-react';
import { DbProduct, DbCategory } from '@/lib/db/types';

interface ExtendedProduct extends DbProduct {
  category_name: string;
  category_slug: string;
  subcategory_name?: string;
  main_image?: string;
  variant_count: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedActive, setSelectedActive] = useState('1');

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories?active=1');
      const data = await res.json();
      setCategories(data.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory) params.append('categoryId', selectedCategory);
      if (selectedActive !== '') params.append('active', selectedActive);

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.data || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedActive]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleToggleActive = async (product: ExtendedProduct) => {
    try {
      const newStatus = product.active === 1 ? 0 : 1;
      await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: newStatus }),
      });
      await fetchProducts();
    } catch (err) {
      console.error('Toggle active error:', err);
    }
  };

  const handleToggleFeatured = async (product: ExtendedProduct) => {
    try {
      const newFeatured = product.featured === 1 ? 0 : 1;
      await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: newFeatured }),
      });
      await fetchProducts();
    } catch (err) {
      console.error('Toggle featured error:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#EDE8DE] shadow-2xs">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#9A7B56] block mb-1">
            Cloudflare D1 Catalog
          </span>
          <h1 className="font-serif text-[24px] sm:text-[28px] text-[#1C1917] font-medium">
            Products ({products.length})
          </h1>
          <p className="text-[13px] text-[#78716C]">
            Manage all active catalog items, specifications, variants, and bespoke customization configurations.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1E3A2F] hover:bg-[#152B23] text-white text-[12.5px] font-semibold transition-all shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </Link>
      </div>

      {/* ─── Filters & Search ─── */}
      <div className="bg-white p-4 rounded-2xl border border-[#EDE8DE] shadow-2xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, slug, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-[#D5CDBF] text-[13px] focus:outline-hidden focus:border-[#1E3A2F]"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-56 shrink-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#D5CDBF] text-[13px] bg-white focus:outline-hidden focus:border-[#1E3A2F]"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-40 shrink-0">
          <select
            value={selectedActive}
            onChange={(e) => setSelectedActive(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#D5CDBF] text-[13px] bg-white focus:outline-hidden focus:border-[#1E3A2F]"
          >
            <option value="1">Active Only</option>
            <option value="">All Statuses</option>
            <option value="0">Disabled Only</option>
          </select>
        </div>
      </div>

      {/* ─── Products Table ─── */}
      <div className="bg-white rounded-2xl border border-[#EDE8DE] shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#78716C]">
            <div className="w-8 h-8 border-2 border-[#1E3A2F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[13px]">Querying Cloudflare D1 database...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-[#78716C]">
            <Package className="w-8 h-8 text-[#8C827A] mx-auto mb-2" />
            <p className="text-[14px] font-medium text-[#1C1917]">No products matched your criteria</p>
            <p className="text-[12px] text-[#78716C] mt-1">Try clearing filters or search terms</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F2ECE1]">
            {products.map((p, idx) => (
              <div
                key={p.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAF7F2]/50 transition-colors"
              >
                {/* Product Info */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <span className="text-[11px] font-mono text-[#8C827A] w-6 text-right shrink-0">
                    {idx + 1}
                  </span>
                  <div className="w-14 h-14 rounded-xl bg-[#FAF7F2] border border-[#EDE8DE] overflow-hidden shrink-0 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.main_image || '/images/hero/living_room.jpg'}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[14px] font-semibold text-[#1C1917] truncate">
                        {p.name}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#EDE8DE] text-[#57534E]">
                        {p.product_type === 'custom_made' ? 'Custom Made' : 'Standard'}
                      </span>
                      {p.featured === 1 && (
                        <span className="text-[9.5px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#9A7B56]/15 text-[#9A7B56]">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#78716C] truncate mt-0.5">
                      {p.category_name} {p.subcategory_name ? `· ${p.subcategory_name}` : ''} · /{p.slug}
                    </p>
                    <span className="text-[11.5px] text-[#8C827A]">
                      {p.variant_count} color/material options
                    </span>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#F2ECE1]">
                  <div className="text-right">
                    <span className="font-serif text-[15px] font-bold text-[#1C1917] block">
                      {p.starting_price === 1 ? 'From ' : ''}₹{p.base_price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-[#8C827A]">/{p.unit || 'piece'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleFeatured(p)}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-semibold border transition-all cursor-pointer ${
                        p.featured === 1
                          ? 'bg-[#9A7B56] text-white border-[#9A7B56]'
                          : 'border-[#EDE8DE] text-[#78716C] hover:border-[#9A7B56]'
                      }`}
                      title="Toggle homepage featured"
                    >
                      ★ {p.featured === 1 ? 'Featured' : 'Regular'}
                    </button>

                    <button
                      onClick={() => handleToggleActive(p)}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-semibold border transition-all cursor-pointer ${
                        p.active === 1
                          ? 'bg-[#15803D]/10 text-[#15803D] border-[#15803D]/20'
                          : 'bg-stone-100 text-stone-500 border-stone-200'
                      }`}
                    >
                      {p.active === 1 ? 'Active' : 'Disabled'}
                    </button>

                    <Link
                      href={`/admin/products/${p.id}`}
                      className="p-1.5 rounded-lg text-[#57534E] hover:text-[#1E3A2F] hover:bg-black/5 transition-all"
                      title="Edit product in detail"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>

                    <Link
                      href={`/products/${p.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-[#8C827A] hover:text-[#1E3A2F] hover:bg-black/5 transition-all"
                      title="Preview on customer website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
