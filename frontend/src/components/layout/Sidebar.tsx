"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  isMobileOpen = false,
  onMobileClose,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuSections = [
    {
      title: "MAIN MENU",
      items: [
        {
          name: "Overview",
          href: "/dashboard",
          icon: LayoutDashboard,
          active: pathname === "/dashboard",
        },
        {
          name: "Data Pegawai",
          href: "/employees",
          icon: Users,
          active: pathname.startsWith("/employees") && pathname !== "/employees/create",
        },
      ],
    },
    {
      title: "MANAGEMENT",
      items: [
        {
          name: "Tambah Pegawai",
          href: "/employees/create",
          icon: UserPlus,
          active: pathname === "/employees/create",
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-4 bottom-4 z-40 flex flex-col glass-sidebar rounded-3xl transition-all duration-300 ease-out border border-white/10 shadow-2xl",
          // Desktop positioning (floating with margin)
          "hidden lg:flex left-4",
          collapsed ? "w-20" : "w-64",
          // Mobile drawer mode
          isMobileOpen && "flex left-4 right-4 sm:right-auto sm:w-72 lg:hidden"
        )}
      >
        {/* Header / Brand */}
        <div className="flex items-center justify-between p-5 pb-4 border-b border-white/10 relative">
          <Link
            href="/dashboard"
            className={cn("flex items-center gap-3 group transition-opacity", collapsed ? "justify-center w-full" : "")}
          >
            {/* Futuristic Logo Icon */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 shadow-lg shadow-blue-500/25 shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>

            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-base font-bold text-white tracking-wider flex items-center gap-1.5">
                  KOPANJO
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-tight truncate">
                  Employee Management
                </span>
              </div>
            )}
          </Link>

          {/* Mobile Close Button */}
          {isMobileOpen && (
            <button
              onClick={onMobileClose}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className={cn(
              "hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900 border border-white/20 items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600 shadow-md transition-colors cursor-pointer"
            )}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation Menus */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              {!collapsed && (
                <div className="px-3 text-[10px] font-bold text-slate-500 tracking-wider">
                  {section.title}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onMobileClose}
                      title={collapsed ? item.name : undefined}
                      className={cn(
                        "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                        item.active
                          ? "bg-gradient-to-r from-blue-600/30 to-violet-600/20 text-white border border-blue-500/30 shadow-md shadow-blue-500/10"
                          : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.06]",
                        collapsed ? "justify-center px-0" : ""
                      )}
                    >
                      {/* Active Indicator Bar */}
                      {item.active && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-400 shadow-[0_0_8px_#4F8CFF]" />
                      )}

                      <Icon
                        className={cn(
                          "w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                          item.active ? "text-blue-400 drop-shadow-[0_0_6px_rgba(79,140,255,0.6)]" : "text-slate-400 group-hover:text-slate-200"
                        )}
                      />

                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom / Admin Profile & Logout */}
        <div className="p-3 border-t border-white/10 bg-white/[0.02] rounded-b-3xl">
          <div
            className={cn(
              "flex items-center gap-3 p-2 rounded-2xl transition-colors",
              collapsed ? "justify-center" : ""
            )}
          >
            {/* Avatar */}
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500/20 to-purple-500/30 border border-white/15 text-white font-semibold text-xs shrink-0 shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user?.name || "Admin KOPANJO"}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <ShieldCheck className="w-3 h-3 text-blue-400 shrink-0" />
                  <span className="truncate">Administrator</span>
                </div>
              </div>
            )}

            <button
              onClick={logout}
              title="Logout"
              className={cn(
                "p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer",
                collapsed ? "mt-2" : ""
              )}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
