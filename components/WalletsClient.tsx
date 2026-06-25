"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Coins, 
  ShieldAlert, 
  Search, 
  Filter, 
  CheckCircle,
  AlertOctagon,
  XCircle,
  Activity,
  Users,
  ChevronDown,
  ArrowRightLeft
} from "lucide-react";
import Avatar from "@/components/Avatar";

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  type: "credit" | "debit";
  amount: string;
  status: "pending" | "success" | "failed";
  source: "call" | "live" | "reward";
  description: string;
  created_at: string;
  user_id: string;
  phone: string;
  user_name: string | null;
  user_avatar: string | null;
  is_host: boolean;
  is_host_verified: boolean;
}

export interface WalletAnomaly {
  id: string;
  user_id: string;
  user_name: string;
  phone: string;
  amount: string;
  source: string;
  description: string;
  created_at: string;
  user_avatar?: string | null;
}

interface WalletsClientProps {
  initialData: {
    transactions: WalletTransaction[];
    anomalies: WalletAnomaly[];
    metrics: {
      totalCredits: number;
      totalDebits: number;
      anomalyCount: number;
    };
  };
}

export default function WalletsClient({ initialData }: WalletsClientProps) {
  const [mounted, setMounted] = useState(false);
  const [transactions] = useState<WalletTransaction[]>(initialData.transactions);
  const [anomalies] = useState<WalletAnomaly[]>(initialData.anomalies);
  const [metrics] = useState(initialData.metrics);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(100);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, sourceFilter, roleFilter]);

  const toggleGroup = (dateStr: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [dateStr]: !(prev[dateStr] ?? true)
    }));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hydration-safe date/time formatting
  const formatTime = (isoString: string) => {
    if (!isoString) return "N/A";
    if (!mounted) return isoString.split("T")[0];
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Filter internal transactions
  const filteredTransactions = transactions.filter((tx) => {
    const nameStr = (tx.user_name || "").toLowerCase();
    const phoneStr = (tx.phone || "").toLowerCase();
    const descStr = (tx.description || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    // Search Filter
    const matchesSearch = 
      nameStr.includes(query) || 
      phoneStr.includes(query) || 
      descStr.includes(query) ||
      tx.id.toLowerCase().includes(query) ||
      tx.wallet_id.toLowerCase().includes(query);

    // Type Filter (Debit/Credit)
    const matchesType = typeFilter === "all" || tx.type === typeFilter;

    // Source Filter (Call/Live/Reward)
    const matchesSource = sourceFilter === "all" || tx.source === sourceFilter;

    // Role Filter (Client/Host)
    const matchesRole = 
      roleFilter === "all" || 
      (roleFilter === "host" && tx.is_host) || 
      (roleFilter === "client" && !tx.is_host);

    return matchesSearch && matchesType && matchesSource && matchesRole;
  });

  // Group transactions by date beautifully
  const getGroupedTransactions = (items: WalletTransaction[]) => {
    const groups: { [key: string]: WalletTransaction[] } = {};

    items.forEach((tx) => {
      const dateStr = tx.created_at.split("T")[0]; // "YYYY-MM-DD"
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(tx);
    });

    // Sort dates in descending order (newest first)
    return Object.keys(groups)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((dateStr) => {
        const dateObj = new Date(dateStr);
        const todayStr = new Date().toISOString().split("T")[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        let displayDate = "";
        if (dateStr === todayStr) {
          displayDate = "Today";
        } else if (dateStr === yesterdayStr) {
          displayDate = "Yesterday";
        } else {
          displayDate = dateObj.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }

        return {
          dateStr,
          displayDate,
          items: groups[dateStr],
        };
      });
  };

  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="font-heading font-black text-3xl text-white tracking-tight">
            Internal Wallet Auditing
          </h1>
          <p className="text-sm text-white/40">
            Track credit deductions (call billing) and credit distributions (host earnings & rewards) within the platform.
          </p>
        </div>
      </div>

      {/* Security Anomalies Banner (Hosts Charged for outbound interactions) */}
      {anomalies.length > 0 && (
        <div className="p-5 rounded-3xl bg-red-500/10 border border-red-500/20 space-y-4 shadow-[0_4px_20px_rgba(239,68,68,0.08)]">
          <div className="flex items-center gap-2 text-red-400">
            <AlertOctagon className="w-5 h-5 animate-bounce" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Critical Security Anomalies Detected ({anomalies.length})</h3>
          </div>
          <p className="text-xs text-red-200/70 leading-relaxed">
            The following hosts have been debited for outgoing calls or interactions. Hosts should only receive credits (earnings), never debits. This indicates a potential billing route bug.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {anomalies.map((anomaly) => (
              <div key={anomaly.id} className="p-3.5 rounded-2xl bg-black/40 border border-red-500/15 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar src={anomaly.user_avatar} name={anomaly.user_name} size="sm" className="rounded-lg" />
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-white truncate">{anomaly.user_name}</span>
                    <span className="block text-[10px] text-white/40 font-mono">{anomaly.phone}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="block text-xs font-black text-red-400 font-mono">-{parseFloat(anomaly.amount).toFixed(0)} Cr</span>
                  <span className="block text-[9px] text-white/30 uppercase font-semibold">{anomaly.source} billing bug</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Core Wallet Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Total Credits Charged (Debits) */}
        <div className="glassmorphism p-6 rounded-3xl border border-white/5 bg-white/1 flex items-center justify-between hover:border-white/10 transition-all duration-200">
          <div className="space-y-1">
            <span className="text-xs text-white/40 font-bold uppercase tracking-wider">Credits Billed</span>
            <h2 className="text-3xl font-black text-red-400 font-mono">{metrics.totalDebits.toFixed(0)} <span className="text-sm font-bold">Cr</span></h2>
            <p className="text-xs text-white/30">Total client call deductions</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Total Credits Distributed (Credits) */}
        <div className="glassmorphism p-6 rounded-3xl border border-white/5 bg-white/1 flex items-center justify-between hover:border-white/10 transition-all duration-200">
          <div className="space-y-1">
            <span className="text-xs text-white/40 font-bold uppercase tracking-wider">Credits Distributed</span>
            <h2 className="text-3xl font-black text-green-400 font-mono">{metrics.totalCredits.toFixed(0)} <span className="text-sm font-bold">Cr</span></h2>
            <p className="text-xs text-white/30">Host earnings & rewards paid</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-400 flex items-center justify-center border border-green-500/20">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Circulation Balance */}
        <div className="glassmorphism p-6 rounded-3xl border border-white/5 bg-white/1 flex items-center justify-between hover:border-white/10 transition-all duration-200">
          <div className="space-y-1">
            <span className="text-xs text-white/40 font-bold uppercase tracking-wider">Net Circulation</span>
            <h2 className="text-3xl font-black text-[#fa48ab] font-mono">
              {Math.abs(metrics.totalDebits - metrics.totalCredits).toFixed(0)} <span className="text-sm font-bold">Cr</span>
            </h2>
            <p className="text-xs text-white/30">Credit movement volume</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-[#fa48ab] flex items-center justify-center border border-pink-500/20">
            <Coins className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filtering & Search Controls */}
      <div className="glassmorphism p-4 rounded-2xl border border-white/5 bg-white/1 flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:max-w-md shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search by user, phone, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-black/30 border border-white/5 focus:border-[#fa48ab]/40 text-sm text-white placeholder-white/20 focus:outline-none transition-all duration-200"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap w-full lg:w-auto items-center justify-end gap-3 self-stretch lg:self-auto">
          {/* Type Filter */}
          <div className="inline-flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-xl border border-white/5 shrink-0">
            <Coins className="w-3.5 h-3.5 text-white/40" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-xs text-white/75 focus:outline-none cursor-pointer font-bold"
            >
              <option value="all" className="bg-[#0f0f10] text-white">All Types</option>
              <option value="debit" className="bg-[#0f0f10] text-white">Deduction (Debit)</option>
              <option value="credit" className="bg-[#0f0f10] text-white">Earning (Credit)</option>
            </select>
          </div>

          {/* Source Filter */}
          <div className="inline-flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-xl border border-white/5 shrink-0">
            <ArrowRightLeft className="w-3.5 h-3.5 text-white/40" />
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-transparent text-xs text-white/75 focus:outline-none cursor-pointer font-bold"
            >
              <option value="all" className="bg-[#0f0f10] text-white">All Sources</option>
              <option value="call" className="bg-[#0f0f10] text-white">Call Billings</option>
              <option value="live" className="bg-[#0f0f10] text-white">Live Billings</option>
              <option value="reward" className="bg-[#0f0f10] text-white">System Rewards</option>
            </select>
          </div>

          {/* Role Filter */}
          <div className="inline-flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-xl border border-white/5 shrink-0">
            <Users className="w-3.5 h-3.5 text-white/40" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-xs text-white/75 focus:outline-none cursor-pointer font-bold"
            >
              <option value="all" className="bg-[#0f0f10] text-white">All Roles</option>
              <option value="client" className="bg-[#0f0f10] text-white">Clients (Callers)</option>
              <option value="host" className="bg-[#0f0f10] text-white">Hosts (Receivers)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List Grouped by Date */}
      <div className="space-y-6">
        {getGroupedTransactions(paginatedTransactions).map((group) => {
          const isExpanded = expandedGroups[group.dateStr] ?? true;
          return (
            <div key={group.dateStr} className="glassmorphism p-6 rounded-3xl border border-white/5 space-y-4">
              {/* Group Header */}
              <div 
                onClick={() => toggleGroup(group.dateStr)}
                className="flex items-center justify-between pb-3 border-b border-white/5 cursor-pointer select-none group/header"
              >
                <div className="flex items-center gap-2.5">
                  <h3 className="font-heading font-black text-lg text-white/95 group-hover/header:text-white transition-colors duration-150">
                    {group.displayDate}
                  </h3>
                  <span className="text-[10px] bg-white/5 border border-white/10 text-white/50 px-2.5 py-0.5 rounded-full font-bold">
                    {group.items.length} transaction(s)
                  </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-white/30 group-hover/header:text-white/60 transition-transform duration-200 ${
                  isExpanded ? "transform rotate-180" : ""
                }`} />
              </div>

              {/* Group Body */}
              {isExpanded && (
                <div className="grid grid-cols-1 gap-3.5 pt-1">
                  {group.items.map((tx) => {
                    const isDebit = tx.type === "debit";
                    
                    return (
                      <div 
                        key={tx.id}
                        className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-white/[0.01] ${
                          tx.status === "failed" 
                            ? "bg-red-950/[0.05] border-red-500/10" 
                            : tx.status === "pending"
                              ? "bg-amber-950/[0.05] border-amber-500/10"
                              : "bg-white/1 border-white/5"
                        }`}
                      >
                        {/* 1. User Info & Visual Indicator */}
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          {/* Visual Indicator Capsule */}
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                            isDebit 
                              ? "bg-red-500/10 text-red-400 border-red-500/20" 
                              : "bg-green-500/10 text-green-400 border-green-500/20"
                          }`}>
                            {isDebit ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                          </div>

                          <Avatar src={tx.user_avatar} name={tx.user_name || tx.phone} size="md" className="rounded-xl border border-white/5" />
                          
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white truncate">
                                {tx.user_name || "Setup Pending"}
                              </span>
                              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                tx.is_host 
                                  ? "bg-[#fa48ab]/15 text-[#fa48ab] border border-[#fa48ab]/20" 
                                  : "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                              }`}>
                                {tx.is_host ? "Host" : "Client"}
                              </span>
                            </div>
                            <span className="block text-[11px] text-white/40 font-mono">{tx.phone}</span>
                          </div>
                        </div>

                        {/* 2. Transaction Description */}
                        <div className="flex-[1.5] min-w-0 md:px-2 space-y-1">
                          <p className="text-xs text-white/85 font-semibold leading-normal">
                            {tx.description}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-white/30 font-semibold uppercase">
                            <span>Source: {tx.source}</span>
                            <span>•</span>
                            <span>Wallet: {tx.wallet_id.substring(0, 8)}...</span>
                          </div>
                        </div>

                        {/* 3. Transaction Details (Credits & Status) */}
                        <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t border-white/5 pt-3 md:border-t-0 md:pt-0">
                          {/* Time */}
                          <span className="text-[11px] text-white/30 font-semibold font-mono md:text-right">
                            {formatTime(tx.created_at)}
                          </span>

                          {/* Credits Amount */}
                          <div className="text-right min-w-[80px]">
                            <span className={`block text-sm font-black font-mono ${
                              isDebit ? "text-red-400" : "text-green-400"
                            }`}>
                              {isDebit ? "-" : "+"}{parseFloat(tx.amount).toFixed(0)} Cr
                            </span>
                            
                            {/* Status badge */}
                            <span className={`inline-block text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md mt-1 ${
                              tx.status === "success"
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : tx.status === "pending"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}>
                              {tx.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/5 pt-6">
          <span className="text-xs text-white/40">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} transactions
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
