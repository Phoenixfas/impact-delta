"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Inbox,
  TrendingUp,
  Mail,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Clock,
  Building2,
  Sparkles,
  Download,
  PlusCircle,
  FileText,
} from "lucide-react";

interface StatsData {
  stats: {
    totalInquiries: number;
    newInquiries: number;
    totalBriefs: number;
    activeBriefs: number;
    wonBriefs: number;
    conversionRate: string;
    totalSubscribers: number;
  };
  recentActivity: {
    briefs: Array<{
      id: string;
      referenceCode: string;
      companyName: string;
      eventName: string;
      status: string;
      budget: string;
      currency: string;
      createdAt: string;
    }>;
    inquiries: Array<{
      id: string;
      name: string;
      email: string;
      subject: string;
      status: string;
      createdAt: string;
    }>;
  };
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dashboard metrics:", err);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
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
      case "CONTACTED":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "CLOSED":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Executive Command Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time telemetry on exhibition stand RFPs, inbound sales leads, and audience reach.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/briefs"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Briefs</span>
          </Link>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#003E95] hover:bg-[#002D6E] text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Journal Article</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Total Inquiries */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Total Inquiries
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#003E95] flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {loading ? "..." : data?.stats?.totalInquiries ?? 0}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-medium">
              <span className="text-[#003E95] font-bold">
                {data?.stats?.newInquiries ?? 0}
              </span>
              <span>new pending action</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Active Stand Briefs */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Active Stand Briefs
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#00A7F5] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {loading ? "..." : data?.stats?.activeBriefs ?? 0}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-medium">
              <span>Out of</span>
              <span className="font-bold text-slate-700">
                {data?.stats?.totalBriefs ?? 0}
              </span>
              <span>total submissions</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Brief Conversion Rate */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Won Stand Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-emerald-700 tracking-tight">
              {loading ? "..." : data?.stats?.conversionRate ?? "0.0%"}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-medium">
              <span className="font-bold text-emerald-600">
                {data?.stats?.wonBriefs ?? 0}
              </span>
              <span>contracts awarded</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Newsletter Audience */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Subscribers
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {loading ? "..." : data?.stats?.totalSubscribers ?? 0}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-medium">
              <span>Active industry readers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Activity Stream Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Stand Briefs Stream (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#003E95]/10 text-[#003E95] flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Recent Stand Architecture RFPs
                  </h2>
                  <p className="text-xs text-slate-500">
                    Latest 6-step wizard submissions from exhibitors
                  </p>
                </div>
              </div>

              <Link
                href="/admin/briefs"
                className="text-xs font-semibold text-[#003E95] hover:text-[#00A7F5] flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {loading ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Loading submissions...
                </div>
              ) : !data?.recentActivity?.briefs?.length ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No stand briefs registered yet.
                </div>
              ) : (
                data.recentActivity.briefs.map((brief) => (
                  <div
                    key={brief.id}
                    className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#003E95]">
                          {brief.referenceCode}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${getStatusBadge(
                            brief.status
                          )}`}
                        >
                          {brief.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-slate-800">
                        {brief.companyName}
                      </div>
                      <div className="text-xs text-slate-400">
                        {brief.eventName} • Budget: {brief.currency} {brief.budget}
                      </div>
                    </div>

                    <Link
                      href={`/admin/briefs/${brief.id}`}
                      className="p-2 rounded-xl text-slate-400 hover:text-[#003E95] hover:bg-blue-50 transition-colors"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Contact Inquiries (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-[#00A7F5] flex items-center justify-center font-bold">
                  <Inbox className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Inbound Inquiries
                  </h2>
                  <p className="text-xs text-slate-500">
                    General contact form leads
                  </p>
                </div>
              </div>

              <Link
                href="/admin/contacts"
                className="text-xs font-semibold text-[#003E95] hover:text-[#00A7F5] flex items-center gap-1"
              >
                <span>Inbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {loading ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Loading inquiries...
                </div>
              ) : !data?.recentActivity?.inquiries?.length ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No contact inquiries recorded yet.
                </div>
              ) : (
                data.recentActivity.inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors"
                  >
                    <div className="space-y-0.5 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800 truncate">
                          {inq.name}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${getStatusBadge(
                            inq.status
                          )}`}
                        >
                          {inq.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {inq.subject || "General inquiry"}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <Link
                      href="/admin/contacts"
                      className="p-2 rounded-xl text-slate-400 hover:text-[#00A7F5] hover:bg-sky-50 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
