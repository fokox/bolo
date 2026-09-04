import { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Sparkles, Shield, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "About Bolo - Honest Anonymous Communication",
  description: "Learn about the mission behind Bolo, the viral anonymous Q&A tool for Instagram Stories and social platforms.",
};

export default function AboutPage() {
  return (
    <div className="flex-1 max-w-2xl mx-auto px-4 py-10 text-zinc-300 leading-relaxed">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 font-semibold mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Bolo</span>
      </Link>

      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center shadow-md">
          <MessageCircle className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">About Bolo</h1>
      </div>
      <p className="text-xs text-pink-400 font-semibold mb-8">বলো • बोलो • Say what you really feel</p>

      <div className="space-y-6 text-xs sm:text-sm">
        <section>
          <h2 className="text-base font-bold text-white mb-2">What is Bolo?</h2>
          <p>
            <strong>Bolo</strong> (which translates directly to &quot;Say it&quot; in Bangla, Hindi, and several South Asian languages)
            is a modern, lightning-fast anonymous messaging tool. It allows creators, influencers, and friends to invite genuine questions,
            compliments, confessions, and honest thoughts across Instagram Stories, WhatsApp, and social media.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5">
            <Sparkles className="w-5 h-5 text-amber-400 mb-2" />
            <h3 className="font-bold text-white mb-1">Frictionless Sharing</h3>
            <p className="text-zinc-400 text-xs">
              No apps to install. Senders type their message directly on a lightweight webpage that loads in milliseconds.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5">
            <Shield className="w-5 h-5 text-emerald-400 mb-2" />
            <h3 className="font-bold text-white mb-1">Privacy by Design</h3>
            <p className="text-zinc-400 text-xs">
              Account handles are decoupled from links with random identifiers, and inboxes are protected with cryptographic JWT security.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">Our Mission</h2>
          <p>
            In a digital world often dominated by curated feeds and social anxiety, we believe there is immense value in giving friends
            and followers a safe, friendly space to share sincere compliments, ask burning questions, and spark genuine conversations.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">Community &amp; Safety</h2>
          <p>
            We take safety seriously. Bolo is designed exclusively for positive interactions. We provide easy 1-tap message deletion,
            content filters, and user reporting mechanisms to ensure the platform remains fun and safe for everyone.
          </p>
        </section>
      </div>
    </div>
  );
}
