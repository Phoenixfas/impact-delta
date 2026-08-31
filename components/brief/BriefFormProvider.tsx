"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useForm, UseFormReturn, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  standBriefSchema,
  StandBriefFormData,
  DEFAULT_BRIEF_VALUES,
  STEPS,
  StepDefinition,
} from "@/lib/standBriefSchema";

interface BriefFormContextType {
  form: UseFormReturn<StandBriefFormData>;
  currentStep: number;
  direction: "forward" | "backward";
  completedSteps: number[];
  isSubmitting: boolean;
  isSubmitted: boolean;
  submissionSuccessData: { referenceId: string; submittedAt: string } | null;
  goToStep: (step: number) => Promise<boolean>;
  nextStep: () => Promise<boolean>;
  prevStep: () => void;
  submitBrief: () => Promise<void>;
  resetBrief: () => void;
  steps: readonly StepDefinition[];
}

const BriefFormContext = createContext<BriefFormContextType | null>(null);

export function useBriefForm() {
  const context = useContext(BriefFormContext);
  if (!context) {
    throw new Error("useBriefForm must be used within a BriefFormProvider");
  }
  return context;
}

interface BriefFormProviderProps {
  children: React.ReactNode;
  onSubmitSuccess?: (data: StandBriefFormData, referenceId: string) => void;
}

export function BriefFormProvider({
  children,
  onSubmitSuccess,
}: BriefFormProviderProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionSuccessData, setSubmissionSuccessData] = useState<{
    referenceId: string;
    submittedAt: string;
  } | null>(null);

  const form = useForm<StandBriefFormData>({
    resolver: zodResolver(standBriefSchema),
    defaultValues: DEFAULT_BRIEF_VALUES,
    mode: "onChange",
  });

  const validateCurrentStep = useCallback(
    async (stepNum: number): Promise<boolean> => {
      const stepKey = STEPS.find((s) => s.id === stepNum)?.key;
      if (!stepKey) return true;

      // Trigger validation specifically for the current step's fields
      const isValid = await form.trigger(stepKey);
      return isValid;
    },
    [form]
  );

  const goToStep = useCallback(
    async (targetStep: number): Promise<boolean> => {
      if (targetStep === currentStep) return true;
      if (targetStep < 1 || targetStep > STEPS.length) return false;

      // If moving backward, always allow without validation blockage
      if (targetStep < currentStep) {
        setDirection("backward");
        setCurrentStep(targetStep);
        return true;
      }

      // If moving forward, validate current step first
      const isValid = await validateCurrentStep(currentStep);
      if (!isValid) return false;

      // Mark current step as completed
      setCompletedSteps((prev) =>
        prev.includes(currentStep) ? prev : [...prev, currentStep]
      );

      setDirection("forward");
      setCurrentStep(targetStep);
      return true;
    },
    [currentStep, validateCurrentStep]
  );

  const nextStep = useCallback(async (): Promise<boolean> => {
    if (currentStep >= STEPS.length) return false;

    const isValid = await validateCurrentStep(currentStep);
    if (!isValid) return false;

    setCompletedSteps((prev) =>
      prev.includes(currentStep) ? prev : [...prev, currentStep]
    );
    setDirection("forward");
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    return true;
  }, [currentStep, validateCurrentStep]);

  const prevStep = useCallback(() => {
    if (currentStep <= 1) return;
    setDirection("backward");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, [currentStep]);

  const submitBrief = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Validate whole form
      const isValid = await form.trigger();
      if (!isValid) {
        // Jump to first invalid step
        const errors = form.formState.errors;
        for (const step of STEPS) {
          if (errors[step.key]) {
            setCurrentStep(step.id);
            break;
          }
        }
        setIsSubmitting(false);
        return;
      }

      const data = form.getValues();
      // Simulate enterprise brief ingestion & ID assignment
      await new Promise((resolve) => setTimeout(resolve, 900));

      const refId = `SB-${Math.floor(100000 + Math.random() * 900000)}`;
      const successInfo = {
        referenceId: refId,
        submittedAt: new Date().toISOString(),
      };

      setSubmissionSuccessData(successInfo);
      setCompletedSteps([1, 2, 3, 4, 5, 6]);
      setIsSubmitted(true);

      if (onSubmitSuccess) {
        onSubmitSuccess(data, refId);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [form, onSubmitSuccess]);

  const resetBrief = useCallback(() => {
    form.reset(DEFAULT_BRIEF_VALUES);
    setCurrentStep(1);
    setCompletedSteps([]);
    setIsSubmitted(false);
    setSubmissionSuccessData(null);
  }, [form]);

  return (
    <BriefFormContext.Provider
      value={{
        form,
        currentStep,
        direction,
        completedSteps,
        isSubmitting,
        isSubmitted,
        submissionSuccessData,
        goToStep,
        nextStep,
        prevStep,
        submitBrief,
        resetBrief,
        steps: STEPS,
      }}
    >
      <FormProvider {...form}>{children}</FormProvider>
    </BriefFormContext.Provider>
  );
}
