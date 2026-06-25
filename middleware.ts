import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = request.cookies.get("twinning_admin_session")?.value;

  const isAdminRoute = path.startsWith("/admin");
  const isLoginRoute = path === "/admin/login";

  // If trying to access admin routes (except login) without auth, redirect to login
  if (isAdminRoute && !isLoginRoute) {
    if (session !== "authenticated") {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already authenticated and trying to access login, redirect to dashboard
  if (isLoginRoute) {
    if (session === "authenticated") {
      const adminUrl = new URL("/admin", request.url);
      return NextResponse.redirect(adminUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
