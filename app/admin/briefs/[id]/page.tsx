"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Layers,
  Building2,
  Calendar,
  DollarSign,
  User,
  Phone,
  Mail,
  Globe,
  MapPin,
  CheckCircle2,
  FileText,
  Download,
  Send,
  MessageSquare,
  Clock,
  Sparkles,
  Shield,
  Save,
  AlertCircle,
  Tv,
  Wifi,
  Package,
  ExternalLink,
} from "lucide-react";

interface NoteItem {
  id: string;
  text: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
}

interface BriefDetail {
  id: string;
  referenceCode: string;
  status: string;
  eventName: string;
  companyName: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  website?: string | null;
  standLocation: string;
  standSize: string;
  standType: string;
  floorPlanUrl?: string | null;
  primaryGoals: any;
  otherGoalDetails?: string | null;
  colorScheme: string;
  currency: string;
  budget: string;
  productsDescription: string;
  productFiles?: any;
  displayItems?: any;
  meetingAreaType: string;
  meetingCapacity?: string | null;
  otherMeetingDetails?: string | null;
  additionalMeetingNotes?: string | null;
  aboveStandOptions?: any;
  carpetColor?: string | null;
  flooringOption?: string | null;
  storeRoomSize?: string | null;
  storeRoomNotes?: string | null;
  ledScreenQty: number;
  ledScreenSize: string;
  venueServices?: any;
  avAdditionalNotes?: string | null;
  specialRequirements?: any;
  additionalComments?: string | null;
  internalNotes?: NoteItem[] | any;
  assignedSalesId?: string | null;
  assignedSales?: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

function getDownloadApiUrl(fileParam?: string | null, isDownload = false): string | null {
  if (!fileParam) return null;
  const trimmed = fileParam.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const cleanName = trimmed.replace(/^\/uploads\//, "").replace(/^uploads\//, "");
  return `/api/download?file=${encodeURIComponent(cleanName)}${isDownload ? "&download=1" : "&download=0"}`;
}

export default function StandBriefDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [brief, setBrief] = useState<BriefDetail | null>(null);
  const [salesUsers, setSalesUsers] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSalesId, setSelectedSalesId] = useState("");
  const [newNoteText, setNewNoteText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState("");

  useEffect(() => {
    // Fetch brief details
    fetch(`/api/admin/briefs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.brief) {
          setBrief(data.brief);
          setSelectedStatus(data.brief.status);
          setSelectedSalesId(data.brief.assignedSalesId || "");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch brief details:", err);
        setLoading(false);
      });

    // Fetch team members for sales assignment dropdown
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.users) {
          setSalesUsers(data.users);
        }
      })
      .catch(() => {
        // Sales users endpoint might be restricted for non-admins, silently handle
      });
  }, [id]);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveSuccessMessage("");

    try {
      const res = await fetch(`/api/admin/briefs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedStatus,
          assignedSalesId: selectedSalesId || null,
          noteText: newNoteText.trim() ? newNoteText : undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.brief) {
        setBrief(data.brief);
        setNewNoteText("");
        setSaveSuccessMessage("Changes & activity log saved successfully.");
        setTimeout(() => setSaveSuccessMessage(""), 3500);
      }
    } catch (err) {
      console.error("Failed to update brief:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400">
        <div className="w-6 h-6 border-2 border-[#003E95] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading comprehensive technical brief...</p>
      </div>
    );
  }

  if (!brief) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-lg font-bold text-slate-800">Stand Brief Not Found</h2>
        <Link href="/admin/briefs" className="text-xs text-[#003E95] mt-2 inline-block">
          Return to Stand Briefs Index
        </Link>
      </div>
    );
  }

  const primaryGoals = Array.isArray(brief.primaryGoals)
    ? brief.primaryGoals
    : typeof brief.primaryGoals === "string"
    ? [brief.primaryGoals]
    : [];

