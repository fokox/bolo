"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Send, Dice5, CheckCircle2, RefreshCw, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AdBanner from "@/components/AdBanner";

const QUICK_PROMPTS = [
  "What is your honest first impression of me?",
  "Tell me a secret you have never told anyone 🤫",
  "Rate my vibe from 1 to 10!",
  "What song reminds you of me?",
  "Do you have a crush on me? Be honest 👀",
  "What is one thing you like most about me?",
];

export default function UserMessagePage() {
  const params = useParams();
  const raw = params?.username as string | undefined;
  const slug = raw ? decodeURIComponent(raw).toLowerCase() : "";

  const [recipientUsername, setRecipientUsername] = useState<string | null>(null);
  const [profileNotFound, setProfileNotFound] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    resolveRecipient();
  }, [slug]);

  const resolveRecipient = async () => {
    try {
      // Find profile by random link_identifier (display_name) or username
      const { data: profile } = await supabase
        .from("bolo_profiles")
        .select("username, display_name")
        .or(`display_name.eq.${slug},username.eq.${slug}`)
        .maybeSingle();

      if (profile && profile.username) {
        setRecipientUsername(profile.username);
      } else {
        setProfileNotFound(true);
      }
    } catch {
      setProfileNotFound(true);
    } finally {
      setCheckingProfile(false);
    }
  };

  const rollPrompt = () => {
    const random = QUICK_PROMPTS[Math.floor(Math.random() * QUICK_PROMPTS.length)];
    setContent(random);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !recipientUsername) return;

    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from("bolo_messages").insert({
        recipient_username: recipientUsername,
        content: content.trim(),
        is_read: false,
      });

      if (insertError) throw insertError;

      // Confetti burst
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.65 },
        colors: ["#ec4899", "#f43f5e", "#f59e0b"],
      });

      setSent(true);
      setContent("");
    } catch (err) {
      console.error(err);
      setError("Couldn't send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingProfile) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 text-zinc-500">
        <RefreshCw className="w-5 h-5 animate-spin text-pink-500" />
      </div>
    );
  }

  if (profileNotFound) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-sm mx-auto w-full text-center">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-zinc-500 flex items-center justify-center mb-3">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h1 className="text-lg font-bold text-white mb-1">Link not found</h1>
        <p className="text-xs text-zinc-400 mb-6">
          This Bolo link doesn't exist or may have been updated.
        </p>
        <Link
          href="/"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xs shadow-md shadow-pink-500/25"
        >
          Create Your Own Bolo Link
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-sm mx-auto w-full">
      {!sent ? (
        /* Floating Anonymous Sticker Card */
        <div className="w-full bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 rounded-3xl p-5 shadow-2xl backdrop-blur-xl relative">
          {/* Sticker Header: Displays bolo.link branding, NO private username exposed */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white text-base font-bold shadow-md shadow-pink-500/25 shrink-0">
                ✨
              </div>
              <div>
                <p className="text-sm font-extrabold text-white leading-tight">
                  send me anonymous messages
                </p>
                <p className="text-[11px] text-zinc-400">never know who sent it 🤫</p>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 text-pink-300 border border-white/5">
              bolo.link
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="relative mb-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, 300))}
                placeholder="Type your message here... 🤫"
                rows={4}
                required
                autoFocus
                className="w-full p-3.5 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all resize-none"
              />

              {/* Character counter + Dice */}
              <div className="flex items-center justify-between mt-1 px-1">
                <button
                  type="button"
                  onClick={rollPrompt}
                  className="inline-flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300 transition-colors cursor-pointer"
                >
                  <Dice5 className="w-3.5 h-3.5" />
                  <span>Random idea</span>
                </button>
                <span className="text-[11px] text-zinc-500">
                  {content.length}/300
                </span>
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-400 bg-rose-500/10 rounded-xl p-2.5 mb-3 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-pink-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
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

          <p className="text-[10px] text-zinc-500 text-center mt-3.5">
            🔒 100% anonymous • No account needed
          </p>
        </div>
      ) : (
        /* Sent Confirmation */
        <div className="w-full bg-zinc-900 border border-white/10 rounded-3xl p-6 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-150">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-black text-white mb-1">Sent! 🎉</h2>
          <p className="text-xs text-zinc-400 mb-6 max-w-xs">
            Your anonymous message was delivered! They will never know who sent it.
          </p>

          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={() => setSent(false)}
              className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Send Another Message
            </button>

            <Link
              href="/"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xs shadow-md shadow-pink-500/20 transition-all flex items-center justify-center"
            >
              Get Your Own Bolo Link
            </Link>
          </div>
        </div>
      )}

      {/* Minimal clean ad */}
      <AdBanner slotId="bolo-msg-bottom" className="mt-4" />
    </div>
  );
}
