"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Check } from "lucide-react";
import { useBriefForm } from "./BriefFormProvider";

export default function BriefStepperBar() {
  const { currentStep, completedSteps, goToStep, steps } = useBriefForm();
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const nodesRef = useRef<(HTMLButtonElement | null)[]>([]);

  // GSAP animation for progress line and node transitions
  useEffect(() => {
    const totalSteps = steps.length;
    // Progress calculation: 0% at step 1, 100% at step 6
    const progress = Math.max(0, Math.min(1, (currentStep - 1) / (totalSteps - 1)));

    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        scaleX: progress,
        duration: 0.55,
        ease: "power2.out",
        transformOrigin: "left center",
      });
    }

    // Node active pulse & checkmark pop-in
    nodesRef.current.forEach((node, idx) => {
      if (!node) return;
      const stepId = idx + 1;
      const isActive = currentStep === stepId;
      const isCompleted = completedSteps.includes(stepId) || stepId < currentStep;

      if (isActive) {
        gsap.to(node, {
          scale: 1.08,
          duration: 0.4,
          ease: "back.out(1.7)",
        });
      } else if (isCompleted) {
        gsap.to(node, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(node, {
          scale: 0.95,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });
  }, [currentStep, completedSteps, steps.length]);

  return (
    <div className="w-full select-none mb-8 sm:mb-10">
      {/* Mobile Step Indicator Banner */}
      <div className="flex sm:hidden items-center justify-between px-3 py-2.5 mb-4 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/70 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-[#003E95] to-[#00A7F5] text-white text-xs font-bold shadow-sm">
            {currentStep}
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-xs font-bold text-slate-800 line-clamp-1">
              {steps[currentStep - 1]?.name}
            </span>
          </div>
        </div>
        <span className="text-xs font-bold text-[#003E95] bg-[#EBF4FF] px-2.5 py-1 rounded-full">
          {Math.round(((currentStep - 1) / (steps.length - 1)) * 100)}%
        </span>
      </div>

      {/* Stepper Bar Desktop & Tablet */}
      <div className="relative">
        {/* Background Track Line */}
        <div className="absolute top-5 left-6 right-6 h-[3px] -translate-y-1/2 bg-slate-200/80 rounded-full z-0 pointer-events-none" />

        {/* GSAP Animated Fill Progress Line */}
        <div
          ref={progressBarRef}
          className="absolute top-5 left-6 right-6 h-[3px] -translate-y-1/2 bg-gradient-to-r from-[#003E95] via-[#00A7F5] to-[#92DCFF] rounded-full z-0 pointer-events-none origin-left shadow-[0_0_12px_rgba(0,167,245,0.45)]"
          style={{ transform: "scaleX(0)" }}
        />

        {/* 6 Step Nodes */}
        <div className="relative z-10 grid grid-cols-6 gap-1 sm:gap-2">
          {steps.map((step, index) => {
            const stepId = step.id;
            const isActive = currentStep === stepId;
            const isCompleted = completedSteps.includes(stepId) || stepId < currentStep;
            const isClickable = isCompleted || stepId <= currentStep;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center group"
              >
                {/* Interactive Node Button */}
                <button
                  ref={(el) => {
                    nodesRef.current[index] = el;
                  }}
                  type="button"
                  onClick={() => isClickable && goToStep(stepId)}
                  disabled={!isClickable}
                  aria-label={`Step ${stepId}: ${step.name}`}
                  aria-current={isActive ? "step" : undefined}
                  className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                    isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-75"
                  } ${
                    isActive
                      ? "bg-gradient-to-br from-[#003E95] to-[#00A7F5] text-white shadow-lg shadow-[#00A7F5]/30 ring-4 ring-[#92DCFF]/40 border-2 border-white"
                      : isCompleted
                      ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20 border-2 border-white hover:scale-105"
                      : "bg-white text-slate-400 border-2 border-slate-200 shadow-sm hover:border-slate-300"
                  }`}
                >
                  {/* Pulse Halo for Active Step */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-[#00A7F5] animate-ping opacity-25 pointer-events-none" />
                  )}

                  {/* Node Content: Completed Checkmark or Step Number */}
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5] text-white" />
                  ) : (
                    <span
                      className={`text-xs font-extrabold tracking-tight ${
                        isActive ? "text-white" : "text-slate-500"
                      }`}
                    >
                      {step.number}
                    </span>
                  )}
                </button>

                {/* Step Text Label (Hidden on ultra-small mobile, styled for 2026 aesthetics) */}
                <div className="mt-2.5 flex flex-col items-center text-center px-0.5">
                  <span
                    className={`text-[11px] sm:text-xs font-bold leading-tight transition-colors duration-200 hidden xs:block line-clamp-1 ${
                      isActive
                        ? "text-[#003E95]"
                        : isCompleted
                        ? "text-slate-700 group-hover:text-[#003E95]"
                        : "text-slate-400"
                    }`}
                  >
                    {step.name}
                  </span>
                  <span
                    className={`text-[10px] hidden md:block mt-0.5 font-medium transition-colors duration-200 line-clamp-1 ${
                      isActive
                        ? "text-[#00A7F5]"
                        : isCompleted
                        ? "text-emerald-600/80"
                        : "text-slate-400/80"
                    }`}
                  >
                    {step.shortDesc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