  const notesList: NoteItem[] = Array.isArray(brief.internalNotes)
    ? (brief.internalNotes as NoteItem[])
    : [];

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-200">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-mono">
            <Link
              href="/admin/briefs"
              className="hover:text-slate-800 flex items-center gap-1 font-semibold text-[#003E95]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Stand Briefs</span>
            </Link>
            <span>/</span>
            <span>{brief.referenceCode}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex flex-wrap items-center gap-3">
            <span>{brief.companyName}</span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
              {brief.referenceCode}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Submitted on {new Date(brief.createdAt).toLocaleString()} • Event: {brief.eventName}
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-[#003E95] hover:bg-[#002D6E] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving Changes..." : "Save Status & Notes"}</span>
          </button>
        </div>
      </div>

      {saveSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Main 2-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ======================================================== */}
        {/* LEFT COLUMN: 6-STEP TECHNICAL SPECIFICATIONS (8 cols)     */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: Company & Stand Coordinates */}
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#003E95] font-bold text-xs flex items-center justify-center font-mono">
                  01
                </span>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Company & Stand Coordinates
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Event / Exhibition:</span>
                <span className="font-bold text-slate-800">{brief.eventName}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Company Name:</span>
                <span className="font-bold text-slate-800">{brief.companyName}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Contact Person:</span>
                <span className="font-bold text-slate-800">{brief.contactPerson}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Contact Number:</span>
                <span className="font-bold text-slate-800">{brief.contactNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Email:</span>
                <a href={`mailto:${brief.email}`} className="font-bold text-[#003E95] underline">
                  {brief.email}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Website:</span>
                {brief.website ? (
                  <a href={brief.website} target="_blank" className="font-bold text-[#00A7F5] underline">
                    {brief.website}
                  </a>
                ) : (
                  <span className="text-slate-400 italic">None provided</span>
                )}
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Stand Location / Hall:</span>
                <span className="font-bold text-slate-800">{brief.standLocation}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Stand Size & Type:</span>
                <span className="font-bold text-slate-800">
                  {brief.standSize} • {brief.standType}
                </span>
              </div>
            </div>

            {brief.floorPlanUrl && (
              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 p-3 rounded-xl">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-[#00A7F5]" />
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-semibold text-slate-800 block truncate">
                      {brief.floorPlanUrl.split("/").pop() || "Floor Plan Document"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <a
                    href={getDownloadApiUrl(brief.floorPlanUrl, false) || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-[#003E95] hover:bg-slate-50 text-xs font-semibold transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View File</span>
                  </a>
                  <a
                    href={getDownloadApiUrl(brief.floorPlanUrl, true) || "#"}
                    download={brief.floorPlanUrl.split("/").pop()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#003E95] hover:bg-blue-100 text-xs font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: Brief & Budget */}
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#003E95] font-bold text-xs flex items-center justify-center font-mono">
                  02
                </span>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Objectives, Budget & Products
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium mb-1.5">Primary Exhibition Goals:</span>
                <div className="flex flex-wrap gap-1.5">
                  {primaryGoals.map((g: any, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-[#003E95] font-semibold"
                    >
                      {typeof g === "string" ? g : g.label || g.id}
                    </span>
                  ))}
                </div>
                {brief.otherGoalDetails && (
                  <p className="mt-2 text-slate-600 italic">Note: {brief.otherGoalDetails}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block font-medium">Preferred Color Scheme:</span>
                  <span className="font-bold text-slate-800">{brief.colorScheme}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Allocated Budget:</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    {brief.currency} {brief.budget}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-medium mb-1">Products / Services Description:</span>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700 whitespace-pre-wrap">
                  {brief.productsDescription}
                </div>
              </div>

              {brief.productFiles && Array.isArray(brief.productFiles) && brief.productFiles.length > 0 && (
                <div>
                  <span className="text-slate-400 block font-medium mb-2">Uploaded Technical Specs & Attachments:</span>
                  <div className="space-y-2">
                    {brief.productFiles.map((pf: any, idx: number) => {
                      const rawIdentifier = typeof pf === "string" ? pf : pf.preview || pf.url || pf.path || pf.name;
                      const fileName = typeof pf === "string" ? pf.split("/").pop() : pf.name || `Technical Attachment #${idx + 1}`;
                      const fileSize = typeof pf === "object" && pf.size ? pf.size : null;
                      const viewUrl = getDownloadApiUrl(rawIdentifier, false);
                      const downloadUrl = getDownloadApiUrl(rawIdentifier, true);

                      return (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs hover:bg-slate-100/60 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                              <FileText className="w-3.5 h-3.5 text-[#00A7F5]" />
                            </div>
                            <div className="truncate">
                              <span className="font-semibold text-slate-800">{fileName}</span>
                              {fileSize && (
                                <span className="text-[10px] text-slate-400 ml-2 font-mono">({fileSize})</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            {viewUrl && (
                              <a
                                href={viewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-[#003E95] hover:bg-slate-50 font-semibold transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>View</span>
                              </a>
                            )}
                            {downloadUrl && (
                              <a
                                href={downloadUrl}
                                download={fileName}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#003E95] hover:bg-blue-100 font-semibold transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download</span>
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* STEP 3: Display & Meeting Areas */}
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#003E95] font-bold text-xs flex items-center justify-center font-mono">
                  03
                </span>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Display Items & Meeting Architecture
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Display items pills */}
              {brief.displayItems && (
                <div>
                  <span className="text-slate-400 block font-medium mb-2">Requested Furniture & Display Units:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(brief.displayItems).map(([key, val]) => {
                      if (typeof val === "boolean" && val) {
                        const qtyKey = `${key}Qty`;
                        const qty = brief.displayItems[qtyKey] || 1;
                        return (
                          <div
                            key={key}
                            className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                          >
                            <span className="font-semibold text-slate-800 capitalize">
                              {key.replace(/([A-Z])/g, " $1")}
                            </span>
                            <span className="font-mono font-bold text-[#003E95] px-1.5 py-0.5 bg-white rounded border border-slate-200">
                              Qty: {qty}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-slate-400 block font-medium">Meeting Area Type:</span>
                  <span className="font-bold text-slate-800">{brief.meetingAreaType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Seating Capacity:</span>
                  <span className="font-bold text-slate-800">{brief.meetingCapacity || "Standard"}</span>
                </div>
              </div>

              {brief.additionalMeetingNotes && (
                <div>
                  <span className="text-slate-400 block font-medium">Meeting Notes:</span>
                  <p className="text-slate-700 italic">{brief.additionalMeetingNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* STEP 4: Design & Flooring */}
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#003E95] font-bold text-xs flex items-center justify-center font-mono">
                  04
                </span>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Stand Architecture, Truss & Flooring
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Above-Stand Truss:</span>
                <span className="font-bold text-slate-800">
                  {brief.aboveStandOptions?.trussTraverse ? "Yes (Suspended Truss Required)" : "Not requested"}
                </span>
                {brief.aboveStandOptions?.aboveStandOther && (
                  <p className="text-slate-500 mt-0.5">{brief.aboveStandOptions.aboveStandOther}</p>
                )}
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Carpet / Flooring:</span>
                <span className="font-bold text-slate-800">
                  {brief.carpetColor || brief.flooringOption || "Custom specification"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Storage Room:</span>
                <span className="font-bold text-slate-800">{brief.storeRoomSize || "None"}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Store Room Notes:</span>
                <span className="text-slate-600">{brief.storeRoomNotes || "None"}</span>
              </div>
            </div>
          </div>

          {/* STEP 5: AV & Venue Services */}
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#003E95] font-bold text-xs flex items-center justify-center font-mono">
                  05
                </span>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Audio Visual & Venue Utilities
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block font-medium">LED Screens:</span>
                  <span className="font-bold text-slate-800">
                    {brief.ledScreenQty > 0
                      ? `${brief.ledScreenQty}x Screen(s) • ${brief.ledScreenSize}`
                      : "None requested"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Venue Utilities:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {brief.venueServices?.wifiInternet && (
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">WiFi</span>
                    )}
                    {brief.venueServices?.logisticsForklift && (
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">Forklift</span>
                    )}
                    {brief.venueServices?.eventConferenceSupport && (
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        Conference Tech
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {brief.avAdditionalNotes && (
                <div>
                  <span className="text-slate-400 block font-medium">AV Notes:</span>
                  <p className="text-slate-700 italic">{brief.avAdditionalNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* STEP 6: Additional Requirements */}
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#003E95] font-bold text-xs flex items-center justify-center font-mono">
                  06
                </span>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Additional Staffing & Comments
                </h2>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex flex-wrap gap-2">
                {brief.specialRequirements?.standPersonnel && (
                  <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-[#00A7F5] font-semibold border border-sky-200">
                    Hostesses / Stand Personnel Requested
                  </span>
                )}
                {brief.specialRequirements?.marketingMaterials && (
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                    Brochure & Collateral Printing
                  </span>
                )}
                {brief.specialRequirements?.travelAccommodation && (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                    Travel Logistics Assistance
                  </span>
                )}
              </div>

              {brief.additionalComments && (
                <div className="mt-2">
                  <span className="text-slate-400 block font-medium">Additional Client Comments:</span>
                  <p className="text-slate-700 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    {brief.additionalComments}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: LEAD CONTROLS & INTERNAL NOTES (4 cols)     */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          {/* Status & Assignee Control Card */}
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#003E95]" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Lead Management
                </h2>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Lead Pipeline Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#00A7F5] focus:ring-2 focus:ring-[#00A7F5]/10 cursor-pointer"
              >
                <option value="SUBMITTED">Submitted (New Lead)</option>
                <option value="IN_REVIEW">In Technical Review</option>
                <option value="PROPOSAL_SENT">Proposal & 3D Sent</option>
                <option value="WON">Won / Contract Awarded</option>
                <option value="LOST">Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Assigned Sales Director
              </label>
              <select
                value={selectedSalesId}
                onChange={(e) => setSelectedSalesId(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#00A7F5] focus:ring-2 focus:ring-[#00A7F5]/10 cursor-pointer"
              >
                <option value="">Unassigned</option>
                {salesUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="w-full py-2.5 px-3 rounded-xl bg-[#003E95] hover:bg-[#002D6E] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Updating Lead..." : "Update Pipeline Status"}</span>
            </button>
          </div>

          {/* Internal Notes Card */}
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <MessageSquare className="w-4 h-4 text-[#003E95]" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Internal Sales & Notes Log
              </h2>
            </div>

            {/* Note Input */}
            <div className="space-y-2 mb-6">
              <textarea
                rows={3}
                placeholder="Log internal note, 3D render progress, or client call summary..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5] focus:ring-2 focus:ring-[#00A7F5]/10 resize-none"
              />
              <button
                onClick={handleSaveChanges}
                disabled={isSaving || !newNoteText.trim()}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Note to Brief</span>
              </button>
            </div>

            {/* Timeline of Notes */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {notesList.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No internal notes recorded yet.
                </div>
              ) : (
                notesList.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-slate-700">
                        {note.authorName} ({note.authorRole})
                      </span>
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-800 whitespace-pre-wrap">{note.text}</p>
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
