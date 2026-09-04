"use client";

import React from "react";

interface AdBannerProps {
  slotId?: string;
  className?: string;
}

/**
 * Ultra-minimal, non-intrusive native ad slot.
 * Clean single-line bar designed to avoid clutter or layout shifts.
 */
export default function AdBanner({
  slotId = "bolo-ad-slot",
  className = "",
}: AdBannerProps) {
  return (
    <div
      className={`w-full max-w-sm mx-auto my-3 ${className}`}
      data-ad-slot={slotId}
    >
      <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-zinc-900/60 border border-white/5 text-xs text-zinc-400 backdrop-blur-sm">
        <div className="flex items-center gap-2 truncate">
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-zinc-400">
            Ad
          </span>
          <span className="truncate text-zinc-300">
            Bolo • Free anonymous questions
          </span>
        </div>
        <a
          href="/"
          className="text-pink-400 hover:text-pink-300 font-medium shrink-0 ml-2 text-[11px]"
        >
          Try it →
        </a>
      </div>
    </div>
  );
}
