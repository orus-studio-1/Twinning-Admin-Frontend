"use client";

import React, { useState, useEffect } from "react";
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Clock, 
  Search, 
  Filter, 
  Activity,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Mic,
  Video,
  CheckCircle,
  XCircle,
  HelpCircle,
  Users,
  ChevronDown
} from "lucide-react";
import Avatar from "@/components/Avatar";

export interface CallData {
  id: string;
  caller_id: string;
  callee_id: string;
  room_id: string;
  status: "initiating" | "ringing" | "connected" | "rejected" | "ended" | "missed";
  started_at: string;
  connected_at: string | null;
  ended_at: string | null;
  duration_seconds: number | null;
  end_reason: string | null;
  call_type: "audio" | "video";
  caller_name: string | null;
  caller_avatar: string | null;
  caller_phone: string;
  caller_is_host: boolean;
  callee_name: string | null;
  callee_avatar: string | null;
  callee_phone: string;
  callee_is_host: boolean;
  charged_amount?: number;
}

interface CallsClientProps {
  initialData: {
    calls: CallData[];
    metrics: {
      totalCalls: number;
      audioCalls: number;
      videoCalls: number;
      connectedCalls: number;
      missedCalls: number;
      averageDurationSeconds: number;
    };
  };
  defaultTypeFilter?: "audio" | "video" | "all";
}

