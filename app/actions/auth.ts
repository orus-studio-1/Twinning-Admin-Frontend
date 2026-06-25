"use server";

import { cookies } from "next/headers";

export async function loginAdmin(prevState: any, formData: FormData) {
  const usernameInput = formData.get("username")?.toString();
  const passwordInput = formData.get("password")?.toString();

  const expectedUsername = process.env.ADMIN_USERNAME || "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD || "twinningadmin2026";

  if (usernameInput === expectedUsername && passwordInput === expectedPassword) {
    const cookieStore = await cookies();
    cookieStore.set("twinning_admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });
    return { success: true };
  }

  return { success: false, error: "Invalid username or password" };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.set("twinning_admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // Expire immediately
  });
  return { success: true };
}
