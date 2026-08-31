"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import gsap from "gsap";
import {
  Calendar,
  Building2,
  User,
  Phone,
  Mail,
  Globe,
  MapPin,
  Maximize2,
  ChevronDown,
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  AlertCircle,
} from "lucide-react";
import { StandBriefFormData, STAND_TYPES } from "@/lib/standBriefSchema";
import { useBriefForm } from "./BriefFormProvider";

export default function StepCompanyDetails() {
  const { nextStep } = useBriefForm();
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<StandBriefFormData>();

  // Form values
  const selectedStandType = watch("step1.standType");
  const floorPlanName = watch("step1.floorPlanName");
  const floorPlanSize = watch("step1.floorPlanSize");

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  // File dropzone state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Magnetic button ref
  const magneticBtnRef = useRef<HTMLButtonElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dropdown opening animation with GSAP
  useEffect(() => {
    if (!dropdownMenuRef.current) return;
    if (dropdownOpen) {
      gsap.fromTo(
        dropdownMenuRef.current,
        { opacity: 0, y: -8, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "power2.out" }
      );
    }
  }, [dropdownOpen]);

  // Magnetic button physics for Next Button
  useEffect(() => {
    const btn = magneticBtnRef.current;
    if (!btn) return;

    const xTo = gsap.quickTo(btn, "x", { duration: 0.3, ease: "power2.out" });
    const yTo = gsap.quickTo(btn, "y", { duration: 0.3, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

      if (dist < 80) {
        const pullFactor = (1 - dist / 80) * 8;
        xTo((e.clientX - centerX) * 0.15 * pullFactor);
        yTo((e.clientY - centerY) * 0.15 * pullFactor);
      } else {
        xTo(0);
        yTo(0);
      }
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    btn.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // File handling functions
  const handleFileUpload = useCallback(
    (file: File) => {
      // Validate file size (25MB max)
      if (file.size > 25 * 1024 * 1024) {
        alert("File exceeds maximum allowed size of 25MB.");
        return;
      }

      // Format size
      const sizeFormatted =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      // Simulate smooth upload progress
      setUploadProgress(15);
      const timer1 = setTimeout(() => setUploadProgress(65), 180);
      const timer2 = setTimeout(() => {
        setUploadProgress(100);
        setValue("step1.floorPlanName", file.name, { shouldValidate: true });
        setValue("step1.floorPlanSize", sizeFormatted, { shouldValidate: true });
        setTimeout(() => setUploadProgress(null), 300);
      }, 400);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    },
    [setValue]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("step1.floorPlanName", "");
    setValue("step1.floorPlanSize", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const currentSelectedTypeObj = STAND_TYPES.find((t) => t.id === selectedStandType);

  return (
    <div className="space-y-7">
      {/* Step Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Client & Stand Specifications</span>
            <span className="text-[11px] font-semibold text-[#00A7F5] bg-[#EBF4FF] px-2.5 py-0.5 rounded-full">
              Primary Credentials
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Fill in your event coordinates and company credentials to configure your architectural proposal.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 self-start sm:self-auto">
          * Required fields
        </span>
      </div>

      {/* 2-Column Responsive Grid with Floating Glass Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* 1. Event / Exhibition Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#00A7F5]" />
              Event / Exhibition Name <span className="text-rose-500">*</span>
            </span>
          </label>
          <div className="relative group">
            <input
              {...register("step1.eventName")}
              placeholder="e.g. MWC Barcelona 2026, Gitex Global"
              className={`w-full px-4 py-3 pl-10 rounded-2xl bg-white/70 backdrop-blur-md border text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-300 shadow-xs group-hover:border-slate-300 focus:outline-none focus:bg-white focus:border-[#003E95] focus:ring-4 focus:ring-[#00A7F5]/15 ${
                errors.step1?.eventName
                  ? "border-rose-400 bg-rose-50/30 ring-2 ring-rose-400/20"
                  : "border-slate-200/90"
              }`}
            />
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-[#003E95]" />
          </div>
          {errors.step1?.eventName && (
            <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.step1.eventName.message}
            </p>
          )}
        </div>

        {/* 2. Company Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#00A7F5]" />
              Company Name <span className="text-rose-500">*</span>
            </span>
          </label>
          <div className="relative group">
            <input
              {...register("step1.companyName")}
              placeholder="e.g. Vertex Aerospace, Quantum AI"
              className={`w-full px-4 py-3 pl-10 rounded-2xl bg-white/70 backdrop-blur-md border text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-300 shadow-xs group-hover:border-slate-300 focus:outline-none focus:bg-white focus:border-[#003E95] focus:ring-4 focus:ring-[#00A7F5]/15 ${
                errors.step1?.companyName
                  ? "border-rose-400 bg-rose-50/30 ring-2 ring-rose-400/20"
                  : "border-slate-200/90"
              }`}
            />
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-[#003E95]" />
          </div>
          {errors.step1?.companyName && (
            <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.step1.companyName.message}
            </p>
          )}
        </div>

        {/* 3. Contact Person */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#00A7F5]" />
              Contact Person <span className="text-rose-500">*</span>
            </span>
          </label>
          <div className="relative group">
            <input
              {...register("step1.contactPerson")}
              placeholder="e.g. Alexander Reed (VP Marketing)"
              className={`w-full px-4 py-3 pl-10 rounded-2xl bg-white/70 backdrop-blur-md border text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-300 shadow-xs group-hover:border-slate-300 focus:outline-none focus:bg-white focus:border-[#003E95] focus:ring-4 focus:ring-[#00A7F5]/15 ${
                errors.step1?.contactPerson
                  ? "border-rose-400 bg-rose-50/30 ring-2 ring-rose-400/20"
                  : "border-slate-200/90"
              }`}
            />
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-[#003E95]" />
          </div>
          {errors.step1?.contactPerson && (
            <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.step1.contactPerson.message}
            </p>
          )}
        </div>

        {/* 4. Contact Number */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#00A7F5]" />
              Contact Number (Direct / WhatsApp) <span className="text-rose-500">*</span>
            </span>
          </label>
          <div className="relative group">
            <input
              type="tel"
              {...register("step1.contactNumber")}
              placeholder="+1 (555) 392-8820"
              className={`w-full px-4 py-3 pl-10 rounded-2xl bg-white/70 backdrop-blur-md border text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-300 shadow-xs group-hover:border-slate-300 focus:outline-none focus:bg-white focus:border-[#003E95] focus:ring-4 focus:ring-[#00A7F5]/15 ${
                errors.step1?.contactNumber
                  ? "border-rose-400 bg-rose-50/30 ring-2 ring-rose-400/20"
                  : "border-slate-200/90"
              }`}
            />
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-[#003E95]" />
          </div>
          {errors.step1?.contactNumber && (
            <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.step1.contactNumber.message}
            </p>
          )}
        </div>

        {/* 5. Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#00A7F5]" />
              Work Email <span className="text-rose-500">*</span>
            </span>
          </label>
          <div className="relative group">
            <input
              type="email"
              {...register("step1.email")}
              placeholder="alexander@vertex-global.com"
              className={`w-full px-4 py-3 pl-10 rounded-2xl bg-white/70 backdrop-blur-md border text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-300 shadow-xs group-hover:border-slate-300 focus:outline-none focus:bg-white focus:border-[#003E95] focus:ring-4 focus:ring-[#00A7F5]/15 ${
                errors.step1?.email
                  ? "border-rose-400 bg-rose-50/30 ring-2 ring-rose-400/20"
                  : "border-slate-200/90"
              }`}
            />
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-[#003E95]" />
          </div>
          {errors.step1?.email && (
            <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.step1.email.message}
            </p>
          )}
        </div>

        {/* 6. Website */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#00A7F5]" />
              Website / Brand Hub
            </span>
            <span className="text-[10px] text-slate-400">Optional</span>
          </label>
          <div className="relative group">
            <input
              type="url"
              {...register("step1.website")}
              placeholder="https://vertex-global.com"
              className="w-full px-4 py-3 pl-10 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/90 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-300 shadow-xs group-hover:border-slate-300 focus:outline-none focus:bg-white focus:border-[#003E95] focus:ring-4 focus:ring-[#00A7F5]/15"
            />
            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-[#003E95]" />
          </div>
        </div>

        {/* 7. Stand Location (Hall & Booth Number) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#00A7F5]" />
              Stand Location (Hall & Booth #) <span className="text-rose-500">*</span>
            </span>
          </label>
          <div className="relative group">
            <input
              {...register("step1.standLocation")}
              placeholder="e.g. Hall 3, Booth A12 / Pavilion B"
              className={`w-full px-4 py-3 pl-10 rounded-2xl bg-white/70 backdrop-blur-md border text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-300 shadow-xs group-hover:border-slate-300 focus:outline-none focus:bg-white focus:border-[#003E95] focus:ring-4 focus:ring-[#00A7F5]/15 ${
                errors.step1?.standLocation
                  ? "border-rose-400 bg-rose-50/30 ring-2 ring-rose-400/20"
                  : "border-slate-200/90"
              }`}
            />
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-[#003E95]" />
          </div>
          {errors.step1?.standLocation && (
            <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.step1.standLocation.message}
            </p>
          )}
        </div>

        {/* 8. Size of the Stand */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-[#00A7F5]" />
              Size of the Stand (Width × Depth) <span className="text-rose-500">*</span>
            </span>
          </label>
          <div className="relative group">
            <input
              {...register("step1.standSize")}
              placeholder="e.g. 6m x 6m (36 sqm) or 20ft x 30ft"
              className={`w-full px-4 py-3 pl-10 rounded-2xl bg-white/70 backdrop-blur-md border text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-300 shadow-xs group-hover:border-slate-300 focus:outline-none focus:bg-white focus:border-[#003E95] focus:ring-4 focus:ring-[#00A7F5]/15 ${
                errors.step1?.standSize
                  ? "border-rose-400 bg-rose-50/30 ring-2 ring-rose-400/20"
                  : "border-slate-200/90"
              }`}
            />
            <Maximize2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-[#003E95]" />
          </div>
          {errors.step1?.standSize && (
            <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.step1.standSize.message}
            </p>
          )}
        </div>

        {/* 9. Type of Stand (Custom Animated Dropdown) */}
        <div className="space-y-1.5 md:col-span-2" ref={dropdownRef}>
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#00A7F5]" />
              Type of Stand Architecture <span className="text-rose-500">*</span>
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              Affects open sides & ceiling rigging
            </span>
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-expanded={dropdownOpen}
              className={`w-full px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-md border text-left flex items-center justify-between transition-all duration-300 shadow-xs hover:border-slate-300 focus:outline-none focus:bg-white focus:border-[#003E95] focus:ring-4 focus:ring-[#00A7F5]/15 ${
                errors.step1?.standType && !selectedStandType
                  ? "border-rose-400 bg-rose-50/30 ring-2 ring-rose-400/20"
                  : "border-slate-200/90"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#003E95]/10 to-[#00A7F5]/10 text-[#003E95]">
                  <Layers className="w-4 h-4" />
                </div>
                {currentSelectedTypeObj ? (
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-slate-900">
                      {currentSelectedTypeObj.label}
                    </span>
                    <span className="text-[11px] font-semibold bg-[#EBF4FF] text-[#003E95] px-2 py-0.5 rounded-md border border-[#00A7F5]/20">
                      {currentSelectedTypeObj.sides}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-slate-400 font-normal">
                    Select stand layout (Peninsula, Island, Corner, Row, Multi-Story)...
                  </span>
                )}
              </div>

              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                  dropdownOpen ? "rotate-180 text-[#003E95]" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu Modal */}
            {dropdownOpen && (
              <div
                ref={dropdownMenuRef}
                className="absolute left-0 right-0 top-full mt-2 z-50 p-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl shadow-slate-300/40 grid grid-cols-1 sm:grid-cols-2 gap-1.5"
              >
                {STAND_TYPES.map((type) => {
                  const isSelected = selectedStandType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => {
                        setValue("step1.standType", type.id, { shouldValidate: true });
                        setDropdownOpen(false);
                      }}
                      className={`w-full p-3 rounded-xl text-left flex flex-col transition-all duration-200 ${
                        isSelected
                          ? "bg-gradient-to-r from-[#003E95]/10 to-[#00A7F5]/10 border border-[#00A7F5]/30 text-[#003E95]"
                          : "hover:bg-slate-50 border border-transparent text-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          {type.label}
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00A7F5]" />
                          )}
                        </span>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {type.badge}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {type.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {errors.step1?.standType && (
            <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.step1.standType.message}
            </p>
          )}
        </div>

        {/* 10. Upload Floor Plan (Interactive Dropzone) */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <UploadCloud className="w-3.5 h-3.5 text-[#00A7F5]" />
              Upload Floor Plan / Exhibition Blueprint
            </span>
            <span className="text-[10px] text-slate-400">
              PDF, DWG, DXF, PNG, JPG (Max 25MB)
            </span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          {!floorPlanName ? (
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer p-6 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center group ${
                isDragging
                  ? "border-[#00A7F5] bg-[#EBF4FF]/60 scale-[1.01]"
                  : "border-slate-200/90 bg-white/50 hover:bg-white/80 hover:border-[#003E95]/40"
              }`}
            >
              {/* Animated Progress Bar overlay */}
              {uploadProgress !== null && (
                <div className="absolute inset-x-0 bottom-0 h-1.5 bg-slate-100 rounded-b-2xl overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#003E95] to-[#00A7F5] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#003E95]/10 to-[#00A7F5]/10 text-[#003E95] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-xs">
                <UploadCloud className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  <span className="text-[#003E95] group-hover:underline">Click to upload</span> or drag and drop floor plan
                </p>
                <p className="text-[11px] text-slate-400">
                  Supports CAD/DWG, high-res PDF blueprints, and hall diagram scans
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white/90 border border-emerald-200/80 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">
                      {floorPlanName}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      <CheckCircle2 className="w-3 h-3" /> Attached
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {floorPlanSize} · Ready for spatial calculation
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={removeFile}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar with Magnetic Next Button */}
      <div className="flex items-center justify-end pt-6 border-t border-slate-100">
        <button
          ref={magneticBtnRef}
          type="button"
          onClick={nextStep}
          className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white overflow-hidden shadow-[0_16px_36px_-8px_rgba(0,62,149,0.35)] hover:shadow-[0_20px_44px_-8px_rgba(0,167,245,0.5)] transition-all duration-300 active:scale-95 cursor-pointer will-change-transform"
        >
          {/* Gradient background with smooth hover slide */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#003E95] via-[#00A7F5] to-[#003E95] bg-[length:200%_auto] transition-all duration-700 group-hover:bg-right" />

          <span className="relative z-10 font-bold tracking-tight">
            Next: Stand Brief
          </span>

          <div className="relative z-10 flex items-center justify-center w-5 h-5 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </button>
      </div>
    </div>
  );
}
