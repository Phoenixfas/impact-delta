"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Mail,
  Search,
  Download,
  RefreshCw,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
} from "lucide-react";

interface SubscriberItem {
  id: string;
  email: string;
  topics?: string[] | any;
  status: "ACTIVE" | "UNSUBSCRIBED";
  createdAt: string;
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/subscribers?${params.toString()}`);
      const data = await res.json();
      if (data.subscribers) {
        setSubscribers(data.subscribers);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch subscribers:", err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "UNSUBSCRIBED" : "ACTIVE";
    try {
      const res = await fetch("/api/admin/subscribers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setSubscribers((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus as any } : s))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this subscriber?")) return;
    try {
      const res = await fetch(`/api/admin/subscribers?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete subscriber");
      }
    } catch (err) {
      console.error("Failed to delete subscriber:", err);
    }
  };

  const handleExportCsv = () => {
    const params = new URLSearchParams({ export: "csv" });
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (search.trim()) params.set("search", search.trim());
    window.open(`/api/admin/subscribers?${params.toString()}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Newsletter Subscribers
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#003E95] text-xs font-mono font-bold">
              {total} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Active audience subscriptions for the Impact Makers Journal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSubscribers}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-xs transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5] focus:ring-2 focus:ring-[#00A7F5]/10"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {["ALL", "ACTIVE", "UNSUBSCRIBED"].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? "bg-[#003E95] text-white shadow-xs"
                  : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {st === "ALL" ? "All" : st.charAt(0) + st.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/60 text-[11px] font-mono uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-3 px-4">Subscriber Email</th>
                <th className="py-3 px-4">Subscribed Topics</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#003E95]" />
                      <span>Loading subscribers...</span>
                    </div>
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Email */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {sub.email}
                    </td>

                    {/* Topics */}
                    <td className="py-3.5 px-4">
                      {Array.isArray(sub.topics) && sub.topics.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {sub.topics.map((t: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">All Updates</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${
                          sub.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(sub.id, sub.status)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors shadow-2xs ${
                          sub.status === "ACTIVE"
                            ? "border-amber-200 bg-amber-50/60 text-amber-700 hover:bg-amber-100"
                            : "border-emerald-200 bg-emerald-50/60 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {sub.status === "ACTIVE" ? "Unsubscribe" : "Reactivate"}
                      </button>
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-rose-600 hover:border-rose-200 transition-colors shadow-2xs"
                        title="Delete Subscriber"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Page <span className="font-bold text-slate-800">{page}</span> of{" "}
              <span className="font-bold text-slate-800">{totalPages}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
