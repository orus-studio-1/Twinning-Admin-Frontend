"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  UserX, 
  UserCheck, 
  Download, 
  MapPin, 
  Phone, 
  DollarSign, 
  Calendar, 
  ArrowUpDown, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Users
} from "lucide-react";
import Avatar from "./Avatar";
import { toggleBlockUserAction } from "@/app/actions/admin";

export interface UserClientData {
  id: string;
  phone: string;
  created_at: string;
  is_blocked: boolean;
  name: string | null;
  avatar: string | null;
  gender: string | null;
  location: string | null;
  language: string | null;
  balance: string | number | null;
}

interface UsersClientProps {
  initialData: UserClientData[];
}

export default function UsersClient({ initialData }: UsersClientProps) {
  const [users, setUsers] = useState<UserClientData[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [balanceFilter, setBalanceFilter] = useState("all");
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
  }, [searchQuery, statusFilter, locationFilter, balanceFilter, sortBy]);

  // Extract unique locations for filtering
  const locations = Array.from(
    new Set(
      initialData
        .map((u) => u.location)
        .filter((loc): loc is string => !!loc)
    )
  ).sort();

  // Handle block/unblock user
  const handleToggleBlock = async (userId: string, currentBlockStatus: boolean) => {
    setIsActionLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      const result = await toggleBlockUserAction(userId, !currentBlockStatus);
      if (result.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, is_blocked: !currentBlockStatus } : u))
        );
      } else {
        alert(result.error || "Failed to update user block status");
      }
    } catch (err) {
      console.error("Block action failed:", err);
      alert("An unexpected error occurred");
    } finally {
      setIsActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Filter and Sort Logic
  const filteredUsers = users.filter((user) => {
    const nameStr = user.name || "";
    const phoneStr = user.phone || "";
    const searchLower = searchQuery.toLowerCase();
    
    // Search Filter
    const matchesSearch =
      nameStr.toLowerCase().includes(searchLower) ||
      phoneStr.includes(searchLower) ||
      user.id.includes(searchLower);

    // Status Filter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "blocked" && user.is_blocked) ||
      (statusFilter === "active" && !user.is_blocked);

    // Location Filter
    const matchesLocation =
      locationFilter === "all" || user.location === locationFilter;

    // Balance Filter
    const balance = parseFloat(String(user.balance || 0));
    const matchesBalance =
      balanceFilter === "all" ||
      (balanceFilter === "has_balance" && balance > 0) ||
      (balanceFilter === "zero_balance" && balance === 0);

    return matchesSearch && matchesStatus && matchesLocation && matchesBalance;
  });

  // Sorting
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortBy === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    if (sortBy === "balance_desc") {
      return parseFloat(String(b.balance || 0)) - parseFloat(String(a.balance || 0));
    }
    if (sortBy === "balance_asc") {
      return parseFloat(String(a.balance || 0)) - parseFloat(String(b.balance || 0));
    }
    if (sortBy === "name_asc") {
      return (a.name || "").localeCompare(b.name || "");
    }
    return 0;
  });

  // Metrics
  const totalUsersCount = users.length;
  const activeUsersCount = users.filter((u) => !u.is_blocked).length;
  const blockedUsersCount = users.filter((u) => u.is_blocked).length;
  const totalWalletBalance = users.reduce(
    (acc, u) => acc + parseFloat(String(u.balance || 0)),
    0
  );

  // Pagination Math
  const totalItems = sortedUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["User ID", "Phone", "Name", "Location", "Gender", "Language", "Wallet Balance", "Block Status", "Join Date"];
    const rows = sortedUsers.map((u) => [
      u.id,
      u.phone,
      u.name || "N/A",
      u.location || "N/A",
      u.gender || "N/A",
      u.language || "N/A",
      u.balance || "0.00",
      u.is_blocked ? "Blocked" : "Active",
      new Date(u.created_at).toLocaleDateString("en-US")
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Twinning_Clients_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Hydration Safe Formatting Helper
  const formatDate = (isoStr: string) => {
    if (!mounted) return "";
    return new Date(isoStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-heading">
            Manage Clients
          </h1>
          <p className="text-white/45 text-sm mt-1">
            Audit and moderate regular platform client registrations, balances, and profiles
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff2a7f] hover:bg-[#e01b6c] text-white text-xs font-bold shadow-lg shadow-pink-500/10 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Download className="w-4 h-4" />
          Export Client Directory
        </button>
      </div>

      {/* Client Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glassmorphism p-5 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-300 text-[#ff2a7f]">
            <Users className="w-20 h-20" />
          </div>
          <p className="text-xs font-semibold text-white/45 uppercase tracking-wider">Total Clients</p>
          <h3 className="text-2xl font-bold text-white mt-2 font-heading">{totalUsersCount}</h3>
          <p className="text-white/30 text-[10px] mt-1">Registered non-employee accounts</p>
        </div>

        <div className="glassmorphism p-5 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-300 text-emerald-400">
            <UserCheck className="w-20 h-20" />
          </div>
          <p className="text-xs font-semibold text-white/45 uppercase tracking-wider">Active Clients</p>
          <h3 className="text-2xl font-bold text-emerald-400 mt-2 font-heading">{activeUsersCount}</h3>
          <p className="text-emerald-400/30 text-[10px] mt-1">Accounts with active access</p>
        </div>

        <div className="glassmorphism p-5 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-300 text-rose-500">
            <ShieldAlert className="w-20 h-20" />
          </div>
          <p className="text-xs font-semibold text-white/45 uppercase tracking-wider">Blocked Clients</p>
          <h3 className="text-2xl font-bold text-rose-500 mt-2 font-heading">{blockedUsersCount}</h3>
          <p className="text-rose-500/30 text-[10px] mt-1">Accounts suspended by moderation</p>
        </div>

        <div className="glassmorphism p-5 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-300 text-amber-400">
            <DollarSign className="w-20 h-20" />
          </div>
          <p className="text-xs font-semibold text-white/45 uppercase tracking-wider">Deposited Wallet Capital</p>
          <h3 className="text-2xl font-bold text-amber-400 mt-2 font-heading">
            ₹{totalWalletBalance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p className="text-amber-400/30 text-[10px] mt-1">Sum of all client wallet balances</p>
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
              placeholder="Search clients by name, phone, or UUID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/3 border border-white/5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#ff2a7f]/45 focus:ring-1 focus:ring-[#ff2a7f]/20 transition-all duration-200"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-white/80 text-xs focus:outline-none focus:border-[#ff2a7f]/45 cursor-pointer hover:bg-white/10 transition-all duration-200"
            >
              <option value="all" className="bg-[#0f0f10]">All Statuses</option>
              <option value="active" className="bg-[#0f0f10]">Active Only</option>
              <option value="blocked" className="bg-[#0f0f10]">Blocked Only</option>
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

            {/* Wallet Balance */}
            <select
              value={balanceFilter}
              onChange={(e) => setBalanceFilter(e.target.value)}
              className="bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-white/80 text-xs focus:outline-none focus:border-[#ff2a7f]/45 cursor-pointer hover:bg-white/10 transition-all duration-200"
            >
              <option value="all" className="bg-[#0f0f10]">All Balances</option>
              <option value="has_balance" className="bg-[#0f0f10]">With Balance (₹ &gt; 0)</option>
              <option value="zero_balance" className="bg-[#0f0f10]">Empty Wallet (₹0)</option>
            </select>

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 border border-[#ff2a7f]/20 rounded-xl px-3 py-2 text-[#ff2a7f] text-xs font-bold focus:outline-none focus:border-[#ff2a7f]/45 cursor-pointer hover:bg-white/10 transition-all duration-200"
            >
              <option value="newest" className="bg-[#0f0f10]">Sort: Newest Signup</option>
              <option value="oldest" className="bg-[#0f0f10]">Sort: Oldest Signup</option>
              <option value="balance_desc" className="bg-[#0f0f10]">Sort: Highest Balance</option>
              <option value="balance_asc" className="bg-[#0f0f10]">Sort: Lowest Balance</option>
              <option value="name_asc" className="bg-[#0f0f10]">Sort: Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Clear filters trigger */}
        {(searchQuery || statusFilter !== "all" || locationFilter !== "all" || balanceFilter !== "all") && (
          <div className="flex justify-end pt-1">
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setLocationFilter("all");
                setBalanceFilter("all");
              }}
              className="text-xs text-[#ff2a7f] hover:underline font-semibold"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </div>

      {/* Client Cards Display */}
      <div className="space-y-4">
        {paginatedUsers.map((user) => {
          const balance = parseFloat(String(user.balance || 0));
          const isToday =
            mounted &&
            new Date(user.created_at).toDateString() === new Date().toDateString();

          return (
            <div
              key={user.id}
              className={`glassmorphism p-5 rounded-3xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-5 relative group ${
                isToday
                  ? "border-[#ff2a7f]/30 bg-[#ff2a7f]/[0.02] hover:bg-[#ff2a7f]/[0.04] shadow-md shadow-pink-500/[0.03]"
                  : "border-white/5 hover:border-white/10 hover:bg-white/[0.01]"
              } ${user.is_blocked ? "opacity-75" : ""}`}
            >
              {/* Left Side: Profile info */}
              <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                  <Avatar
                    src={user.avatar}
                    name={user.name || user.phone}
                    className={`w-14 h-14 rounded-2xl border-2 shadow-inner transition-transform duration-300 group-hover:scale-105 ${
                      isToday
                        ? "border-[#ff2a7f]"
                        : user.is_blocked
                        ? "border-rose-500/40"
                        : "border-white/10"
                    }`}
                  />
                  {user.is_blocked && (
                    <div className="absolute -top-1 -right-1 bg-rose-600 rounded-full p-0.5 border border-black">
                      <ShieldAlert className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-bold text-base truncate">
                      {user.name || "Anonymous User"}
                    </h4>
                    {isToday && (
                      <span className="text-[9px] font-extrabold text-white bg-[#ff2a7f] px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                        New Today
                      </span>
                    )}
                    {user.is_blocked && (
                      <span className="text-[9px] font-extrabold text-rose-400 bg-rose-950/40 border border-rose-500/20 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                        Blocked
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/45">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-white/30" />
                      {user.phone}
                    </span>
                    {user.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-white/30" />
                        {user.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-white/30" />
                      Joined {formatDate(user.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Wallet details & Moderation tools */}
              <div className="flex flex-row sm:items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                {/* Financial overview */}
                <div className="text-left md:text-right space-y-0.5">
                  <p className="text-[10px] text-white/30 font-semibold uppercase tracking-wider">Wallet Balance</p>
                  <h4 className={`text-base font-bold font-heading ${
                    balance > 0 ? "text-emerald-400" : "text-white/30"
                  }`}>
                    ₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </h4>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5">
                  {/* View Descriptive Profile */}
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/5 transition-all duration-200"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Audit Details</span>
                  </Link>

                  {/* Block / Unblock Toggle */}
                  <button
                    onClick={() => handleToggleBlock(user.id, user.is_blocked)}
                    disabled={isActionLoading[user.id]}
                    className={`flex items-center justify-center p-2 rounded-xl border transition-all duration-200 ${
                      user.is_blocked
                        ? "bg-emerald-950/20 hover:bg-emerald-950/40 border-emerald-500/20 text-emerald-400"
                        : "bg-rose-950/20 hover:bg-rose-950/40 border-rose-500/20 text-rose-500"
                    } disabled:opacity-30`}
                    title={user.is_blocked ? "Unblock User" : "Block User"}
                  >
                    {user.is_blocked ? (
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

        {sortedUsers.length === 0 && (
          <div className="glassmorphism p-16 rounded-3xl border border-white/5 text-center text-white/30 italic">
            No registered clients match your filtering criteria
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
