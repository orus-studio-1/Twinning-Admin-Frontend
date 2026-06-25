import React from "react";
import { Scale, Clock } from "lucide-react";

export default function TermsAndConditionsPage() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="space-y-6 pb-8 border-b border-white/5 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fa48ab]/10 border border-[#fa48ab]/15 text-[#fa48ab] text-xs font-semibold uppercase">
          <Scale className="w-3.5 h-3.5" />
          Legal Agreement
        </div>
        <h1 className="font-heading font-black text-4xl sm:text-5xl tracking-tight text-white">
          Terms & Conditions
        </h1>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Clock className="w-3.5 h-3.5" />
          <span>Last Updated: June 24, 2026</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Version 1.0.0</span>
        </div>
      </div>

      {/* Content Placeholder */}
      <div className="space-y-8 text-white/70 leading-relaxed text-sm">
        <section className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-white">1. Acceptance of Terms</h2>
          <p>
            By registering an account and utilizing the Twinning mobile application, website, or services, you represent that you are at least 18 years of age and agree to comply with all rules set forth in this document.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-white">2. User Conduct & Community Guidelines</h2>
          <p>
            Twinning is dedicated to authentic, respectful conversations. You agree NOT to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/60">
            <li>Engage in harassment, abusive behavior, or hate speech during voice/video calls.</li>
            <li>Broadcast explicit, pornographic, or copyrighted materials.</li>
            <li>Impersonate other users or attempt to commit fraud/financial scams.</li>
            <li>Use automated scripts or bots to manipulate matches or call sessions.</li>
          </ul>
          <p>
            Violating these codes of conduct will result in instant account suspension and forfeiture of any pending wallet balances.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-white">3. Host Wallet & Earning Mechanisms</h2>
          <p>
            Verified Hosts earn coins from incoming call minutes. You understand that:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/60">
            <li>Coins are credited to your Twinning Wallet and can be withdrawn subject to audit review.</li>
            <li>Twinning reserves the right to charge platform processing fees on transactions.</li>
            <li>Any suspicion of artificial call-time inflation or fraudulent matches will freeze withdrawals pending investigation.</li>
          </ul>
          <p className="text-white/40 italic">
            [Detailed financial transaction and withdrawal timelines to be inserted by the administrator...]
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-white">4. Account Termination</h2>
          <p>
            Twinning reserves the right to deactivate or terminate any user profile or host status at our sole discretion, without notice, if we find violations of local laws or our platform guidelines.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-white">5. Revisions to Terms</h2>
          <p>
            We may modify these Terms & Conditions as Twinning grows. Your continued use of the platform following updates constitutes acceptance of the modified guidelines.
          </p>
        </section>
      </div>
    </div>
  );
}
