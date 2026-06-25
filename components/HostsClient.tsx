"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  UserCheck, 
  UserX, 
  Download, 
  MapPin, 
  Phone, 
  DollarSign, 
  Calendar, 
  ArrowUpDown, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Users,
  Percent,
  Check,
  X,
  CreditCard
} from "lucide-react";
import Avatar from "./Avatar";
import { verifyHostAction, toggleBlockUserAction } from "@/app/actions/admin";

export interface HostClientData {
  id: string; // user_id
  phone: string;
  created_at: string;
  is_blocked: boolean;
  name: string | null;
  avatar: string | null;
  gender: string | null;
  location: string | null;
  language: string | null;
  balance: string | number | null;
  // Host employee specific details
  host_id: string;
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

interface HostsClientProps {
  initialData: HostClientData[];
}

export default function HostsClient({ initialData }: HostsClientProps) {
  const [hosts, setHosts] = useState<HostClientData[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isActionLoading, setIsActionLoading] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, verificationFilter, locationFilter, sortBy]);

  // Extract unique locations for filtering
  const locations = Array.from(
    new Set(
      initialData
        .map((h) => h.location)
        .filter((loc): loc is string => !!loc)
    )
  ).sort();

  // Handle host verification approval/rejection
  const handleVerifyHost = async (hostId: string, userId: string, verify: boolean) => {
    setIsActionLoading((prev) => ({ ...prev, [hostId]: true }));
    try {
      const result = await verifyHostAction(hostId, verify, userId);
      if (result.success) {
        setHosts((prev) =>
          prev.map((h) => (h.host_id === hostId ? { ...h, is_verified: verify } : h))
        );
      } else {
        alert(result.error || "Failed to update host verification status");
      }
    } catch (err) {
      console.error("Verification action failed:", err);
      alert("An unexpected error occurred");
    } finally {
      setIsActionLoading((prev) => ({ ...prev, [hostId]: false }));
    }
  };

  // Handle block/unblock host (from user model)
  const handleToggleBlock = async (userId: string, currentBlockStatus: boolean) => {
    setIsActionLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      const result = await toggleBlockUserAction(userId, !currentBlockStatus);
      if (result.success) {
        setHosts((prev) =>
          prev.map((h) => (h.id === userId ? { ...h, is_blocked: !currentBlockStatus } : h))
        );
      } else {
        alert(result.error || "Failed to update block status");
      }
    } catch (err) {
      console.error("Block action failed:", err);
      alert("An unexpected error occurred");
    } finally {
      setIsActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Filter and Sort Logic
  const filteredHosts = hosts.filter((host) => {
    const nameStr = host.full_name || host.name || "";
    const phoneStr = host.phone || "";
    const aadharStr = host.aadhar_number || "";
    const searchLower = searchQuery.toLowerCase();

    const matchesSearch =
      nameStr.toLowerCase().includes(searchLower) ||
      phoneStr.includes(searchLower) ||
      aadharStr.includes(searchLower) ||
      host.id.includes(searchLower);

    const matchesVerification =
      verificationFilter === "all" ||
      (verificationFilter === "verified" && host.is_verified) ||
      (verificationFilter === "pending" && !host.is_verified);

    const matchesLocation =
      locationFilter === "all" || host.location === locationFilter;

    return matchesSearch && matchesVerification && matchesLocation;
  });

  // Sorting
  const sortedHosts = [...filteredHosts].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortBy === "earnings_desc") {
      return parseFloat(String(b.total_earnings || 0)) - parseFloat(String(a.total_earnings || 0));
    }
    if (sortBy === "earning_rate_desc") {
      return parseFloat(String(b.earning_rate_percent || 0)) - parseFloat(String(a.earning_rate_percent || 0));
    }
    if (sortBy === "pending_first") {
      return (a.is_verified ? 1 : 0) - (b.is_verified ? 1 : 0);
    }
    if (sortBy === "name_asc") {
      return (a.full_name || "").localeCompare(b.full_name || "");
    }
    return 0;
  });

  // Metrics
  const totalHostsCount = hosts.length;
  const verifiedHostsCount = hosts.filter((h) => h.is_verified).length;
  const pendingVerificationCount = hosts.filter((h) => !h.is_verified).length;
  const totalHostEarnings = hosts.reduce(
    (acc, h) => acc + parseFloat(String(h.total_earnings || 0)),
    0
  );

  // Pagination Math
  const totalItems = sortedHosts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedHosts = sortedHosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Host ID", "Phone", "Full Name", "Aadhar", "UPI ID", 
      "Bank Account", "IFSC", "Earning Rate %", "Total Earnings", 
      "Verification Status", "Block Status", "Register Date"
    ];
    const rows = sortedHosts.map((h) => [
      h.host_id,
      h.phone,
      h.full_name,
      h.aadhar_number,
      h.upi_id || "N/A",
      h.bank_account_number || "N/A",
      h.ifsc_code || "N/A",
      h.earning_rate_percent,
      h.total_earnings || "0.00",
      h.is_verified ? "Verified" : "Pending",
      h.is_blocked ? "Blocked" : "Active",
      new Date(h.created_at).toLocaleDateString("en-US")
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Twinning_Female_Hosts_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Safe formatting helpers
  const formatDate = (isoStr: string) => {
    if (!mounted) return "";
    return new Date(isoStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAadhar = (aadhar: string) => {
    if (!aadhar) return "N/A";
    if (aadhar.length === 12) {
      return `•••• •••• ${aadhar.slice(-4)}`;
    }
    return aadhar;
  };

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-heading">
            Manage Female Clients (Hosts)
          </h1>
          <p className="text-white/45 text-sm mt-1">
            Audit performer credentials, payouts, verify profiles, and configure payout commission parameters
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff2a7f] hover:bg-[#e01b6c] text-white text-xs font-bold shadow-lg shadow-pink-500/10 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Download className="w-4 h-4" />
          Export Hosts Directory
        </button>
      </div>

      {/* Host Overview Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glassmorphism p-5 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-300 text-[#ff2a7f]">
            <Users className="w-20 h-20" />
          </div>
          <p className="text-xs font-semibold text-white/45 uppercase tracking-wider">Total Female Hosts</p>
          <h3 className="text-2xl font-bold text-white mt-2 font-heading">{totalHostsCount}</h3>
          <p className="text-white/30 text-[10px] mt-1">Registered female employee profiles</p>
        </div>

        <div className="glassmorphism p-5 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-300 text-emerald-400">
            <ShieldCheck className="w-20 h-20" />
          </div>
          <p className="text-xs font-semibold text-white/45 uppercase tracking-wider">Verified Hosts</p>
          <h3 className="text-2xl font-bold text-emerald-400 mt-2 font-heading">{verifiedHostsCount}</h3>
          <p className="text-emerald-400/30 text-[10px] mt-1">Audit complete and verified profiles</p>
        </div>

        <div className="glassmorphism p-5 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-300 text-amber-400">
            <ShieldAlert className="w-20 h-20" />
          </div>
          <p className="text-xs font-semibold text-white/45 uppercase tracking-wider">Pending Verifications</p>
          <h3 className="text-2xl font-bold text-amber-400 mt-2 font-heading">{pendingVerificationCount}</h3>
          <p className="text-amber-400/30 text-[10px] mt-1">Hosts awaiting credential approvals</p>
        </div>

        <div className="glassmorphism p-5 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-300 text-indigo-400">
            <DollarSign className="w-20 h-20" />
          </div>
          <p className="text-xs font-semibold text-white/45 uppercase tracking-wider">Accumulated Host Earnings</p>
          <h3 className="text-2xl font-bold text-indigo-400 mt-2 font-heading">
            ₹{totalHostEarnings.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p className="text-indigo-400/30 text-[10px] mt-1">Platform-wide total hosts payout capital</p>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="glassmorphism p-6 rounded-3xl border border-white/5 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search hosts by name, phone, Aadhar, or UUID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/3 border border-white/5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#ff2a7f]/45 focus:ring-1 focus:ring-[#ff2a7f]/20 transition-all duration-200"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Verification status */}
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-white/80 text-xs focus:outline-none focus:border-[#ff2a7f]/45 cursor-pointer hover:bg-white/10 transition-all duration-200"
            >
              <option value="all" className="bg-[#0f0f10]">All Verification Status</option>
              <option value="verified" className="bg-[#0f0f10]">Verified Only</option>
              <option value="pending" className="bg-[#0f0f10]">Pending Only</option>
            </select>

            {/* Location */}
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-white/80 text-xs focus:outline-none focus:border-[#ff2a7f]/45 cursor-pointer hover:bg-white/10 transition-all duration-200"
            >
              <option value="all" className="bg-[#0f0f10]">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc} className="bg-[#0f0f10]">
                  {loc}
                </option>
              ))}
            </select>

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 border border-[#ff2a7f]/20 rounded-xl px-3 py-2 text-[#ff2a7f] text-xs font-bold focus:outline-none focus:border-[#ff2a7f]/45 cursor-pointer hover:bg-white/10 transition-all duration-200"
            >
              <option value="newest" className="bg-[#0f0f10]">Sort: Newest Profile</option>
              <option value="earnings_desc" className="bg-[#0f0f10]">Sort: Highest Earnings</option>
              <option value="earning_rate_desc" className="bg-[#0f0f10]">Sort: Highest Earning Rate</option>
              <option value="pending_first" className="bg-[#0f0f10]">Sort: Verification Pending First</option>
              <option value="name_asc" className="bg-[#0f0f10]">Sort: Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Clear filters trigger */}
        {(searchQuery || verificationFilter !== "all" || locationFilter !== "all") && (
          <div className="flex justify-end pt-1">
            <button
              onClick={() => {
                setSearchQuery("");
                setVerificationFilter("all");
                setLocationFilter("all");
              }}
              className="text-xs text-[#ff2a7f] hover:underline font-semibold"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </div>

      {/* Host Cards Display */}
      <div className="space-y-4">
        {paginatedHosts.map((host) => {
          const totalEarnings = parseFloat(String(host.total_earnings || 0));
          const isToday =
            mounted &&
            new Date(host.created_at).toDateString() === new Date().toDateString();

          return (
            <div
              key={host.id}
              className={`glassmorphism p-5 rounded-3xl border transition-all duration-300 flex flex-col xl:flex-row xl:items-center justify-between gap-5 relative group ${
                isToday
                  ? "border-[#ff2a7f]/30 bg-[#ff2a7f]/[0.02] hover:bg-[#ff2a7f]/[0.04]"
                  : "border-white/5 hover:border-white/10 hover:bg-white/[0.01]"
              } ${!host.is_verified ? "border-amber-500/20 bg-amber-500/[0.005]" : ""} ${host.is_blocked ? "opacity-70" : ""}`}
            >
              {/* Profile Details Area */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                <div className="relative">
                  <Avatar
                    avatarKey={host.avatar}
                    gender="female"
                    className={`w-16 h-16 rounded-2xl border-2 shadow-inner transition-transform duration-300 group-hover:scale-105 ${
                      !host.is_verified
                        ? "border-amber-500/50"
                        : "border-[#ff2a7f]"
                    }`}
                  />
                  {!host.is_verified && (
                    <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5 border border-black" title="Verification Pending">
                      <ShieldAlert className="w-3.5 h-3.5 text-black" />
                    </div>
                  )}
                  {host.is_verified && (
                    <div className="absolute -top-1 -right-1 bg-[#ff2a7f] rounded-full p-0.5 border border-black" title="Verified Host">
                      <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-white font-bold text-base truncate">
                      {host.full_name || host.name || "Anonymous Host"}
                    </h4>
                    {host.bio && (
                      <span className="text-[10px] text-[#ff2a7f] italic bg-[#ff2a7f]/5 px-2 py-0.5 rounded-full max-w-[120px] truncate">
                        "{host.bio}"
                      </span>
                    )}
                    {host.is_blocked && (
                      <span className="text-[9px] font-extrabold text-rose-400 bg-rose-950/40 border border-rose-500/20 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                        Blocked User
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/45">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-white/30" />
                      {host.phone}
                    </span>
                    {host.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-white/30" />
                        {host.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-white/30" />
                      Registered {formatDate(host.created_at)}
                    </span>
                  </div>

                  {/* Credentials / Bank Accounts details snippet */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-white/30 font-semibold pt-1">
                    <span>Aadhar: {formatAadhar(host.aadhar_number)}</span>
                    {host.upi_id && <span>UPI: <code className="text-[#ff2a7f]/60">{host.upi_id}</code></span>}
                    {host.bank_account_number && <span>Bank A/C: ••••{host.bank_account_number.slice(-4)}</span>}
                  </div>
                </div>
              </div>

              {/* Earnings, Earning Rate & Actions */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between xl:justify-end gap-6 border-t xl:border-t-0 pt-4 xl:pt-0 border-white/5">
                
                {/* Commission Rate */}
                <div className="space-y-0.5">
                  <p className="text-[9px] text-white/30 font-semibold uppercase tracking-wider flex items-center gap-0.5">
                    <Percent className="w-2.5 h-2.5 text-white/30" /> Earning Share
                  </p>
                  <h5 className="text-xs font-bold text-white/80">
                    {parseFloat(String(host.earning_rate_percent))}%
                  </h5>
                </div>

                {/* Total Payout Accumulation */}
                <div className="space-y-0.5">
                  <p className="text-[9px] text-white/30 font-semibold uppercase tracking-wider">Total Earnings</p>
                  <h4 className="text-base font-bold text-indigo-400 font-heading">
                    ₹{totalEarnings.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </h4>
                </div>

                {/* Verification & Block Action Buttons */}
                <div className="flex items-center gap-2">
                  
                  {/* Detailed profile audit link */}
                  <Link
                    href={`/admin/users/${host.id}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/5 transition-all duration-200"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Audit</span>
                  </Link>

                  {/* Verification Quick Action */}
                  {!host.is_verified ? (
                    <button
                      onClick={() => handleVerifyHost(host.host_id, host.id, true)}
                      disabled={isActionLoading[host.host_id]}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold transition-all duration-200 disabled:opacity-30"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Verify Host</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleVerifyHost(host.host_id, host.id, false)}
                      disabled={isActionLoading[host.host_id]}
                      className="flex items-center justify-center p-2 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 text-white/60 hover:text-rose-400 transition-all duration-200 disabled:opacity-30"
                      title="Revoke Verification"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {/* Block / Unblock Toggle */}
                  <button
                    onClick={() => handleToggleBlock(host.id, host.is_blocked)}
                    disabled={isActionLoading[host.id]}
                    className={`flex items-center justify-center p-2 rounded-xl border transition-all duration-200 ${
                      host.is_blocked
                        ? "bg-emerald-950/20 hover:bg-emerald-950/40 border-emerald-500/20 text-emerald-400"
                        : "bg-rose-950/20 hover:bg-rose-950/40 border-rose-500/20 text-rose-500"
                    } disabled:opacity-30`}
                    title={host.is_blocked ? "Unblock Host User" : "Block Host User"}
                  >
                    {host.is_blocked ? (
                      <UserCheck className="w-4 h-4" />
                    ) : (
                      <UserX className="w-4 h-4" />
                    )}
                  </button>

                </div>
              </div>
            </div>
          );
        })}

        {sortedHosts.length === 0 && (
          <div className="glassmorphism p-16 rounded-3xl border border-white/5 text-center text-white/30 italic">
            No female hosts match your filtering criteria
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/5 text-xs text-white/45 font-semibold">
          <div className="flex items-center gap-3">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white/5 border border-white/5 rounded-lg px-2.5 py-1 text-white focus:outline-none cursor-pointer"
            >
              <option value={50} className="bg-[#0f0f10]">50 rows</option>
              <option value={100} className="bg-[#0f0f10]">100 rows</option>
              <option value={200} className="bg-[#0f0f10]">200 rows</option>
            </select>
            <span>
              Showing {Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)} to{" "}
              {Math.min(totalItems, currentPage * itemsPerPage)} of {totalItems} entries
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 text-white disabled:opacity-30 disabled:hover:bg-white/3 transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, index, array) => {
                  const showEllipsis = index > 0 && p - array[index - 1] > 1;
                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && <span className="px-1.5 opacity-30">...</span>}
                      <button
                        onClick={() => setCurrentPage(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                          currentPage === p
                            ? "bg-[#ff2a7f] text-white"
                            : "bg-white/3 text-white/60 hover:bg-white/5"
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 text-white disabled:opacity-30 disabled:hover:bg-white/3 transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
