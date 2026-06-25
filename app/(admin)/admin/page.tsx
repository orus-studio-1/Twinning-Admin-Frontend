import React from "react";
import DashboardClient from "@/components/DashboardClient";

export const revalidate = 0; // Disable static caching

export default async function AdminDashboardPage() {
  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:9000";
  const apiKey = process.env.ADMIN_API_KEY || "";

  let dashboardData = null;
  let errorMsg = null;

  try {
    const res = await fetch(`${backendUrl}/admin/stats`, {
      headers: {
        "x-admin-key": apiKey,
      },
      next: { revalidate: 0 },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        dashboardData = json.data;
      } else {
        errorMsg = json.message || "Failed to load statistics.";
      }
    } else {
      errorMsg = `Server returned status ${res.status}`;
    }
  } catch (error: any) {
    errorMsg = error.message || "Failed to connect to backend database.";
  }

  // Fallback to mock data if backend is offline/error
  if (!dashboardData) {
    return (
      <div className="space-y-8">
        {/* Error / Offline Alert banner */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-400 text-sm">
          <div className="space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              ⚠️ Backend Database Offline (Running in Demo Mode)
            </span>
            <p className="text-xs text-amber-400/85 leading-relaxed">
              The panel could not establish a connection to the backend database at <code className="bg-black/40 px-1 rounded font-mono">{backendUrl}</code>. Showing mock data for demonstration. Error: {errorMsg}
            </p>
          </div>
        </div>

        {/* Render Dashboard with Mock Data */}
        <DashboardClient initialData={getMockData()} />
      </div>
    );
  }

  return <DashboardClient initialData={dashboardData} />;
}

// Resilient Mock Data Fallback
function getMockData() {
  return {
    metrics: {
      totalUsers: 128452,
      totalClients: 128110,
      totalHosts: 342,
      totalVerifiedHosts: 324,
      audioCallsToday: 215,
      videoCallsToday: 127,
      liveCalls: 18,
      totalRechargedEver: 2450180,
      totalRechargedToday: 48500
    },
    lists: {
      recentRegistrations: [
        {
          id: "u-1",
          phone: "+919876543210",
          created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2m ago
          is_blocked: false,
          name: "Sarah L.",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
          gender: "female",
          location: "Mumbai, India",
          language: "English, Hindi",
          is_host: true,
          is_host_verified: false
        },
        {
          id: "u-2",
          phone: "+14155552671",
          created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12m ago
          is_blocked: false,
          name: "Alexander K.",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
          gender: "male",
          location: "California, USA",
          language: "German, English",
          is_host: false,
          is_host_verified: false
        },
        {
          id: "u-3",
          phone: "+919999988888",
          created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45m ago
          is_blocked: true,
          name: "Rajesh Kumar",
          avatar: null,
          gender: "male",
          location: "Delhi, India",
          language: "Hindi",
          is_host: false,
          is_host_verified: false
        }
      ],
      recentCalls: [
        {
          id: "c-1",
          caller_id: "u-2",
          callee_id: "u-1",
          status: "ended",
          started_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
          duration_seconds: 1080, // 18m
          call_type: "video",
          end_reason: "normal",
          caller_name: "Alexander K.",
          callee_name: "Sarah L."
        },
        {
          id: "c-2",
          caller_id: "u-3",
          callee_id: "u-1",
          status: "ended",
          started_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          duration_seconds: 300, // 5m
          call_type: "audio",
          end_reason: "normal",
          caller_name: "Rajesh Kumar",
          callee_name: "Sarah L."
        }
      ],
      recentTransactions: [
        {
          id: "t-1",
          type: "credit",
          amount: 500,
          status: "success",
          source: "recharge",
          description: "Razorpay recharge",
          created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          phone: "+14155552671",
          user_name: "Alexander K."
        },
        {
          id: "t-2",
          type: "debit",
          amount: 250,
          status: "success",
          source: "call",
          description: "Call billing",
          created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
          phone: "+14155552671",
          user_name: "Alexander K."
        }
      ],
      pendingHosts: [
        {
          id: "emp-1",
          user_id: "u-1",
          full_name: "Sarah Lawrence",
          date_of_birth: "2004-05-12T00:00:00.000Z",
          aadhar_number: "528492019948",
          upi_id: "sarah@ybl",
          bank_account_number: "91802948201",
          ifsc_code: "BARB0MUMBAI",
          created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
          location: "Mumbai, India"
        }
      ]
    }
  };
}
