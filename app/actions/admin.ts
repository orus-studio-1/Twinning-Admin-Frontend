"use server";

import { revalidatePath } from "next/cache";

// Helper to make secure fetch requests to the backend
async function fetchBackendAdmin(path: string, options: RequestInit = {}) {
  const backendUrl = process.env.BACKEND_API_URL || "http://localhost:9000";
  const apiKey = process.env.ADMIN_API_KEY || "";

  const response = await fetch(`${backendUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": apiKey,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Backend request failed");
  }

  return response.json();
}

// Block or unblock a user
export async function toggleBlockUserAction(userId: string, block: boolean) {
  try {
    await fetchBackendAdmin(`/admin/users/${userId}/block`, {
      method: "POST",
      body: JSON.stringify({ block }),
    });

    // Revalidate the admin dashboard and list pages to fetch fresh data
    revalidatePath("/admin");
    revalidatePath("/admin/users");
    revalidatePath("/admin/hosts");
    revalidatePath(`/admin/users/${userId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to block/unblock user" };
  }
}

// Verify or reject a host profile
export async function verifyHostAction(hostId: string, verify: boolean, userId?: string) {
  try {
    await fetchBackendAdmin(`/admin/hosts/${hostId}/verify`, {
      method: "POST",
      body: JSON.stringify({ verify }),
    });

    // Revalidate the admin dashboard and host pages to fetch fresh data
    revalidatePath("/admin");
    revalidatePath("/admin/users");
    revalidatePath("/admin/hosts");
    if (userId) {
      revalidatePath(`/admin/users/${userId}`);
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to verify host" };
  }
}

// Restore a soft-deleted user account
export async function restoreUserAction(userId: string) {
  try {
    await fetchBackendAdmin(`/admin/users/${userId}/restore`, {
      method: "POST",
    });

    // Revalidate the admin dashboard and deleted accounts pages to fetch fresh data
    revalidatePath("/admin");
    revalidatePath("/admin/deleted-account");
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to restore user" };
  }
}

