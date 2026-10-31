import React from "react";
import type { Metadata } from "next";
import { Trash2, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Delete Your Account | Twining by Amoura Labs",
  description: "How to request deletion of your Twining account and associated data.",
};

const SUPPORT_EMAIL = "twining.app@gmail.com";
const MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Twining account deletion request")}`;

export default function DeleteAccountPage() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="space-y-6 pb-8 border-b border-white/5 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fa48ab]/10 border border-[#fa48ab]/15 text-[#fa48ab] text-xs font-semibold uppercase">
          <Trash2 className="w-3.5 h-3.5" />
          Account Deletion
        </div>
        <h1 className="font-heading font-black text-4xl sm:text-5xl tracking-tight text-white">
          Delete Your Twining Account
        </h1>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Clock className="w-3.5 h-3.5" />
          <span>Last Updated: October 31, 2026</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Twining app by Amoura Labs</span>
        </div>
      </div>

      <div className="space-y-8 text-white/70 leading-relaxed text-sm">
        <section className="space-y-4">
          <p>
            This page explains how to delete your account in the Twining app, developed by Amoura Labs, and what
            happens to your data when you do. You can delete your account from inside the app, or ask us to do it
            for you by email if you no longer have the app.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-white">1. Delete your account in the app</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Open the Twining app and log in with your phone number.</li>
            <li>Go to the <span className="text-white">Profile</span> tab and open <span className="text-white">Settings</span>.</li>
            <li>Tap <span className="text-white">Delete Account</span> and confirm.</li>
          </ol>
          <p>You are logged out immediately and your profile is no longer visible to other users.</p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-white">2. Request deletion by email</h2>
          <p>If you can&apos;t use the app, email us from any address with:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>the phone number registered to your Twining account (with country code), and</li>
            <li>the subject line &ldquo;Twining account deletion request&rdquo;.</li>
          </ul>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-white/90">
            <p className="font-semibold">Amoura Labs Support</p>
            <p className="text-xs text-white/50 mt-1">
              Email:{" "}
              <a href={MAILTO} className="text-[#fa48ab] hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </p>
          </div>
          <p>
            To protect your account, we may ask you to confirm that you own the phone number before deleting it. We
            process requests within 7 days and reply by email once your account is scheduled for deletion.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-white">3. What is deleted</h2>
          <p>When your account is deleted, we permanently remove:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>your account and phone number,</li>
            <li>your profile, including name, photo, preferences and approximate location,</li>
            <li>your chat conversations and messages,</li>
            <li>your call history,</li>
            <li>your wallet, credit balance and in-app transaction history,</li>
            <li>host earnings and withdrawal records, if you were a host, and</li>
            <li>block lists and reports you submitted.</li>
          </ul>
          <p>
            We never record or store the audio or video of your calls, so there is no call content to delete.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading font-bold text-xl text-white">4. When it is deleted, and what is kept</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Your account is deactivated immediately and permanently deleted from our servers{" "}
              <span className="text-white">15 days</span> after the request. If you log in again during those 15
              days, you can choose to restore your account.
            </li>
            <li>
              Unused credits are lost when the account is deleted and are not refunded.
            </li>
            <li>
              Payments made through Razorpay are also recorded by Razorpay, which keeps its own records as required
              by law. We don&apos;t control those records.
            </li>
            <li>
              Reports other users filed about your behaviour are kept for safety reasons, but no longer linked to
              your account.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
