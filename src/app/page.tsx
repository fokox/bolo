"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Copy, Check, ArrowRight, Sparkles, Inbox, RefreshCw, LogOut, Lock } from "lucide-react";
import AdBanner from "@/components/AdBanner";

export default function HomePage() {
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const [activeLinkId, setActiveLinkId] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Form State
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedStickerText, setCopiedStickerText] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.username) {
          setActiveUser(data.username);
          setActiveLinkId(data.linkId || data.username);
        }
      }
    } catch {
      // not logged in
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_.]/g, "");
    if (!cleanUsername) {
      setError("Please enter a valid username.");
      setLoading(false);
      return;
    }

    if (!password || password.length < 4) {
      setError("Password must be at least 4 characters.");
      setLoading(false);
      return;
    }

    const endpoint = isLoginMode ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: cleanUsername,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed.");
        setLoading(false);
        return;
      }

      setActiveUser(data.username);
      setActiveLinkId(data.linkId || data.username);
      localStorage.setItem("bolo_current_user", data.username);
      setPassword("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setActiveUser(null);
    setActiveLinkId(null);
    localStorage.removeItem("bolo_current_user");
  };

  const shareUrl = `${origin}/${activeLinkId || activeUser || "link"}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyStickerText = () => {
    navigator.clipboard.writeText("bolo.link");
    setCopiedStickerText(true);
    setTimeout(() => setCopiedStickerText(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-sm mx-auto w-full">
      {checkingAuth ? (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          <RefreshCw className="w-5 h-5 animate-spin text-pink-500" />
        </div>
      ) : activeUser ? (
        /* Authenticated View: Random Link Identifier */
        <div className="w-full flex flex-col items-center text-center animate-in fade-in duration-200">
          {/* Avatar / Handle */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 p-0.5 mb-3 shadow-lg shadow-pink-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center text-xl font-bold text-white">
              {activeUser[0].toUpperCase()}
            </div>
          </div>
          <h1 className="text-xl font-black text-white">@{activeUser}</h1>
          <p className="text-xs text-zinc-400 mt-0.5 mb-5">
            Your private link identifier is active
          </p>

          {/* Random Identifier Link Box */}
          <div className="w-full p-3 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-between gap-2 mb-3">
            <div className="flex flex-col text-left truncate pl-1">
              <span className="text-[10px] uppercase font-bold text-pink-400 tracking-wider">
                Anonymous Link
              </span>
              <span className="text-xs font-mono text-zinc-200 truncate">
                {shareUrl}
              </span>
            </div>
            <button
              onClick={copyLink}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold transition-all active:scale-95 shrink-0"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "Copied" : "Copy"}</span>
            </button>
          </div>

          {/* Big Action Buttons */}
          <button
            onClick={copyLink}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-pink-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 mb-2 cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? "Link Copied!" : "1. Copy Link URL"}</span>
          </button>

          <Link
            href="/inbox"
            className="w-full py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold text-sm border border-white/10 active:scale-95 transition-all flex items-center justify-center gap-2 mb-4"
          >
            <Inbox className="w-4 h-4 text-pink-400" />
            <span>Open Private Inbox</span>
          </Link>

          {/* Instagram Sticker Pro-Tip */}
          <div className="w-full p-4 rounded-2xl bg-zinc-950/60 border border-white/5 text-left text-xs space-y-2.5 mb-4">
            <p className="font-semibold text-zinc-200 text-[11px] uppercase tracking-wider flex items-center justify-between">
              <span>How to make sticker say bolo.link:</span>
              <button
                onClick={copyStickerText}
                className="text-pink-400 hover:underline font-bold lowercase text-[11px]"
              >
                {copiedStickerText ? "✓ Copied" : "Copy 'bolo.link'"}
              </button>
            </p>
            <div className="flex items-start gap-2.5 text-zinc-400">
              <span className="w-5 h-5 rounded-full bg-white/5 text-zinc-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                1
              </span>
              <span>Tap the <b>Link sticker</b> on Instagram Story.</span>
            </div>
            <div className="flex items-start gap-2.5 text-zinc-400">
              <span className="w-5 h-5 rounded-full bg-white/5 text-zinc-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <span>Paste your copied link into <b>URL</b>.</span>
            </div>
            <div className="flex items-start gap-2.5 text-zinc-400">
              <span className="w-5 h-5 rounded-full bg-white/5 text-zinc-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                3
              </span>
              <span>Type <b>bolo.link</b> in <b>Customize sticker text</b>!</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-xs text-zinc-500 hover:text-rose-400 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log out</span>
          </button>
        </div>
      ) : (
        /* Unauthenticated View: Secure Register / Login Form */
        <div className="w-full flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3 h-3" />
            <span>Anonymous Instagram Q&A</span>
          </div>

          <h1 className="text-3xl font-black text-white tracking-tight mb-1">
            {isLoginMode ? "Log in to Bolo" : "Get your link"}
          </h1>
          <p className="text-xs text-zinc-400 mb-6 max-w-xs">
            {isLoginMode
              ? "Enter your credentials to access your link & inbox."
              : "Create an account. Your link gets a private random identifier!"}
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            {/* Username Input */}
            <div className="relative flex items-center">
              <span className="absolute left-4 text-zinc-500 font-semibold text-sm">
                @
              </span>
              <input
                type="text"
                placeholder="your_handle"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ""))
                }
                required
                autoFocus
                className="w-full pl-9 pr-4 py-3 bg-zinc-900 border border-white/10 rounded-2xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-medium"
              />
            </div>

            {/* Password Input */}
            <div className="relative flex items-center">
              <span className="absolute left-4 text-zinc-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="Password (min. 4 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-white/10 rounded-2xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
              />
            </div>

            {error && (
              <p className="text-xs text-rose-400 bg-rose-500/10 rounded-xl p-2.5 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !username.trim() || !password}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-pink-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{isLoginMode ? "Log In" : "Create Link & Password"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="mt-4 pt-3 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError(null);
              }}
              className="text-xs text-zinc-400 hover:text-pink-400 transition-colors cursor-pointer"
            >
              {isLoginMode
                ? "Don't have an account? Sign Up"
                : "Already have an account? Log In"}
            </button>
          </div>
        </div>
      )}

      {/* Minimal clean ad */}
      <AdBanner slotId="bolo-home" className="mt-6" />

      {/* High-Value Editorial FAQ Section for Users & AdSense Crawlers */}
      <div className="w-full mt-10 pt-8 border-t border-white/5 text-left">
        <h2 className="text-sm font-extrabold text-white tracking-wide uppercase mb-1">
          Frequently Asked Questions
        </h2>
        <p className="text-xs text-zinc-400 mb-6">
          Everything you need to know about Bolo anonymous messaging.
        </p>

        <div className="space-y-3.5 text-xs">
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5">
            <h3 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
              <span>✨</span> What is Bolo and how does it work?
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Bolo (meaning &quot;Say it&quot; in Bangla, Hindi, and regional languages) is a modern anonymous Q&amp;A platform.
              You create your personal link, add it as a sticker to your Instagram Story or WhatsApp Status,
              and receive 100% anonymous questions and confessions in your private inbox.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5">
            <h3 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
              <span>🔒</span> Are messages really 100% anonymous?
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Yes, completely! Senders do not need to log in or provide any personal details.
              We never track or share the sender&apos;s identity, phone number, or social media profile with the recipient.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5">
            <h3 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
              <span>📱</span> How do I make my Instagram sticker say bolo.link?
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              When creating an Instagram Story, select the <b>Link</b> sticker, paste your Bolo URL, and in the
              <b>&quot;Customize sticker text&quot;</b> field, type <b>bolo.link</b>. Your sticker will display as
              a clean, professional <span className="text-pink-400 font-mono">bolo.link</span> sticker!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5">
            <h3 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
              <span>🛡️</span> How does Bolo prevent bullying and harassment?
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Safety is our top priority. Recipients can delete any unwanted message with 1 tap.
              Our platform operates on a strict zero-tolerance policy against cyberbullying, hate speech,
              and doxxing. For more, read our <a href="/terms" className="text-pink-400 underline">Terms of Service</a>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5">
            <h3 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
              <span>⚡</span> Do my friends need to install an app to send messages?
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              No apps required! When followers tap your link in Instagram, it opens an ultra-fast web page
              in their browser that loads in milliseconds on any mobile device.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5">
            <h3 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
              <span>🎨</span> How do I share replies back to my Instagram Story?
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Inside your Bolo inbox, tap any message to open the Story Card generator.
              Type your answer, hit <b>Save Image</b>, and post the generated high-resolution card
              directly to your Story!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
