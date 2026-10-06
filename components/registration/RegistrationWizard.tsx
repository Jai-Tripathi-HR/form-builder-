"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FestiveBackground } from "./FestiveBackground";
import { ProgressIndicator } from "./ProgressIndicator";
import { WelcomeScreen } from "./WelcomeScreen";
import { EmployeeForm } from "./EmployeeForm";
import { GuestCount } from "./GuestCount";
import { GuestForm } from "./GuestForm";
import { ReviewStep } from "./ReviewStep";
import { SuccessScreen } from "./SuccessScreen";
import { EmployeeData, GuestData, RegistrationFormData } from "@/types/registration";

type WizardStep = "welcome" | "employee" | "count" | "guest" | "review" | "success";

const INITIAL_FORM_DATA: RegistrationFormData = {
  employee: {
    name: "",
    email: "",
    phone: "",
  },
  guestCount: 1,
  guests: [
    {
      name: "",
      phone: "",
      email: "",
      type: "Family",
    },
  ],
};

export function RegistrationWizard() {
  const [step, setStep] = useState<WizardStep>("welcome");
  const [currentGuestIndex, setCurrentGuestIndex] = useState(0);
  const [formData, setFormData] = useState<RegistrationFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [requiresSheetHeaders, setRequiresSheetHeaders] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{
    registrationId: string;
    submittedAt: string;
  } | null>(null);

  // Calculate step numbers for progress indicator
  // Steps: 1: Employee, 2: Count, 3..(2+count): Guests, (3+count): Review
  const totalWizardSteps = 2 + formData.guestCount + 1; // employee + count + guests + review
  let currentStepNumber = 1;
  let currentStepCategory = "Employee Details";

  if (step === "employee") {
    currentStepNumber = 1;
    currentStepCategory = "Employee Details";
  } else if (step === "count") {
    currentStepNumber = 2;
    currentStepCategory = "Guest Selection";
  } else if (step === "guest") {
    currentStepNumber = 3 + currentGuestIndex;
    currentStepCategory = `Guest ${currentGuestIndex + 1} of ${formData.guestCount}`;
  } else if (step === "review") {
    currentStepNumber = totalWizardSteps;
    currentStepCategory = "Review & Confirm";
  }

  // --- Step Navigations ---
  const handleStart = () => {
    setStep("employee");
  };

  const handleEmployeeSubmit = (employee: EmployeeData) => {
    setFormData((prev) => ({ ...prev, employee }));
    setStep("count");
  };

  const handleGuestCountSelect = (count: number) => {
    setFormData((prev) => {
      // Adjust guests array size while preserving previously entered data
      const newGuests: GuestData[] = [];
      for (let i = 0; i < count; i++) {
        if (prev.guests[i]) {
          newGuests.push(prev.guests[i]);
        } else {
          newGuests.push({
            name: "",
            phone: "",
            email: "",
            type: "Family",
          });
        }
      }
      return {
        ...prev,
        guestCount: count,
        guests: newGuests,
      };
    });

    if (count === 0) {
      setStep("review");
    } else {
      setCurrentGuestIndex(0);
      setStep("guest");
    }
  };

  const handleGuestSubmit = (guest: GuestData) => {
    setFormData((prev) => {
      const updatedGuests = [...prev.guests];
      updatedGuests[currentGuestIndex] = guest;
      return { ...prev, guests: updatedGuests };
    });

    if (currentGuestIndex < formData.guestCount - 1) {
      setCurrentGuestIndex((prev) => prev + 1);
    } else {
      setStep("review");
    }
  };

  const handleBack = () => {
    setSubmissionError(null);
    if (step === "employee") {
      setStep("welcome");
    } else if (step === "count") {
      setStep("employee");
    } else if (step === "guest") {
      if (currentGuestIndex > 0) {
        setCurrentGuestIndex((prev) => prev - 1);
      } else {
        setStep("count");
      }
    } else if (step === "review") {
      if (formData.guestCount > 0) {
        setCurrentGuestIndex(formData.guestCount - 1);
        setStep("guest");
      } else {
        setStep("count");
      }
    }
  };

  // Direct editing navigation from review step
  const handleEditEmployee = () => setStep("employee");
  const handleEditGuestCount = () => setStep("count");
  const handleEditGuest = (index: number) => {
    setCurrentGuestIndex(index);
    setStep("guest");
  };

  // --- Submission to Next.js API Route ---
  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);
    setRequiresSheetHeaders(false);

    try {
      const res = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee: formData.employee,
          guestCount: formData.guestCount,
          guests: formData.guests.slice(0, formData.guestCount),
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setSuccessInfo({
          registrationId: data.registration_id,
          submittedAt: data.submitted_at,
        });
        setStep("success");
      } else {
        const errorMsg =
          data?.error ||
          "We couldn't complete your registration right now. Please try again in a moment.";
        setSubmissionError(errorMsg);
        if (data?.requiresSheetHeaders) {
          setRequiresSheetHeaders(true);
        }
      }
    } catch (err: unknown) {
      console.error("Submission failed:", err);
      setSubmissionError(
        "Something went wrong while connecting to the server. Please check your internet connection."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentGuestIndex(0);
    setSubmissionError(null);
    setRequiresSheetHeaders(false);
    setSuccessInfo(null);
    setStep("welcome");
  };

  return (
    <main className="min-h-screen relative flex flex-col justify-between py-6 px-3 sm:px-6">
      <FestiveBackground />

      {/* Progress header shown during form steps */}
      {step !== "welcome" && step !== "success" && (
        <ProgressIndicator
          currentStep={currentStepNumber}
          totalSteps={totalWizardSteps}
          stepTitle={currentStepCategory}
          stepCategory={currentStepCategory}
          canGoBack={true}
          onBack={handleBack}
        />
      )}

      {/* Animated step switcher */}
      <div className="flex-1 flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          {step === "welcome" && (
            <WelcomeScreen key="step-welcome" onStart={handleStart} />
          )}

          {step === "employee" && (
            <EmployeeForm
              key="step-employee"
              initialData={formData.employee}
              onSubmit={handleEmployeeSubmit}
            />
          )}

          {step === "count" && (
            <GuestCount
              key="step-count"
              currentCount={formData.guestCount}
              onSelect={handleGuestCountSelect}
            />
          )}

          {step === "guest" && (
            <GuestForm
              key={`step-guest-${currentGuestIndex}`}
              guestIndex={currentGuestIndex}
              totalGuests={formData.guestCount}
              initialData={formData.guests[currentGuestIndex]}
              onSubmit={handleGuestSubmit}
            />
          )}

          {step === "review" && (
            <ReviewStep
              key="step-review"
              formData={formData}
              isSubmitting={isSubmitting}
              onEditEmployee={handleEditEmployee}
              onEditGuestCount={handleEditGuestCount}
              onEditGuest={handleEditGuest}
              onSubmit={handleConfirmSubmit}
              onBack={handleBack}
              errorMessage={submissionError}
              requiresSheetHeaders={requiresSheetHeaders}
            />
          )}

          {step === "success" && successInfo && (
            <SuccessScreen
              key="step-success"
              registrationId={successInfo.registrationId}
              submittedAt={successInfo.submittedAt}
              formData={formData}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Minimal Footer */}
      <footer className="w-full text-center py-4 text-xs text-slate-400 select-none">
        <p>Corporate Garba Gala 2026 • Powered by Next.js & SheetDB</p>
      </footer>
    </main>
  );
}
