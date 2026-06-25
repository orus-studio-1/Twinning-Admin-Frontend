"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  PhoneCall, 
  Wallet, 
  LogOut, 
  Menu, 
  X,
  Activity,
  Video,
  UserCheck
} from "lucide-react";
import { logoutAdmin } from "@/app/actions/auth";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAdmin();
    router.refresh();
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Manage Clients", href: "/admin/users", icon: Users },
    { name: "Manage Hosts", href: "/admin/hosts", icon: UserCheck },
    { name: "Audio Calls", href: "/admin/calls", icon: PhoneCall },
    { name: "Video Calls", href: "/admin/video-calls", icon: Video },
    { name: "Wallet & Txns", href: "/admin/transactions", icon: Wallet },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden w-full glassmorphism-dark h-16 px-4 flex items-center justify-between border-b border-white/5 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10">
            <Image 
              src="/twining-logo.jpeg" 
              alt="Twinning Logo" 
              width={32} 
              height={32} 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-heading font-bold text-lg">Twinning Admin</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/5"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 glassmorphism-dark border-r border-white/5 z-40 p-6 flex flex-col justify-between
        transform transition-transform duration-300 md:relative md:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="space-y-8">
          {/* Logo */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(250,72,171,0.15)]">
              <Image 
                src="/twining-logo.jpeg" 
                alt="Twinning Logo" 
                width={36} 
                height={36} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Twinning Panel
            </span>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = item.href === "/admin" 
                ? pathname === "/admin" 
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group
                    ${isActive 
                      ? "bg-[#fa48ab]/10 border border-[#fa48ab]/20 text-[#fa48ab] shadow-[0_0_15px_rgba(250,72,171,0.08)]" 
                      : "text-white/55 hover:text-white hover:bg-white/5 border border-transparent"
                    }
                  `}
                >
                  <Icon className={`w-4.5 h-4.5 transition-transform group-hover:scale-105 ${isActive ? "text-[#fa48ab]" : "text-white/45 group-hover:text-white"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area with profile & sign-out */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#fa48ab]/20 border border-[#fa48ab]/30 flex items-center justify-center text-xs font-bold text-[#fa48ab]">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-white truncate">Administrator</span>
              <span className="text-[10px] text-white/40 flex items-center gap-1">
                <Activity className="w-3 h-3 text-green-500 animate-pulse" />
                Active Session
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-4.5 h-4.5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
