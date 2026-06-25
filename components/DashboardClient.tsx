"use client";

import React, { useState, useTransition } from "react";
import { 
  Users, 
  PhoneCall, 
  Coins, 
  ShieldAlert, 
  Video, 
  Mic, 
  Check, 
  X, 
  Clock, 
  Search,
  UserCheck,
  UserX,
  TrendingUp,
  ArrowUpRight,
  Activity,
  CreditCard
} from "lucide-react";
import Avatar from "@/components/Avatar";
import { toggleBlockUserAction, verifyHostAction } from "@/app/actions/admin";

interface DashboardClientProps {
  initialData: {
    metrics: {
      totalUsers: number;
      totalClients: number;
      totalHosts: number;
      totalVerifiedHosts: number;
      audioCallsToday: number;
      videoCallsToday: number;
      liveCalls: number;
      totalRechargedEver: number;
      totalRechargedToday: number;
    };
    lists: {
      recentRegistrations: any[];
      recentCalls: any[];
      recentTransactions: any[];
      pendingHosts: any[];
    };
  };
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { metrics, lists } = data;

  // Handle blocking/unblocking user
  const handleToggleBlock = async (userId: string, isCurrentlyBlocked: boolean) => {
    setActionLoading(`block-${userId}`);
    const shouldBlock = !isCurrentlyBlocked;
    
    startTransition(async () => {
      const result = await toggleBlockUserAction(userId, shouldBlock);
      if (result.success) {
        // Update local state dynamically
        const updatedRegistrations = lists.recentRegistrations.map((user) => {
          if (user.id === userId) {
            return { ...user, is_blocked: shouldBlock };
          }
          return user;
        });
        setData({
          ...data,
          lists: {
            ...lists,
            recentRegistrations: updatedRegistrations,
          },
        });
      } else {
        alert(result.error || "Failed to update user block status.");
      }
      setActionLoading(null);
    });
  };

  // Handle verifying/rejecting a host
  const handleVerifyHost = async (hostUserId: string, verify: boolean) => {
    setActionLoading(`verify-${hostUserId}`);
    
    startTransition(async () => {
      const result = await verifyHostAction(hostUserId, verify);
      if (result.success) {
        // Remove verified host from the pending list and update registrations
        const updatedPending = lists.pendingHosts.filter((host) => host.user_id !== hostUserId);
        const updatedRegistrations = lists.recentRegistrations.map((user) => {
          if (user.id === hostUserId) {
            return { ...user, is_host_verified: verify };
          }
          return user;
        });
        
        setData({
          ...data,
          metrics: {
            ...metrics,
            totalVerifiedHosts: verify ? metrics.totalVerifiedHosts + 1 : metrics.totalVerifiedHosts,
          },
          lists: {
            ...lists,
            pendingHosts: updatedPending,
            recentRegistrations: updatedRegistrations,
          },
        });
      } else {
        alert(result.error || "Failed to verify host.");
      }
      setActionLoading(null);
    });
  };

