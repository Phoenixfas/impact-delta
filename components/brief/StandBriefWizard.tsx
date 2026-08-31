"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { BriefFormProvider, useBriefForm } from "./BriefFormProvider";
import BriefStepperBar from "./BriefStepperBar";
import StepCompanyDetails from "./StepCompanyDetails";
import StepStandBrief from "./StepStandBrief";
import StepDisplayMeeting from "./StepDisplayMeeting";
import StepStandDesign from "./StepStandDesign";
import StepAudioVisual from "./StepAudioVisual";
import StepAdditionalReq from "./StepAdditionalReq";
import BriefSuccessModal from "./BriefSuccessModal";

function WizardContent() {
  const { currentStep, direction } = useBriefForm();
  const stepContainerRef = useRef<HTMLDivElement | null>(null);

  // GSAP Step Transition (fade & directional slide)
  useEffect(() => {
    if (!stepContainerRef.current) return;

    const xOffset = direction === "forward" ? 24 : -24;

    gsap.fromTo(
      stepContainerRef.current,
      {
        opacity: 0,
        x: xOffset,
        scale: 0.99,
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      }
    );
  }, [currentStep, direction]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="w-full"
        noValidate
      >
        {/* Interactive Stepper Progress Bar */}
        <BriefStepperBar />

        {/* Step Content Mount Area (GSAP Animated container) */}
        <div ref={stepContainerRef} className="min-h-[300px]">
          {currentStep === 1 && <StepCompanyDetails />}
          {currentStep === 2 && <StepStandBrief />}
          {currentStep === 3 && <StepDisplayMeeting />}
          {currentStep === 4 && <StepStandDesign />}
          {currentStep === 5 && <StepAudioVisual />}
          {currentStep === 6 && <StepAdditionalReq />}
        </div>
      </form>

      {/* Celebratory Fullscreen Glass Modal on Successful Brief Transmission */}
      <BriefSuccessModal />
    </>
  );
}

export default function StandBriefWizard() {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 30, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: 0.25,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <BriefFormProvider>
      {/* Soft elevated glass card container */}
      <div
        ref={cardRef}
        className="w-full bg-white/90 backdrop-blur-xl border border-white/60 shadow-2xl shadow-slate-200/50 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto transition-all will-change-transform"
      >
        <WizardContent />
      </div>
    </BriefFormProvider>
  );
}
