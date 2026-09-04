import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - Bolo",
  description: "Learn how Bolo protects your privacy, handles anonymous messages, and uses cookies.",
};

export default function PrivacyPolicyPage() {
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
        <ShieldCheck className="w-6 h-6 text-pink-400" />
        <h1 className="text-2xl sm:text-3xl font-black text-white">Privacy Policy</h1>
      </div>
      <p className="text-xs text-zinc-500 mb-8">Last Updated: September 4, 2026</p>

      <div className="space-y-6 text-xs sm:text-sm">
        <section>
          <h2 className="text-base font-bold text-white mb-2">1. Overview</h2>
          <p>
            Welcome to Bolo (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). Your privacy is of paramount importance to us.
            This Privacy Policy describes how we collect, use, and handle your information when you visit our website,
            create an account, or send/receive anonymous messages through our platform.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
            <li>
              <strong className="text-zinc-200">Account Information:</strong> When you register on Bolo to receive messages,
              we collect your chosen username and an encrypted, salted hash of your password. We never store your plain-text password.
            </li>
            <li>
              <strong className="text-zinc-200">Anonymous Messages:</strong> When visitors send an anonymous message via your link,
              we collect the message text to deliver it to your inbox. We do not require or collect the sender&apos;s name, email, or social media profile.
            </li>
            <li>
              <strong className="text-zinc-200">Log Data &amp; Cookies:</strong> Like most websites, our servers automatically log
              standard technical data such as browser type, referring URLs, and timestamps to ensure service reliability, prevent spam, and mitigate DDoS attacks.
            </li>
          </ul>
        </section>

        <section className="p-4 rounded-2xl bg-zinc-900 border border-white/10">
          <h2 className="text-base font-bold text-white mb-2">3. Advertising &amp; Google AdSense Cookies</h2>
          <p className="mb-2">
            We use third-party advertising companies, including <strong>Google AdSense</strong>, to serve advertisements when you visit our website.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
            <li>
              Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to our website or other websites.
            </li>
            <li>
              Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 underline hover:text-pink-300"
              >
                Google Ads Settings
              </a>.
            </li>
            <li>
              Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting{" "}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 underline hover:text-pink-300"
              >
                www.aboutads.info
              </a>.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">4. How We Use Information</h2>
          <p>We use the collected information exclusively to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400 mt-1.5">
            <li>Deliver anonymous questions and messages to the intended recipient&apos;s inbox.</li>
            <li>Maintain, secure, and prevent abuse or spam on our services.</li>
            <li>Enable users to generate shareable Instagram Story cards.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">5. Data Retention &amp; Security</h2>
          <p>
            Users can delete any received message directly from their inbox at any time. When a message is deleted,
            it is permanently removed from our active database. We implement modern cryptographic security (salted bcrypt hashing,
            JSON Web Tokens, SSL encryption) to protect all stored information.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">6. Children&apos;s Privacy (COPPA)</h2>
          <p>
            Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information
            from children under 13. If you believe that a child has provided us with personal information, please contact us immediately so we can remove it.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">7. Contact Us</h2>
          <p>
            If you have questions, feedback, or concerns regarding this Privacy Policy or your data, you may reach us at:{" "}
            <a href="mailto:support@bolo.link" className="text-pink-400 underline hover:text-pink-300">
              support@bolo.link
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
