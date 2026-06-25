import React from "react";
import UserDetailClient, { 
  DetailedUser, 
  DetailedHostInfo, 
  DetailCallLog, 
  DetailTransaction 
} from "@/components/UserDetailClient";

export const revalidate = 0; // Disable static caching

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetailPage({ params }: PageProps) {
  const { id } = await params;
  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:9000";
  const apiKey = process.env.ADMIN_API_KEY || "";

  let detailData = null;
  let errorMsg = null;

  try {
    const res = await fetch(`${backendUrl}/admin/users/${id}`, {
      headers: {
        "x-admin-key": apiKey,
      },
      next: { revalidate: 0 },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        detailData = json.data;
      } else {
        errorMsg = json.message || "Failed to load user detail profile.";
      }
    } else {
      errorMsg = `Server returned status ${res.status}`;
    }
  } catch (error: any) {
    errorMsg = error.message || "Failed to connect to backend database.";
  }

  // Fallback to mock data if backend is offline/error
  if (!detailData) {
    const isMockHost = id.includes("host");
    const mockData = isMockHost ? getMockHostDetail(id) : getMockClientDetail(id);

    return (
      <div className="space-y-8">
        {/* Error / Offline Alert banner */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-400 text-sm">
          <div className="space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              ⚠️ Backend Database Offline (Running in Demo Mode)
            </span>
            <p className="text-xs text-amber-400/85 leading-relaxed">
              The user auditing system could not fetch live database records for user <code className="bg-black/40 px-1 rounded font-mono">{id}</code>. Showing mock data for demonstration. Error: {errorMsg}
            </p>
          </div>
        </div>

        {/* Render User Details with Mock Data */}
        <UserDetailClient 
          user={mockData.user} 
          hostDetails={mockData.hostDetails} 
          calls={mockData.calls} 
          transactions={mockData.transactions} 
        />
      </div>
    );
  }

  return (
    <UserDetailClient 
      user={detailData.user} 
      hostDetails={detailData.hostDetails} 
      calls={detailData.calls} 
      transactions={detailData.transactions} 
    />
  );
}

// Mock details generator for a female host
function getMockHostDetail(id: string): {
  user: DetailedUser;
  hostDetails: DetailedHostInfo | null;
  calls: DetailCallLog[];
  transactions: DetailTransaction[];
} {
  return {
    user: {
      id,
      phone: "+919888877777",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
      is_blocked: false,
      name: "Neha Sharma",
      avatar: "female_avatar_4",
      age: 24,
      gender: "female",
      location: "Delhi, India",
      preferences: "Interested in music, comedy, and travel conversations",
      language: "Hindi, English, Punjabi",
      balance: "500.00",
      is_host: true
    },
    hostDetails: {
      id: "fe-mock-1",
      full_name: "Neha Sharma",
      date_of_birth: "2002-05-12",
      aadhar_number: "555544443333",
      bank_account_number: "918888812345",
      ifsc_code: "SBIN0001234",
      upi_id: "neha.sharma@okaxis",
      bio: "Friendly and conversational host. I love meeting new people!",
      earning_rate_percent: "65.00",
      is_verified: true,
      is_active: true,
      total_earnings: "48200.00"
    },
    calls: [
      {
        id: "call-host-1",
        caller_id: "u-mock-client-1",
        callee_id: id,
        status: "ended",
        started_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45m ago
        connected_at: new Date(Date.now() - 1000 * 60 * 45 + 5000).toISOString(),
        ended_at: new Date(Date.now() - 1000 * 60 * 45 + 605000).toISOString(),
        duration_seconds: 600, // 10 mins
        end_reason: "normal",
        call_type: "video",
        caller_name: "Amit Sharma",
        caller_avatar: "male_avatar_1",
        callee_name: "Neha Sharma",
        callee_avatar: "female_avatar_4"
      },
      {
        id: "call-host-2",
        caller_id: "u-mock-client-4",
        callee_id: id,
        status: "ended",
        started_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4h ago
        connected_at: new Date(Date.now() - 1000 * 60 * 60 * 4 + 8000).toISOString(),
        ended_at: new Date(Date.now() - 1000 * 60 * 60 * 4 + 1808000).toISOString(),
        duration_seconds: 1800, // 30 mins
        end_reason: "normal",
        call_type: "video",
        caller_name: "Alexander K.",
        caller_avatar: "male_avatar_3",
        callee_name: "Neha Sharma",
        callee_avatar: "female_avatar_4"
      },
      {
        id: "call-host-3",
        caller_id: "u-mock-client-1",
        callee_id: id,
        status: "missed",
        started_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1d ago
        connected_at: null,
        ended_at: null,
        duration_seconds: null,
        end_reason: "no_answer",
        call_type: "audio",
        caller_name: "Amit Sharma",
        caller_avatar: "male_avatar_1",
        callee_name: "Neha Sharma",
        callee_avatar: "female_avatar_4"
      }
    ],
    transactions: [
      {
        id: "tx-host-1",
        type: "credit",
        amount: "390.00",
        status: "success",
        source: "call",
        description: "Video call session earnings (65% share)",
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
      },
      {
        id: "tx-host-2",
        type: "credit",
        amount: "1170.00",
        status: "success",
        source: "call",
        description: "Video call session earnings (65% share)",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
      },
      {
        id: "tx-host-3",
        type: "debit",
        amount: "5000.00",
        status: "success",
        source: "withdrawal",
        description: "Bank transfer payout processed successfully",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
      }
    ]
  };
}

// Mock details generator for a regular client
function getMockClientDetail(id: string): {
  user: DetailedUser;
  hostDetails: DetailedHostInfo | null;
  calls: DetailCallLog[];
  transactions: DetailTransaction[];
} {
  return {
    user: {
      id,
      phone: "+919876543210",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      is_blocked: false,
      name: "Amit Sharma",
      avatar: "male_avatar_1",
      age: 28,
      gender: "male",
      location: "Delhi, India",
      preferences: "Looking to talk to hosts about cooking, language, and culture",
      language: "Hindi, English",
      balance: "1250.00",
      is_host: false
    },
    hostDetails: null,
    calls: [
      {
        id: "call-client-1",
        caller_id: id,
        callee_id: "u-mock-host-1",
        status: "ended",
        started_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        connected_at: new Date(Date.now() - 1000 * 60 * 45 + 5000).toISOString(),
        ended_at: new Date(Date.now() - 1000 * 60 * 45 + 605000).toISOString(),
        duration_seconds: 600,
        end_reason: "normal",
        call_type: "video",
        caller_name: "Amit Sharma",
        caller_avatar: "male_avatar_1",
        callee_name: "Neha Sharma",
        callee_avatar: "female_avatar_4"
      },
      {
        id: "call-client-2",
        caller_id: id,
        callee_id: "u-mock-host-1",
        status: "missed",
        started_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        connected_at: null,
        ended_at: null,
        duration_seconds: null,
        end_reason: "no_answer",
        call_type: "audio",
        caller_name: "Amit Sharma",
        caller_avatar: "male_avatar_1",
        callee_name: "Neha Sharma",
        callee_avatar: "female_avatar_4"
      }
    ],
    transactions: [
      {
        id: "tx-client-1",
        type: "debit",
        amount: "600.00",
        status: "success",
        source: "call",
        description: "10 mins video call billing to Neha Sharma",
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
      },
      {
        id: "tx-client-2",
        type: "credit",
        amount: "2000.00",
        status: "success",
        source: "recharge",
        description: "Razorpay online recharge load",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      },
      {
        id: "tx-client-3",
        type: "debit",
        amount: "150.00",
        status: "success",
        source: "call",
        description: "5 mins audio call billing to Neha Sharma",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
      }
    ]
  };
}