export default function CallsClient({ initialData, defaultTypeFilter }: CallsClientProps) {
  const [mounted, setMounted] = useState(false);
  const [calls] = useState<CallData[]>(initialData.calls);
  const [metrics] = useState(initialData.metrics);

  // Filter States - Default type filter based on prop
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>(defaultTypeFilter || "audio");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [receiverFilter, setReceiverFilter] = useState<string>("all");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, statusFilter, receiverFilter]);

  const toggleGroup = (dateStr: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [dateStr]: !(prev[dateStr] ?? true)
    }));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hydration-safe time formatting (HH:MM)
  const formatTime = (isoString: string) => {
    if (!isoString) return "N/A";
    if (!mounted) return isoString.split("T")[0];
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format duration in seconds to MM:SS
  const formatDuration = (seconds: number | null) => {
    if (seconds === null || seconds === undefined || seconds === 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Filter call sessions
  const filteredCalls = calls.filter((call) => {
    const callerName = (call.caller_name || "").toLowerCase();
    const callerPhone = (call.caller_phone || "").toLowerCase();
    const calleeName = (call.callee_name || "").toLowerCase();
    const calleePhone = (call.callee_phone || "").toLowerCase();
    const room = (call.room_id || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = callerName.includes(query) || 
      callerPhone.includes(query) || 
      calleeName.includes(query) || 
      calleePhone.includes(query) || 
      room.includes(query);

    const matchesType = typeFilter === "all" || call.call_type === typeFilter;
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "connected" && (call.status === "connected" || call.status === "ended" && call.connected_at !== null)) ||
      (statusFilter === "missed" && (call.status === "missed" || call.status === "rejected" || call.status === "ended" && call.connected_at === null));

    const matchesReceiver = receiverFilter === "all" ||
      (receiverFilter === "client" && !call.callee_is_host) ||
      (receiverFilter === "host" && call.callee_is_host);

    return matchesSearch && matchesType && matchesStatus && matchesReceiver;
  });

  // Group calls by date beautifully (similar to transactions)
  const getGroupedCalls = (items: CallData[]) => {
    const groups: { [key: string]: CallData[] } = {};

    items.forEach((call) => {
      const dateStr = call.started_at.split("T")[0]; // "YYYY-MM-DD"
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(call);
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

  const totalItems = filteredCalls.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedCalls = filteredCalls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="font-heading font-black text-3xl text-white tracking-tight">
            {typeFilter === "video" ? "Video Call Audit Logs" : typeFilter === "audio" ? "Audio Call Audit Logs" : "Call Audit Logs"}
          </h1>
          <p className="text-sm text-white/40">
            {typeFilter === "video" 
              ? "Monitor real-time video calling sessions, routing, and caller directories"
              : "Monitor real-time voice call sessions, routing, and user directions"
            }
          </p>
        </div>
      </div>

      {/* Metrics Aggregate Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Calls */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/5 space-y-4 hover:border-white/10 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-white/45 uppercase tracking-wider">Total Voice Calls</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
              <PhoneCall className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-heading font-black text-white">{metrics.audioCalls}</span>
            <span className="text-[10px] text-white/40 font-semibold">Voice Connections</span>
          </div>
        </div>

        {/* Connected Calls */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/5 space-y-4 hover:border-white/10 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-white/45 uppercase tracking-wider">Connected Calls</span>
            <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/25 flex items-center justify-center text-green-400">
              <Phone className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-heading font-black text-white">{metrics.connectedCalls}</span>
            <span className="text-[10px] text-green-400 font-semibold">Talk Time Established</span>
          </div>
        </div>

        {/* Missed / Rejected Calls */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/5 space-y-4 hover:border-white/10 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-white/45 uppercase tracking-wider">Unanswered / Missed</span>
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400">
              <PhoneOff className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-heading font-black text-white">{metrics.missedCalls}</span>
            <span className="text-[10px] text-white/40 font-semibold">Missed / Busy / Rejected</span>
          </div>
        </div>

        {/* Average Duration */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/5 space-y-4 hover:border-white/10 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-white/45 uppercase tracking-wider">Average Talk Time</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-heading font-black text-white">{formatDuration(metrics.averageDurationSeconds)}</span>
            <span className="text-[10px] text-white/40 font-semibold">Per Connected Call</span>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="space-y-6">
        {/* Controls Card */}
        <div className="glassmorphism p-6 rounded-2xl border border-white/5">
          <div className="flex flex-col xl:flex-row gap-4 justify-between xl:items-center">
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-lg text-white">Call Log Filters</h3>
              <p className="text-xs text-white/40">Audit calls in chronological date-blocks with transparent direction routing</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search Input */}
              <div className="relative max-w-xs w-full sm:w-64">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/35">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search name, phone, room ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 focus:border-[#fa48ab]/30 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white placeholder-white/30 focus:outline-none transition-all duration-200"
                />
              </div>

              {/* Call Type Selector */}
              <div className="inline-flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                <Filter className="w-3.5 h-3.5 text-white/40" />
                <select 
                  value={typeFilter} 
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-transparent text-xs text-white/75 focus:outline-none cursor-pointer font-semibold"
                >
                  <option value="audio" className="bg-[#0f0f10] text-white">Audio Calls Only</option>
                  <option value="video" className="bg-[#0f0f10] text-white">Video Calls Only</option>
                  <option value="all" className="bg-[#0f0f10] text-white">All Call Types</option>
                </select>
              </div>

              {/* Call Status Selector */}
              <div className="inline-flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                <Activity className="w-3.5 h-3.5 text-white/40" />
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-xs text-white/75 focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-[#0f0f10] text-white">All Statuses</option>
                  <option value="connected" className="bg-[#0f0f10] text-white">Connected (Talked)</option>
                  <option value="missed" className="bg-[#0f0f10] text-white">Missed / Rejected</option>
                </select>
              </div>

              {/* Callee Role Selector (Receiver checks) */}
              <div className="inline-flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                <Users className="w-3.5 h-3.5 text-white/40" />
                <select 
                  value={receiverFilter} 
                  onChange={(e) => setReceiverFilter(e.target.value)}
                  className="bg-transparent text-xs text-white/75 focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-[#0f0f10] text-white">All Receivers</option>
                  <option value="host" className="bg-[#0f0f10] text-white">Receiver is Host (Standard)</option>
                  <option value="client" className="bg-[#0f0f10] text-white">Receiver is Client (Direct/Special)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Date-Blocked Call Blocks */}
        <div className="space-y-8">
          {getGroupedCalls(paginatedCalls).map((group) => {
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
                      {isToday 
                        ? (typeFilter === "video" ? "Today's Video Logs" : "Today's Voice Logs")
                        : group.displayDate
                      }
                    </h3>
                    {isToday && (
                      <p className="text-xs text-[#fa48ab] font-semibold tracking-wide uppercase">
                        {typeFilter === "video" ? "Active Video Stream Monitoring" : "Active Stream Monitoring"}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`font-bold rounded-full border transition-all duration-200 ${
                      isToday 
                        ? "text-sm text-[#fa48ab] bg-[#fa48ab]/15 border-[#fa48ab]/25 px-4 py-1" 
                        : "text-xs text-white/50 bg-white/5 border-white/10 px-3 py-0.5"
                    }`}>
                      {group.items.length} {group.items.length === 1 ? "call session" : "call sessions"}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-white/35 group-hover/header:text-white/70 transition-transform duration-300 shrink-0 ${
                      isExpanded ? "transform rotate-180 text-[#fa48ab]" : ""
                    }`} />
                  </div>
                </div>

                {/* Block list of call flows, making it transparent & easy to read! */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isExpanded 
                      ? "grid-rows-[1fr] opacity-100 mt-4" 
                      : "grid-rows-[0fr] opacity-0 mt-0 overflow-hidden"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-1 gap-4 pt-1">
                      {group.items.map((call) => {
                        const isReceiverClient = !call.callee_is_host;
                        const isConnected = call.status === "connected" || (call.status === "ended" && call.connected_at !== null);
                        
                        return (
                          <div 
                            key={call.id} 
                            className={`flex flex-col xl:flex-row xl:items-center justify-between gap-6 p-5 rounded-2xl border transition-all duration-200 ${
                              isToday
                                ? "bg-white/4 border-white/10 hover:bg-white/6 hover:border-white/15"
                                : "bg-white/2 border-white/5 hover:bg-white/4 hover:border-white/8"
                            }`}
                          >
                            {/* 1. Caller / Initiator Column */}
                            <div className="flex items-center gap-4 min-w-0 flex-1">
                              <Avatar 
                                src={call.caller_avatar} 
                                name={call.caller_name || call.caller_phone} 
                                size={isToday ? "lg" : "md"} 
                                className="rounded-xl shrink-0" 
                              />
                              <div className="min-w-0 space-y-1">
                                <span className="block text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                                  Caller (Initiator)
                                </span>
                                <span className={`block font-bold text-white truncate ${isToday ? "text-base" : "text-sm"}`}>
                                  {call.caller_name || "Setup Pending"}
                                </span>
                                <span className="block text-[11px] text-white/40">{call.caller_phone}</span>
                              </div>
                            </div>

                            {/* 2. Visual Call Flow Connector */}
                            <div className="flex flex-col items-center justify-center min-w-[140px] px-2 self-center">
                              <div className="flex items-center gap-2 w-full justify-center">
                                <div className="h-[2px] bg-white/10 flex-1 max-w-[40px]" />
                                
                                {/* Central Call Icon Button */}
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
                                  isConnected 
                                    ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                    : "bg-red-500/10 text-red-400 border-red-500/20"
                                }`}>
                                  {call.call_type === "audio" ? (
                                    <Mic className="w-4 h-4" />
                                  ) : (
                                    <Video className="w-4 h-4" />
                                  )}
                                </div>
                                
                                <div className="h-[2px] bg-white/10 flex-1 max-w-[40px]" />
                              </div>
                              
                              {/* Duration Badge */}
                              <span className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono ${
                                isConnected 
                                  ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                                  : "bg-red-500/10 text-red-400 border border-red-500/20"
                              }`}>
                                <Clock className="w-3 h-3" />
                                {isConnected ? formatDuration(call.duration_seconds) : "00:00"}
                              </span>
                            </div>

                            {/* 3. Callee / Receiver Column */}
                            <div className="flex items-center gap-4 min-w-0 flex-1">
                              <Avatar 
                                src={call.callee_avatar} 
                                name={call.callee_name || call.callee_phone} 
                                size={isToday ? "lg" : "md"} 
                                className="rounded-xl shrink-0" 
                              />
                              <div className="min-w-0 space-y-1">
                                <span className="block text-[10px] text-[#fa48ab] font-bold uppercase tracking-wider">
                                  Callee (Receiver)
                                </span>
                                <span className={`block font-bold text-white truncate ${isToday ? "text-base" : "text-sm"}`}>
                                  {call.callee_name || "Setup Pending"}
                                </span>
                                <span className="block text-[11px] text-white/40">{call.callee_phone}</span>
                              </div>
                            </div>

                            {/* 4. Receiver is Client check & Routing info */}
                            <div className="flex flex-wrap items-center justify-between xl:justify-end gap-6 shrink-0 border-t border-white/5 pt-4 xl:border-t-0 xl:pt-0 min-w-[240px]">
                              {/* Charged Amount Badge */}
                              <div className="space-y-1 text-left xl:text-center">
                                <span className="block text-[10px] text-white/30 font-semibold uppercase tracking-wider">
                                  Charged Amount
                                </span>
                                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold px-3 py-1 rounded-lg bg-[#fa48ab]/10 text-[#fa48ab] border border-[#fa48ab]/20 shadow-[0_2px_8px_rgba(250,72,171,0.08)]">
                                  {call.charged_amount ?? 0} Credits
                                </span>
                              </div>

                              {/* Status and Timestamp */}
                              <div className="text-right space-y-1">
                                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isConnected
                                    ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}>
                                  {call.status === "ended" && call.connected_at !== null ? "completed" : call.status}
                                  {call.end_reason && ` (${call.end_reason})`}
                                </span>
                                <span className="block text-[10px] text-white/30 font-semibold">
                                  {formatTime(call.started_at)}
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

          {filteredCalls.length === 0 && (
            <div className="glassmorphism p-16 rounded-3xl border border-white/5 text-center text-white/30 italic">
              No call logs match your filtering criteria
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
