"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageCircle, Inbox } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [savedUser, setSavedUser] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const user = localStorage.getItem("bolo_current_user");
    if (user) {
      setSavedUser(user);
      // Fetch unread count
      supabase
        .from("bolo_messages")
        .select("id", { count: "exact", head: true })
        .eq("recipient_username", user)
        .eq("is_read", false)
        .then(({ count }) => {
          if (count !== null) setUnreadCount(count);
        });
    }
  }, []);

  return (
    <header className="w-full max-w-md mx-auto px-4 pt-4 pb-2 flex items-center justify-between">
      {/* Minimal Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center shadow-md shadow-pink-500/20">
          <MessageCircle className="w-4 h-4 text-white fill-white/20" />
        </div>
        <span className="text-lg font-black tracking-tight text-white group-hover:text-pink-300 transition-colors">
          bolo
        </span>
      </Link>

      {/* Action */}
      {savedUser && (
        <Link
          href="/inbox"
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 hover:border-pink-500/40 text-xs font-semibold text-zinc-300 transition-all"
        >
          <Inbox className="w-3.5 h-3.5 text-pink-400" />
          <span>Inbox</span>
          {unreadCount > 0 && (
            <span className="ml-1 w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Link>
      )}
    </header>
  );
}
