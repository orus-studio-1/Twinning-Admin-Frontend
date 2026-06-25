import React from "react";
import HostsClient, { HostClientData } from "@/components/HostsClient";

export const revalidate = 0; // Disable static caching

export default async function AdminHostsPage() {
  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:9000";
  const apiKey = process.env.ADMIN_API_KEY || "";

  let hostsData = null;
  let errorMsg = null;

  try {
    const res = await fetch(`${backendUrl}/admin/hosts`, {
      headers: {
        "x-admin-key": apiKey,
      },
      next: { revalidate: 0 },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        hostsData = json.data;
      } else {
        errorMsg = json.message || "Failed to load hosts list.";
      }
    } else {
      errorMsg = `Server returned status ${res.status}`;
    }
  } catch (error: any) {
    errorMsg = error.message || "Failed to connect to backend database.";
  }

  // Fallback to mock data if backend is offline/error
  if (!hostsData) {
    return (
      <div className="space-y-8">
        {/* Error / Offline Alert banner */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-400 text-sm">
          <div className="space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              ⚠️ Backend Database Offline (Running in Demo Mode)
            </span>
            <p className="text-xs text-amber-400/85 leading-relaxed">
              The host management page could not connect to the backend database at <code className="bg-black/40 px-1 rounded font-mono">{backendUrl}</code>. Showing mock data for demonstration. Error: {errorMsg}
            </p>
          </div>
        </div>

        {/* Render Hosts List with Mock Data */}
        <HostsClient initialData={getMockHostsData()} />
      </div>
    );
  }

  return <HostsClient initialData={hostsData} />;
}

// Resilient Mock Data Fallback for Female Performers/Hosts
function getMockHostsData(): HostClientData[] {
  return [
    {
      id: "u-mock-host-1",
      phone: "+919888877777",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15d ago
      is_blocked: false,
      name: "Neha Sharma",
      avatar: "female_avatar_4",
      gender: "female",
      location: "Delhi, India",
      language: "Hindi, English",
      balance: "500.00",
      host_id: "fe-mock-1",
      full_name: "Neha Sharma",
      date_of_birth: "1998-05-12",
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
    {
      id: "u-mock-host-2",
      phone: "+919555666777",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h ago
      is_blocked: false,
      name: "Shalini Kapoor",
      avatar: "female_avatar_5",
      gender: "female",
      location: "Mumbai, India",
      language: "Marathi, Hindi, English",
      balance: "0.00",
      host_id: "fe-mock-2",
      full_name: "Shalini Kapoor",
      date_of_birth: "2000-09-24",
      aadhar_number: "998811223344",
      bank_account_number: "501002003004",
      ifsc_code: "HDFC0000123",
      upi_id: "shalini.k@okhdfc",
      bio: "Passionate storyteller and counselor. Available for audio/video chats.",
      earning_rate_percent: "65.00",
      is_verified: false,
      is_active: true,
      total_earnings: "0.00"
    },
    {
      id: "u-mock-host-3",
      phone: "+919000011111",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(), // 45d ago
      is_blocked: false,
      name: "Ananya Rao",
      avatar: "female_avatar_6",
      gender: "female",
      location: "Bangalore, India",
      language: "Telugu, Kannada, Hindi, English",
      balance: "120.00",
      host_id: "fe-mock-3",
      full_name: "Ananya Rao",
      date_of_birth: "1996-12-05",
      aadhar_number: "123456789012",
      bank_account_number: "302010405060",
      ifsc_code: "ICIC0000456",
      upi_id: "ananya.rao@okicici",
      bio: "Welcome! Let's talk about music, movies, or coding. Very active host.",
      earning_rate_percent: "70.00",
      is_verified: true,
      is_active: true,
      total_earnings: "98400.00"
    },
    {
      id: "u-mock-host-4",
      phone: "+447911123456",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(), // 60d ago
      is_blocked: false,
      name: "Jessica Drew",
      avatar: "female_avatar_1",
      gender: "female",
      location: "London, UK",
      language: "English, French",
      balance: "2500.00",
      host_id: "fe-mock-4",
      full_name: "Jessica Drew",
      date_of_birth: "1997-03-18",
      aadhar_number: "987654321098",
      bank_account_number: null,
      ifsc_code: null,
      upi_id: "jessica.drew@paytm",
      bio: "Global host. Happy to connect and chat anytime.",
      earning_rate_percent: "65.00",
      is_verified: true,
      is_active: true,
      total_earnings: "145000.00"
    },
    {
      id: "u-mock-host-5",
      phone: "+919777766666",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12h ago
      is_blocked: false,
      name: "Meera Nair",
      avatar: "female_avatar_2",
      gender: "female",
      location: "Chennai, India",
      language: "Tamil, English",
      balance: "0.00",
      host_id: "fe-mock-5",
      full_name: "Meera Nair",
      date_of_birth: "2001-07-30",
      aadhar_number: "444455556666",
      bank_account_number: "204060801020",
      ifsc_code: "BARB0CHENNAI",
      upi_id: "meera.nair@okbaroda",
      bio: "Lively, energetic, and happy to listen to your stories.",
      earning_rate_percent: "65.00",
      is_verified: false,
      is_active: true,
      total_earnings: "0.00"
    }
  ];
}
