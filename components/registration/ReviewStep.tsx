"use client";

import React from "react";
import { motion } from "framer-motion";
import { Edit2, Sparkles, Loader2, ArrowLeft, User, Phone, Mail, ShieldAlert } from "lucide-react";
import { RegistrationFormData } from "@/types/registration";

interface ReviewStepProps {
  formData: RegistrationFormData;
  isSubmitting: boolean;
  onEditEmployee: () => void;
  onEditGuestCount: () => void;
  onEditGuest: (index: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  errorMessage?: string | null;
  requiresSheetHeaders?: boolean;
}

export function ReviewStep({
  formData,
  isSubmitting,
  onEditEmployee,
  onEditGuestCount,
  onEditGuest,
  onSubmit,
  onBack,
  errorMessage,
  requiresSheetHeaders,
}: ReviewStepProps) {
  const { employee, guestCount, guests } = formData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xl mx-auto px-4 py-4 sm:py-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 mb-2">
          Almost there.
        </h2>
        <p className="text-sm sm:text-base text-slate-500">
          Review your details carefully. Your unique entry pass will be generated upon confirmation.
        </p>
      </div>

      {/* Error alert banner if submission failed */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-start gap-3"
        >
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="font-semibold text-amber-950">Registration Notice</p>
            <p className="text-amber-800 leading-relaxed">{errorMessage}</p>
            {requiresSheetHeaders && (
              <div className="mt-2 pt-2 border-t border-amber-200/60 text-xs text-amber-900/90 font-mono bg-white/70 p-2 rounded-lg break-all">
                Row 1 columns needed in Google Sheet: registration_id, submitted_at, status, employee_name, employee_email, employee_phone, number_of_guests, guests_summary, guest_1_name...
              </div>
            )}
          </div>
        </motion.div>
      )}

      <div className="space-y-4 mb-8">
        {/* Employee Summary Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm shadow-slate-900/5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                E
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Primary Employee
              </span>
            </div>
            <button
              type="button"
              onClick={onEditEmployee}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-800 hover:underline py-1 px-2 rounded-md hover:bg-amber-50 transition-colors cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-base font-semibold text-slate-900">
              {employee.name}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>+91 {employee.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Guests Summary Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm shadow-slate-900/5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-800 flex items-center justify-center text-xs font-bold">
                {guestCount}
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Accompanying Guests ({guestCount})
              </span>
            </div>
            <button
              type="button"
              onClick={onEditGuestCount}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-800 hover:underline py-1 px-2 rounded-md hover:bg-amber-50 transition-colors cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Change Count</span>
            </button>
          </div>

          {guestCount === 0 ? (
            <div className="text-xs text-slate-500 italic py-2">
              Attending solo. No additional guest passes requested.
            </div>
          ) : (
            <div className="space-y-3 divide-y divide-slate-100">
              {guests.slice(0, guestCount).map((guest, idx) => (
                <div key={idx} className={idx > 0 ? "pt-3" : ""}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900">
                          {guest.name}
                        </span>
                        <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200/60">
                          {guest.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          +91 {guest.phone}
                        </span>
                        {guest.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {guest.email}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onEditGuest(idx)}
                      disabled={isSubmitting}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title={`Edit Guest ${idx + 1}`}
                      aria-label={`Edit Guest ${idx + 1}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full sm:w-auto order-2 sm:order-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-all cursor-pointer shadow-xs active:scale-[0.99] disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Details</span>
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full sm:flex-1 order-1 sm:order-2 group inline-flex items-center justify-center gap-2.5 py-3.5 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-medium text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-slate-900/15 disabled:bg-slate-700 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Registering your details...</span>
            </>
          ) : (
            <>
              <span>Confirm Registration</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
