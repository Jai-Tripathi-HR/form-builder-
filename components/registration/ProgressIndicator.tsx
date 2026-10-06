"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepCategory?: string;
  canGoBack: boolean;
  onBack: () => void;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  stepTitle,
  stepCategory,
  canGoBack,
  onBack,
}: ProgressIndicatorProps) {
  const progressPercent = Math.min(
    100,
    Math.max(5, Math.round((currentStep / totalSteps) * 100))
  );

  return (
    <header className="w-full max-w-xl mx-auto px-4 pt-4 pb-2 mb-2">
      {/* Top row: Back button & Category badge */}
      <div className="flex items-center justify-between min-h-[44px]">
        {canGoBack ? (
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors py-2 px-2.5 -ml-2 rounded-lg hover:bg-slate-200/50 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="Go to previous step"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back</span>
          </button>
        ) : (
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-amber-700/80 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Garba 2026</span>
          </div>
        )}

        {/* Step indicator count */}
        <div className="text-xs font-medium text-slate-400 tracking-tight">
          <span className="text-slate-800 font-semibold">{currentStep}</span> of{" "}
          <span>{totalSteps}</span>
        </div>
      </div>

      {/* Progress track */}
      <div className="relative w-full h-1 bg-slate-200/80 rounded-full overflow-hidden mt-2">
        <motion.div
          className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-full"
          initial={false}
          animate={{ width: `${progressPercent}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>

      {/* Optional micro label */}
      {stepCategory && (
        <div className="mt-2 text-[11px] font-medium text-amber-800/80 uppercase tracking-wider">
          {stepCategory}
        </div>
      )}
    </header>
  );
}
