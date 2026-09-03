"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import {
  Inbox as InboxIcon,
  MessageSquare,
  Sparkles,
  Trash2,
  Share2,
  Download,
  X,
  RefreshCw,
  Copy,
  Check,
  Lock,
  ArrowRight,
} from "lucide-react";
import { supabase, BoloMessage } from "@/lib/supabase";
import AdBanner from "@/components/AdBanner";

export default function InboxPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [inputUsername, setInputUsername] = useState("");
  const [messages, setMessages] = useState<BoloMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<BoloMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const storyCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("bolo_current_user");
    if (saved) {
      setUsername(saved);
      fetchMessages(saved);
    } else {
      setLoading(false);
    }
  }, []);

  // Listen to realtime incoming messages via Supabase Realtime
  useEffect(() => {
    if (!username) return;

    const channel = supabase
      .channel("bolo-realtime-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bolo_messages",
          filter: `recipient_username=eq.${username}`,
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
  }, [username]);

  const fetchMessages = async (user: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bolo_messages")
        .select("*")
        .eq("recipient_username", user)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputUsername.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (!clean) return;
    localStorage.setItem("bolo_current_user", clean);
    setUsername(clean);
    fetchMessages(clean);
  };

  const markAsRead = async (msg: BoloMessage) => {
    setSelectedMessage(msg);
    setReplyText("");
    if (!msg.is_read) {
      // Optimistic update
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
    await supabase.from("bolo_messages").delete().eq("id", id);
  };

  const downloadStoryImage = async () => {
    if (!storyCardRef.current) return;
    setGeneratingImage(true);

    try {
      const dataUrl = await toPng(storyCardRef.current, {
        cacheBust: true,
        pixelRatio: 2, // High resolution for mobile screens
      });

      const link = document.createElement("a");
      link.download = `bolo-story-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate story image:", err);
    } finally {
      setGeneratingImage(false);
    }
  };

  const shareNative = async () => {
    if (!storyCardRef.current) return;
    setGeneratingImage(true);

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
          title: "My Bolo Anonymous Reply",
          text: `Reply on Bolo: bolo.link/${username}`,
        });
      } else {
        // Fallback to download
        downloadStoryImage();
      }
    } catch (err) {
      console.error(err);
      downloadStoryImage();
    } finally {
      setGeneratingImage(false);
    }
  };

  const copyProfileLink = () => {
    if (!username) return;
    const url = `${window.location.origin}/${username}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!username) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-sm mx-auto w-full">
        <div className="w-16 h-16 rounded-3xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-5 border border-pink-500/30 shadow-lg">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2 text-center">Open Your Inbox</h1>
        <p className="text-xs text-zinc-400 text-center mb-6">
          Enter your username to view your anonymous messages.
        </p>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
          <input
            type="text"
            placeholder="Your username"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            required
            className="w-full px-4 py-3.5 bg-zinc-900 border border-white/10 rounded-2xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-pink-500"
          />
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <span>Access Inbox</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="flex-1 flex flex-col px-4 py-6 max-w-xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            Inbox
            {unreadCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500 text-white font-bold animate-pulse">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-xs text-zinc-400">@{username}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchMessages(username)}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-pink-400" : ""}`} />
          </button>
          <button
            onClick={copyProfileLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30 text-xs font-semibold transition-all"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? "Copied" : "Share Link"}</span>
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 space-y-3">
        {loading ? (
          <div className="text-center py-16 text-zinc-500 text-sm flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-pink-500" />
            <span>Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-white/10 bg-zinc-950/40">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 text-zinc-500 flex items-center justify-center mx-auto mb-3">
              <InboxIcon className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No messages yet</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto mb-5">
              Put your Bolo link on your Instagram Story so your friends and followers can send you anonymous questions!
            </p>
            <button
              onClick={copyProfileLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-bold shadow-md shadow-pink-500/25 active:scale-95 transition-all"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Link for Instagram</span>
            </button>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => markAsRead(msg)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer group flex items-start justify-between gap-3 ${
                msg.is_read
                  ? "bg-zinc-900/50 border-white/5 hover:border-white/15"
                  : "bg-gradient-to-r from-pink-950/40 to-zinc-900/80 border-pink-500/40 hover:border-pink-500 shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                    msg.is_read ? "bg-zinc-700" : "bg-pink-500 ring-4 ring-pink-500/20"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-100 line-clamp-2 leading-relaxed">
                    "{msg.content}"
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1 font-mono">
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
                <span className="text-[11px] font-semibold text-pink-400 group-hover:underline hidden sm:inline mr-2">
                  Reply
                </span>
                <button
                  onClick={(e) => deleteMessage(msg.id, e)}
                  className="p-2 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Minimal clean Ad Banner at bottom of inbox */}
      <AdBanner slotId="bolo-inbox-bottom" className="mt-6" />

      {/* Story Reply Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-5 max-w-sm w-full shadow-2xl relative my-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-bold text-zinc-300 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-400" />
              Instagram Story Card
            </h3>

            {/* Renderable Instagram Story Card Preview */}
            <div
              ref={storyCardRef}
              className="w-full aspect-[9/14] rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden shadow-2xl bg-gradient-to-br from-indigo-950 via-purple-900 to-rose-950 border border-white/20"
            >
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />

              {/* Top Branding Pill */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15">
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                  <span className="text-[11px] font-bold text-white tracking-wide">
                    bolo.link/{username}
                  </span>
                </div>
                <span className="text-[10px] font-bold tracking-widest text-pink-300/80 uppercase">
                  বলো • बोलो
                </span>
              </div>

              {/* Center Question Card (NGL / Story Style) */}
              <div className="my-auto z-10 flex flex-col gap-3">
                <div className="bg-white rounded-2xl p-4 shadow-xl text-zinc-900">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-pink-600 mb-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send me anonymous messages</span>
                  </div>
                  <p className="text-base font-extrabold leading-snug">
                    "{selectedMessage.content}"
                  </p>
                </div>

                {/* Optional Reply Bubble */}
                {replyText.trim() && (
                  <div className="bg-black/70 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 text-white shadow-lg animate-in fade-in duration-150">
                    <p className="text-[10px] uppercase font-bold text-pink-300 tracking-wider mb-0.5">
                      My Reply:
                    </p>
                    <p className="text-sm font-semibold">{replyText}</p>
                  </div>
                )}
              </div>

              {/* Bottom Tagline */}
              <div className="text-center z-10">
                <p className="text-[10px] font-medium text-white/70">
                  Ask me anything anonymously on Bolo ✨
                </p>
              </div>
            </div>

            {/* Reply Input Box */}
            <div className="mt-3">
              <input
                type="text"
                placeholder="Type your reply here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                onClick={downloadStoryImage}
                disabled={generatingImage}
                className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{generatingImage ? "Saving..." : "Save Image"}</span>
              </button>

              <button
                onClick={shareNative}
                disabled={generatingImage}
                className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-pink-500/25 transition-all disabled:opacity-50"
              >
                <Share2 className="w-4 h-4" />
                <span>Share to Story</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
