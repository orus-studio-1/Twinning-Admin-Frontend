import React from "react";
import UsersClient, { UserClientData } from "@/components/UsersClient";

export const revalidate = 0; // Disable static caching

export default async function AdminUsersPage() {
  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:9000";
  const apiKey = process.env.ADMIN_API_KEY || "";

  let usersData = null;
  let errorMsg = null;

  try {
    const res = await fetch(`${backendUrl}/admin/users`, {
      headers: {
        "x-admin-key": apiKey,
      },
      next: { revalidate: 0 },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        usersData = json.data;
      } else {
        errorMsg = json.message || "Failed to load clients list.";
      }
    } else {
      errorMsg = `Server returned status ${res.status}`;
    }
  } catch (error: any) {
    errorMsg = error.message || "Failed to connect to backend database.";
  }

  // Fallback to mock data if backend is offline/error
  if (!usersData) {
    return (
      <div className="space-y-8">
        {/* Error / Offline Alert banner */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-400 text-sm">
          <div className="space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              ⚠️ Backend Database Offline (Running in Demo Mode)
            </span>
            <p className="text-xs text-amber-400/85 leading-relaxed">
              The client management page could not connect to the backend database at <code className="bg-black/40 px-1 rounded font-mono">{backendUrl}</code>. Showing mock data for demonstration. Error: {errorMsg}
            </p>
          </div>
        </div>

        {/* Render Users List with Mock Data */}
        <UsersClient initialData={getMockClientsData()} />
      </div>
    );
  }

  return <UsersClient initialData={usersData} />;
}

// Resilient Mock Data Fallback
function getMockClientsData(): UserClientData[] {
  return [
    {
      id: "u-mock-client-1",
      phone: "+919876543210",
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30m ago
      is_blocked: false,
      name: "Amit Sharma",
      avatar: "male_avatar_1",
      gender: "male",
      location: "Delhi, India",
      language: "Hindi, English",
      balance: "1250.00"
    },
    {
      id: "u-mock-client-2",
      phone: "+919811122233",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3h ago
      is_blocked: false,
      name: "Priya Patel",
      avatar: "female_avatar_1",
      gender: "female",
      location: "Mumbai, India",
      language: "Gujarati, Hindi, English",
      balance: "0.00"
    },
    {
      id: "u-mock-client-3",
      phone: "+919988776655",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1d ago
      is_blocked: true,
      name: "Rajesh Kumar",
      avatar: "male_avatar_2",
      gender: "male",
      location: "Bangalore, India",
      language: "Kannada, English",
      balance: "450.50"
    },
    {
      id: "u-mock-client-4",
      phone: "+14155552671",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3d ago
      is_blocked: false,
      name: "Alexander K.",
      avatar: "male_avatar_3",
      gender: "male",
      location: "California, USA",
      language: "English, German",
      balance: "7200.00"
    },
    {
      id: "u-mock-client-5",
      phone: "+442079460192",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7d ago
      is_blocked: false,
      name: "Sarah Lawrence",
      avatar: "female_avatar_2",
      gender: "female",
      location: "London, UK",
      language: "English",
      balance: "150.00"
    },
    {
      id: "u-mock-client-6",
      phone: "+919555444333",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(), // 12d ago
      is_blocked: false,
      name: "Rohan Malhotra",
      avatar: "male_avatar_4",
      gender: "male",
      location: "Delhi, India",
      language: "Punjabi, Hindi, English",
      balance: "0.00"
    },
    {
      id: "u-mock-client-7",
      phone: "+6567890123",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30d ago
      is_blocked: false,
      name: "Jessica Chen",
      avatar: "female_avatar_3",
      gender: "female",
      location: "Singapore",
      language: "Mandarin, English",
      balance: "3400.00"
    }
  ];
}
