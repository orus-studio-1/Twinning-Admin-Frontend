import React from "react";
import CallsClient from "@/components/CallsClient";

export const revalidate = 0; // Disable static caching

export default async function AdminVideoCallsPage() {
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
              The video call auditing panel could not connect to the backend database at <code className="bg-black/40 px-1 rounded font-mono">{backendUrl}</code>. Showing mock data for demonstration. Error: {errorMsg}
            </p>
          </div>
        </div>

        {/* Render Calls Page with Video-Specific Mock Data */}
        <CallsClient initialData={getMockVideoCallsData()} defaultTypeFilter="video" />
      </div>
    );
  }

  return <CallsClient initialData={callsData} defaultTypeFilter="video" />;
}

// High-Fidelity Mock Video Calls Data Fallback
function getMockVideoCallsData() {
  return {
    calls: [
      {
        id: "v-call-1",
        caller_id: "u-2",
        callee_id: "u-1",
        room_id: "room-video-1",
        status: "ended",
        started_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(), // 8m ago
        connected_at: new Date(Date.now() - 1000 * 60 * 7.5).toISOString(),
        ended_at: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
        duration_seconds: 390, // 6.5 mins
        end_reason: "normal",
        call_type: "video",
        caller_name: "Alexander K.",
        caller_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
        caller_phone: "+14155552671",
        caller_is_host: false,
        callee_name: "Sarah Lawrence",
        callee_avatar: "/avatars/Female_Avatar_1.png",
        callee_phone: "+918888877777",
        callee_is_host: true
      },
      {
        id: "v-call-2",
        caller_id: "u-3",
        callee_id: "u-1",
        room_id: "room-video-2",
        status: "ended",
        started_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35m ago
        connected_at: new Date(Date.now() - 1000 * 60 * 34).toISOString(),
        ended_at: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
        duration_seconds: 1200, // 20 mins
        end_reason: "normal",
        call_type: "video",
        caller_name: "Rajesh Kumar",
        caller_avatar: null,
        caller_phone: "+919999988888",
        caller_is_host: false,
        callee_name: "Sarah Lawrence",
        callee_avatar: "/avatars/Female_Avatar_1.png",
        callee_phone: "+918888877777",
        callee_is_host: true
      },
      {
        id: "v-call-3",
        caller_id: "u-2",
        callee_id: "u-3",
        room_id: "room-video-3",
        status: "ended",
        started_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4h ago
        connected_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        ended_at: new Date(Date.now() - 1000 * 60 * 60 * 3.75).toISOString(),
        duration_seconds: 900, // 15 mins
        end_reason: "normal",
        call_type: "video",
        caller_name: "Alexander K.",
        caller_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
        caller_phone: "+14155552671",
        caller_is_host: false,
        callee_name: "Rajesh Kumar",
        callee_avatar: null,
        callee_phone: "+919999988888",
        callee_is_host: false // Anomalous receiver check (client to client video!)
      },
      {
        id: "v-call-4",
        caller_id: "u-1",
        callee_id: "u-2",
        room_id: "room-video-4",
        status: "missed",
        started_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
        connected_at: null,
        ended_at: new Date(Date.now() - 1000 * 60 * 60 * 23.99).toISOString(),
        duration_seconds: 0,
        end_reason: "no_answer",
        call_type: "video",
        caller_name: "Sarah Lawrence",
        caller_avatar: "/avatars/Female_Avatar_1.png",
        caller_phone: "+918888877777",
        caller_is_host: true,
        callee_name: "Alexander K.",
        callee_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
        callee_phone: "+14155552671",
        callee_is_host: false
      }
    ],
    metrics: {
      totalCalls: 4,
      audioCalls: 0,
      videoCalls: 4,
      connectedCalls: 3,
      missedCalls: 1,
      averageDurationSeconds: 830
    }
  };
}