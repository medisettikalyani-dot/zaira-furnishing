'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Ruler,
  Search,
  Calendar,
  Phone,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Eye,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { DbMeasurementRequest, MeasurementRequestStatus } from '@/lib/db/types';

interface MeasurementCounts {
  all: number;
  new: number;
  contacted: number;
  scheduled: number;
  completed: number;
  cancelled: number;
}

export default function AdminMeasurementRequestsPage() {
  const [requests, setRequests] = useState<DbMeasurementRequest[]>([]);
  const [counts, setCounts] = useState<MeasurementCounts>({
    all: 0,
    new: 0,
    contacted: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      params.set('page', String(page));
      params.set('limit', '15');

      const res = await fetch(`/api/measurement-requests?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to load measurement requests (${res.status})`);
      }
      const data = await res.json();
      setRequests(data.measurementRequests || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
      if (data.counts) {
        setCounts(data.counts);
      }
    } catch (err: any) {
      console.error('Error fetching admin measurement requests:', err);
      setError(err.message || 'Failed to connect to database.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRequests();
  };

  const getStatusBadge = (status: MeasurementRequestStatus) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            NEW
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            CONTACTED
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <Calendar className="w-3 h-3 text-purple-600" />
            SCHEDULED
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            COMPLETED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            CANCELLED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-stone-100 text-stone-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-stone-500 text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#9A7B56]" />
            <span>Atelier In-Home Measurement</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#1C1917]">Measurement Requests</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Complimentary in-home laser measurement visits booked by customers.
          </p>
        </div>
        <button
          onClick={() => fetchRequests()}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-stone-200 text-stone-700 rounded-lg text-xs font-medium hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'ALL', label: 'All', count: counts.all },
          { key: 'NEW', label: 'New', count: counts.new },
          { key: 'CONTACTED', label: 'Contacted', count: counts.contacted },
          { key: 'SCHEDULED', label: 'Scheduled', count: counts.scheduled },
          { key: 'COMPLETED', label: 'Completed', count: counts.completed },
          { key: 'CANCELLED', label: 'Cancelled', count: counts.cancelled },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setStatusFilter(tab.key);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              statusFilter === tab.key
                ? 'bg-[#152B23] text-white shadow-2xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                statusFilter === tab.key
                  ? 'bg-white/20 text-white'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by request number, customer name, phone, email, or product..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-xs outline-none focus:border-[#9A7B56]"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-[#152B23] text-white rounded-lg text-xs font-semibold hover:bg-[#1E3A2F] transition-colors cursor-pointer"
        >
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setPage(1);
            }}
            className="px-3 py-2 bg-white border border-stone-200 text-stone-600 rounded-lg text-xs hover:bg-stone-50 cursor-pointer"
          >
            Clear
          </button>
        )}
      </form>

      {/* Error Alert */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#FAF7F2] border-b border-stone-200 text-stone-600 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Request #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Preferred Date</th>
                <th className="py-3 px-4">Time Slot</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-normal">
              {loading && requests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#9A7B56]" />
                    <span>Loading measurement requests...</span>
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    <Ruler className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                    <p className="font-medium text-stone-600">No measurement requests found</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Customer bookings for free measurement visits will appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-[#1C1917]">
                      {req.request_number}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-stone-900">{req.customer_name}</div>
                      {req.address && (
                        <div className="text-[11px] text-stone-400 truncate max-w-[180px] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>{req.address}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-stone-700">
                        <Phone className="w-3 h-3 text-stone-400" />
                        <span>{req.customer_phone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-stone-900 truncate max-w-[180px]">
                        {req.product_name_snapshot}
                      </div>
                      {req.variant_name_snapshot && (
                        <div className="text-[11px] text-[#9A7B56]">
                          Variant: {req.variant_name_snapshot}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-stone-700 font-medium">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{req.preferred_date}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-stone-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{req.preferred_time_slot}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/measurement-requests/${req.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 text-stone-700 rounded-md hover:bg-stone-100 hover:text-stone-900 transition-colors text-[11px] font-medium cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="py-3 px-4 border-t border-stone-200 bg-[#FAF7F2] flex items-center justify-between text-xs text-stone-600">
            <div>
              Showing page <span className="font-semibold">{page}</span> of{' '}
              <span className="font-semibold">{totalPages}</span> ({totalCount} total)
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
