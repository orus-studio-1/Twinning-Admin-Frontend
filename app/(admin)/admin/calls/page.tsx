import React from "react";
import CallsClient, { CallData } from "@/components/CallsClient";

export const revalidate = 0; // Disable static caching

export default async function AdminCallsPage() {
  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:9000";
  const apiKey = process.env.ADMIN_API_KEY || "";

  let callsData = null;
  let errorMsg = null;

  try {
    const res = await fetch(`${backendUrl}/admin/calls`, {
      headers: {
        "x-admin-key": apiKey,
      },
      next: { revalidate: 0 },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        callsData = json.data;
      } else {
        errorMsg = json.message || "Failed to load call audit logs.";
      }
    } else {
      errorMsg = `Server returned status ${res.status}`;
    }
  } catch (error: any) {
    errorMsg = error.message || "Failed to connect to backend database.";
  }

  // Fallback to mock data if backend is offline/error
  if (!callsData) {
    return (
      <div className="space-y-8">
        {/* Error / Offline Alert banner */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-400 text-sm">
          <div className="space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              ⚠️ Backend Database Offline (Running in Demo Mode)
            </span>
            <p className="text-xs text-amber-400/85 leading-relaxed">
              The call auditing panel could not connect to the backend database at <code className="bg-black/40 px-1 rounded font-mono">{backendUrl}</code>. Showing mock data for demonstration. Error: {errorMsg}
            </p>
          </div>
        </div>

        {/* Render Calls Page with Mock Data */}
        <CallsClient initialData={getMockCallsData()} />
      </div>
    );
  }

  return <CallsClient initialData={callsData} />;
}

// High-Fidelity Mock Calls Data Fallback
function getMockCallsData(): {
  calls: CallData[];
  metrics: {
    totalCalls: number;
    audioCalls: number;
    videoCalls: number;
    connectedCalls: number;
    missedCalls: number;
    averageDurationSeconds: number;
  };
} {
  return {
    calls: [
      {
        id: "call-1",
        caller_id: "u-1",
        callee_id: "u-2",
        room_id: "room-1",
        status: "ended",
        started_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10m ago
        connected_at: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
        ended_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        duration_seconds: 420, // 7 mins
        end_reason: "normal",
        call_type: "audio",
        caller_name: "Amit Sharma",
        caller_avatar: null,
        caller_phone: "+919876543210",
        caller_is_host: false,
        callee_name: "Sarah Lawrence",
        callee_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
        callee_phone: "+918888877777",
        callee_is_host: true,
        charged_amount: 140.00
      },
      {
        id: "call-2",
        caller_id: "u-3",
        callee_id: "u-2",
        room_id: "room-2",
        status: "missed",
        started_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45m ago
        connected_at: null,
        ended_at: new Date(Date.now() - 1000 * 60 * 44).toISOString(),
        duration_seconds: 0,
        end_reason: "missed",
        call_type: "audio",
        caller_name: "Rajesh Kumar",
        caller_avatar: null,
        caller_phone: "+919999988888",
        caller_is_host: false,
        callee_name: "Sarah Lawrence",
        callee_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
        callee_phone: "+918888877777",
        callee_is_host: true,
        charged_amount: 0.00
      },
      {
        id: "call-3",
        caller_id: "u-1",
        callee_id: "u-4",
        room_id: "room-3",
        status: "ended",
        started_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3h ago
        connected_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        ended_at: new Date(Date.now() - 1000 * 60 * 60 * 2.8).toISOString(),
        duration_seconds: 720, // 12 mins
        end_reason: "normal",
        call_type: "audio",
        caller_name: "Amit Sharma",
        caller_avatar: null,
        caller_phone: "+919876543210",
        caller_is_host: false,
        callee_name: "John Doe",
        callee_avatar: null,
        callee_phone: "+14155558932",
        callee_is_host: false,
        charged_amount: 240.00
      },
      {
        id: "call-4",
        caller_id: "u-2",
        callee_id: "u-1",
        room_id: "room-4",
        status: "rejected",
        started_at: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), // Yesterday
        connected_at: null,
        ended_at: new Date(Date.now() - 1000 * 60 * 60 * 24.99).toISOString(),
        duration_seconds: 0,
        end_reason: "rejected",
        call_type: "audio",
        caller_name: "Sarah Lawrence",
        caller_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
        caller_phone: "+918888877777",
        caller_is_host: true,
        callee_name: "Amit Sharma",
        callee_avatar: null,
        callee_phone: "+919876543210",
        callee_is_host: false,
        charged_amount: 0.00
      }
    ],
    metrics: {
      totalCalls: 4,
      audioCalls: 4,
      videoCalls: 0,
      connectedCalls: 2,
      missedCalls: 2,
      averageDurationSeconds: 570
    }
  };
}
