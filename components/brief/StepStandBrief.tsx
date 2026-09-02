"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import gsap from "gsap";
import {
  Target,
  Palette,
  Coins,
  PackageCheck,
  UploadCloud,
  FileImage,
  X,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Users,
  Rocket,
  Plus,
  AlertCircle,
  Pipette,
  Check,
  Trash2,
} from "lucide-react";
import {
  StandBriefFormData,
  PRIMARY_GOALS_LIST,
  CURRENCIES,
  UploadedFile,
} from "@/lib/standBriefSchema";
import { useBriefForm } from "./BriefFormProvider";

const GOAL_ICONS: Record<string, React.ElementType> = {
  "Product Presentation": Layers,
  Meeting: Users,
  "Product Launch": Rocket,
  Others: Sparkles,
};

const PRESET_PALETTES = [
  { name: "Impact Navy", hex: "#003E95" },
  { name: "Electric Cyan", hex: "#00A7F5" },
  { name: "Obsidian Slate", hex: "#0F172A" },
  { name: "Luxe Emerald", hex: "#059669" },
  { name: "Tech Violet", hex: "#7C3AED" },
  { name: "Titanium Silver", hex: "#64748B" },
];

export default function StepStandBrief() {
  const { nextStep, prevStep } = useBriefForm();
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<StandBriefFormData>();

  const primaryGoals = watch("step2.primaryGoals") || [];
  const colorHex = watch("step2.colorHex") || "#003E95";
  const preferredColorScheme = watch("step2.preferredColorScheme") || "";
  const budgetCurrency = watch("step2.budgetCurrency") || "USD";
  const productsToExhibit = watch("step2.productsToExhibit") || "";
  const productFiles: UploadedFile[] = watch("step2.productFiles") || [];

  // Dropdown state for Currency
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const currencyRef = useRef<HTMLDivElement | null>(null);

  // File dropzone state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Magnetic button refs
  const magneticNextRef = useRef<HTMLButtonElement | null>(null);
  const magneticBackRef = useRef<HTMLButtonElement | null>(null);

  // Close currency dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // GSAP Magnetic Buttons
  useEffect(() => {
    const attachMagnetic = (btn: HTMLElement | null) => {
      if (!btn) return () => {};
      const xTo = gsap.quickTo(btn, "x", { duration: 0.3, ease: "power2.out" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.3, ease: "power2.out" });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

        if (dist < 75) {
          const pullFactor = (1 - dist / 75) * 7;
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
    };

    const cleanupNext = attachMagnetic(magneticNextRef.current);
    const cleanupBack = attachMagnetic(magneticBackRef.current);

    return () => {
      cleanupNext();
      cleanupBack();
    };
  }, []);

  // Toggle Primary Goal Selection with GSAP animation
  const toggleGoal = (goalId: string, index: number) => {
    const chipEl = chipRefs.current[index];
    if (chipEl) {
      gsap.fromTo(
        chipEl,
        { scale: 0.94 },
        { scale: 1, duration: 0.3, ease: "back.out(2)" }
      );
    }

    const current = new Set(primaryGoals);
    if (current.has(goalId)) {
      current.delete(goalId);
    } else {
      current.add(goalId);
    }
    setValue("step2.primaryGoals", Array.from(current), { shouldValidate: true });
  };

  // Multi-File Upload Handlers
  const handleFilesUpload = useCallback(
    async (files: FileList | File[]) => {
      const newFiles: UploadedFile[] = [];

      for (const file of Array.from(files)) {
        if (file.size > 20 * 1024 * 1024) {
          alert(`File ${file.name} exceeds 20MB limit.`);
          continue;
        }

        const sizeFormatted =
          file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.round(file.size / 1024)} KB`;

        let previewUrl: string | undefined = undefined;

        try {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          if (res.ok) {
            const data = await res.json();
            previewUrl = data.url;
          } else if (file.type.startsWith("image/")) {
            previewUrl = URL.createObjectURL(file);
          }
        } catch {
          if (file.type.startsWith("image/")) {
            previewUrl = URL.createObjectURL(file);
          }
        }

        newFiles.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          name: file.name,
          size: sizeFormatted,
          type: file.type,
          preview: previewUrl,
        });
      }

      if (newFiles.length > 0) {
        setValue("step2.productFiles", [...productFiles, ...newFiles], {
          shouldValidate: true,
        });
      }
    },
    [productFiles, setValue]
  );

  const removeProductFile = (fileId: string) => {
    const updated = productFiles.filter((f) => f.id !== fileId);
    setValue("step2.productFiles", updated, { shouldValidate: true });
  };

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUpload(e.dataTransfer.files);
    }
  };

  const isOtherGoalSelected = primaryGoals.includes("Others");

  return (
    <div className="space-y-8">
      {/* Step Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Stand Objectives & Products</span>
            <span className="text-[11px] font-semibold text-[#00A7F5] bg-[#EBF4FF] px-2.5 py-0.5 rounded-full">
              Brief Calibration
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Outline your strategic goals, budget allocation, and the showcase items to exhibit.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 self-start sm:self-auto">
          * Required fields
        </span>
      </div>

      {/* 1. Primary Aims and Goals: Multi-select Interactive Chip Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#00A7F5]" />
            Primary Aims & Goals <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] text-slate-400 font-medium">
            Select all that apply ({primaryGoals.length} selected)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRIMARY_GOALS_LIST.map((goal, idx) => {
            const isSelected = primaryGoals.includes(goal.id);
            const Icon = GOAL_ICONS[goal.id] || Target;

            return (
              <button
                key={goal.id}
                ref={(el) => {
                  chipRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => toggleGoal(goal.id, idx)}
                className={`relative p-4 rounded-2xl text-left border transition-all duration-300 flex flex-col justify-between group cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-br from-[#003E95]/10 via-[#00A7F5]/10 to-white border-[#00A7F5] shadow-md shadow-[#00A7F5]/15 ring-2 ring-[#00A7F5]/30"
                    : "bg-white/70 backdrop-blur-md border-slate-200/90 hover:border-slate-300 hover:bg-white shadow-xs"
                }`}
              >
                {/* Header Icon + Check badge */}
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-[#003E95] text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-[#00A7F5] text-white scale-100"
                        : "border border-slate-200 text-transparent scale-90"
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                {/* Title & Desc */}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">
                      {goal.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    {goal.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {errors.step2?.primaryGoals && (
          <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.step2.primaryGoals.message}
          </p>
        )}

        {/* Expandable text input if "Others" is selected */}
        {isOtherGoalSelected && (
          <div className="mt-3 p-4 rounded-2xl bg-white/80 border border-[#00A7F5]/30 shadow-xs">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00A7F5]" />
              Specify Custom Goals / Additional Aims
            </label>
            <input
              {...register("step2.otherGoalDetails")}
              placeholder="e.g. VIP investor private gala, live podcast recording booth, barista activation..."
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#003E95] focus:ring-2 focus:ring-[#00A7F5]/20 transition-all"
            />
          </div>
        )}
      </div>

      {/* 2-Column Responsive Grid for Color Scheme & Allocated Budget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* 2. Preferred Colour Scheme with Inline Picker Trigger & Preset Swatches */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#00A7F5]" />
              Preferred Colour Scheme <span className="text-rose-500">*</span>
            </span>
            <span className="text-[10px] text-slate-400">Brand Palette</span>
          </label>

          <div className="relative group">
            {/* Color swatch trigger */}
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
              <label
                htmlFor="color-picker-input"
                className="w-7 h-7 rounded-xl border border-white shadow-sm flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: colorHex }}
                title="Click to open color picker"
              >
                <Pipette className="w-3.5 h-3.5 text-white drop-shadow" />
              </label>
              <input
                id="color-picker-input"
                type="color"
                value={colorHex}
                onChange={(e) => setValue("step2.colorHex", e.target.value)}
                className="sr-only"
              />
            </div>

            <input
              {...register("step2.preferredColorScheme")}
              placeholder="e.g. Corporate Deep Blue & Pure White, Metallic Silver"
              className={`w-full px-4 py-3 pl-14 rounded-2xl bg-white/70 backdrop-blur-md border text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-300 shadow-xs group-hover:border-slate-300 focus:outline-none focus:bg-white focus:border-[#003E95] focus:ring-4 focus:ring-[#00A7F5]/15 ${
                errors.step2?.preferredColorScheme
                  ? "border-rose-400 bg-rose-50/30 ring-2 ring-rose-400/20"
                  : "border-slate-200/90"
              }`}
            />
          </div>

          {/* Quick Preset Color Swatches */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10px] font-medium text-slate-400 mr-1">Presets:</span>
            {PRESET_PALETTES.map((p) => (
              <button
                key={p.hex}
                type="button"
                onClick={() => {
                  setValue("step2.colorHex", p.hex);
                  setValue(
                    "step2.preferredColorScheme",
                    `${p.name} & Pure White`,
                    { shouldValidate: true }
                  );
                }}
                className={`w-5 h-5 rounded-full border border-white shadow-xs transition-transform hover:scale-125 ${
                  colorHex === p.hex ? "ring-2 ring-[#003E95] scale-110" : ""
                }`}
                style={{ backgroundColor: p.hex }}
                title={p.name}
              />
            ))}
          </div>

          {errors.step2?.preferredColorScheme && (
            <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.step2.preferredColorScheme.message}
            </p>
          )}
        </div>

        {/* 3. Allocated Budget with Integrated Currency Selector Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-[#00A7F5]" />
              Allocated Stand Budget <span className="text-rose-500">*</span>
            </span>
            <span className="text-[10px] text-slate-400">Total Architecture & Build</span>
          </label>

          <div className="flex items-center gap-2">
            {/* Currency Selector Dropdown */}
            <div className="relative" ref={currencyRef}>
              <button
                type="button"
                onClick={() => setCurrencyDropdownOpen((prev) => !prev)}
                className="h-[46px] px-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/90 hover:border-slate-300 text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-xs focus:outline-none focus:border-[#003E95] focus:ring-4 focus:ring-[#00A7F5]/15 transition-all"
              >
                <span>{budgetCurrency}</span>
                <span className="text-slate-400 font-normal">
                  ({CURRENCIES.find((c) => c.code === budgetCurrency)?.symbol})
                </span>
              </button>

              {currencyDropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 z-50 p-1 rounded-xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-lg shadow-slate-200/50 min-w-[120px] space-y-0.5">
                  {CURRENCIES.map((curr) => (
                    <button
                      key={curr.code}
                      type="button"
                      onClick={() => {
                        setValue("step2.budgetCurrency", curr.code, { shouldValidate: true });
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 rounded-lg text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                        budgetCurrency === curr.code
                          ? "bg-[#003E95] text-white"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span>{curr.code}</span>
                      <span className="text-[11px] opacity-80">{curr.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Budget Amount Input */}
            <div className="relative flex-1 group">
              <input
                {...register("step2.budgetAmount")}
                type="text"
                placeholder="e.g. 45,000"
                className={`w-full px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-md border text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-300 shadow-xs group-hover:border-slate-300 focus:outline-none focus:bg-white focus:border-[#003E95] focus:ring-4 focus:ring-[#00A7F5]/15 ${
                  errors.step2?.budgetAmount
                    ? "border-rose-400 bg-rose-50/30 ring-2 ring-rose-400/20"
                    : "border-slate-200/90"
                }`}
              />
            </div>
          </div>

          {errors.step2?.budgetAmount && (
            <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.step2.budgetAmount.message}
            </p>
          )}
        </div>
      </div>

      {/* 4. Products to Exhibit: Expanded Sleek Textarea with Character Count */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <PackageCheck className="w-3.5 h-3.5 text-[#00A7F5]" />
            Products & Solutions to Exhibit <span className="text-rose-500">*</span>
          </label>
          <span
            className={`text-[11px] font-mono font-medium ${
              productsToExhibit.length > 450
                ? "text-amber-600 font-bold"
                : "text-slate-400"
            }`}
          >
            {productsToExhibit.length} / 500 characters
          </span>
        </div>

        <div className="relative group">
          <textarea
            {...register("step2.productsToExhibit")}
            maxLength={500}
            rows={3}
            placeholder="Describe key physical machinery, software demo stations, industrial models, or sample displays you plan to feature on the stand floor..."
            className={`w-full px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-md border text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-300 shadow-xs group-hover:border-slate-300 focus:outline-none focus:bg-white focus:border-[#003E95] focus:ring-4 focus:ring-[#00A7F5]/15 resize-none ${
              errors.step2?.productsToExhibit
                ? "border-rose-400 bg-rose-50/30 ring-2 ring-rose-400/20"
                : "border-slate-200/90"
            }`}
          />
        </div>

        {errors.step2?.productsToExhibit && (
          <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.step2.productsToExhibit.message}
          </p>
        )}
      </div>

      {/* 5. Upload Product Images / Files: Multi-file Drag & Drop Uploader */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <UploadCloud className="w-3.5 h-3.5 text-[#00A7F5]" />
            Upload Product Images & Reference Files
          </label>
          <span className="text-[10px] text-slate-400">
            JPG, PNG, WEBP, PDF (Max 20MB each)
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFilesUpload(e.target.files);
            }
          }}
        />

        {/* Dropzone Container */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer p-6 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center group ${
            isDragging
              ? "border-[#00A7F5] bg-[#EBF4FF]/60 scale-[1.01]"
              : "border-slate-200/90 bg-white/50 hover:bg-white/80 hover:border-[#003E95]/40 shadow-xs"
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#003E95]/10 to-[#00A7F5]/10 text-[#003E95] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform duration-300 shadow-xs">
            <FileImage className="w-5 h-5" />
          </div>

          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              <span className="text-[#003E95] group-hover:underline">Click to upload</span> or drag and drop product photos & specs
            </p>
            <p className="text-[11px] text-slate-400">
              Upload multiple 3D models, rendering samples, or product catalogues
            </p>
          </div>
        </div>

        {/* Uploaded File Previews & Removal Chips Grid */}
        {productFiles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
            {productFiles.map((file) => (
              <div
                key={file.id}
                className="p-2.5 rounded-xl bg-white/90 border border-slate-200/90 shadow-xs flex items-center justify-between gap-2.5 group hover:border-[#00A7F5]/40 transition-all"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-9 h-9 rounded-lg object-cover border border-slate-100 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-[#EBF4FF] text-[#003E95] flex items-center justify-center shrink-0">
                      <FileImage className="w-4 h-4" />
                    </div>
                  )}

                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {file.size}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeProductFile(file.id)}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors shrink-0"
                  title="Remove file"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation: Magnetic Back and Next Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
        <button
          ref={magneticBackRef}
          type="button"
          onClick={prevStep}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 cursor-pointer transition-all duration-200 will-change-transform"
        >
          <ArrowLeft className="w-4 h-4" /> Back: Company Details
        </button>

        <button
          ref={magneticNextRef}
          type="button"
          onClick={nextStep}
          className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white overflow-hidden shadow-[0_16px_36px_-8px_rgba(0,62,149,0.35)] hover:shadow-[0_20px_44px_-8px_rgba(0,167,245,0.5)] transition-all duration-300 active:scale-95 cursor-pointer will-change-transform"
        >
          {/* Gradient background with smooth hover slide */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#003E95] via-[#00A7F5] to-[#003E95] bg-[length:200%_auto] transition-all duration-700 group-hover:bg-right" />

          <span className="relative z-10 font-bold tracking-tight">
            Next: Display & Meeting
          </span>

          <div className="relative z-10 flex items-center justify-center w-5 h-5 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </button>
      </div>
    </div>
  );
}
