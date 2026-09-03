"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import AdBanner from "@/components/AdBanner";

function InstagramIcon({ className = "w-4 h-4 text-pink-400" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
      const saved = localStorage.getItem("bolo_current_user");
      if (saved) {
        setActiveUser(saved);
        setUsername(saved);
      }
    }
  }, []);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (!cleanUsername || cleanUsername.length < 3) {
      setError("Username must be at least 3 characters (letters, numbers, underscores).");
      return;
    }

    setLoading(true);

    try {
      // Check if profile exists
      const { data: existing, error: fetchErr } = await supabase
        .from("bolo_profiles")
        .select("username, secret_passcode")
        .eq("username", cleanUsername)
        .maybeSingle();

      if (fetchErr) throw fetchErr;

      if (existing) {
        // If passcode was set on creation, verify it
        if (existing.secret_passcode && passcode && existing.secret_passcode !== passcode) {
          setError("Incorrect passcode for this username. Please check your 4-digit PIN.");
          setLoading(false);
          return;
        }
      } else {
        // Create new profile
        const { error: insertErr } = await supabase.from("bolo_profiles").insert({
          username: cleanUsername,
          display_name: cleanUsername,
          secret_passcode: passcode.trim() || null,
        });

        if (insertErr) throw insertErr;
      }

      // Save to localStorage
      localStorage.setItem("bolo_current_user", cleanUsername);
      if (passcode.trim()) {
        localStorage.setItem(`bolo_pin_${cleanUsername}`, passcode.trim());
      }

      setActiveUser(cleanUsername);
    } catch (err: unknown) {
      console.error(err);
      setError("Could not connect to database. Check your network or configuration.");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (!activeUser) return;
    const url = `${origin}/${activeUser}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = `${origin}/${activeUser || username || "yourname"}`;

  return (
    <div className="flex-1 flex flex-col items-center justify-start px-4 py-8 sm:py-12 max-w-xl mx-auto w-full">
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-amber-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold mb-6 animate-pulse">
        <Sparkles className="w-3.5 h-3.5 text-pink-400" />
        <span>Tell me anything • বলো • बोलो</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-5xl font-black text-center tracking-tight text-white mb-3">
        Get Honest Messages on{" "}
        <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">
          Instagram Stories
        </span>
      </h1>
      <p className="text-zinc-400 text-sm sm:text-base text-center max-w-md mb-8">
        Create your personalized Bolo link, paste it in your Instagram Story sticker, and receive 100% anonymous questions & compliments!
      </p>

      {/* Active User Card vs Create Card */}
      {activeUser ? (
        <div className="w-full bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-pink-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden mb-6">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-pink-500/30">
                {activeUser[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-1.5">
                  @{activeUser}
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </h2>
                <p className="text-xs text-zinc-400">Your Bolo link is active & ready</p>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("bolo_current_user");
                setActiveUser(null);
              }}
              className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Switch
            </button>
          </div>

          {/* Link Box */}
          <div className="p-3 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between gap-2 mb-4">
            <span className="text-xs sm:text-sm font-mono text-zinc-300 truncate">
              {shareLink}
            </span>
            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 active:scale-95 text-xs font-semibold text-white transition-all shadow-md shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/inbox"
              className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold text-sm shadow-lg shadow-pink-500/20 active:scale-95 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>View Inbox</span>
            </Link>

            <Link
              href={`/${activeUser}`}
              target="_blank"
              className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-sm border border-white/10 active:scale-95 transition-all"
            >
              <span>Test Page</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        /* Sign up / Claim form */
        <form
          onSubmit={handleClaim}
          className="w-full bg-zinc-900/80 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl mb-6 relative"
        >
          <div className="mb-4">
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              Choose your username
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-zinc-500 font-mono text-sm font-semibold">
                bolo.link/
              </span>
              <input
                type="text"
                placeholder="yourname"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                required
                className="w-full pl-24 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-mono text-sm transition-all"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-semibold text-zinc-400 mb-2 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-zinc-500" />
              Optional 4-Digit Passcode (to secure your inbox)
            </label>
            <input
              type="password"
              maxLength={6}
              placeholder="e.g. 1234"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500 font-mono text-sm tracking-widest"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-4">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-95 text-white font-bold text-sm tracking-wide shadow-xl shadow-pink-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <>
                <span>Get My Bolo Link</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* 3 Step Instagram Guide */}
      <div className="w-full bg-zinc-950/60 border border-white/5 rounded-3xl p-5 mb-4">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <InstagramIcon className="w-4 h-4 text-pink-400" />
          How to use on Instagram Story
        </h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center">
            <div className="w-7 h-7 rounded-xl bg-pink-500/20 text-pink-400 font-bold text-xs flex items-center justify-center mb-1.5">
              1
            </div>
            <p className="text-[11px] font-semibold text-zinc-200">Copy Link</p>
            <p className="text-[10px] text-zinc-400 leading-tight mt-0.5">Grab your personal Bolo link</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center">
            <div className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center justify-center mb-1.5">
              2
            </div>
            <p className="text-[11px] font-semibold text-zinc-200">Add Sticker</p>
            <p className="text-[10px] text-zinc-400 leading-tight mt-0.5">Paste under Instagram 'Link' sticker</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 flex flex-col items-center">
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center mb-1.5">
              3
            </div>
            <p className="text-[11px] font-semibold text-zinc-200">Read & Reply</p>
            <p className="text-[10px] text-zinc-400 leading-tight mt-0.5">Share anonymous replies to Story</p>
          </div>
        </div>
      </div>

      {/* Clean Unobtrusive Ad Banner */}
      <AdBanner slotId="bolo-home-bottom" />
    </div>
  );
}
