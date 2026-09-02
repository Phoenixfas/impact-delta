"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Layers,
  Search,
  Download,
  Filter,
  ArrowRight,
  Eye,
  RefreshCw,
  Building2,
  Calendar,
  DollarSign,
  User,
} from "lucide-react";

interface StandBriefItem {
  id: string;
  referenceCode: string;
  status: string;
  eventName: string;
  companyName: string;
  contactPerson: string;
  email: string;
  contactNumber: string;
  standSize: string;
  standType: string;
  budget: string;
  currency: string;
  assignedSales?: {
    name: string;
    email: string;
  } | null;
  createdAt: string;
}

export default function AdminBriefsPage() {
  const [briefs, setBriefs] = useState<StandBriefItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBriefs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
      });
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/briefs?${params.toString()}`);
      const data = await res.json();
      if (data.briefs) {
        setBriefs(data.briefs);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch stand briefs:", err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchBriefs();
  }, [fetchBriefs]);

  const handleExportCsv = () => {
    const params = new URLSearchParams({ export: "csv" });
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (search.trim()) params.set("search", search.trim());
    window.open(`/api/admin/briefs?${params.toString()}`, "_blank");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-blue-50 text-[#003E95] border-blue-200";
      case "IN_REVIEW":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "PROPOSAL_SENT":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "WON":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "LOST":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const statusOptions = [
    { label: "All Statuses", value: "ALL" },
    { label: "Submitted", value: "SUBMITTED" },
    { label: "In Review", value: "IN_REVIEW" },
    { label: "Proposal Sent", value: "PROPOSAL_SENT" },
    { label: "Won / Awarded", value: "WON" },
    { label: "Lost", value: "LOST" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Stand Architecture Briefs
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#003E95] text-xs font-mono font-bold">
              {total} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage, assign, and track multi-step exhibition RFPs and technical stand requirements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchBriefs}
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

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by reference code, company, event, contact person..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5] focus:ring-2 focus:ring-[#00A7F5]/10"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setStatusFilter(opt.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === opt.value
                  ? "bg-[#003E95] text-white shadow-xs"
                  : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stand Briefs Table */}
      <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/60 text-[11px] font-mono uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Company & Event</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Size & Layout</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Sales</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#003E95]" />
                      <span>Loading stand briefs...</span>
                    </div>
                  </td>
                </tr>
              ) : briefs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No stand briefs matched the current filter.
                  </td>
                </tr>
              ) : (
                briefs.map((brief) => (
                  <tr
                    key={brief.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Reference Code */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#003E95]">
                      {brief.referenceCode}
                    </td>

                    {/* Company & Event */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        {brief.companyName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {brief.eventName}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">
                        {brief.contactPerson}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {brief.email}
                      </div>
                    </td>

                    {/* Size & Layout */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">
                        {brief.standSize}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {brief.standType}
                      </div>
                    </td>

                    {/* Budget */}
                    <td className="py-3.5 px-4 font-semibold text-emerald-700">
                      {brief.currency} {brief.budget}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${getStatusBadge(
                          brief.status
                        )}`}
                      >
                        {brief.status.replace("_", " ")}
                      </span>
                    </td>

                    {/* Assigned Sales */}
                    <td className="py-3.5 px-4">
                      {brief.assignedSales ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-blue-100 text-[#003E95] font-bold text-[10px] flex items-center justify-center">
                            {brief.assignedSales.name[0]}
                          </div>
                          <span className="font-medium text-slate-800 truncate max-w-[120px]">
                            {brief.assignedSales.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/briefs/${brief.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:text-[#003E95] hover:border-blue-200 text-xs font-semibold shadow-2xs transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review</span>
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
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Showing page <span className="font-bold text-slate-800">{page}</span> of{" "}
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
