"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  UserCheck,
  UserX,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownLeft,
  Video,
  Clock,
  Briefcase,
  Hash,
  AlertCircle,
  Activity,
  Award,
  BookOpen,
  CreditCard
} from "lucide-react";
import Avatar from "./Avatar";
import { toggleBlockUserAction, verifyHostAction } from "@/app/actions/admin";

export interface DetailedUser {
  id: string;
  phone: string;
  created_at: string;
  is_blocked: boolean;
  name: string | null;
  avatar: string | null;
  age: number | null;
  gender: string | null;
  location: string | null;
  preferences: string | null;
  language: string | null;
  balance: string | number | null;
  is_host: boolean;
}

export interface DetailedHostInfo {
  id: string;
  full_name: string;
  date_of_birth: string;
  aadhar_number: string;
  bank_account_number: string | null;
  ifsc_code: string | null;
  upi_id: string | null;
  bio: string | null;
  earning_rate_percent: string | number;
  is_verified: boolean;
  is_active: boolean;
  total_earnings: string | number | null;
}

export interface DetailCallLog {
  id: string;
  caller_id: string;
  callee_id: string;
  status: string;
  started_at: string;
  connected_at: string | null;
  ended_at: string | null;
  duration_seconds: number | null;
  end_reason: string | null;
  call_type: string;
  caller_name: string | null;
  caller_avatar: string | null;
  callee_name: string | null;
  callee_avatar: string | null;
}

export interface DetailTransaction {
  id: string;
  type: string;
  amount: string | number;
  status: string;
  source: string;
  description: string;
  created_at: string;
}

interface UserDetailClientProps {
  user: DetailedUser;
  hostDetails: DetailedHostInfo | null;
  calls: DetailCallLog[];
  transactions: DetailTransaction[];
}

