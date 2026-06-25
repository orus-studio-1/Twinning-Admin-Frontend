import React from "react";
import { Shield, Clock } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="space-y-6 pb-8 border-b border-white/5 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fa48ab]/10 border border-[#fa48ab]/15 text-[#fa48ab] text-xs font-semibold uppercase">
          <Shield className="w-3.5 h-3.5" />
          Privacy Assurance
        </div>
        <h1 className="font-heading font-black text-4xl sm:text-5xl tracking-tight text-white">
          Privacy Policy
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
          <h2 className="font-heading font-bold text-xl text-white">1. Information We Collect</h2>
          <p>
            At Twinning, we value your privacy. This section outlines the personal data we collect when you use our real-time audio and video calling services, including account details, device identifiers, and metadata related to call sessions.
          </p>
          <p className="text-white/40 italic">
            [Detailed collection terms and categories to be inserted by the administrator...]
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-white">2. How We Use Your Information</h2>
          <p>
            We use your data strictly to connect you with other users globally, process payments inside your wallet, enforce community guidelines, and optimize network connection routing for your video calls.
          </p>
          <p className="text-white/40 italic">
            [Detailed data processing terms and third-party API details to be inserted by the administrator...]
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-white">3. Voice and Video Call Security</h2>
          <p>
            Twinning calls are end-to-end encrypted or securely routed depending on the match type. We do NOT record, stream, or store any audio or video content of your personal calls on our servers. All conversations remain private and direct between participants.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-white">4. User Rights and Data Retention</h2>
          <p>
            You retain full ownership of your profile. You may request account deletion and removal of all associated wallet histories, transactions, and session metadata from our databases at any time by contacting our support desk.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-white">5. Contact Information</h2>
          <p>
            If you have questions, complaints, or suggestions regarding our privacy procedures, please reach out to us at:
          </p>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-white/90">
            <p className="font-semibold">Twinning Support Operations</p>
            <p className="text-xs text-white/50 mt-1">Email: privacy@twinning.app</p>
          </div>
        </section>
      </div>
    </div>
  );
}
