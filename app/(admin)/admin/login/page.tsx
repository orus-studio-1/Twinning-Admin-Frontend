"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, User, AlertCircle, Loader2 } from "lucide-react";
import { loginAdmin } from "../../../actions/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const result = await loginAdmin(null, formData);

      if (result.success) {
        // Force routing refresh to update middleware/layout session state
        router.refresh();
        router.push("/admin");
      } else {
        setError(result.error || "Authentication failed.");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#070707]">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#fa48ab]/10 blur-[100px] pointer-events-none" />

      {/* Glassmorphic Login Card */}
      <div className="w-full max-w-md glassmorphism p-8 sm:p-10 rounded-3xl border border-white/5 shadow-2xl relative z-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 mx-auto shadow-[0_0_20px_rgba(250,72,171,0.2)]">
            <Image 
              src="/twining-logo.jpeg" 
              alt="Twinning Logo" 
              width={64} 
              height={64} 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-heading font-black text-2xl tracking-tight text-white">
            Admin Portal
          </h1>
          <p className="text-xs text-white/40">
            Securely access the Twinning management dashboard
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-start gap-3 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Authentication Error</span>
              <p className="mt-0.5 text-red-400/80">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/50 px-1" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/35">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/5 focus:border-[#fa48ab]/30 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#fa48ab]/20 disabled:opacity-50 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/50 px-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/35">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/5 focus:border-[#fa48ab]/30 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#fa48ab]/20 disabled:opacity-50 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full relative inline-flex items-center justify-center bg-[#fa48ab] text-white text-sm font-bold py-4 rounded-2xl shadow-[0_4px_20px_rgba(250,72,171,0.3)] hover:shadow-[0_4px_25px_rgba(250,72,171,0.45)] hover:bg-[#fa48ab]/95 disabled:opacity-50 transition-all duration-300"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                Authorizing Session...
              </span>
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
