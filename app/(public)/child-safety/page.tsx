import React from "react";
import type { Metadata } from "next";
import { ShieldCheck, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Child Safety Standards | Twining by Amoura Labs",
  description: "Twining's standards against child sexual abuse and exploitation (CSAE) and how to report a concern.",
};

const SAFETY_EMAIL = "twining.app@gmail.com";
const MAILTO = `mailto:${SAFETY_EMAIL}?subject=${encodeURIComponent("Twining child safety report")}`;

export default function ChildSafetyPage() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="space-y-6 pb-8 border-b border-white/5 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fa48ab]/10 border border-[#fa48ab]/15 text-[#fa48ab] text-xs font-semibold uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          Child Safety
        </div>
        <h1 className="font-heading font-black text-4xl sm:text-5xl tracking-tight text-white">
          Child Safety Standards
        </h1>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Clock className="w-3.5 h-3.5" />
          <span>Last Updated: November 3, 2026</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Twining app by Amoura Labs</span>
        </div>
      </div>

      <div className="space-y-8 text-white/70 leading-relaxed text-sm">
        <section className="space-y-4">
          <p>
            Twining, developed by Amoura Labs, has zero tolerance for child sexual abuse and exploitation (CSAE),
            including child sexual abuse material (CSAM). These standards apply to everyone who uses Twining and to
            everything shared through the app, including profiles, chat messages, and voice and video calls.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-white">1. Twining is for adults only</h2>
          <p>
            You must be at least 18 years old to use Twining. Users enter their age when they set up a profile, and
            the app does not accept an age under 18. If we learn that an account belongs to someone under 18, we
            remove it.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-white">2. What is prohibited</h2>
          <p>The following are strictly prohibited on Twining:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>creating, sharing, requesting, or linking to CSAM in any form;</li>
            <li>grooming, or any attempt to build a relationship with a minor for the purpose of sexual contact;</li>
            <li>sexualising a minor in any way, including through messages, descriptions, or conduct on a call;</li>
            <li>sextortion, or threatening or pressuring a minor over sexual images or contact;</li>
            <li>trafficking or advertising a minor for sexual purposes; and</li>
            <li>using Twining to contact a minor or to move a minor to another platform for any of the above.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-white">3. How to report a concern</h2>
          <p>
            <span className="text-white">In the app:</span> go to the{" "}
            <span className="text-white">Profile</span> tab, open <span className="text-white">Feedback</span>, and
            choose <span className="text-white">Report Misbehavior</span>. Select the type that fits best, set the
            severity to <span className="text-white">Critical</span>, and say in your description that it is a child
            safety concern. You can also block a user from your chat with them.
          </p>
          <p>
            <span className="text-white">By email:</span> anyone can report a concern to us, with or without a
            Twining account. Please include the user&apos;s name or phone number if you know it, and what happened.
          </p>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-white/90">
            <p className="font-semibold">Amoura Labs Child Safety Contact</p>
            <p className="text-xs text-white/50 mt-1">
              Email:{" "}
              <a href={MAILTO} className="text-[#fa48ab] hover:underline">
                {SAFETY_EMAIL}
              </a>
            </p>
          </div>
          <p>
            Please do not copy, save, or send us images or videos of suspected abuse. Describe what you saw instead,
            and report it to the authorities listed below.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-white">4. What we do about reports</h2>
          <p>We treat child safety reports as our highest priority. When we receive one, we:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>review the report and the account involved;</li>
            <li>remove violating content and accounts that break these standards;</li>
            <li>keep the information we are legally required to preserve; and</li>
            <li>report confirmed CSAM and child exploitation to the relevant authorities, as the law requires.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-white">5. Compliance with the law</h2>
          <p>
            Amoura Labs complies with applicable child safety laws, including India&apos;s Protection of Children
            from Sexual Offences (POCSO) Act, 2012 and the Information Technology Act, 2000. We cooperate with law
            enforcement on valid legal requests.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-white">6. If a child is in danger</h2>
          <p>
            If a child is in immediate danger, contact local emergency services first. You can also report directly
            to these authorities:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>India emergency services: <span className="text-white">112</span></li>
            <li>India Childline: <span className="text-white">1098</span></li>
            <li>
              India National Cyber Crime Reporting Portal:{" "}
              <a href="https://cybercrime.gov.in" className="text-[#fa48ab] hover:underline">
                cybercrime.gov.in
              </a>
            </li>
            <li>
              Outside India, NCMEC CyberTipline:{" "}
              <a href="https://report.cybertip.org" className="text-[#fa48ab] hover:underline">
                report.cybertip.org
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
