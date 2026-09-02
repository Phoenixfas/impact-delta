"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  User,
  Mail,
  HelpCircle,
  MessageSquare,
  Phone,
  Video,
  Send,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  Building2,
  Globe2,
  X,
  PhoneCall,
  Lock,
  Layers,
} from "lucide-react";

interface OfficeHub {
  id: string;
  name: string;
  badge: string;
  city: string;
  country: string;
  address: string;
  postal: string;
  timeZone: string;
  phone: string;
  email: string;
  deskHours: { open: number; close: number }; // 24h format in local time
}

const OFFICE_HUBS: OfficeHub[] = [
  {
    id: "dubai-hq",
    name: "Global Headquarters & Fabrication Atelier",
    badge: "GLOBAL HQ & DUBAI WORKSHOP",
    city: "Dubai",
    country: "United Arab Emirates",
    address: "Tamem House Building, Barsha Heights (Tecom)",
    postal: "Dubai, UAE",
    timeZone: "Asia/Dubai",
    phone: "+971 54 711 4951",
    email: "sales@impactmakersevents.com",
    deskHours: { open: 8.0, close: 19.0 },
  },
  {
    id: "europe-hubs",
    name: "European Operations & Logistics Desk",
    badge: "EUROPEAN HUBS (4 COUNTRIES)",
    city: "Lisbon & Warsaw",
    country: "Portugal, Poland, Netherlands, Germany",
    address: "Av. da Liberdade / ul. Marszałkowska",
    postal: "EU Operational Hubs",
    timeZone: "Europe/Lisbon",
    phone: "+971 54 711 4951",
    email: "sales@impactmakersevents.com",
    deskHours: { open: 8.5, close: 18.5 },
  },
];

type PreferredMethod = "email" | "phone" | "whatsapp" | "video";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  preferredMethod: PreferredMethod;
}