  // Format seconds to MM:SS
  const formatDuration = (seconds: number | null) => {
    if (seconds === null || seconds === undefined) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Format timestamp to relative/clean time safely (hydration-safe)
  const formatTime = (isoString: string) => {
    if (!isoString) return "N/A";
    if (!mounted) {
      // Server renders stable YYYY-MM-DD format
      return isoString.split("T")[0];
    }
    // Client renders local timezone format
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " - " + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Format date of birth safely (hydration-safe)
  const formatDOB = (isoString: string) => {
    if (!isoString) return "N/A";
    if (!mounted) {
      // Server renders stable YYYY-MM-DD format
      return isoString.split("T")[0];
    }
    // Client renders local timezone format
    const date = new Date(isoString);
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Filter registrations by search query
  const filteredUsers = lists.recentRegistrations.filter((user) => {
    const name = (user.name || "").toLowerCase();
    const phone = (user.phone || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || phone.includes(query);
  });

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/5 space-y-4 hover:border-white/10 transition-all duration-300 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-white/45 uppercase tracking-wider">Total Users</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-heading font-black text-white">{metrics.totalUsers}</span>
            <span className="text-[10px] text-white/40 font-semibold">Registered Users</span>
          </div>
        </div>

        {/* Regular Clients */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/5 space-y-4 hover:border-white/10 transition-all duration-300 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-white/45 uppercase tracking-wider">Total Clients</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-heading font-black text-white">{metrics.totalClients}</span>
            <span className="text-[10px] text-white/40 font-semibold">Regular Callers</span>
          </div>
        </div>

        {/* Total Hosts */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/5 space-y-4 hover:border-white/10 transition-all duration-300 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-white/45 uppercase tracking-wider">Total Hosts</span>
            <div className="w-9 h-9 rounded-xl bg-[#fa48ab]/10 border border-[#fa48ab]/25 flex items-center justify-center text-[#fa48ab]">
              <UserCheck className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-heading font-black text-white">{metrics.totalHosts}</span>
            <span className="text-[10px] text-white/40 font-semibold">
              {metrics.totalVerifiedHosts} Verified
            </span>
          </div>
        </div>

        {/* Live Calls */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/5 space-y-4 hover:border-white/10 transition-all duration-300 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-white/45 uppercase tracking-wider">Active Calls</span>
            <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/25 flex items-center justify-center text-green-400 animate-pulse">
              <Activity className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-heading font-black text-white">{metrics.liveCalls}</span>
            <span className="text-[10px] text-green-400 font-bold flex items-center gap-1">
              Live Connection Node
            </span>
          </div>
        </div>
      </div>

      {/* Call & Recharge Volume Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recharges Today */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/5 flex items-center justify-between hover:border-white/10 transition-all duration-300">
          <div className="space-y-1">
            <span className="block text-xs font-semibold text-white/45 uppercase tracking-wider">Recharges Today</span>
            <span className="block text-2xl font-heading font-black text-white">₹{metrics.totalRechargedToday.toLocaleString()}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        {/* Audio Calls Today */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/5 flex items-center justify-between hover:border-white/10 transition-all duration-300">
          <div className="space-y-1">
            <span className="block text-xs font-semibold text-white/45 uppercase tracking-wider">Audio Calls Today</span>
            <span className="block text-2xl font-heading font-black text-white">{metrics.audioCallsToday} calls</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Mic className="w-5 h-5" />
          </div>
        </div>

        {/* Video Calls Today */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/5 flex items-center justify-between hover:border-white/10 transition-all duration-300">
          <div className="space-y-1">
            <span className="block text-xs font-semibold text-white/45 uppercase tracking-wider">Video Calls Today</span>
            <span className="block text-2xl font-heading font-black text-white">{metrics.videoCallsToday} calls</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#fa48ab]/10 border border-[#fa48ab]/20 flex items-center justify-center text-[#fa48ab]">
            <Video className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Pending Host Verifications Section */}
      {lists.pendingHosts.length > 0 && (
        <div className="glassmorphism p-6 rounded-2xl border border-white/5 space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <ShieldAlert className="w-5 h-5 text-[#fa48ab]" />
            <h3 className="font-heading font-bold text-lg text-white">Pending Host Verification Audits</h3>
            <span className="ml-auto text-xs font-bold bg-[#fa48ab]/15 text-[#fa48ab] px-2.5 py-1 rounded-full border border-[#fa48ab]/25">
              {lists.pendingHosts.length} applications
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {lists.pendingHosts.map((host) => (
              <div key={host.id} className="p-5 rounded-2xl bg-white/3 border border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-start">
                <div className="flex gap-3 items-start min-w-0">
                  <Avatar src={host.avatar} name={host.full_name} size="lg" className="rounded-xl shrink-0" />
                  <div className="min-w-0 space-y-1">
                    <span className="block text-sm font-bold text-white truncate">{host.full_name}</span>
                    <span className="block text-xs text-white/40">DOB: {formatDOB(host.date_of_birth)}</span>
                    <span className="block text-xs text-white/40">Aadhar: {host.aadhar_number}</span>
                    <div className="p-2 rounded bg-black/40 text-[10px] text-white/50 font-mono space-y-0.5 mt-2">
                      <p>UPI: <span className="text-white/80">{host.upi_id || "N/A"}</span></p>
                      <p>A/C: <span className="text-white/80">{host.bank_account_number || "N/A"}</span> (IFSC: {host.ifsc_code || "N/A"})</p>
                    </div>
                  </div>
                </div>

                {/* Audit Buttons */}
                <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0 justify-end self-stretch">
                  <button
                    onClick={() => handleVerifyHost(host.user_id, true)}
                    disabled={actionLoading === `verify-${host.user_id}`}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl disabled:opacity-40 transition-all duration-250"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve Host
                  </button>
                  <button
                    onClick={() => handleVerifyHost(host.user_id, false)}
                    disabled={actionLoading === `verify-${host.user_id}`}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 text-white/80 text-xs font-bold py-2.5 px-4 rounded-xl disabled:opacity-40 transition-all duration-250"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: User Moderation & Call logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* User Moderation List */}
        <div id="users-section" className="lg:col-span-7 glassmorphism p-6 rounded-2xl border border-white/5 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Platform Registrations</h3>
              <p className="text-xs text-white/40">Search and moderate platform users</p>
            </div>

            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/35">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/5 focus:border-[#fa48ab]/30 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-xs text-white/40 font-semibold">
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Role / Type</th>
                  <th className="py-3 px-4">Phone / Region</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-white/85">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/1 transition-colors">
                    {/* User profile details */}
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <Avatar src={user.avatar} name={user.name || user.phone} size="sm" />
                      <div className="min-w-0">
                        <span className="block font-bold text-white truncate">{user.name || "Setup Pending"}</span>
                        <span className="block text-[10px] text-white/40">{formatTime(user.created_at)}</span>
                      </div>
                    </td>

                    {/* Role / Host check */}
                    <td className="py-3.5 px-4">
                      {user.is_host ? (
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${user.is_host_verified ? "bg-purple-500/10 text-purple-400" : "bg-amber-500/10 text-amber-400"}`}>
                          {user.is_host_verified ? "Host (Verified)" : "Host (Unverified)"}
                        </span>
                      ) : (
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
                          Client Caller
                        </span>
                      )}
                    </td>

                    {/* Phone/Location */}
                    <td className="py-3.5 px-4">
                      <span className="block font-semibold">{user.phone}</span>
                      <span className="block text-[10px] text-white/40">{user.location || "N/A"}</span>
                    </td>

                    {/* Block Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleBlock(user.id, user.is_blocked)}
                        disabled={actionLoading === `block-${user.id}`}
                        className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200 ${
                          user.is_blocked 
                            ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20" 
                            : "bg-white/5 hover:bg-red-500/5 hover:text-red-400 border border-transparent hover:border-red-500/10"
                        }`}
                      >
                        {user.is_blocked ? (
                          <>
                            <UserX className="w-3.5 h-3.5" />
                            Blocked
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            Active
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-white/30 italic">
                      No users match your query
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Call Logs */}
        <div className="lg:col-span-5 glassmorphism p-6 rounded-2xl border border-white/5 space-y-6">
          <div>
            <h3 className="font-heading font-bold text-lg text-white">Call Activity Logs</h3>
            <p className="text-xs text-white/40">Monitoring last 10 call sessions</p>
          </div>

          <div className="space-y-4">
            {lists.recentCalls.map((call) => (
              <div key={call.id} className="flex gap-3 items-start text-xs border-b border-white/5 pb-3.5 last:border-0 last:pb-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  call.call_type === 'video' 
                    ? "bg-[#fa48ab]/15 text-[#fa48ab]" 
                    : "bg-blue-500/15 text-blue-400"
                }`}>
                  {call.call_type === 'video' ? <Video className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-white/80 leading-relaxed">
                    <span className="font-bold text-white">{call.caller_name || "Caller"}</span>
                    {" called "}
                    <span className="font-bold text-white">{call.callee_name || "Host"}</span>
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-white/30">
                    <span className="bg-white/5 px-1.5 py-0.5 rounded text-white/55 font-mono">
                      {formatDuration(call.duration_seconds)}
                    </span>
                    <span className="capitalize">{call.status}</span>
                    {call.end_reason && (
                      <span className="text-white/20">• {call.end_reason}</span>
                    )}
                    <span className="ml-auto text-white/25">{formatTime(call.started_at)}</span>
                  </div>
                </div>
              </div>
            ))}

            {lists.recentCalls.length === 0 && (
              <p className="text-center py-8 text-white/30 italic text-xs">
                No call logs available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="glassmorphism p-6 rounded-2xl border border-white/5 space-y-6">
        <div>
          <h3 className="font-heading font-bold text-lg text-white">Recent Transactions</h3>
          <p className="text-xs text-white/40">Audit trail of platforms credits, recharges, and withdrawals</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-xs text-white/40 font-semibold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Category / Source</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-white/85">
              {lists.recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/1 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="block font-bold text-white">{tx.user_name || "User"}</span>
                    <span className="block text-[10px] text-white/40">{tx.phone}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded ${
                      tx.type === "credit" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold font-heading text-white">
                    ₹{parseFloat(tx.amount).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 capitalize font-semibold text-white/60">
                    {tx.source}
                  </td>
                  <td className="py-3.5 px-4 text-white/55 max-w-xs truncate">
                    {tx.description || "N/A"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      tx.status === "success" 
                        ? "bg-green-500/10 text-green-400" 
                        : tx.status === "failed" 
                          ? "bg-red-500/10 text-red-400" 
                          : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-white/40">
                    {formatTime(tx.created_at)}
                  </td>
                </tr>
              ))}

              {lists.recentTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-white/30 italic">
                    No transactions available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
