import { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service - Bolo",
  description: "Terms and conditions governing the use of Bolo anonymous messaging platform.",
};

export default function TermsOfServicePage() {
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
        <FileText className="w-6 h-6 text-pink-400" />
        <h1 className="text-2xl sm:text-3xl font-black text-white">Terms of Service</h1>
      </div>
      <p className="text-xs text-zinc-500 mb-8">Last Updated: September 4, 2026</p>

      <div className="space-y-6 text-xs sm:text-sm">
        <section>
          <h2 className="text-base font-bold text-white mb-2">1. Agreement to Terms</h2>
          <p>
            By accessing or using Bolo (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
            If you disagree with any part of the terms, you may not access or use the Service.
          </p>
        </section>

        <section className="p-4 rounded-2xl bg-zinc-900 border border-white/10">
          <h2 className="text-base font-bold text-white mb-2">2. Prohibited Conduct &amp; Zero Tolerance Policy</h2>
          <p className="mb-2">
            Bolo is built for positive, fun, and constructive honest feedback. We enforce a strict zero-tolerance policy against:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li>Cyberbullying, harassment, stalking, or targeted abuse of any person.</li>
            <li>Hate speech, defamation, discrimination, or threats of physical violence.</li>
            <li>Sharing private personal information (doxxing), phone numbers, or residential addresses.</li>
            <li>Sending sexually explicit, obscene, or illegal content.</li>
            <li>Spam, automated message bombing, or unauthorized advertising.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">3. User Responsibility &amp; Anonymity</h2>
          <p>
            While messages are anonymous to recipients, anonymity is not a license to violate the law.
            We reserve the right to cooperate with legal authorities and law enforcement in cases involving criminal threats,
            illegal harassment, or physical danger.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">4. Content Moderation &amp; Deletion</h2>
          <p>
            Recipients have complete control to delete any received message from their inbox at any time.
            We reserve the right to review, block, or delete any content or terminate accounts that violate our policies
            without prior notice.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">5. Disclaimer of Warranties</h2>
          <p>
            The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind.
            Bolo does not endorse, verify, or assume responsibility for any content sent by third parties through the platform.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">6. Limitation of Liability</h2>
          <p>
            In no event shall Bolo, its operators, or affiliates be liable for any direct, indirect, incidental, or consequential damages
            arising from your use of the Service or any interactions with messages received.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">7. Contact &amp; Reports</h2>
          <p>
            To report abuse, copyright infringement, or violations of these terms, please contact:{" "}
            <a href="mailto:support@bolo.link" className="text-pink-400 underline hover:text-pink-300">
              support@bolo.link
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