export default function ContactFormSection() {
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const companyId = useId();
  const subjectId = useId();
  const messageId = useId();

  const [formState, setFormState] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    subject: "Summit & Stage Architecture",
    message: "",
    preferredMethod: "email",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [referenceTicket, setReferenceTicket] = useState<string>("");

  // Live clocks state
  const [hubTimes, setHubTimes] = useState<Record<string, { timeStr: string; isOpen: boolean }>>({});

  const sectionRef = useRef<HTMLElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const successModalRef = useRef<HTMLDivElement | null>(null);

  // 1. Live Timezone calculation for Office Hubs
  useEffect(() => {
    const updateTimes = () => {
      const newTimes: Record<string, { timeStr: string; isOpen: boolean }> = {};
      const now = new Date();

      OFFICE_HUBS.forEach((hub) => {
        try {
          // Format time string
          const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: hub.timeZone,
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
          const timeStr = formatter.format(now);

          // Compute if currently in operating hours (Mon-Fri 08:30-18:00)
          const parts = new Intl.DateTimeFormat("en-US", {
            timeZone: hub.timeZone,
            hour: "numeric",
            minute: "numeric",
            weekday: "short",
            hour12: false,
          }).formatToParts(now);

          let hour = 0;
          let minute = 0;
          let weekday = "";
          parts.forEach((p) => {
            if (p.type === "hour") hour = parseInt(p.value, 10);
            if (p.type === "minute") minute = parseInt(p.value, 10);
            if (p.type === "weekday") weekday = p.value;
          });

          const currentDecimalHour = hour + minute / 60;
          const isWeekend = weekday === "Sat" || weekday === "Sun";
          const isOpen =
            !isWeekend &&
            currentDecimalHour >= hub.deskHours.open &&
            currentDecimalHour < hub.deskHours.close;

          newTimes[hub.id] = { timeStr, isOpen };
        } catch {
          newTimes[hub.id] = { timeStr: "--:--", isOpen: true };
        }
      });

      setHubTimes(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 10000);
    return () => clearInterval(interval);
  }, []);

  // 2. Magnetic Pull on Submit Button
  useEffect(() => {
    const btn = submitButtonRef.current;
    if (!btn) return;

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let rafId = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const radius = 90;

      if (dist < radius) {
        const pull = (1 - dist / radius) * 0.28;
        targetX = dx * pull;
        targetY = dy * pull;
      } else {
        targetX = 0;
        targetY = 0;
      }
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const loop = () => {
      curX += (targetX - curX) * 0.14;
      curY += (targetY - curY) * 0.14;
      btn.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`;
      rafId = requestAnimationFrame(loop);
    };

    btn.addEventListener("pointermove", handlePointerMove, { passive: true });
    btn.addEventListener("pointerleave", handlePointerLeave);
    rafId = requestAnimationFrame(loop);

    return () => {
      btn.removeEventListener("pointermove", handlePointerMove);
      btn.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // 3. Form Submission handler with GSAP animation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.fullName || !formState.email || !formState.message) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.fullName,
          fullName: formState.fullName,
          email: formState.email,
          phone: formState.phone,
          company: formState.company,
          subject: formState.subject || "General Inquiry",
          preferredMethod: formState.preferredMethod,
          message: formState.message,
        }),
      });

      const data = await res.json();
      const ticket = data.id ? `IMP-${data.id.slice(-6).toUpperCase()}` : `IMP-${Math.floor(100000 + Math.random() * 900000)}`;
      setReferenceTicket(ticket);
      setIsSubmitting(false);
      setShowSuccessModal(true);

      setTimeout(() => {
        if (successModalRef.current) {
          gsap.fromTo(
            successModalRef.current,
            { scale: 0.9, opacity: 0, y: 20 },
            { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.7)" }
          );
        }
      }, 10);
    } catch {
      setIsSubmitting(false);
      const fallbackTicket = `IMP-${Math.floor(100000 + Math.random() * 900000)}`;
      setReferenceTicket(fallbackTicket);
      setShowSuccessModal(true);
    }
  };

  const closeSuccessModal = () => {
    if (successModalRef.current) {
      gsap.to(successModalRef.current, {
        scale: 0.95,
        opacity: 0,
        y: 10,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          setShowSuccessModal(false);
          setFormState({
            fullName: "",
            email: "",
            phone: "",
            company: "",
            subject: "Summit & Stage Architecture",
            message: "",
            preferredMethod: "email",
          });
        },
      });
    } else {
      setShowSuccessModal(false);
      setFormState({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        subject: "Summit & Stage Architecture",
        message: "",
        preferredMethod: "email",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact-form-section"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider bg-blue-50 text-[#003E95] border border-blue-200/80 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#00A7F5]" />
            <span>DIRECT INQUIRY & DISPATCH</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Initiate Project Briefing & Global Desk
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Submit your technical event scope, keynote arena dimensions, or general RFP.
            Our show engineers route submissions directly to the appropriate regional director.
          </p>
        </div>

        {/* Asymmetrical 2-Column Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ================================================================ */}
          {/* LEFT COLUMN: GENERAL CONTACT FORM (7 cols)                       */}
          {/* ================================================================ */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Stand Brief Callout Badge */}
            <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 backdrop-blur-md bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-indigo-50/90 border border-[#00A7F5]/30 shadow-sm transition-all hover:border-[#00A7F5]/60 group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#00A7F5]/30 flex items-center justify-center text-[#003E95] shrink-0 shadow-xs">
                    <Layers className="w-4 h-4 text-[#00A7F5]" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-[#003E95] uppercase tracking-wider">
                      SPECIFIC STAND OR EXHIBITION BUILD?
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-800">
                      Need custom 3D dimensions, turnkey rigging & previz pricing?
                    </div>
                  </div>
                </div>

                <Link
                  href="/brief"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#003E95] hover:bg-[#002D6E] transition-all shadow-sm shrink-0 active:scale-95 group/btn"
                >
                  <span>Launch Stand Brief Wizard</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Main Interactive Contact Form Card */}
            <div className="relative rounded-3xl backdrop-blur-md bg-white/85 border border-slate-200/80 shadow-lg shadow-slate-100/60 p-6 sm:p-8 md:p-10">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Form Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="relative group/field">
                    <input
                      id={nameId}
                      type="text"
                      required
                      placeholder=" "
                      value={formState.fullName}
                      onChange={(e) =>
                        setFormState({ ...formState, fullName: e.target.value })
                      }
                      className="peer w-full px-4 pt-6 pb-2 rounded-2xl bg-slate-50/70 border border-slate-200 text-sm font-medium text-slate-900 placeholder-transparent transition-all duration-200 focus:outline-none focus:bg-white focus:border-[#00A7F5] focus:ring-4 focus:ring-[#00A7F5]/10"
                    />
                    <label
                      htmlFor={nameId}
                      className="absolute left-4 top-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-mono peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-[#003E95] pointer-events-none"
                    >
                      Full Name *
                    </label>
                    <User className="absolute right-4 top-4 w-4 h-4 text-slate-400 transition-colors peer-focus:text-[#00A7F5]" />
                  </div>

                  {/* Email Address */}
                  <div className="relative group/field">
                    <input
                      id={emailId}
                      type="email"
                      required
                      placeholder=" "
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      className="peer w-full px-4 pt-6 pb-2 rounded-2xl bg-slate-50/70 border border-slate-200 text-sm font-medium text-slate-900 placeholder-transparent transition-all duration-200 focus:outline-none focus:bg-white focus:border-[#00A7F5] focus:ring-4 focus:ring-[#00A7F5]/10"
                    />
                    <label
                      htmlFor={emailId}
                      className="absolute left-4 top-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-mono peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-[#003E95] pointer-events-none"
                    >
                      Work Email Address *
                    </label>
                    <Mail className="absolute right-4 top-4 w-4 h-4 text-slate-400 transition-colors peer-focus:text-[#00A7F5]" />
                  </div>
                </div>

                {/* Form Row 2: Phone & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone / WhatsApp */}
                  <div className="relative group/field">
                    <input
                      id={phoneId}
                      type="tel"
                      placeholder=" "
                      value={formState.phone}
                      onChange={(e) =>
                        setFormState({ ...formState, phone: e.target.value })
                      }
                      className="peer w-full px-4 pt-6 pb-2 rounded-2xl bg-slate-50/70 border border-slate-200 text-sm font-medium text-slate-900 placeholder-transparent transition-all duration-200 focus:outline-none focus:bg-white focus:border-[#00A7F5] focus:ring-4 focus:ring-[#00A7F5]/10"
                    />
                    <label
                      htmlFor={phoneId}
                      className="absolute left-4 top-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-mono peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-[#003E95] pointer-events-none"
                    >
                      Phone / WhatsApp Number
                    </label>
                    <Phone className="absolute right-4 top-4 w-4 h-4 text-slate-400 transition-colors peer-focus:text-[#00A7F5]" />
                  </div>

                  {/* Company / Brand */}
                  <div className="relative group/field">
                    <input
                      id={companyId}
                      type="text"
                      placeholder=" "
                      value={formState.company}
                      onChange={(e) =>
                        setFormState({ ...formState, company: e.target.value })
                      }
                      className="peer w-full px-4 pt-6 pb-2 rounded-2xl bg-slate-50/70 border border-slate-200 text-sm font-medium text-slate-900 placeholder-transparent transition-all duration-200 focus:outline-none focus:bg-white focus:border-[#00A7F5] focus:ring-4 focus:ring-[#00A7F5]/10"
                    />
                    <label
                      htmlFor={companyId}
                      className="absolute left-4 top-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-mono peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-[#003E95] pointer-events-none"
                    >
                      Company / Organization
                    </label>
                    <Building2 className="absolute right-4 top-4 w-4 h-4 text-slate-400 transition-colors peer-focus:text-[#00A7F5]" />
                  </div>
                </div>

                {/* Form Row 2: Subject Dropdown */}
                <div className="relative group/field">
                  <select
                    id={subjectId}
                    value={formState.subject}
                    onChange={(e) =>
                      setFormState({ ...formState, subject: e.target.value })
                    }
                    className="w-full px-4 pt-6 pb-2 rounded-2xl bg-slate-50/70 border border-slate-200 text-sm font-medium text-slate-900 transition-all duration-200 focus:outline-none focus:bg-white focus:border-[#00A7F5] focus:ring-4 focus:ring-[#00A7F5]/10 appearance-none cursor-pointer"
                  >
                    <option value="Custom Exhibition Stand Fabrication">
                      Custom Exhibition Stand Fabrication (In-House Workshop)
                    </option>
                    <option value="International Congress & Event Organizing">
                      International Congress & Event Organizing (DEC / DWTC / ADNEC)
                    </option>
                    <option value="Concert Sound, 4K LED Video & Stage Lighting">
                      Concert Sound, Curved 4K LED Video & Stage Lighting Rental
                    </option>
                    <option value="Photography, 4K Videography & Livestreaming">
                      Photography, 4K Videography & Live Broadcast Production
                    </option>
                    <option value="Exhibition Space Selling & Sponsorships">
                      Exhibition Space Selling & Floor Plan Monetization
                    </option>
                    <option value="Designer Furniture Rental & Corporate Gifts">
                      Designer Furniture Rental (Corbusier/Tolix) & Luxury Gifts
                    </option>
                  </select>
                  <label
                    htmlFor={subjectId}
                    className="absolute left-4 top-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#003E95] pointer-events-none"
                  >
                    Inquiry Classification / Service *
                  </label>
                  <HelpCircle className="absolute right-4 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>

                {/* Preferred Contact Method Pill Picker */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-600">
                    Preferred Response Channel
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: "email", label: "Email Desk", icon: Mail },
                      { id: "phone", label: "Direct Call", icon: Phone },
                      { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
                      { id: "video", label: "Video Briefing", icon: Video },
                    ].map((method) => {
                      const Icon = method.icon;
                      const isSelected = formState.preferredMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() =>
                            setFormState({
                              ...formState,
                              preferredMethod: method.id as PreferredMethod,
                            })
                          }
                          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${isSelected
                              ? "bg-[#003E95] text-white border-[#003E95] shadow-xs"
                              : "bg-slate-50/80 text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300"
                            }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{method.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="relative group/field">
                  <textarea
                    id={messageId}
                    required
                    rows={4}
                    placeholder=" "
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                    className="peer w-full px-4 pt-6 pb-2 rounded-2xl bg-slate-50/70 border border-slate-200 text-sm font-medium text-slate-900 placeholder-transparent transition-all duration-200 focus:outline-none focus:bg-white focus:border-[#00A7F5] focus:ring-4 focus:ring-[#00A7F5]/10 resize-none"
                  />
                  <label
                    htmlFor={messageId}
                    className="absolute left-4 top-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-mono peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-[#003E95] pointer-events-none"
                  >
                    Project Scope, Timeline & Technical Notes *
                  </label>
                </div>

                {/* Submit Actions & Security Note */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>256-Bit SSL Encrypted · Mutual NDA standard</span>
                  </div>

                  {/* Magnetic Submit Button */}
                  <button
                    ref={submitButtonRef}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#003E95] via-[#00A7F5] to-[#003E95] bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-md shadow-blue-900/15 active:scale-95 disabled:opacity-75 cursor-pointer will-change-transform"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Transmitting Scope...</span>
                      </>
                    ) : (
                      <>
                        <span>Transmit Briefing</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ================================================================ */}
          {/* RIGHT COLUMN: HEADQUARTERS & REGIONAL HUBS (5 cols)              */}
          {/* ================================================================ */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-800">
                <Building2 className="w-4 h-4 text-[#003E95]" />
                <span>COMMAND HUBS & LOCAL DESKS</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                LIVE TELEMETRY
              </div>
            </div>

            {/* Office Hub Cards */}
            {OFFICE_HUBS.map((hub) => {
              const liveStatus = hubTimes[hub.id] || {
                timeStr: "Loading...",
                isOpen: true,
              };

              return (
                <div
                  key={hub.id}
                  className="relative rounded-3xl backdrop-blur-md bg-white/80 border border-slate-200/80 shadow-md shadow-slate-100/50 p-6 sm:p-7 transition-all duration-300 hover:shadow-lg hover:border-[#00A7F5]/50 group"
                >
                  {/* Top Card Bar: Badge & Live Clock Status */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-slate-100 border border-slate-200 text-slate-700">
                      {hub.badge}
                    </span>

                    {/* Operating Status Indicator Badge */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border ${liveStatus.isOpen
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${liveStatus.isOpen ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                          }`}
                      />
                      <span>{liveStatus.isOpen ? "Open" : "After Hours"}</span>
                      <span className="text-slate-300 font-mono">·</span>
                      <span>{liveStatus.timeStr}</span>
                    </div>
                  </div>

                  {/* Office Info */}
                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight group-hover:text-[#003E95] transition-colors">
                      {hub.city}, {hub.country}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {hub.name}
                    </p>
                  </div>

                  {/* Address Details */}
                  <div className="flex items-start gap-2.5 text-xs text-slate-600 mb-4 pb-4 border-b border-slate-100">
                    <MapPin className="w-3.5 h-3.5 text-[#00A7F5] shrink-0 mt-0.5" />
                    <span>
                      {hub.address}, {hub.postal}
                    </span>
                  </div>

                  {/* Direct Contact triggers */}
                  <div className="flex items-center justify-between text-xs">
                    <a
                      href={`tel:${hub.phone.replace(/[^+\d]/g, "")}`}
                      className="inline-flex items-center gap-1.5 font-mono font-semibold text-slate-700 hover:text-[#003E95] transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#00A7F5]" />
                      <span>{hub.phone}</span>
                    </a>

                    <a
                      href={`mailto:${hub.email}`}
                      className="inline-flex items-center gap-1 font-semibold text-[#003E95] hover:text-[#00A7F5] transition-colors"
                    >
                      <span>Direct Desk</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}

            {/* Global Dispatch Guarantee Card */}
            <div className="rounded-2xl backdrop-blur-md bg-gradient-to-br from-slate-900 to-[#003E95] text-white p-5 shadow-lg shadow-blue-950/15">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-cyan-300 shrink-0">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 mb-1">
                    ZERO-FAIL RESPONSE PROTOCOL
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Senior project directors and master joinery engineers review all stand briefs and event inquiries within 2 hours across Dubai and our 9 global country hubs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUCCESS MODAL DIALOG                                                 */}
      {/* ==================================================================== */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/40 animate-in fade-in duration-200">
          <div
            ref={successModalRef}
            className="relative w-full max-w-lg rounded-3xl backdrop-blur-2xl bg-white/95 border border-white/80 shadow-2xl p-6 sm:p-8 text-center"
          >
            {/* Close Button */}
            <button
              onClick={closeSuccessModal}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            {/* Modal Title */}
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#003E95] mb-1">
              TRANSMISSION CONFIRMED
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              Briefing Routed to Engineering Desk
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Thank you, <span className="font-bold text-slate-800">{formState.fullName}</span>.
              Your event briefing has been encrypted and assigned to our regional technical
              director.
            </p>

            {/* Reference Ticket ID Pill */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-500">DISPATCH TICKET:</span>
              <span className="font-bold text-[#003E95]">{referenceTicket}</span>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={closeSuccessModal}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-[#003E95] hover:bg-[#002D6E] transition-all shadow-md shadow-blue-900/15 active:scale-98 cursor-pointer"
            >
              Close Confirmation
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
