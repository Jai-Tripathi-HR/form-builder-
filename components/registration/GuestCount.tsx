"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Users, User, Check } from "lucide-react";

interface GuestCountProps {
  currentCount: number;
  onSelect: (count: number) => void;
}

const GUEST_OPTIONS = [
  {
    count: 0,
    title: "Just Me",
    description: "Attending solo as the primary employee",
    icon: User,
  },
  {
    count: 1,
    title: "1 Guest",
    description: "Bringing 1 companion (spouse, partner, or friend)",
    icon: Users,
  },
  {
    count: 2,
    title: "2 Guests",
    description: "Bringing 2 guests (family members or friends)",
    icon: Users,
  },
  {
    count: 3,
    title: "3 Guests",
    description: "Bringing 3 guests (family / group)",
    icon: Users,
  },
  {
    count: 4,
    title: "4 Guests",
    description: "Bringing 4 guests (family entourage)",
    icon: Users,
  },
  {
    count: 5,
    title: "5 Guests",
    description: "Bringing 5 guests (maximum permitted)",
    icon: Users,
  },
];

export function GuestCount({ currentCount, onSelect }: GuestCountProps) {
  const [selected, setSelected] = useState<number>(currentCount);

  const handleChoose = (count: number) => {
    setSelected(count);
  };

  const handleContinue = () => {
    onSelect(selected);
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
          How many guests are joining you?
        </h2>
        <p className="text-sm sm:text-base text-slate-500">
          Select how many accompanying guests will attend under your registration.
        </p>
      </div>

      {/* Selectable Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6" role="radiogroup" aria-label="Number of guests">
        {GUEST_OPTIONS.map((option) => {
          const isSelected = selected === option.count;
          const Icon = option.icon;

          return (
            <motion.button
              key={option.count}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleChoose(option.count)}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className={`relative flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer shadow-sm ${
                isSelected
                  ? "bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 border-amber-500 ring-2 ring-amber-500/20 shadow-amber-500/10"
                  : "bg-white/90 border-slate-200/80 hover:border-slate-300 hover:bg-white"
              }`}
            >
              {/* Count badge / circle */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base transition-colors shrink-0 ${
                  isSelected
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {option.count === 0 ? <Icon className="w-4 h-4" /> : option.count}
              </div>

              {/* Text content */}
              <div className="flex-1 pr-6">
                <div className="flex items-center gap-1.5">
                  <span className={`font-semibold text-sm ${isSelected ? "text-slate-900" : "text-slate-800"}`}>
                    {option.title}
                  </span>
                  {option.count === 5 && (
                    <span className="text-[10px] font-medium bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                      Max
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-snug mt-0.5">
                  {option.description}
                </p>
              </div>

              {/* Selection Checkmark */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Continue CTA */}
      <div>
        <button
          type="button"
          onClick={handleContinue}
          className="w-full group inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-medium text-sm transition-all duration-200 cursor-pointer shadow-md shadow-slate-900/10"
        >
          <span>
            {selected === 0
              ? "Continue with Solo Registration"
              : `Continue with ${selected} ${selected === 1 ? "Guest" : "Guests"}`}
          </span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </motion.div>
  );
}
