"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Coins, 
  ShieldAlert, 
  Search, 
  Download, 
  Filter, 
  CheckCircle,
  AlertOctagon,
  XCircle,
  HelpCircle,
  TrendingUp,
  Users,
  ChevronDown
} from "lucide-react";
import Avatar from "@/components/Avatar";

export interface Transaction {
  id: string;
  wallet_id: string;
  type: "credit" | "debit";
  amount: string;
  status: "pending" | "success" | "failed";
  source: "call" | "live" | "recharge" | "reward" | "withdrawal";
  description: string;
  created_at: string;
  user_id: string;
  phone: string;
  user_name: string | null;
  user_avatar: string | null;
  is_host: boolean;
  is_host_verified: boolean;
}

export interface Anomaly {
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

interface TransactionsClientProps {
  initialData: {
    transactions: Transaction[];
    anomalies: Anomaly[];
    metrics: {
      totalCredits: number;
      totalDebits: number;
      totalRecharges: number;
      anomalyCount: number;
    };
  };
}

export default function TransactionsClient({ initialData }: TransactionsClientProps) {
  const [mounted, setMounted] = useState(false);
  const [transactions] = useState<Transaction[]>(initialData.transactions);
  const [anomalies] = useState<Anomaly[]>(initialData.anomalies);
  const [metrics] = useState(initialData.metrics);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, sourceFilter, roleFilter, statusFilter]);

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

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const name = (tx.user_name || "").toLowerCase();
    const phone = (tx.phone || "").toLowerCase();
    const desc = (tx.description || "").toLowerCase();
    const id = (tx.id || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = name.includes(query) || phone.includes(query) || desc.includes(query) || id.includes(query);

    const matchesType = typeFilter === "all" || 
      (typeFilter === "anomaly" && tx.type === "debit" && ["call", "live"].includes(tx.source) && tx.is_host) ||
      (typeFilter === tx.type && !(typeFilter === "debit" && ["call", "live"].includes(tx.source) && tx.is_host));

    const matchesSource = sourceFilter === "all" || tx.source === sourceFilter;

    const matchesRole = roleFilter === "all" || 
      (roleFilter === "host" && tx.is_host) || 
      (roleFilter === "client" && !tx.is_host);

    const matchesStatus = statusFilter === "all" || tx.status === statusFilter;

    return matchesSearch && matchesType && matchesSource && matchesRole && matchesStatus;
  });

  // Group transactions by date beautifully
  const getGroupedTransactions = (items: Transaction[]) => {
    const groups: { [key: string]: Transaction[] } = {};
    
    items.forEach((tx) => {
      const dateStr = tx.created_at.split("T")[0]; // "YYYY-MM-DD"
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(tx);
    });

    // Sort dates descending (newest first)
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

  // Compile and download CSV file
  const downloadCSV = () => {
    if (filteredTransactions.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = [
      "Transaction ID",
      "Date/Time",
      "User Name",
      "Phone",
      "Role",
      "Type",
      "Amount",
      "Source",
      "Status",
      "Description"
    ];

    const rows = filteredTransactions.map((tx) => [
      tx.id,
      tx.created_at,
      tx.user_name || "Setup Pending",
      tx.phone,
      tx.is_host ? "Host" : "Client",
      tx.type.toUpperCase(),
      tx.amount,
      tx.source,
      tx.status.toUpperCase(),
      tx.description || ""
    ]);

    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `twinning_transactions_audit_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            Transaction Auditing
          </h1>
          <p className="text-sm text-white/40">
            Monitor credits, recharges, and platform financial security
          </p>
        </div>

        {/* Download CSV button */}
        <button
          onClick={downloadCSV}
          className="inline-flex items-center gap-2 bg-[#fa48ab] text-white text-xs font-bold py-3 px-5 rounded-xl shadow-[0_4px_15px_rgba(250,72,171,0.25)] hover:shadow-[0_4px_20px_rgba(250,72,171,0.4)] hover:bg-[#fa48ab]/95 transition-all duration-300 group"
        >
          <Download className="w-4 h-4 group-hover:scale-105 transition-transform" />
          Export Filtered CSV
        </button>
      </div>

      {/* CRITICAL SECURITY ALARM BANNER (When host is debited for calls) */}
      {metrics.anomalyCount > 0 && (
        <div className="relative overflow-hidden p-6 rounded-3xl bg-red-950/20 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.1)] space-y-6 animate-pulse-slow">
          <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/5 rounded-full blur-3xl" />
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400 shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-black text-lg text-red-400 tracking-tight flex items-center gap-2">
                CRITICAL SYSTEM ALARM: Outbound Call Debits on Host Profile(s)
              </h3>
              <p className="text-sm text-white/60 max-w-4xl leading-relaxed">
                The system has detected <span className="font-bold text-white">{metrics.anomalyCount} debit transaction(s)</span> associated with call charges on a Host profile (female creator). Hosts are designed strictly to receive calls and earn credits; placing outgoing billed calls is exclusive to client callers. This indicates a potential exploit, database inconsistency, or billing code bug.
              </p>
            </div>
          </div>

          {/* Anomaly list table with custom Avatars */}
          <div className="overflow-hidden rounded-2xl border border-red-500/20 bg-black/40">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-red-500/5 border-b border-red-500/20 text-red-300/80 font-bold">
                  <th className="py-2.5 px-4">Anomalous Host</th>
                  <th className="py-2.5 px-4">Transaction ID</th>
                  <th className="py-2.5 px-4">Debited Amount</th>
                  <th className="py-2.5 px-4">Source</th>
                  <th className="py-2.5 px-4">Discrepancy Details</th>
                  <th className="py-2.5 px-4 text-right">Date/Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-500/10 text-white/80 font-medium">
                {anomalies.map((an) => (
                  <tr key={an.id} className="hover:bg-red-500/5 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-2.5">
                      <Avatar src={an.user_avatar} name={an.user_name} size="sm" />
                      <div className="min-w-0">
                        <span className="block font-bold text-red-200 truncate">{an.user_name}</span>
                        <span className="block text-[10px] text-white/40">{an.phone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] text-white/50">{an.id}</td>
                    <td className="py-3 px-4 text-red-400 font-bold">₹{parseFloat(an.amount).toLocaleString()}</td>
                    <td className="py-3 px-4 capitalize font-semibold">{an.source}</td>
                    <td className="py-3 px-4 text-white/50 italic">{an.description}</td>
                    <td className="py-3 px-4 text-right text-white/40">{formatTime(an.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Metrics Aggregate Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Lifetime Recharges */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/5 space-y-4 hover:border-white/10 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-white/45 uppercase tracking-wider">Lifetime Recharges</span>
            <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/25 flex items-center justify-center text-green-400">
              <Coins className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-heading font-black text-white">₹{metrics.totalRecharges.toLocaleString()}</span>
            <span className="text-[10px] text-white/40 font-semibold">Total Deposits</span>
          </div>
        </div>

        {/* Total Credits */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/5 space-y-4 hover:border-white/10 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-white/45 uppercase tracking-wider">Total Credits</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
              <ArrowUpRight className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-heading font-black text-white">₹{metrics.totalCredits.toLocaleString()}</span>
            <span className="text-[10px] text-white/40 font-semibold">Total Inflows</span>
          </div>
        </div>

        {/* Total Debits */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/5 space-y-4 hover:border-white/10 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-white/45 uppercase tracking-wider">Total Debits</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400">
              <ArrowDownRight className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-heading font-black text-white">₹{metrics.totalDebits.toLocaleString()}</span>
            <span className="text-[10px] text-white/40 font-semibold">Total Outflows</span>
          </div>
        </div>

        {/* Platform Security Status */}
        <div className={`glassmorphism p-6 rounded-2xl border space-y-4 transition-all duration-300 ${
          metrics.anomalyCount > 0 
            ? "border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)] animate-pulse-slow" 
            : "border-white/5"
        }`}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-white/45 uppercase tracking-wider">Security State</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              metrics.anomalyCount > 0 ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"
            }`}>
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className={`text-2xl font-heading font-black ${metrics.anomalyCount > 0 ? "text-red-400" : "text-green-400"}`}>
              {metrics.anomalyCount > 0 ? `${metrics.anomalyCount} Alert` : "Secure"}
            </span>
            <span className="text-[10px] text-white/40 font-semibold">
              {metrics.anomalyCount > 0 ? "Bypasses Found" : "Billing Intact"}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Audit Controls */}
      <div className="space-y-6">
        {/* Controls Card */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/5">
          <div className="flex flex-col xl:flex-row gap-4 justify-between xl:items-center">
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-lg text-white">Platform Audit Filters</h3>
              <p className="text-xs text-white/40">Audit, search, and filter platform transactions by date blocks</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search Input */}
              <div className="relative max-w-xs w-full sm:w-64">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/35">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search name, phone, tx..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 focus:border-[#fa48ab]/30 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-200"
                />
              </div>

              {/* Type Selector */}
              <div className="inline-flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                <Filter className="w-3.5 h-3.5 text-white/40" />
                <select 
                  value={typeFilter} 
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-transparent text-xs text-white/75 focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-[#0f0f10] text-white">All Types</option>
                  <option value="credit" className="bg-[#0f0f10] text-white">Credits Only</option>
                  <option value="debit" className="bg-[#0f0f10] text-white">Debits Only</option>
                  <option value="anomaly" className="bg-[#0f0f10] text-red-400 font-bold">Anomalies Only</option>
                </select>
              </div>

              {/* Source Selector */}
              <div className="inline-flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                <Coins className="w-3.5 h-3.5 text-white/40" />
                <select 
                  value={sourceFilter} 
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="bg-transparent text-xs text-white/75 focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-[#0f0f10] text-white">All Sources</option>
                  <option value="recharge" className="bg-[#0f0f10] text-white">Recharges</option>
                  <option value="call" className="bg-[#0f0f10] text-white">Calls</option>
                  <option value="withdrawal" className="bg-[#0f0f10] text-white">Withdrawals</option>
                  <option value="reward" className="bg-[#0f0f10] text-white">Rewards</option>
                </select>
              </div>

              {/* Role Selector */}
              <div className="inline-flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                <Users className="w-3.5 h-3.5 text-white/40" />
                <select 
                  value={roleFilter} 
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-transparent text-xs text-white/75 focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-[#0f0f10] text-white">All Roles</option>
                  <option value="client" className="bg-[#0f0f10] text-white">Clients Only</option>
                  <option value="host" className="bg-[#0f0f10] text-white">Hosts Only</option>
                </select>
              </div>

              {/* Status Selector */}
              <div className="inline-flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                <CheckCircle className="w-3.5 h-3.5 text-white/40" />
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-xs text-white/75 focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-[#0f0f10] text-white">All Statuses</option>
                  <option value="success" className="bg-[#0f0f10] text-white">Success</option>
                  <option value="pending" className="bg-[#0f0f10] text-white">Pending</option>
                  <option value="failed" className="bg-[#0f0f10] text-white">Failed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Grouped Date-Blocks Audits */}
        <div className="space-y-8">
          {getGroupedTransactions(paginatedTransactions).map((group) => {
            const isToday = group.displayDate === "Today";
            const isExpanded = expandedGroups[group.dateStr] ?? true;
            return (
              <div 
                key={group.dateStr} 
                className={`glassmorphism rounded-3xl border transition-all duration-300 ${
                  isToday 
                    ? "p-8 border-[#fa48ab]/30 shadow-[0_0_35px_rgba(250,72,171,0.12)] bg-gradient-to-b from-[#fa48ab]/5 to-transparent" 
                    : "p-6 border-white/5 hover:border-white/8"
                }`}
              >
                {/* Date Header Block - Clickable to Collapse/Expand */}
                <div 
                  onClick={() => toggleGroup(group.dateStr)}
                  className="flex items-center justify-between border-b border-white/5 pb-4 cursor-pointer select-none group/header"
                >
                  <div className="space-y-1">
                    <h3 className={`font-heading font-black tracking-tight transition-colors duration-250 ${
                      isToday 
                        ? "text-3xl text-white group-hover/header:text-pink-100" 
                        : "text-xl text-white/90 group-hover/header:text-white"
                    }`}>
                      {isToday ? "Today's Transactions" : group.displayDate}
                    </h3>
                    {isToday && (
                      <p className="text-xs text-[#fa48ab] font-semibold tracking-wide uppercase">
                        Real-time Auditing Active
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`font-bold rounded-full border transition-all duration-200 ${
                      isToday 
                        ? "text-sm text-[#fa48ab] bg-[#fa48ab]/15 border-[#fa48ab]/25 px-4 py-1" 
                        : "text-xs text-white/50 bg-white/5 border-white/10 px-3 py-0.5"
                    }`}>
                      {group.items.length} {group.items.length === 1 ? "transaction" : "transactions"}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-white/35 group-hover/header:text-white/70 transition-transform duration-300 shrink-0 ${
                      isExpanded ? "transform rotate-180 text-[#fa48ab]" : ""
                    }`} />
                  </div>
                </div>

                {/* Block list instead of a cramped table, making it clean & transparent! */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isExpanded 
                      ? "grid-rows-[1fr] opacity-100 mt-4" 
                      : "grid-rows-[0fr] opacity-0 mt-0 overflow-hidden"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-1 gap-4 pt-1">
                      {group.items.map((tx) => {
                        const isAnomaly = tx.type === "debit" && ["call", "live"].includes(tx.source) && tx.is_host;
                        const isCredit = tx.type === "credit";
                        
                        return (
                          <div 
                            key={tx.id} 
                            className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4.5 rounded-2xl border transition-all duration-200 ${
                              isAnomaly 
                                ? "bg-red-950/20 border-red-500/20 text-red-200 hover:border-red-500/30" 
                                : isToday
                                  ? "bg-white/4 border-white/10 hover:bg-white/6 hover:border-white/15"
                                  : "bg-white/2 border-white/5 hover:bg-white/4 hover:border-white/8"
                            }`}
                          >
                            {/* Left section: User info & category */}
                            <div className="flex items-center gap-4 min-w-0 flex-1">
                              <Avatar 
                                src={tx.user_avatar} 
                                name={tx.user_name || tx.phone} 
                                size={isToday ? "lg" : "md"} 
                                className="rounded-xl shrink-0" 
                              />
                              
                              <div className="min-w-0 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className={`font-bold truncate ${
                                    isAnomaly 
                                      ? "text-red-400 text-base" 
                                      : isToday 
                                        ? "text-white text-base" 
                                        : "text-white/90 text-sm"
                                  }`}>
                                    {tx.user_name || "Setup Pending"}
                                  </span>
                                  
                                  {/* Role Badge */}
                                  {tx.is_host ? (
                                    <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded ${
                                      isAnomaly 
                                        ? "bg-red-500/20 text-red-400" 
                                        : "bg-[#fa48ab]/10 text-[#fa48ab] border border-[#fa48ab]/20"
                                    }`}>
                                      {isAnomaly ? "Host Security Alert" : "Host"}
                                    </span>
                                  ) : (
                                    <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                      Client
                                    </span>
                                  )}
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/45">
                                  <span>{tx.phone}</span>
                                  <span className="text-white/20">•</span>
                                  <span className="font-mono text-[10px]">ID: {tx.id}</span>
                                </div>
                              </div>
                            </div>

                            {/* Middle/Right section: Details, Amount, Status */}
                            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-6 shrink-0 border-t border-white/5 pt-3 lg:border-t-0 lg:pt-0">
                              {/* Source & Description */}
                              <div className="text-left lg:text-right space-y-0.5">
                                <span className={`block text-xs font-bold capitalize ${
                                  isAnomaly ? "text-red-300" : "text-white/75"
                                }`}>
                                  {tx.source} Category
                                </span>
                                <span className="block text-[11px] text-white/40 italic max-w-[200px] truncate">
                                  {tx.description || "No description"}
                                </span>
                              </div>

                              {/* Status & Time */}
                              <div className="text-left lg:text-center space-y-1">
                                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  tx.status === "success" 
                                    ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                                    : tx.status === "failed" 
                                      ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                }`}>
                                  {tx.status}
                                </span>
                                <span className="block text-[10px] text-white/30 whitespace-nowrap">
                                  {formatTime(tx.created_at)}
                                </span>
                              </div>

                              {/* Amount */}
                              <div className="text-right min-w-[100px]">
                                <span className={`block font-heading font-black tracking-tight ${
                                  isAnomaly 
                                    ? "text-red-400 text-xl" 
                                    : isToday 
                                      ? `text-2xl ${isCredit ? "text-green-400 animate-pulse" : "text-white"}` 
                                      : `text-lg ${isCredit ? "text-green-500/90" : "text-white/90"}`
                                }`}>
                                  {isCredit ? "+" : "-"} ₹{parseFloat(tx.amount).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredTransactions.length === 0 && (
            <div className="glassmorphism p-16 rounded-3xl border border-white/5 text-center text-white/30 italic">
              No transactions match your filtering criteria
            </div>
          )}

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
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 text-white disabled:opacity-30 disabled:hover:bg-white/3 transition-all duration-200"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  if (totalPages > 5 && pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - currentPage) > 1) {
                     if (pageNum === 2 && currentPage > 3) return <span key="dots1" className="px-1.5">...</span>;
                     if (pageNum === totalPages - 1 && currentPage < totalPages - 2) return <span key="dots2" className="px-1.5">...</span>;
                     return null;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center transition-all duration-200 ${
                        currentPage === pageNum
                          ? "bg-[#fa48ab] text-white shadow-[0_3px_10px_rgba(250,72,171,0.25)]"
                          : "bg-white/3 border border-white/5 hover:bg-white/5 text-white"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 text-white disabled:opacity-30 disabled:hover:bg-white/3 transition-all duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
