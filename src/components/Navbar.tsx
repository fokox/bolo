"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageSquare, Sparkles, Inbox, PlusCircle } from "lucide-react";

export default function Navbar() {
  const [savedUser, setSavedUser] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("bolo_current_user");
    if (user) setSavedUser(user);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-black/40 border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform duration-200">
            <MessageSquare className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white group-hover:text-pink-300 transition-colors">
                Bolo
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                বলো • बोलो
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 -mt-0.5 hidden sm:inline">
              Anonymous Instagram Q&A
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-2 sm:gap-3">
          {savedUser ? (
            <>
              <Link
                href="/inbox"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-sm font-semibold text-zinc-200 border border-white/10 transition-all hover:border-pink-500/40"
              >
                <Inbox className="w-4 h-4 text-pink-400" />
                <span className="hidden sm:inline">Inbox</span>
                <span className="text-xs bg-pink-500/20 text-pink-300 px-1.5 py-0.5 rounded-md font-mono">
                  @{savedUser}
                </span>
              </Link>
              <Link
                href={`/${savedUser}`}
                target="_blank"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Test Link
              </Link>
            </>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-sm font-semibold text-white shadow-md shadow-pink-500/20 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Get Your Link</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
