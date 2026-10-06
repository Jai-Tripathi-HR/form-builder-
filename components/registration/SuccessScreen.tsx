"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Check, Copy, CheckCheck, Sparkles, Calendar, Users, RotateCcw } from "lucide-react";
import { RegistrationFormData } from "@/types/registration";

interface SuccessScreenProps {
  registrationId: string;
  submittedAt: string;
  formData: RegistrationFormData;
  onReset: () => void;
}

export function SuccessScreen({
  registrationId,
  submittedAt,
  formData,
  onReset,
}: SuccessScreenProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#EA580C", "#D97706", "#F59E0B", "#BE185D", "#4F46E5"],
      });
      const timer = setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#EA580C", "#F59E0B"],
        });
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#BE185D", "#D97706"],
        });
      }, 350);
      return () => clearTimeout(timer);
    } catch {
      // Gracefully ignore in SSR/test environments
    }
  }, []);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(registrationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const totalAttendees = 1 + formData.guestCount;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center text-center"
    >
      {/* Animated Checkmark Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        className="relative mb-6"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-500/25">
          <Check className="w-10 h-10 stroke-[3]" />
        </div>
        <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping -z-10" />
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-2"
      >
        You&apos;re all set. ✨
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className="text-base sm:text-lg text-slate-600 max-w-md mb-8"
      >
        Your Garba registration has been successfully recorded in the event database.
      </motion.p>

      {/* Digital Event Pass Ticket */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.35 }}
        className="w-full bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 shadow-xl shadow-slate-900/5 mb-8 text-left relative overflow-hidden"
      >
        {/* Top pass badge */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-dashed border-slate-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Garba 2026 Event Pass
            </span>
          </div>
          <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
            Confirmed
          </span>
        </div>

        {/* Pass ID Display with 1-click Copy */}
        <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 mb-5 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Registration Pass ID
            </div>
            <div className="font-mono text-xl sm:text-2xl font-bold text-slate-900 tracking-wider">
              {registrationId}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyId}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95 shadow-xs"
            }`}
            aria-label="Copy Registration ID"
          >
            {copied ? (
              <>
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy ID</span>
              </>
            )}
          </button>
        </div>

        {/* Pass Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Primary Employee</span>
            <span className="font-semibold text-slate-800 text-sm">
              {formData.employee.name}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Total Attendees</span>
            <span className="font-semibold text-slate-800 text-sm flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              {totalAttendees} {totalAttendees === 1 ? "Person" : "Persons"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Registered At</span>
            <span className="font-medium text-slate-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {submittedAt}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Accompanying Guests</span>
            <span className="font-medium text-slate-700">
              {formData.guestCount} {formData.guestCount === 1 ? "guest" : "guests"}
            </span>
          </div>
        </div>

        {/* Security badge notice */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
          <span>📸 Take a screenshot or present this ID at the welcome reception desk.</span>
        </div>
      </motion.div>

      {/* Action CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        className="w-full flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        <button
          type="button"
          onClick={() => window.print()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all cursor-pointer shadow-md shadow-slate-900/10 active:scale-[0.99]"
        >
          <span>Save / Print Pass</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-all cursor-pointer active:scale-[0.99]"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>Register Another</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