export default function UserDetailClient({ user, hostDetails, calls, transactions }: UserDetailClientProps) {
  const [blocked, setBlocked] = useState(user.is_blocked);
  const [verified, setVerified] = useState(hostDetails?.is_verified ?? false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleBlock = async () => {
    setIsActionLoading(true);
    try {
      const result = await toggleBlockUserAction(user.id, !blocked);
      if (result.success) {
        setBlocked(!blocked);
      } else {
        alert(result.error || "Failed to update block status");
      }
    } catch (err) {
      console.error("Block action failed:", err);
      alert("An unexpected error occurred");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleToggleVerify = async () => {
    if (!hostDetails) return;
    setIsActionLoading(true);
    try {
      const result = await verifyHostAction(hostDetails.id, !verified, user.id);
      if (result.success) {
        setVerified(!verified);
      } else {
        alert(result.error || "Failed to update verification status");
      }
    } catch (err) {
      console.error("Verification action failed:", err);
      alert("An unexpected error occurred");
    } finally {
      setIsActionLoading(false);
    }
  };

  const formatDate = (isoStr: string) => {
    if (!mounted) return "";
    return new Date(isoStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (isoStr: string) => {
    if (!mounted) return "";
    return new Date(isoStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* Back Button and Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={user.is_host ? "/admin/hosts" : "/admin/users"}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 border border-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white font-heading">
              Client Audit Profile
            </h1>
            <p className="text-white/45 text-xs mt-0.5">
              Comprehensive identity, credential, call history, and financial audit logs
            </p>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {hostDetails && (
            <button
              onClick={handleToggleVerify}
              disabled={isActionLoading}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                verified
                  ? "bg-white/5 border border-white/5 hover:bg-white/10 text-white/60 hover:text-rose-400"
                  : "bg-amber-500 hover:bg-amber-600 text-black shadow-lg shadow-amber-500/10"
              } disabled:opacity-30`}
            >
              {verified ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
              <span>{verified ? "Revoke Verification" : "Verify Host"}</span>
            </button>
          )}

          <button
            onClick={handleToggleBlock}
            disabled={isActionLoading}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
              blocked
                ? "bg-emerald-950/20 hover:bg-emerald-950/40 border-emerald-500/20 text-emerald-400"
                : "bg-rose-950/20 hover:bg-rose-950/40 border-rose-500/20 text-rose-500 shadow-lg shadow-rose-500/5"
            } disabled:opacity-30`}
          >
            {blocked ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
            <span>{blocked ? "Activate Account" : "Block User"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Identity Card & Host Credentials */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Identity overview card */}
          <div className="glassmorphism p-6 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col items-center text-center">
            {/* Glow background */}
            <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-[#ff2a7f]/10 blur-3xl pointer-events-none" />
            
            <div className="relative mt-4">
              <Avatar
                src={user.avatar}
                name={user.name || user.phone}
                className={`w-24 h-24 rounded-3xl border-4 shadow-xl ${
                  user.is_host
                    ? verified ? "border-[#ff2a7f]" : "border-amber-500/50"
                    : "border-white/10"
                }`}
              />
              {user.is_host && (
                <div className={`absolute -bottom-1 -right-1 rounded-full p-1 border border-black shadow-lg ${
                  verified ? "bg-[#ff2a7f]" : "bg-amber-500"
                }`}>
                  {verified ? (
                    <ShieldCheck className="w-4 h-4 text-white" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-black" />
                  )}
                </div>
              )}
            </div>

            <h3 className="text-lg font-extrabold text-white mt-4 font-heading">
              {user.name || "Anonymous Client"}
            </h3>
            
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider bg-white/5 border border-white/5 text-white/60">
                {user.is_host ? "Female Host" : "Regular Client"}
              </span>
              {blocked && (
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider bg-rose-950/40 border border-rose-500/20 text-rose-400">
                  Suspended
                </span>
              )}
            </div>

            {user.preferences && (
              <p className="text-white/40 text-xs italic mt-3 max-w-[200px] truncate">
                "{user.preferences}"
              </p>
            )}

            {/* Fields list */}
            <div className="w-full border-t border-white/5 mt-6 pt-5 space-y-3.5 text-xs text-left">
              <div className="flex justify-between items-center">
                <span className="text-white/35 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-white/30" /> Phone
                </span>
                <span className="text-white/80 font-mono font-bold">{user.phone}</span>
              </div>

              {user.location && (
                <div className="flex justify-between items-center">
                  <span className="text-white/35 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-white/30" /> Location
                  </span>
                  <span className="text-white/80 font-bold">{user.location}</span>
                </div>
              )}

              {user.age && (
                <div className="flex justify-between items-center">
                  <span className="text-white/35 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-white/30" /> Age
                  </span>
                  <span className="text-white/80 font-bold">{user.age} years</span>
                </div>
              )}

              {user.language && (
                <div className="flex justify-between items-center">
                  <span className="text-white/35 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-white/30" /> Languages
                  </span>
                  <span className="text-white/80 font-bold truncate max-w-[150px]">{user.language}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-white/35 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-white/30" /> Signup Date
                </span>
                <span className="text-white/80 font-bold">{formatDate(user.created_at)}</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-white/3">
                <span className="text-white/35 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-white/30" /> User UUID
                </span>
                <span className="text-white/50 font-mono text-[9px] truncate max-w-[150px]" title={user.id}>
                  {user.id}
                </span>
              </div>
            </div>
          </div>

          {/* Host credential block if applicable */}
          {hostDetails && (
            <div className="glassmorphism p-6 rounded-3xl border border-white/5 relative overflow-hidden space-y-5">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-[#ff2a7f] pointer-events-none">
                <Briefcase className="w-16 h-16" />
              </div>

              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#ff2a7f]" />
                Host Employee Credentials
              </h4>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/3 border border-white/3 space-y-1">
                  <p className="text-[10px] text-white/35 uppercase tracking-wider">Aadhar Card Verification</p>
                  <p className="text-white font-mono font-bold text-sm tracking-wide">
                    {hostDetails.aadhar_number.replace(/(.{4})/g, "$1 ").trim()}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/3 border border-white/3 space-y-3">
                  <p className="text-[10px] text-white/35 uppercase tracking-wider flex items-center gap-1">
                    <CreditCard className="w-3 h-3" /> Payout & Banking Details
                  </p>
                  
                  <div className="space-y-2 font-semibold text-white/85">
                    {hostDetails.upi_id && (
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 font-medium">UPI ID</span>
                        <span className="font-mono text-[#ff2a7f]">{hostDetails.upi_id}</span>
                      </div>
                    )}
                    {hostDetails.bank_account_number && (
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 font-medium">Account Number</span>
                        <span className="font-mono">{hostDetails.bank_account_number}</span>
                      </div>
                    )}
                    {hostDetails.ifsc_code && (
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 font-medium">IFSC Code</span>
                        <span className="font-mono uppercase">{hostDetails.ifsc_code}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-3.5 rounded-2xl bg-white/3 border border-white/3 space-y-0.5">
                    <p className="text-[9px] text-white/35 uppercase tracking-wider">Earning Share</p>
                    <p className="text-base font-extrabold text-white">
                      {parseFloat(String(hostDetails.earning_rate_percent))}%
                    </p>
                  </div>
                  
                  <div className="p-3.5 rounded-2xl bg-white/3 border border-white/3 space-y-0.5">
                    <p className="text-[9px] text-white/35 uppercase tracking-wider">Total Earnings</p>
                    <p className="text-base font-extrabold text-indigo-400">
                      ₹{parseFloat(String(hostDetails.total_earnings || 0)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {hostDetails.bio && (
                  <div className="p-3.5 rounded-2xl bg-white/3 border border-white/3 space-y-1">
                    <p className="text-[9px] text-white/35 uppercase tracking-wider">Host Biography</p>
                    <p className="text-white/70 italic leading-relaxed text-[11px]">
                      "{hostDetails.bio}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Columns: Financial & Call audits */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Financial summary and transactions */}
          <div className="glassmorphism p-6 rounded-3xl border border-white/5 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Wallet Balance & Financial Audits
              </h4>
              
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-2xl">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Current Balance</span>
                <span className="text-sm font-black text-emerald-400 font-heading">
                  ₹{parseFloat(String(user.balance || 0)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Transactions lists */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-white/40">Recent Transactions History (Last 50)</p>
              
              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {transactions.map((tx) => {
                  const amount = parseFloat(String(tx.amount));
                  const isCredit = tx.type === "credit";
                  const isSuccess = tx.status === "success";

                  return (
                    <div
                      key={tx.id}
                      className="p-3 rounded-2xl bg-white/3 border border-white/3 hover:bg-white/5 transition-colors flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl border ${
                          isCredit
                            ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-400"
                            : "bg-rose-950/20 border-rose-500/20 text-rose-500"
                        }`}>
                          {isCredit ? (
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          )}
                        </div>
                        
                        <div className="space-y-0.5">
                          <p className="text-white font-bold">{tx.description || "Wallet Transaction"}</p>
                          <div className="flex items-center gap-2 text-[10px] text-white/35">
                            <span className="uppercase font-semibold tracking-wider text-white/45">{tx.source}</span>
                            <span>•</span>
                            <span>{formatDate(tx.created_at)} at {formatTime(tx.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right space-y-0.5">
                        <p className={`font-black font-heading ${
                          isCredit ? "text-emerald-400" : "text-white/80"
                        }`}>
                          {isCredit ? "+" : "-"}₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </p>
                        <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                          isSuccess
                            ? "bg-emerald-500/10 text-emerald-400"
                            : tx.status === "failed"
                            ? "bg-rose-500/10 text-rose-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {transactions.length === 0 && (
                  <div className="text-center py-10 text-white/30 italic">
                    No wallet transaction records found for this client
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Call Auditing block */}
          <div className="glassmorphism p-6 rounded-3xl border border-white/5 space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Video className="w-4 h-4 text-[#ff2a7f]" />
              Audio & Video Calls Audit Log (Last 50)
            </h4>

            {/* Call Logs list */}
            <div className="space-y-3">
              <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                {calls.map((call) => {
                  const isIncoming = call.callee_id === user.id;
                  const isConnected = !!call.connected_at;
                  const formattedDate = formatDate(call.started_at);
                  const formattedTime = formatTime(call.started_at);

                  return (
                    <div
                      key={call.id}
                      className="p-4 rounded-2xl bg-white/3 border border-white/3 hover:bg-white/5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      {/* Connection details */}
                      <div className="flex items-center gap-4">
                        {/* Caller */}
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={call.caller_avatar}
                            name={call.caller_name}
                            className="w-8 h-8 rounded-xl border border-white/10"
                          />
                          <div className="max-w-[70px] sm:max-w-[100px] truncate text-[11px] text-white/80 font-bold">
                            {call.caller_name || "Unknown"}
                          </div>
                        </div>

                        {/* Connection Capsule */}
                        <div className="flex flex-col items-center gap-1 min-w-[70px]">
                          <div className="flex items-center gap-1 text-[9px] font-extrabold text-[#ff2a7f] bg-[#ff2a7f]/5 border border-[#ff2a7f]/10 px-2 py-0.5 rounded-full uppercase">
                            <Video className="w-2.5 h-2.5" />
                            <span>{call.call_type}</span>
                          </div>
                          
                          {/* Arrow flow indicator */}
                          <div className="h-0.5 w-12 bg-white/10 relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/30" />
                          </div>
                          
                          <span className="text-[8px] text-white/30 font-semibold uppercase">{call.status}</span>
                        </div>

                        {/* Callee */}
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={call.callee_avatar}
                            name={call.callee_name}
                            className="w-8 h-8 rounded-xl border border-white/10"
                          />
                          <div className="max-w-[70px] sm:max-w-[100px] truncate text-[11px] text-white/80 font-bold">
                            {call.callee_name || "Unknown"}
                          </div>
                        </div>
                      </div>

                      {/* Call Metadata */}
                      <div className="flex items-center justify-between sm:justify-end gap-5 text-right text-xs pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                        {/* Timestamps */}
                        <div className="text-left sm:text-right space-y-0.5">
                          <p className="text-white/85 font-semibold text-[11px]">{formattedDate}</p>
                          <p className="text-white/30 text-[9px] font-medium">{formattedTime}</p>
                        </div>

                        {/* Duration & status */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-white/80">
                            <Clock className="w-3.5 h-3.5 text-white/30" />
                            <span>{formatDuration(call.duration_seconds)}</span>
                          </div>
                          
                          {call.end_reason && (
                            <span className="text-[9px] block text-white/30 capitalize">
                              Reason: {call.end_reason}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {calls.length === 0 && (
                  <div className="text-center py-12 text-white/30 italic text-xs">
                    No voice or video call logs found for this client
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
