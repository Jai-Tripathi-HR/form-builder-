"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, User, Phone, Mail, CheckCircle2, AlertCircle, Heart, Users2, Briefcase, Sparkles } from "lucide-react";
import { GuestData, GuestType } from "@/types/registration";
import { singleGuestSchema, sanitizeIndianPhone } from "@/lib/validation";

interface GuestFormProps {
  guestIndex: number;
  totalGuests: number;
  initialData?: Partial<GuestData>;
  onSubmit: (data: GuestData) => void;
}

const GUEST_TYPES: { type: GuestType; label: string; icon: React.ElementType; description: string }[] = [
  { type: "Family", label: "Family", icon: Heart, description: "Spouse, parent, child, or relative" },
  { type: "Friend", label: "Friend", icon: Sparkles, description: "Personal friend or companion" },
  { type: "Colleague", label: "Colleague", icon: Briefcase, description: "Fellow teammate or coworker" },
  { type: "Other", label: "Other", icon: Users2, description: "Other accompanying guest" },
];

export function GuestForm({
  guestIndex,
  totalGuests,
  initialData,
  onSubmit,
}: GuestFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [type, setType] = useState<GuestType>(initialData?.type || "Family");
  const [touched, setTouched] = useState({ name: false, phone: false, email: false });

  const sanitizedPhone = sanitizeIndianPhone(phone);
  const validationResult = singleGuestSchema.safeParse({
    name,
    phone: sanitizedPhone,
    email: email.trim() || undefined,
    type,
  });

  const errors: { name?: string; phone?: string; email?: string } = {};
  if (!validationResult.success) {
    validationResult.error.issues.forEach((err) => {
      const field = err.path[0] as "name" | "phone" | "email";
      if (!errors[field]) {
        errors[field] = err.message;
      }
    });
  }

  const isFormValid = validationResult.success;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true });
    if (validationResult.success) {
      onSubmit({
        name: validationResult.data.name,
        phone: validationResult.data.phone,
        email: validationResult.data.email,
        type: validationResult.data.type,
      });
    }
  };

  const isLastGuest = guestIndex === totalGuests - 1;

  return (
    <motion.div
      key={`guest-${guestIndex}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xl mx-auto px-4 py-4 sm:py-6"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-2">
          Guest {guestIndex + 1} of {totalGuests}
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 mb-2">
          Who&apos;s joining you?
        </h2>
        <p className="text-sm sm:text-base text-slate-500">
          Provide identification details for your companion&apos;s event badge.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Relationship Type Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-700 tracking-tight">
            Relationship to Employee <span className="text-amber-600">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup">
            {GUEST_TYPES.map((item) => {
              const isSelected = type === item.type;
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setType(item.type)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-amber-500/10 border-amber-500 text-amber-900 ring-1 ring-amber-500 font-semibold"
                      : "bg-white/80 border-slate-200/80 text-slate-600 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1 ${isSelected ? "text-amber-600" : "text-slate-400"}`} />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Guest Full Name */}
        <div className="space-y-1.5">
          <label
            htmlFor={`guest-${guestIndex}-name`}
            className="block text-xs font-medium text-slate-700 tracking-tight"
          >
            Guest Full Name <span className="text-amber-600">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id={`guest-${guestIndex}-name`}
              type="text"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
              placeholder="e.g. Rahul Sharma"
              className={`w-full pl-10 pr-10 py-3 rounded-xl bg-white/90 border text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none transition-all shadow-sm ${
                touched.name && errors.name
                  ? "border-amber-400 bg-amber-50/20 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  : touched.name && name.trim().length >= 2
                  ? "border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  : "border-slate-200/90 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              }`}
            />
            {touched.name && !errors.name && name.trim().length >= 2 && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>
          {touched.name && errors.name && (
            <p className="text-xs text-amber-700 flex items-center gap-1.5 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* Guest Mobile Number */}
        <div className="space-y-1.5">
          <label
            htmlFor={`guest-${guestIndex}-phone`}
            className="block text-xs font-medium text-slate-700 tracking-tight"
          >
            Guest Mobile Number <span className="text-amber-600">*</span>
          </label>
          <div className="relative flex">
            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200/90 bg-slate-50 text-slate-500 text-xs font-medium select-none">
              🇮🇳 +91
            </span>
            <div className="relative flex-1">
              <input
                id={`guest-${guestIndex}-phone`}
                type="tel"
                autoComplete="off"
                inputMode="numeric"
                maxLength={15}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                placeholder="9876543211"
                className={`w-full pl-3 pr-10 py-3 rounded-r-xl bg-white/90 border text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none transition-all shadow-sm ${
                  touched.phone && errors.phone
                    ? "border-amber-400 bg-amber-50/20 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    : touched.phone && !errors.phone
                    ? "border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    : "border-slate-200/90 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                }`}
              />
              {touched.phone && !errors.phone && (
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
          {touched.phone && errors.phone ? (
            <p className="text-xs text-amber-700 flex items-center gap-1.5 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.phone}</span>
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 mt-1">
              For event entry coordination & SMS pass updates
            </p>
          )}
        </div>

        {/* Guest Email (Optional) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor={`guest-${guestIndex}-email`}
              className="block text-xs font-medium text-slate-700 tracking-tight"
            >
              Guest Email Address
            </label>
            <span className="text-[11px] text-slate-400">Optional</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id={`guest-${guestIndex}-email`}
              type="email"
              autoComplete="off"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              placeholder="rahul@example.com (optional)"
              className={`w-full pl-10 pr-10 py-3 rounded-xl bg-white/90 border text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none transition-all shadow-sm ${
                touched.email && errors.email
                  ? "border-amber-400 bg-amber-50/20 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  : touched.email && email && !errors.email
                  ? "border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  : "border-slate-200/90 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              }`}
            />
          </div>
          {touched.email && errors.email && (
            <p className="text-xs text-amber-700 flex items-center gap-1.5 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full group inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer shadow-md ${
              isFormValid
                ? "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10 active:scale-[0.99]"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <span>{isLastGuest ? "Review All Details" : `Continue to Guest ${guestIndex + 2}`}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
