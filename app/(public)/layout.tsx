import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, ShieldAlert, ArrowRight } from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#070707] text-[#f1f1f1] selection:bg-[#fa48ab] selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 glassmorphism-dark border-b border-white/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(250,72,171,0.15)] group-hover:border-[#fa48ab]/40 transition-all duration-300">
              <Image 
                src="/twining-logo.jpeg" 
                alt="Twinning Logo" 
                width={40} 
                height={40} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent group-hover:to-white transition-all duration-300">
              Twinning
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <Link href="/#features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/#earning" className="hover:text-white transition-colors">
              Earning
            </Link>
            <Link href="/#security" className="hover:text-white transition-colors">
              Security
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </nav>

          {/* Action CTA */}
          <div className="flex items-center gap-4">

            <Link
              href="/#download"
              className="relative inline-flex items-center gap-1 bg-[#fa48ab] text-white text-sm font-semibold py-2.5 px-5 rounded-xl shadow-[0_4px_20px_rgba(250,72,171,0.3)] hover:shadow-[0_4px_25px_rgba(250,72,171,0.45)] hover:bg-[#fa48ab]/95 transition-all duration-300 group"
            >
              Download App
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-[#0b0b0c] border-t border-white/5 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/10">
                <Image 
                  src="/twining-logo.jpeg" 
                  alt="Twinning Logo" 
                  width={36} 
                  height={36} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight">Twinning</span>
            </div>
            <p className="text-sm text-white/40 max-w-sm leading-relaxed">
              A premium, secure global video and voice calling experience designed to build authentic connections and empower creators worldwide.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm text-white tracking-wider uppercase mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm text-white tracking-wider uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <a href="#download" className="hover:text-white transition-colors">
                  Download Mobile App
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/45">
          <p>© {new Date().getFullYear()} Twinning. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-[#fa48ab]" />
            <span>End-to-end encrypted voice & video calling.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
