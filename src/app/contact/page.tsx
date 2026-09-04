import { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare, AlertCircle, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us - Bolo",
  description: "Get in touch with the Bolo team for support, business inquiries, or to report abuse.",
};

export default function ContactPage() {
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
        <Mail className="w-6 h-6 text-pink-400" />
        <h1 className="text-2xl sm:text-3xl font-black text-white">Contact Us</h1>
      </div>
      <p className="text-xs text-zinc-400 mb-8">We are here to help and listen to your feedback.</p>

      <div className="space-y-5 text-xs sm:text-sm">
        <div className="p-5 rounded-2xl bg-zinc-900 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white mb-1">Email Support</h2>
            <p className="text-zinc-400 text-xs">
              For general inquiries, account assistance, or feedback:
            </p>
          </div>
          <a
            href="mailto:support@bolo.link"
            className="px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-md transition-all shrink-0"
          >
            support@bolo.link
          </a>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-rose-500/20">
          <div className="flex items-center gap-2 text-rose-400 font-bold mb-2">
            <AlertCircle className="w-4 h-4" />
            <span>Reporting Inappropriate Content</span>
          </div>
          <p className="text-zinc-400 text-xs leading-relaxed mb-3">
            If you received a message that violates our Community Guidelines (e.g. harassment, threats, or hate speech),
            you can delete it immediately using the trash icon in your inbox.
          </p>
          <p className="text-zinc-400 text-xs leading-relaxed">
            For urgent safety concerns, please email us with the subject line <strong>&quot;URGENT: Safety Report&quot;</strong> and include
            details of the message and your Bolo account handle so our team can take immediate action.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-white/5">
          <div className="flex items-center gap-2 text-white font-bold mb-1">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>Feature Requests &amp; Ideas</span>
          </div>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Have an idea to make Bolo better or want new features for Instagram Stories?
            We love hearing from creators! Drop us an email anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
