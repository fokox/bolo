"use client";

import React from "react";

interface AdBannerProps {
  slotId?: string;
  className?: string;
  format?: "horizontal" | "compact";
}

/**
 * Clean, non-intrusive native banner ad slot.
 * Designed to fit seamlessly into the design without obnoxious popups or layout shifts.
 */
export default function AdBanner({
  slotId = "bolo-default-banner",
  className = "",
  format = "horizontal",
}: AdBannerProps) {
  return (
    <div
      className={`w-full mx-auto my-4 transition-all duration-200 ${className}`}
      data-ad-slot={slotId}
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-zinc-900/70 via-zinc-800/50 to-zinc-900/70 backdrop-blur-md p-3 px-4 shadow-sm text-center">
        {/* Subtle 'Ad' pill badge */}
        <div className="flex items-center justify-between text-[10px] uppercase font-semibold tracking-wider text-zinc-500 mb-1.5">
          <span>Sponsored</span>
          <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-[9px] text-zinc-400">Ad</span>
        </div>

        {/* Minimalist Native Ad Display Area */}
        {format === "horizontal" ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-1">
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
                ✨
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-200 line-clamp-1">
                  Connect & Express Freely with Bolo
                </p>
                <p className="text-[11px] text-zinc-400 line-clamp-1">
                  Share questions with zero friction. Free forever.
                </p>
              </div>
            </div>
            <a
              href="/"
              className="w-full sm:w-auto text-center px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-zinc-100 transition-colors border border-white/10 shrink-0"
            >
              Get Started
            </a>
          </div>
        ) : (
          <div className="py-2">
            <p className="text-xs font-medium text-zinc-300">
              Discover honest thoughts with friends on Bolo 🚀
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
