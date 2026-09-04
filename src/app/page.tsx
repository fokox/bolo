"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Copy, Check, ArrowRight, Sparkles, Inbox, RefreshCw, LogOut, Lock } from "lucide-react";
import AdBanner from "@/components/AdBanner";

export default function HomePage() {
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Form State
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);
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
    localStorage.removeItem("bolo_current_user");
  };

  const copyLink = () => {
    if (!activeUser) return;
    const url = `${origin}/${activeUser}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = `${origin}/${activeUser || "username"}`;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-sm mx-auto w-full">
      {checkingAuth ? (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          <RefreshCw className="w-5 h-5 animate-spin text-pink-500" />
        </div>
      ) : activeUser ? (
        /* Authenticated View: Active Link Card */
        <div className="w-full flex flex-col items-center text-center animate-in fade-in duration-200">
          {/* Avatar / Handle */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 p-0.5 mb-3 shadow-lg shadow-pink-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center text-xl font-bold text-white">
              {activeUser[0].toUpperCase()}
            </div>
          </div>
          <h1 className="text-xl font-black text-white">@{activeUser}</h1>
          <p className="text-xs text-zinc-400 mt-0.5 mb-6">Your link is live & authenticated</p>

          {/* Copy Link Box */}
          <div className="w-full p-3 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-mono text-zinc-300 truncate pl-1">
              {shareUrl}
            </span>
            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold transition-all active:scale-95 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={copyLink}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-pink-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 mb-2.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Link Copied to Clipboard!" : "Copy Link for Instagram"}</span>
          </button>

          <Link
            href="/inbox"
            className="w-full py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold text-sm border border-white/10 active:scale-95 transition-all flex items-center justify-center gap-2 mb-4"
          >
            <Inbox className="w-4 h-4 text-pink-400" />
            <span>Open Private Inbox</span>
          </Link>

          {/* Quick Guide */}
          <div className="w-full p-4 rounded-2xl bg-zinc-950/60 border border-white/5 text-left text-xs space-y-2 mb-4">
            <p className="font-semibold text-zinc-300 text-[11px] uppercase tracking-wider">
              How to post on Instagram:
            </p>
            <div className="flex items-start gap-2.5 text-zinc-400">
              <span className="w-5 h-5 rounded-full bg-white/5 text-zinc-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                1
              </span>
              <span>Open Instagram Story & tap the <b>Stickers</b> icon.</span>
            </div>
            <div className="flex items-start gap-2.5 text-zinc-400">
              <span className="w-5 h-5 rounded-full bg-white/5 text-zinc-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <span>Select the <b>Link</b> sticker & paste your copied link.</span>
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
              ? "Enter your username and password to access your link & inbox."
              : "Create a username and password to protect your anonymous inbox."}
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            {/* Username Input */}
            <div className="relative flex items-center">
              <span className="absolute left-4 text-zinc-500 font-semibold text-sm">
                @
              </span>
              <input
                type="text"
                placeholder="your_instagram_handle"
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
    </div>
  );
}
