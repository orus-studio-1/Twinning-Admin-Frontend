"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#070707] text-[#f1f1f1]">{children}</div>;
  }

  return (
    <div className="h-screen bg-[#070707] text-[#f1f1f1] flex flex-col md:flex-row overflow-hidden">
      <AdminSidebar />
      
      {/* Main dashboard content viewport */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
