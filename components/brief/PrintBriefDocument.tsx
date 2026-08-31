"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { StandBriefFormData } from "@/lib/standBriefSchema";

interface PrintBriefDocumentProps {
  data: StandBriefFormData;
  referenceId: string;
  submittedAt: string;
}

export default function PrintBriefDocument({
  data,
  referenceId,
  submittedAt,
}: PrintBriefDocumentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  const step1 = data.step1 || {};
  const step2 = data.step2 || {};
  const step3 = data.step3 || {};
  const step4 = data.step4 || {};
  const step5 = data.step5 || {};
  const step6 = data.step6 || {};

  const formattedDate = submittedAt
    ? new Date(submittedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    : new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const content = (
    <div
      id="print-brief-root"
      className="hidden print:block bg-white text-slate-900 font-sans p-6 sm:p-8 max-w-4xl mx-auto"
      style={{
        width: "100%",
        boxSizing: "border-box",
        background: "#ffffff",
        color: "#0f172a",
      }}
    >
      {/* 1. Header Banner */}
      <div className="border-b-2 border-slate-900 pb-5 mb-5 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo_t_lightGrad.svg"
              alt="IMPACT MAKERS EVENTS"
              width={64}
              height={64}
              className="absolute w-16 h-16 object-contain"
            />
            <img
              src="/logo_g_lightGrad.svg"
              alt="IMPACT MAKERS EVENTS"
              width={64}
              height={64}
              className="w-16 h-16 object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase leading-none">
              IMPACT MAKERS EVENTS
            </h1>
            <p className="text-xs font-bold tracking-widest text-[#003E95] uppercase mt-1">
              Official Exhibition Architecture & Stand Brief
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              UAE HQ · USA · Poland · Netherland · Germany · Ethiopia · Singapore · Portugal
            </p>
          </div>
        </div>

        <div className="text-right border-l border-slate-200 pl-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Document Reference
          </span>
          <p className="font-mono text-sm font-extrabold text-[#003E95]">
            {referenceId}
          </p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
            Confirmed / In Review
          </span>
          <p className="text-[10px] text-slate-500 mt-1">{formattedDate}</p>
        </div>
      </div>

      {/* 2. Client & Exhibition Coordinates */}
      <div className="mb-5">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-white bg-[#003E95] px-3 py-1.5 rounded-t-md">
          01. Client Credentials & Event Coordinates
        </h2>
        <div className="border border-slate-200 border-t-0 rounded-b-md p-3.5 bg-slate-50/50 grid grid-cols-3 gap-y-2.5 gap-x-4 text-xs">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">
              Event / Exhibition
            </span>
            <span className="font-bold text-slate-900">{step1.eventName || "—"}</span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">
              Company Name
            </span>
            <span className="font-bold text-slate-900">{step1.companyName || "—"}</span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">
              Contact Person
            </span>
            <span className="font-bold text-slate-900">{step1.contactPerson || "—"}</span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">
              Work Email
            </span>
            <span className="font-semibold text-slate-800">{step1.email || "—"}</span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">
              Contact Number
            </span>
            <span className="font-semibold text-slate-800">{step1.contactNumber || "—"}</span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">
              Website
            </span>
            <span className="font-semibold text-slate-800">{step1.website || "—"}</span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">
              Stand Location
            </span>
            <span className="font-bold text-[#003E95]">{step1.standLocation || "—"}</span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">
              Stand Size & Area
            </span>
            <span className="font-bold text-slate-900">{step1.standSize || "—"}</span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">
              Stand Layout Type
            </span>
            <span className="font-bold text-slate-900">{step1.standType || "—"}</span>
          </div>
          {step1.floorPlanName && (
            <div className="col-span-3 border-t border-slate-200 pt-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-500 uppercase">
                Floor Plan Blueprint Attached:
              </span>
              <span className="font-mono text-xs font-bold text-emerald-700">
                {step1.floorPlanName} ({step1.floorPlanSize})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Objectives & Budget Allocation */}
      <div className="mb-5">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-white bg-[#003E95] px-3 py-1.5 rounded-t-md">
          02. Strategic Objectives & Budget Allocation
        </h2>
        <div className="border border-slate-200 border-t-0 rounded-b-md p-3.5 bg-slate-50/50 space-y-2.5 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                Primary Aims & Goals
              </span>
              <span className="font-bold text-slate-900">
                {step2.primaryGoals?.join(", ") || "—"}
              </span>
              {step2.otherGoalDetails && (
                <p className="text-[11px] text-slate-600 italic mt-0.5">
                  &quot;{step2.otherGoalDetails}&quot;
                </p>
              )}
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                Allocated Stand Budget
              </span>
              <span className="font-extrabold text-sm text-[#003E95]">
                {step2.budgetCurrency} {step2.budgetAmount || "Custom / Scoping"}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-2 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                Brand Colour Scheme
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="w-3.5 h-3.5 rounded border border-slate-300 inline-block shrink-0"
                  style={{ backgroundColor: step2.colorHex || "#003E95" }}
                />
                <span className="font-semibold text-slate-800">
                  {step2.preferredColorScheme || "—"} ({step2.colorHex})
                </span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                Reference Files Attached
              </span>
              <span className="font-semibold text-slate-800">
                {step2.productFiles && step2.productFiles.length > 0
                  ? `${step2.productFiles.length} file(s) attached`
                  : "None"}
              </span>
            </div>
          </div>

          {step2.productsToExhibit && (
            <div className="border-t border-slate-200 pt-2">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                Products & Solutions to Exhibit
              </span>
              <p className="text-xs text-slate-800 mt-0.5 leading-relaxed">
                {step2.productsToExhibit}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Display Elements & Meeting Architecture */}
      <div className="mb-5">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-white bg-[#003E95] px-3 py-1.5 rounded-t-md">
          03. Display Fixtures & Meeting Architecture
        </h2>
        <div className="border border-slate-200 border-t-0 rounded-b-md p-3.5 bg-slate-50/50 space-y-2.5 text-xs">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
              Configured Display Modules:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Reception Desk", checked: step3.receptionDesk, qty: step3.receptionDeskQty },
                { label: "Brochure Holder", checked: step3.brochureHolder, qty: step3.brochureHolderQty },
                { label: "Display Shelf", checked: step3.displayShelf, qty: step3.displayShelfQty },
                { label: "Display Podium", checked: step3.displayPodium, qty: step3.displayPodiumQty },
                { label: "Display Showcase", checked: step3.displayShowcase, qty: step3.displayShowcaseQty },
                { label: "Workstation", checked: step3.workstation, qty: step3.workstationQty },
              ].map((m) => (
                <div
                  key={m.label}
                  className={`p-1.5 rounded border text-[10px] ${m.checked
                    ? "bg-blue-50/70 border-blue-200 text-slate-900 font-bold"
                    : "bg-white border-slate-200 text-slate-400"
                    }`}
                >
                  <span className="inline-block mr-1">
                    {m.checked ? "☑" : "☐"}
                  </span>
                  {m.label} {m.checked && `(Qty: ${m.qty})`}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-2 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                Meeting Area Type
              </span>
              <span className="font-bold text-slate-900">
                {step3.meetingAreaType || "Open Lounge"}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                Seating Capacity
              </span>
              <span className="font-bold text-slate-900">
                {step3.seatingCapacity || "4-6 Persons"}
              </span>
            </div>
          </div>

          {step3.otherMeetingDetails && (
            <div className="border-t border-slate-200 pt-1.5">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                Custom Meeting Details:
              </span>
              <p className="text-xs text-slate-800">{step3.otherMeetingDetails}</p>
            </div>
          )}

          {step3.additionalMeetingNotes && (
            <div className="border-t border-slate-200 pt-1.5">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                Special Display / Hospitality Notes:
              </span>
              <p className="text-xs text-slate-800">{step3.additionalMeetingNotes}</p>
            </div>
          )}
        </div>
      </div>

      {/* 5. Structural Rigging, Flooring & Storage */}
      <div className="mb-5">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-white bg-[#003E95] px-3 py-1.5 rounded-t-md">
          04. Structural Rigging, Flooring & Storage
        </h2>
        <div className="border border-slate-200 border-t-0 rounded-b-md p-3.5 bg-slate-50/50 grid grid-cols-3 gap-y-2.5 gap-x-4 text-xs">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">
              Truss Traverse with Banner
            </span>
            <span className="font-bold text-slate-900">
              {step4.trussTraverse ? "Yes (Included)" : "No"}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">
              Carpet Colour
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block shrink-0"
                style={{ backgroundColor: step4.carpetColorHex || "#003E95" }}
              />
              <span className="font-bold text-slate-900">
                {step4.carpetColor || "Impact Blue"} ({step4.carpetColorHex})
              </span>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase block">
              Store Room (2x2 sqm)
            </span>
            <span className="font-bold text-slate-900">
              {step4.storeRoom2x2 ? "Yes (Standard Lockable)" : "No"}
            </span>
          </div>

          {step4.aboveStandOther && (
            <div className="col-span-3 border-t border-slate-200 pt-1.5">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                Other Overhead Requirements:
              </span>
              <p className="text-xs text-slate-800">{step4.aboveStandOther}</p>
            </div>
          )}

          {step4.flooringOther && (
            <div className="col-span-3 border-t border-slate-200 pt-1.5">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                Other Flooring Options:
              </span>
              <p className="text-xs text-slate-800">{step4.flooringOther}</p>
            </div>
          )}

          {step4.storeRoomOther && (
            <div className="col-span-3 border-t border-slate-200 pt-1.5">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                Custom Store Room Requirements:
              </span>
              <p className="text-xs text-slate-800">{step4.storeRoomOther}</p>
            </div>
          )}
        </div>
      </div>

      {/* 6. Audio Visual & Venue Services */}
      <div className="mb-5">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-white bg-[#003E95] px-3 py-1.5 rounded-t-md">
          05. Audio Visual & Venue Utilities
        </h2>
        <div className="border border-slate-200 border-t-0 rounded-b-md p-3.5 bg-slate-50/50 space-y-2.5 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                LED Screen Quantity
              </span>
              <span className="font-bold text-slate-900">
                {step5.ledScreenQty ? `${step5.ledScreenQty} Unit(s)` : "None"}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                Display Size & Specs
              </span>
              <span className="font-bold text-slate-900">
                {step5.ledScreenSize || "—"}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-2 grid grid-cols-3 gap-2">
            <div className={`p-1.5 rounded border text-[10px] ${step5.wifiInternet ? "bg-blue-50/70 border-blue-200 font-bold" : "bg-white border-slate-200 text-slate-400"}`}>
              {step5.wifiInternet ? "☑" : "☐"} Dedicated WiFi / Net Drop
            </div>
            <div className={`p-1.5 rounded border text-[10px] ${step5.logisticsForklift ? "bg-blue-50/70 border-blue-200 font-bold" : "bg-white border-slate-200 text-slate-400"}`}>
              {step5.logisticsForklift ? "☑" : "☐"} Logistics & Crane Handling
            </div>
            <div className={`p-1.5 rounded border text-[10px] ${step5.eventConferenceSupport ? "bg-blue-50/70 border-blue-200 font-bold" : "bg-white border-slate-200 text-slate-400"}`}>
              {step5.eventConferenceSupport ? "☑" : "☐"} Technical Standby Support
            </div>
          </div>

          {step5.avAdditionalNotes && (
            <div className="border-t border-slate-200 pt-1.5">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                Additional AV Notes:
              </span>
              <p className="text-xs text-slate-800">{step5.avAdditionalNotes}</p>
            </div>
          )}
        </div>
      </div>

      {/* 7. Concierge Services & Additional Instructions */}
      <div className="mb-6">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-white bg-[#003E95] px-3 py-1.5 rounded-t-md">
          06. Concierge Services & Additional Directives
        </h2>
        <div className="border border-slate-200 border-t-0 rounded-b-md p-3.5 bg-slate-50/50 space-y-2.5 text-xs">
          <div className="grid grid-cols-3 gap-2">
            <div className={`p-1.5 rounded border text-[10px] ${step6.standPersonnel ? "bg-blue-50/70 border-blue-200 font-bold" : "bg-white border-slate-200 text-slate-400"}`}>
              {step6.standPersonnel ? "☑" : "☐"} Stand Hostesses & Staff
            </div>
            <div className={`p-1.5 rounded border text-[10px] ${step6.marketingMaterials ? "bg-blue-50/70 border-blue-200 font-bold" : "bg-white border-slate-200 text-slate-400"}`}>
              {step6.marketingMaterials ? "☑" : "☐"} Marketing & Large Print
            </div>
            <div className={`p-1.5 rounded border text-[10px] ${step6.travelAccommodation ? "bg-blue-50/70 border-blue-200 font-bold" : "bg-white border-slate-200 text-slate-400"}`}>
              {step6.travelAccommodation ? "☑" : "☐"} Visa, Flights & Hotel
            </div>
          </div>

          {step6.additionalComments && (
            <div className="border-t border-slate-200 pt-1.5">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                Additional Comments / Directives:
              </span>
              <p className="text-xs text-slate-800 leading-relaxed">
                {step6.additionalComments}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 8. Signatures & Approval Blocks */}
      <div className="border-t-2 border-slate-900 pt-5 grid grid-cols-2 gap-8 text-xs">
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Authorized Client Signature
            </span>
            <div className="h-10 border-b border-slate-400 border-dashed" />
            <p className="text-[10px] text-slate-600 mt-1">
              Name: {step1.contactPerson || "Client Signatory"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Impact Makers Events Production Desk
            </span>
            <div className="h-10 border-b border-slate-400 border-dashed flex items-end">
              <span className="text-[10px] font-mono text-[#003E95] font-bold pb-0.5">
                [VERIFIED ARCHITECTURAL TRANSMISSION]
              </span>
            </div>
            <p className="text-[10px] text-slate-600 mt-1">
              Lead Production Director · IMPACT MAKERS EVENTS
            </p>
          </div>
        </div>
      </div>

      {/* Footer Confidentiality Notice */}
      <div className="text-center mt-5 pt-3 border-t border-slate-200 text-[9px] text-slate-400">
        © 2026 IMPACT MAKERS EVENTS. All rights reserved. Confidential exhibition stand brief and production scope document.
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
