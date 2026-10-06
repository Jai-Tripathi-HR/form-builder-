"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Calendar, MapPin, Users, ShieldCheck } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center text-center"
    >
      {/* Eyebrow Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/70 text-amber-900 text-xs font-semibold tracking-wide uppercase shadow-sm mb-6"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
        <span>GARBA 2026</span>
        <span className="w-1 h-1 rounded-full bg-amber-400" />
        <span className="text-amber-700/80 normal-case font-medium">Annual Corporate Celebration</span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 leading-[1.15] max-w-lg mb-4"
      >
        Let&apos;s celebrate <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
          together.
        </span>
      </motion.h1>

      {/* Supporting Text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
        className="text-base sm:text-lg text-slate-600 max-w-md leading-relaxed mb-8"
      >
        Register yourself and your guests in less than a minute. Secure your verified event entry pass today.
      </motion.p>

      {/* Event Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.35 }}
        className="w-full bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm shadow-slate-900/5 mb-8 text-left space-y-3.5"
      >
        <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
          <div className="w-8 h-8 rounded-lg bg-amber-100/60 flex items-center justify-center text-amber-800 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-900">Festive Evening Celebration</div>
            <div className="text-slate-500 text-xs">Traditional Raas, Live Orchestra & Gourmet Dinner</div>
          </div>
        </div>

        <div className="h-px bg-slate-100 w-full" />

        <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
          <div className="w-8 h-8 rounded-lg bg-orange-100/60 flex items-center justify-center text-orange-800 shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-900">Family & Friends Welcome</div>
            <div className="text-slate-500 text-xs">Bring up to 5 accompanied guests under your employee pass</div>
          </div>
        </div>

        <div className="h-px bg-slate-100 w-full" />

        <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
          <div className="w-8 h-8 rounded-lg bg-emerald-100/60 flex items-center justify-center text-emerald-800 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-900">Instant Digital Entry Pass</div>
            <div className="text-slate-500 text-xs">Unique GARBA pass ID generated immediately upon submission</div>
          </div>
        </div>
      </motion.div>

      {/* Primary CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.35 }}
        className="w-full flex flex-col items-center gap-3"
      >
        <button
          type="button"
          onClick={onStart}
          className="group relative w-full sm:w-auto sm:min-w-[260px] inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-medium text-base shadow-lg shadow-slate-900/15 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
        >
          <span>Register Now</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>

        <span className="text-xs text-slate-400 tracking-normal">
          Employee & Guest Registration • HR Corporate Initiative
        </span>
      </motion.div>
    </motion.div>
  );
}
