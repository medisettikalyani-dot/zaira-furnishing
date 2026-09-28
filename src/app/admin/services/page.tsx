'use client';

import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Edit2,
  Upload,
  Check,
  X,
  Plus,
  Trash2,
  Calendar,
} from 'lucide-react';
import { DbService } from '@/lib/db/types';

export default function AdminServicesPage() {
  const [services, setServices] = useState<DbService[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<DbService> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      setServices(data.data || []);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'services');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setEditingService((prev) => ({ ...prev, image: data.url }));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.name || !editingService?.slug) return;

    setSubmitting(true);
    try {
      const isEdit = !!editingService.id;
      const res = await fetch('/api/admin/services', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save service');
      }

      setModalOpen(false);
      setEditingService(null);
      await fetchServices();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error saving service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (srv: DbService) => {
    try {
      await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: srv.id, active: srv.active === 1 ? 0 : 1 }),
      });
      await fetchServices();
    } catch (err) {
      console.error('Toggle active error:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#EDE8DE] shadow-2xs">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#9A7B56] block mb-1">
            Atelier Value-Added Services
          </span>
          <h1 className="font-serif text-[24px] sm:text-[28px] text-[#1C1917] font-medium">
            Services Management ({services.length})
          </h1>
          <p className="text-[13px] text-[#78716C]">
            Manage the 8 verified in-home measurement, demo, tailoring, and smart installation services in D1.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingService({
              name: '',
              slug: '',
              short_desc: '',
              full_desc: '',
              image: '/images/hero/living_room.jpg',
              icon_name: 'Sparkles',
              highlights: JSON.stringify(['Professional service']),
              requires_site_visit: 1,
              active: 1,
              display_order: services.length,
            });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1E3A2F] hover:bg-[#152B23] text-white text-[12.5px] font-semibold transition-all shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Service</span>
        </button>
      </div>

      {/* ─── Services Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading ? (
          <div className="md:col-span-2 p-12 text-center text-[#78716C]">
            <div className="w-8 h-8 border-2 border-[#1E3A2F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[13px]">Loading services from Cloudflare D1...</p>
          </div>
        ) : (
          services.map((srv, idx) => {
            let highlightsArray: string[] = [];
            try {
              highlightsArray = JSON.parse(srv.highlights || '[]');
            } catch {
              highlightsArray = [];
            }

            return (
              <div
                key={srv.id}
                className="bg-white rounded-2xl border border-[#EDE8DE] p-5 shadow-2xs flex flex-col justify-between hover:border-[#1E3A2F]/30 transition-all"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-[#FAF7F2] border border-[#EDE8DE] overflow-hidden shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={srv.image}
                        alt={srv.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#8C827A]">#{idx + 1}</span>
                        <h3 className="font-serif text-[16px] font-medium text-[#1C1917] truncate">
                          {srv.name}
                        </h3>
                      </div>
                      <p className="text-[11.5px] text-[#78716C] mt-0.5 font-mono">/{srv.slug}</p>
                      {srv.requires_site_visit === 1 && (
                        <span className="inline-flex items-center gap-1 text-[10.5px] text-[#9A7B56] font-medium mt-1">
                          <Calendar className="w-3 h-3" /> Site Visit Required
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[13px] text-[#57534E] leading-relaxed mb-3">
                    {srv.short_desc}
                  </p>

                  {highlightsArray.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {highlightsArray.map((hl, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#78716C] text-[10.5px] border border-[#EDE8DE]"
                        >
                          {hl}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between">
                  <button
                    onClick={() => handleToggleActive(srv)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                      srv.active === 1
                        ? 'bg-[#15803D]/10 text-[#15803D] border-[#15803D]/20'
                        : 'bg-stone-100 text-stone-500 border-stone-200'
                    }`}
                  >
                    {srv.active === 1 ? 'Active on Site' : 'Disabled'}
                  </button>

                  <button
                    onClick={() => {
                      setEditingService(srv);
                      setModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#EDE8DE] hover:border-[#1E3A2F] text-[12px] font-medium text-[#1C1917] transition-all cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Service</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ─── Service Edit Modal ─── */}
      {modalOpen && editingService && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE8DE] mb-4">
              <h2 className="font-serif text-[18px] text-[#1C1917] font-medium">
                {editingService.id ? 'Edit Atelier Service' : 'Add Atelier Service'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-[#8C827A] hover:text-[#1C1917]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1C1917] mb-1">
                  Service Name / Title
                </label>
                <input
                  type="text"
                  value={editingService.name || ''}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5CDBF] text-[13.5px] focus:outline-hidden focus:border-[#1E3A2F]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1C1917] mb-1">
                  Slug (Anchor identifier)
                </label>
                <input
                  type="text"
                  value={editingService.slug || ''}
                  onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5CDBF] text-[13.5px] font-mono focus:outline-hidden focus:border-[#1E3A2F]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1C1917] mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingService.short_desc || ''}
                  onChange={(e) => setEditingService({ ...editingService, short_desc: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5CDBF] text-[13px] focus:outline-hidden focus:border-[#1E3A2F]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1C1917] mb-1">
                  Full Description (Optional)
                </label>
                <textarea
                  rows={3}
                  value={editingService.full_desc || ''}
                  onChange={(e) => setEditingService({ ...editingService, full_desc: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5CDBF] text-[13px] focus:outline-hidden focus:border-[#1E3A2F]"
                />
              </div>

              {/* Service Image with R2 Upload */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1C1917] mb-1">
                  Service Photography (R2 or URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingService.image || ''}
                    onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                    required
                    className="flex-1 px-3.5 py-2 rounded-xl border border-[#D5CDBF] text-[13px] font-mono focus:outline-hidden focus:border-[#1E3A2F]"
                  />
                  <label className="px-3.5 py-2 rounded-xl border border-[#D5CDBF] bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[12px] font-semibold text-[#1C1917] cursor-pointer flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1C1917] mb-1">
                  Highlights (comma-separated):
                </label>
                <input
                  type="text"
                  placeholder="Laser accuracy, Free doorstep demo, 5-year warranty..."
                  value={
                    typeof editingService.highlights === 'string'
                      ? (() => {
                          try {
                            return JSON.parse(editingService.highlights).join(', ');
                          } catch {
                            return editingService.highlights;
                          }
                        })()
                      : ''
                  }
                  onChange={(e) => {
                    const items = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                    setEditingService({ ...editingService, highlights: JSON.stringify(items) });
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5CDBF] text-[13px] focus:outline-hidden focus:border-[#1E3A2F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 p-3 rounded-xl border border-[#EDE8DE] bg-[#FAF7F2] cursor-pointer text-[12.5px]">
                  <input
                    type="checkbox"
                    checked={editingService.requires_site_visit === 1}
                    onChange={(e) =>
                      setEditingService({ ...editingService, requires_site_visit: e.target.checked ? 1 : 0 })
                    }
                    className="rounded text-[#1E3A2F]"
                  />
                  <span>Requires Site Visit</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl border border-[#EDE8DE] bg-[#FAF7F2] cursor-pointer text-[12.5px]">
                  <input
                    type="checkbox"
                    checked={editingService.active === 1}
                    onChange={(e) => setEditingService({ ...editingService, active: e.target.checked ? 1 : 0 })}
                    className="rounded text-[#1E3A2F]"
                  />
                  <span>Active on Website</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EDE8DE]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#D5CDBF] text-[12.5px] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="px-5 py-2 rounded-xl bg-[#1E3A2F] text-white text-[12.5px] font-semibold hover:bg-[#152B23]"
                >
                  {submitting ? 'Saving...' : 'Save Service to D1'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
