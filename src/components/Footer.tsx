import Link from "next/link";
import { MessageCircle, Shield, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-black/40 backdrop-blur-md mt-auto py-8 px-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-400">
        {/* Brand */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center shadow-sm">
              <MessageCircle className="w-3 h-3 text-white fill-white/20" />
            </div>
            <span className="font-extrabold text-white text-sm">bolo</span>
            <span className="text-[10px] text-zinc-500 font-mono">বলো • बोलो</span>
          </Link>
          <p className="text-[11px] text-zinc-500">
            Anonymous questions and honest thoughts for Instagram & WhatsApp.
          </p>
        </div>

        {/* Legal & Informational Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-zinc-400 font-medium text-[11px]">
          <Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-zinc-500 text-center sm:text-left">
        <p>© {new Date().getFullYear()} Bolo. All rights reserved.</p>
        <p className="flex items-center gap-1">
          <span>Safe & Anonymous</span>
          <Shield className="w-3 h-3 text-emerald-400 inline" />
        </p>
      </div>
    </footer>
  );
}
