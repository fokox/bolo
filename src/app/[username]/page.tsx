"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Send,
  Dice5,
  Sparkles,
  Shield,
  CheckCircle2,
  RefreshCw,
  PlusCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import AdBanner from "@/components/AdBanner";

const FUN_PROMPTS = [
  "What is your honest first impression of me?",
  "Tell me a secret you have never told anyone 🤫",
  "Rate my vibe from 1 to 10!",
  "What song reminds you of me?",
  "If we could go anywhere right now, where would it be?",
  "What's one thing you like most about me?",
  "Do you have a crush on me? Be honest 👀",
  "What advice do you think I really need to hear?",
];

export default function UserMessagePage() {
  const params = useParams();
  const rawUsername = params?.username as string | undefined;
  const username = rawUsername ? decodeURIComponent(rawUsername).toLowerCase() : "";

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * FUN_PROMPTS.length);
    setContent(FUN_PROMPTS[randomIndex]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !username) return;

    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from("bolo_messages").insert({
        recipient_username: username,
        content: content.trim(),
        is_read: false,
      });

      if (insertError) throw insertError;

      // Trigger celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ec4899", "#f43f5e", "#f59e0b", "#8b5cf6"],
      });

      setSent(true);
      setContent("");
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to send message. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-md mx-auto w-full">
      {/* Top Tagline */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold mb-5">
        <Shield className="w-3.5 h-3.5" />
        <span>100% Anonymous • Bolo</span>
      </div>

      {!sent ? (
        <div className="w-full bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative">
          {/* Recipient Profile Header */}
          <div className="flex items-center gap-3.5 mb-5 pb-5 border-b border-white/10">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-pink-500/25 shrink-0">
              {username ? username[0].toUpperCase() : "B"}
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">Send anonymous message to</p>
              <h1 className="text-xl font-black text-white flex items-center gap-1.5">
                @{username}
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Input Box */}
            <div className="relative mb-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, 300))}
                placeholder="Send me anything... honestly! (I won't know it's you 🤫)"
                rows={4}
                required
                className="w-full p-4 rounded-2xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all resize-none font-sans"
              />

              {/* Character count & dice prompt */}
              <div className="flex items-center justify-between mt-2 px-1 text-xs text-zinc-500">
                <button
                  type="button"
                  onClick={getRandomPrompt}
                  className="inline-flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300 font-medium transition-colors"
                >
                  <Dice5 className="w-4 h-4" />
                  <span>Random question idea</span>
                </button>
                <span className={content.length >= 280 ? "text-amber-400 font-bold" : ""}>
                  {content.length}/300
                </span>
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-3">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-pink-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Anonymously</span>
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-zinc-500 text-center mt-4">
            🔒 Your identity is completely hidden. No account required.
          </p>
        </div>
      ) : (
        /* Sent Success View */
        <div className="w-full bg-zinc-900/90 border border-emerald-500/30 rounded-3xl p-7 shadow-2xl backdrop-blur-xl text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h2 className="text-2xl font-black text-white mb-2">Message Sent! 🎉</h2>
          <p className="text-zinc-400 text-sm mb-6 max-w-xs">
            @{username} received your message. They will never know who sent it!
          </p>

          <div className="flex flex-col gap-2.5 w-full">
            <button
              onClick={() => setSent(false)}
              className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-colors"
            >
              Send Another Message
            </button>

            <Link
              href="/"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-sm shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Get Your Own Bolo Link</span>
            </Link>
          </div>
        </div>
      )}

      {/* Clean Unobtrusive Ad Banner */}
      <AdBanner slotId="bolo-sender-bottom" className="mt-4" />
    </div>
  );
}
