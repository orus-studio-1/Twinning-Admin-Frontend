"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  UserCheck, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Users, 
  ArrowUpDown, 
  RefreshCw, 
  ShieldAlert,
  MapPin,
  CheckCircle2
} from "lucide-react";
import Avatar from "./Avatar";
import { restoreUserAction } from "@/app/actions/admin";

export interface DeletedUserData {
  id: string;
  phone: string;
  created_at: string;
  deleted_at: string;
  scheduled_deletion_date: string;
  name: string | null;
  avatar: string | null;
  gender: string | null;
  location: string | null;
  language: string | null;
}

interface DeletedAccountsClientProps {
  initialData: DeletedUserData[];
}

export default function DeletedAccountsClient({ initialData }: DeletedAccountsClientProps) {
  const [users, setUsers] = useState<DeletedUserData[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("soonest_deletion");
  const [isActionLoading, setIsActionLoading] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  // Handle restore user account
  const handleRestore = async (userId: string, userName: string | null, userPhone: string) => {
    if (isActionLoading[userId]) return;
    
    setIsActionLoading((prev) => ({ ...prev, [userId]: true }));
    setSuccessMessage(null);
    
    try {
      const result = await restoreUserAction(userId);
      if (result.success) {
        const displayName = userName || userPhone;
        setSuccessMessage(`Successfully restored account for ${displayName}`);
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } else {
        alert(result.error || "Failed to restore user account");
      }
    } catch (err) {
      console.error("Restore action failed:", err);
      alert("An unexpected error occurred while restoring the account");
    } finally {
      setIsActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Grace Period Calculator
  const getGracePeriodStats = (deletedAtStr: string) => {
    const deletedAt = new Date(deletedAtStr);
    const totalDurationMs = 15 * 24 * 60 * 60 * 1000; // 15 Days in MS
    const now = new Date();
    
    const elapsedMs = now.getTime() - deletedAt.getTime();
    const remainingMs = Math.max(0, totalDurationMs - elapsedMs);
    
    const percentElapsed = Math.min(100, Math.max(0, (elapsedMs / totalDurationMs) * 100));
    
    // Convert remaining ms to days and hours
    const remainingDays = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
    const remainingHours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    let text = "";
    let urgency: "low" | "medium" | "high" = "low";
    
    if (remainingMs <= 0) {
      text = "Permanent deletion pending";
      urgency = "high";
    } else if (remainingDays === 0) {
      text = `${remainingHours}h remaining`;
      urgency = "high";
    } else {
      text = `${remainingDays}d ${remainingHours}h remaining`;
      if (remainingDays < 3) {
        urgency = "high";
      } else if (remainingDays < 7) {
        urgency = "medium";
      }
    }
    
    return {
      percentElapsed,
      remainingDays,
      remainingHours,
      text,
      urgency,
      remainingMs
    };
  };

  // Filter and Sort Logic
  const filteredUsers = users.filter((user) => {
    const nameStr = user.name || "";
    const phoneStr = user.phone || "";
    const searchLower = searchQuery.toLowerCase();
    
    return (
      nameStr.toLowerCase().includes(searchLower) ||
      phoneStr.includes(searchLower) ||
      user.id.includes(searchLower)
    );
  });

  // Sorting
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const statsA = getGracePeriodStats(a.deleted_at);
    const statsB = getGracePeriodStats(b.deleted_at);

    if (sortBy === "soonest_deletion") {
      return statsA.remainingMs - statsB.remainingMs;
    }
    if (sortBy === "latest_deletion") {
      return statsB.remainingMs - statsA.remainingMs;
    }
    if (sortBy === "newest_registration") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortBy === "name_asc") {
      return (a.name || "").localeCompare(b.name || "");
    }
    return 0;
  });

  // Metrics Calculations
  const totalPendingCount = users.length;
  
  const urgentCount = users.filter((u) => {
    const stats = getGracePeriodStats(u.deleted_at);
    return stats.remainingDays < 3 && stats.remainingMs > 0;
  }).length;

  const nearestDeletionText = (() => {
    if (users.length === 0) return "N/A";
    const sortedByUrgency = [...users].sort((a, b) => {
      return getGracePeriodStats(a.deleted_at).remainingMs - getGracePeriodStats(b.deleted_at).remainingMs;
    });
    return getGracePeriodStats(sortedByUrgency[0].deleted_at).text;
  })();

  // Pagination Math
  const totalItems = sortedUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Date Formatting Helpers
  const formatDateTime = (isoStr: string) => {
    if (!mounted) return "";
    const date = new Date(isoStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-8">
      {/* Success Banner */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 text-green-400 text-sm animate-fade-in shadow-[0_4px_12px_rgba(34,197,94,0.08)]">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="font-heading font-black text-3xl text-white tracking-tight">
            Account Deletion Requests
          </h1>
          <p className="text-sm text-white/40">
            Monitor accounts scheduled for permanent deletion. Admins can restore accounts within the 15-day grace period.
          </p>
        </div>
      </div>

      {/* Metrics Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Pending */}
        <div className="glassmorphism p-6 rounded-3xl border border-white/5 bg-white/1 flex items-center justify-between hover:border-white/10 transition-all duration-200">
          <div className="space-y-1">
            <span className="text-xs text-white/40 font-bold uppercase tracking-wider">Pending Deletions</span>
            <h2 className="text-3xl font-black text-white font-mono">{totalPendingCount}</h2>
            <p className="text-xs text-white/30">Accounts in grace period</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-[#fa48ab] flex items-center justify-center border border-pink-500/20">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Urgent Deletions */}
        <div className="glassmorphism p-6 rounded-3xl border border-white/5 bg-white/1 flex items-center justify-between hover:border-white/10 transition-all duration-200">
          <div className="space-y-1">
            <span className="text-xs text-white/40 font-bold uppercase tracking-wider">Deleting Soon</span>
            <h2 className="text-3xl font-black text-amber-400 font-mono">{urgentCount}</h2>
            <p className="text-xs text-white/30">Less than 3 days remaining</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Next Permanent Deletion */}
        <div className="glassmorphism p-6 rounded-3xl border border-white/5 bg-white/1 flex items-center justify-between hover:border-white/10 transition-all duration-200">
          <div className="space-y-1">
            <span className="text-xs text-white/40 font-bold uppercase tracking-wider">Next Deletion</span>
            <h2 className="text-xl font-black text-red-400 font-sans tracking-tight">{nearestDeletionText}</h2>
            <p className="text-xs text-white/30">Nearest permanent wipeout</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="glassmorphism p-4 rounded-2xl border border-white/5 bg-white/1 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search by name, phone or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-black/30 border border-white/5 focus:border-[#fa48ab]/40 text-sm text-white placeholder-white/20 focus:outline-none transition-all duration-200"
          />
        </div>

        {/* Sort Selector */}
        <div className="flex w-full md:w-auto items-center justify-end gap-3 self-stretch md:self-auto">
          <div className="inline-flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-xl border border-white/5 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-white/40" />
              <span className="text-xs text-white/45 font-semibold">Sort By:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-white/80 font-bold focus:outline-none cursor-pointer"
            >
              <option value="soonest_deletion" className="bg-[#0f0f10] text-white">Soonest Deletion</option>
              <option value="latest_deletion" className="bg-[#0f0f10] text-white">Latest Deletion</option>
              <option value="newest_registration" className="bg-[#0f0f10] text-white">Newest Registered</option>
              <option value="name_asc" className="bg-[#0f0f10] text-white">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="space-y-4">
        {paginatedUsers.length === 0 ? (
          <div className="glassmorphism p-12 rounded-3xl border border-white/5 bg-white/1 text-center space-y-3">
            <Users className="w-12 h-12 text-white/10 mx-auto" />
            <h3 className="font-bold text-lg text-white/70">No Account Deletion Requests Found</h3>
            <p className="text-sm text-white/40 max-w-sm mx-auto">
              No users have requested account deletion matching your current search criteria.
            </p>
          </div>
        ) : (
          paginatedUsers.map((user) => {
            const stats = getGracePeriodStats(user.deleted_at);
            const isLoading = isActionLoading[user.id] || false;
            
            return (
              <div 
                key={user.id}
                className="glassmorphism p-5 rounded-2xl border border-white/5 bg-white/1 hover:border-white/10 transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* 1. User Identity */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <Avatar 
                    src={user.avatar} 
                    name={user.name || user.phone} 
                    size="lg" 
                    className="rounded-xl shrink-0 border border-white/5"
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-white truncate">
                        {user.name || "Setup Pending"}
                      </span>
                      {user.gender && (
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          user.gender === "female" 
                            ? "bg-[#fa48ab]/10 text-[#fa48ab] border border-[#fa48ab]/20" 
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}>
                          {user.gender}
                        </span>
                      )}
                    </div>
                    <span className="block text-xs text-white/40 font-mono">{user.phone}</span>
                    {user.location && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-white/35">
                        <MapPin className="w-3 h-3" />
                        {user.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Deletion Timeline Progress */}
                <div className="flex-1 min-w-[280px] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/30 font-semibold uppercase tracking-wider text-[10px]">Deletion Timeline</span>
                    <span className={`font-mono font-bold flex items-center gap-1 ${
                      stats.urgency === "high" 
                        ? "text-red-400" 
                        : stats.urgency === "medium" 
                          ? "text-amber-400" 
                          : "text-green-400"
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      {stats.text}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-2 w-full rounded-full bg-black/40 border border-white/5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        stats.urgency === "high"
                          ? "bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_8px_rgba(239,68,68,0.3)]"
                          : stats.urgency === "medium"
                            ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                            : "bg-gradient-to-r from-green-500 to-emerald-400"
                      }`}
                      style={{ width: `${stats.percentElapsed}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-[10px] text-white/25 font-semibold">
                    <span>Requested: {formatDateTime(user.deleted_at)}</span>
                    <span>Wipeout: {formatDateTime(user.scheduled_deletion_date)}</span>
                  </div>
                </div>

                {/* 3. Actions Column */}
                <div className="flex items-center gap-4 lg:self-center shrink-0 self-end">
                  <button
                    onClick={() => handleRestore(user.id, user.name, user.phone)}
                    disabled={isLoading}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 ${
                      isLoading 
                        ? "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
                        : "bg-green-500/15 hover:bg-green-500/25 text-green-400 border border-green-500/20 shadow-[0_2px_12px_rgba(34,197,94,0.06)] hover:shadow-[0_4px_16px_rgba(34,197,94,0.12)]"
                    }`}
                  >
                    {isLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <UserCheck className="w-3.5 h-3.5" />
                    )}
                    Restore Account
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/5 pt-6">
          <span className="text-xs text-white/40">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} accounts
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border text-white/60 transition-colors duration-150 ${
                currentPage === 1 
                  ? "border-white/5 bg-white/1 cursor-not-allowed opacity-50" 
                  : "border-white/10 bg-white/5 hover:bg-white/8 hover:text-white"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border text-white/60 transition-colors duration-150 ${
                currentPage === totalPages 
                  ? "border-white/5 bg-white/1 cursor-not-allowed opacity-50" 
                  : "border-white/10 bg-white/5 hover:bg-white/8 hover:text-white"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
