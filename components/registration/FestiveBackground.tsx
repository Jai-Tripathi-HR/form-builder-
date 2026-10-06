"use client";

import React from "react";

export function FestiveBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#FAF9F6]"
    >
      {/* Subtle warm ambient lighting */}
      <div className="absolute -top-40 -right-40 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-gradient-to-br from-amber-200/35 via-orange-100/25 to-transparent rounded-full blur-3xl opacity-70" />
      <div className="absolute top-1/2 -left-48 w-80 h-80 sm:w-[450px] sm:h-[450px] bg-gradient-to-tr from-rose-200/25 via-pink-100/20 to-transparent rounded-full blur-3xl opacity-60" />
      <div className="absolute -bottom-40 right-1/4 w-80 h-80 sm:w-[450px] sm:h-[450px] bg-gradient-to-t from-amber-100/30 to-transparent rounded-full blur-3xl opacity-50" />

      {/* Elegant, restrained Garba geometric circular motif (mandala rhythm ring) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] sm:w-[900px] sm:h-[900px] opacity-[0.035]">
        <svg
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full animate-[spin_180s_linear_infinite]"
        >
          {/* Concentric rings */}
          <circle cx="400" cy="400" r="380" stroke="#B45309" strokeWidth="1" strokeDasharray="6 6" />
          <circle cx="400" cy="400" r="340" stroke="#0F172A" strokeWidth="1" />
          <circle cx="400" cy="400" r="290" stroke="#B45309" strokeWidth="1" strokeDasharray="12 12" />
          <circle cx="400" cy="400" r="230" stroke="#0F172A" strokeWidth="1" />
          <circle cx="400" cy="400" r="160" stroke="#B45309" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="400" cy="400" r="90" stroke="#0F172A" strokeWidth="1" />

          {/* Symmetrical ray spokes */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16;
            return (
              <g key={i} transform={`rotate(${angle} 400 400)`}>
                <line x1="400" y1="70" x2="400" y2="150" stroke="#B45309" strokeWidth="1" />
                <circle cx="400" cy="65" r="3" fill="#B45309" />
                <line x1="400" y1="240" x2="400" y2="280" stroke="#0F172A" strokeWidth="1" />
                <circle cx="400" cy="335" r="2.5" fill="#0F172A" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Micro noise / subtle grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0F172A 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
