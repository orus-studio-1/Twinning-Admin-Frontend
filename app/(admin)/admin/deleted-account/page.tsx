import React from "react";
import DeletedAccountsClient, { DeletedUserData } from "@/components/DeletedAccountsClient";

export const revalidate = 0; // Disable static caching

export default async function AdminDeletedAccountsPage() {
  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:9000";
  const apiKey = process.env.ADMIN_API_KEY || "";

  let deletedUsersData = null;
  let errorMsg = null;

  try {
    const res = await fetch(`${backendUrl}/admin/deleted-users`, {
      headers: {
        "x-admin-key": apiKey,
      },
      next: { revalidate: 0 },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        deletedUsersData = json.data;
      } else {
        errorMsg = json.message || "Failed to load deleted accounts list.";
      }
    } else {
      errorMsg = `Server returned status ${res.status}`;
    }
  } catch (error: any) {
    errorMsg = error.message || "Failed to connect to backend database.";
  }

  // Fallback to mock data if backend is offline/error
  if (!deletedUsersData) {
    return (
      <div className="space-y-8">
        {/* Error / Offline Alert banner */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-400 text-sm">
          <div className="space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              ⚠️ Backend Database Offline (Running in Demo Mode)
            </span>
            <p className="text-xs text-amber-400/85 leading-relaxed">
              The deleted accounts panel could not connect to the backend database at <code className="bg-black/40 px-1 rounded font-mono">{backendUrl}</code>. Showing mock data for demonstration. Error: {errorMsg}
            </p>
          </div>
        </div>

        {/* Render Page with Mock Data */}
        <DeletedAccountsClient initialData={getMockDeletedUsers()} />
      </div>
    );
  }

  return <DeletedAccountsClient initialData={deletedUsersData} />;
}

// High-Fidelity Mock Deleted Users Data Fallback
function getMockDeletedUsers(): DeletedUserData[] {
  const totalDurationMs = 15 * 24 * 60 * 60 * 1000; // 15 Days in MS
  
  return [
    {
      id: "u-mock-del-1",
      phone: "+919811122233",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(), // 60 days ago
      deleted_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2.5).toISOString(), // 2.5 days ago (12.5 days remaining - Low Urgency)
      scheduled_deletion_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2.5 + totalDurationMs).toISOString(),
      name: "Priya Patel",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
      gender: "female",
      location: "Mumbai, India",
      language: "Gujarati, Hindi, English"
    },
    {
      id: "u-mock-del-2",
      phone: "+919988776655",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
      deleted_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12.8).toISOString(), // 12.8 days ago (2.2 days remaining - Medium/High Urgency)
      scheduled_deletion_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12.8 + totalDurationMs).toISOString(),
      name: "Rajesh Kumar",
      avatar: null,
      gender: "male",
      location: "Delhi, India",
      language: "Hindi, English"
    },
    {
      id: "u-mock-del-3",
      phone: "+919876543210",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(), // 90 days ago
      deleted_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14.9).toISOString(), // 14.9 days ago (2.4 hours remaining - CRITICAL)
      scheduled_deletion_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14.9 + totalDurationMs).toISOString(),
      name: "Amit Sharma",
      avatar: null,
      gender: "male",
      location: "Bangalore, India",
      language: "Kannada, English"
    }
  ];
}