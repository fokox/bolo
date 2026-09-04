"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import {
  Inbox as InboxIcon,
  Trash2,
  Share2,
  Download,
  X,
  RefreshCw,
  Copy,
  Check,
  Lock,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { supabase, BoloMessage } from "@/lib/supabase";
import AdBanner from "@/components/AdBanner";

export default function InboxPage() {
  const [user, setUser] = useState<string | null>(null);
  const [linkId, setLinkId] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [messages, setMessages] = useState<BoloMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<BoloMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [savingImage, setSavingImage] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const storyCardRef = useRef<HTMLDivElement>(null);

  // Check existing session
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.username) {
          setUser(data.username);
          setLinkId(data.linkId || data.username);
          fetchMessages();
          return;
        }
      }
    } catch {
      // not logged in
    }
  };

  // Realtime updates when user is authenticated
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("bolo-inbox-realtime-secure")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bolo_messages",
          filter: `recipient_username=eq.${user}`,
        },
        (payload) => {
          const newMsg = payload.new as BoloMessage;
          setMessages((prev) => [newMsg, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      } else if (res.status === 401) {
        setUser(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formUsername.trim().toLowerCase(),
          password: formPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error || "Authentication failed.");
        setAuthLoading(false);
        return;
      }

      setUser(data.username);
      setLinkId(data.linkId || data.username);
      localStorage.setItem("bolo_current_user", data.username);
      fetchMessages();
    } catch {
      setAuthError("Network error. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setMessages([]);
    localStorage.removeItem("bolo_current_user");
  };

  const openMessage = async (msg: BoloMessage) => {
    setSelectedMessage(msg);
    setReplyText("");
    if (!msg.is_read) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
      );
      await supabase
        .from("bolo_messages")
        .update({ is_read: true })
        .eq("id", msg.id);
    }
  };

  const deleteMessage = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selectedMessage?.id === id) setSelectedMessage(null);
    await fetch(`/api/messages?id=${id}`, { method: "DELETE" });
  };

  const downloadStoryImage = async () => {
    if (!storyCardRef.current) return;
    setSavingImage(true);
    try {
      const dataUrl = await toPng(storyCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `bolo-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingImage(false);
    }
  };

  const shareNative = async () => {
    if (!storyCardRef.current) return;
    setSavingImage(true);
    try {
      const dataUrl = await toPng(storyCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "bolo-story.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Bolo Anonymous Reply",
        });
      } else {
        downloadStoryImage();
      }
    } catch {
      downloadStoryImage();
    } finally {
      setSavingImage(false);
    }
  };

  const copyLink = () => {
    if (!user) return;
    const url = `${window.location.origin}/${linkId || user}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Auth Screen (Login / Register)
  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 max-w-sm mx-auto w-full">
        <div className="w-full bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-5">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-2.5">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-white">
              {isRegistering ? "Create your account" : "Log in to your inbox"}
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isRegistering
                ? "Protect your inbox with a secure password"
                : "Enter your username and password"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Username
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-zinc-500 font-semibold text-sm">
                  @
                </span>
                <input
                  type="text"
                  placeholder="your_handle"
                  value={formUsername}
                  onChange={(e) =>
                    setFormUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ""))
                  }
                  required
                  className="w-full pl-8 pr-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 bg-rose-500/10 rounded-xl p-2.5 text-center">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={authLoading || !formUsername.trim() || !formPassword}
              className="w-full mt-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-pink-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              {authLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{isRegistering ? "Sign Up & Get Link" : "Log In to Inbox"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-4 pt-4 border-t border-white/5 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setAuthError(null);
              }}
              className="text-xs text-zinc-400 hover:text-pink-400 transition-colors"
            >
              {isRegistering
                ? "Already have an account? Log In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>

        <AdBanner slotId="bolo-auth-bottom" className="mt-6" />
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-sm mx-auto w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            Inbox
            {unreadCount > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-pink-500 text-white font-bold">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-xs text-zinc-400">@{user}</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={fetchMessages}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            title="Refresh"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loadingMessages ? "animate-spin text-pink-400" : ""}`}
            />
          </button>
          <button
            onClick={copyLink}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pink-500/20 text-pink-300 text-xs font-semibold hover:bg-pink-500/30 transition-all"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? "Copied" : "Copy Link"}</span>
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-500 hover:text-rose-400 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 space-y-2.5">
        {loadingMessages ? (
          <div className="text-center py-16 text-zinc-500 text-xs flex flex-col items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-pink-500" />
            <span>Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-14 px-4 rounded-3xl border border-white/5 bg-zinc-950/60">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-zinc-500 flex items-center justify-center mx-auto mb-2.5">
              <InboxIcon className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-white mb-1">No messages yet</p>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto mb-4">
              Share your Bolo link on your Instagram Story to receive anonymous questions.
            </p>
            <button
              onClick={copyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-pink-500 text-white text-xs font-bold active:scale-95 transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedLink ? "Copied to Clipboard!" : "Copy Link"}</span>
            </button>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => openMessage(msg)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                msg.is_read
                  ? "bg-zinc-900/40 border-white/5 hover:border-white/10"
                  : "bg-zinc-900 border-pink-500/30 hover:border-pink-500 shadow-sm"
              }`}
            >
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <span
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    msg.is_read ? "bg-transparent" : "bg-pink-500"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-zinc-100 line-clamp-2">
                    {msg.content}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    {new Date(msg.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[11px] font-semibold text-pink-400 mr-1">
                  Reply
                </span>
                <button
                  onClick={(e) => deleteMessage(msg.id, e)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AdBanner slotId="bolo-inbox-bottom" className="mt-4" />

      {/* Story Reply Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-4 max-w-xs w-full shadow-2xl relative my-auto">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 text-zinc-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xs font-bold text-zinc-400 mb-2.5">
              Instagram Story Card
            </h3>

            {/* Renderable Story Sticker */}
            <div
              ref={storyCardRef}
              className="w-full aspect-[9/13] rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden shadow-2xl bg-gradient-to-br from-purple-900 via-pink-900 to-rose-950 border border-white/20"
            >
              {/* Header */}
              <div className="flex items-center justify-between z-10">
                <span className="px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-bold text-white tracking-wide border border-white/10">
                  bolo.link
                </span>
                <span className="text-[10px] font-black text-pink-300 tracking-wider">
                  বলো • बोलो
                </span>
              </div>

              {/* Message Box */}
              <div className="my-auto z-10 flex flex-col gap-2.5">
                <div className="bg-white rounded-2xl p-4 shadow-xl text-zinc-900">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-pink-600 mb-1">
                    Send me anonymous messages
                  </p>
                  <p className="text-sm font-extrabold leading-tight">
                    "{selectedMessage.content}"
                  </p>
                </div>

                {replyText.trim() && (
                  <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-white shadow-lg">
                    <p className="text-xs font-semibold">{replyText}</p>
                  </div>
                )}
              </div>

              <div className="text-center z-10">
                <p className="text-[9px] text-white/60">
                  Ask me anything anonymously on Bolo ✨
                </p>
              </div>
            </div>

            {/* Type Answer */}
            <input
              type="text"
              placeholder="Type your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full mt-2.5 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-pink-500"
            />

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-2.5">
              <button
                onClick={downloadStoryImage}
                disabled={savingImage}
                className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{savingImage ? "Saving..." : "Save Image"}</span>
              </button>

              <button
                onClick={shareNative}
                disabled={savingImage}
                className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-bold shadow-md shadow-pink-500/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Story</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
