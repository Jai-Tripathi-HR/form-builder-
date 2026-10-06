"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, User, Mail, Phone, CheckCircle2, AlertCircle } from "lucide-react";
import { EmployeeData } from "@/types/registration";
import { employeeSchema, sanitizeIndianPhone } from "@/lib/validation";

interface EmployeeFormProps {
  initialData: EmployeeData;
  onSubmit: (data: EmployeeData) => void;
}

export function EmployeeForm({ initialData, onSubmit }: EmployeeFormProps) {
  const [name, setName] = useState(initialData.name || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [touched, setTouched] = useState({ name: false, email: false, phone: false });

  // Sanitize and validate
  const sanitizedPhone = sanitizeIndianPhone(phone);
  const validationResult = employeeSchema.safeParse({
    name,
    email,
    phone: sanitizedPhone,
  });

  const errors: { name?: string; email?: string; phone?: string } = {};
  if (!validationResult.success) {
    validationResult.error.issues.forEach((err) => {
      const field = err.path[0] as "name" | "email" | "phone";
      if (!errors[field]) {
        errors[field] = err.message;
      }
    });
  }

  const isFormValid = validationResult.success;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true });
    if (validationResult.success) {
      onSubmit({
        name: validationResult.data.name,
        email: validationResult.data.email,
        phone: validationResult.data.phone,
      });
    }
  };

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
          First, tell us about you.
        </h2>
        <p className="text-sm sm:text-base text-slate-500">
          Enter your details to register as the primary employee pass holder.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Full Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="employee-name"
            className="block text-xs font-medium text-slate-700 tracking-tight"
          >
            Employee Full Name <span className="text-amber-600">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="employee-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
              placeholder="e.g. Gregory John"
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

        {/* Email Address */}
        <div className="space-y-1.5">
          <label
            htmlFor="employee-email"
            className="block text-xs font-medium text-slate-700 tracking-tight"
          >
            Work or Personal Email <span className="text-amber-600">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="employee-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              placeholder="gregory@company.com"
              className={`w-full pl-10 pr-10 py-3 rounded-xl bg-white/90 border text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none transition-all shadow-sm ${
                touched.email && errors.email
                  ? "border-amber-400 bg-amber-50/20 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  : touched.email && !errors.email
                  ? "border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  : "border-slate-200/90 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              }`}
            />
            {touched.email && !errors.email && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>
          {touched.email && errors.email && (
            <p className="text-xs text-amber-700 flex items-center gap-1.5 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Mobile Number */}
        <div className="space-y-1.5">
          <label
            htmlFor="employee-phone"
            className="block text-xs font-medium text-slate-700 tracking-tight"
          >
            Employee Mobile Number <span className="text-amber-600">*</span>
          </label>
          <div className="relative flex">
            {/* Country code prefix */}
            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200/90 bg-slate-50 text-slate-500 text-xs font-medium select-none">
              🇮🇳 +91
            </span>
            <div className="relative flex-1">
              <input
                id="employee-phone"
                type="tel"
                autoComplete="tel"
                inputMode="numeric"
                maxLength={15}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                placeholder="9876543210"
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
              Valid 10-digit Indian mobile number (e.g. 9876543210)
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
            <span>Continue to Guest Details</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
