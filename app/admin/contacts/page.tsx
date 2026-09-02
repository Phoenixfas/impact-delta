"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Inbox,
  Search,
  Download,
  Filter,
  Eye,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Trash2,
  X,
  User,
  MessageSquare,
} from "lucide-react";

interface ContactItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  status: "NEW" | "CONTACTED" | "CLOSED";
  createdAt: string;
}

export default function AdminContactsPage() {
  const [inquiries, setInquiries] = useState<ContactItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Active inquiry for modal view
  const [activeInquiry, setActiveInquiry] = useState<ContactItem | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
      });
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/contacts?${params.toString()}`);
      const data = await res.json();
      if (data.inquiries) {
        setInquiries(data.inquiries);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch contact inquiries:", err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: newStatus as any } : item
          )
        );
        if (activeInquiry?.id === id) {
          setActiveInquiry((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this contact inquiry?")) return;

    try {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInquiries((prev) => prev.filter((item) => item.id !== id));
        if (activeInquiry?.id === id) setActiveInquiry(null);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete inquiry.");
      }
    } catch (err) {
      console.error("Failed to delete inquiry:", err);
    }
  };

  const handleExportCsv = () => {
    const params = new URLSearchParams({ export: "csv" });
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (search.trim()) params.set("search", search.trim());
    window.open(`/api/admin/contacts?${params.toString()}`, "_blank");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-50 text-[#003E95] border-blue-200";
      case "CONTACTED":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "CLOSED":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Contact Inquiries Inbox
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#003E95] text-xs font-mono font-bold">
              {total} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Incoming exhibition and summit RFPs submitted via the main contact page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchContacts}
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
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client name, email, phone, subject..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5] focus:ring-2 focus:ring-[#00A7F5]/10"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {["ALL", "NEW", "CONTACTED", "CLOSED"].map((st) => (
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

      {/* Inquiries Table */}
      <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/60 text-[11px] font-mono uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Subject & Scope</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#003E95]" />
                      <span>Loading contact inquiries...</span>
                    </div>
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                inquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{inq.name}</div>
                      <div className="text-[11px] text-slate-500">{inq.email}</div>
                      {inq.phone && (
                        <div className="text-[10px] text-slate-400">{inq.phone}</div>
                      )}
                    </td>

                    {/* Subject & Message snippet */}
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="font-semibold text-slate-800 truncate">
                        {inq.subject || "General Inquiry"}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {inq.message}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-1 rounded-md border ${getStatusBadge(
                          inq.status
                        )} cursor-pointer focus:outline-none`}
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => setActiveInquiry(inq)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 text-[#003E95] hover:border-blue-200 transition-colors shadow-2xs"
                        title="View Full Inquiry"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(inq.id)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-rose-600 hover:border-rose-200 transition-colors shadow-2xs"
                        title="Delete Inquiry"
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

      {/* Inquiry Detail Modal */}
      {activeInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200/80 shadow-2xl rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#003E95] flex items-center justify-center font-bold">
                  <Inbox className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {activeInquiry.subject || "Contact Inquiry"}
                  </h3>
                  <span className="text-xs text-slate-400">
                    Received {new Date(activeInquiry.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveInquiry(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div>
                  <span className="text-slate-400 block font-medium">Client Name:</span>
                  <span className="font-bold text-slate-800">{activeInquiry.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Email:</span>
                  <a
                    href={`mailto:${activeInquiry.email}`}
                    className="font-bold text-[#003E95] underline"
                  >
                    {activeInquiry.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Phone:</span>
                  <span className="font-bold text-slate-800">
                    {activeInquiry.phone || "Not provided"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Status:</span>
                  <select
                    value={activeInquiry.status}
                    onChange={(e) => handleStatusChange(activeInquiry.id, e.target.value)}
                    className="text-xs font-semibold px-2 py-0.5 rounded-md border border-slate-200 bg-white"
                  >
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-medium mb-1.5">Message Content:</span>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {activeInquiry.message}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <a
                href={`mailto:${activeInquiry.email}?subject=Re: ${encodeURIComponent(
                  activeInquiry.subject || "Your Inquiry to Impact Makers Events"
                )}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#003E95] text-white font-semibold text-xs shadow-xs hover:bg-[#002D6E] transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Compose Reply Email</span>
              </a>

              <button
                onClick={() => setActiveInquiry(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
