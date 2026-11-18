"use client";

import * as React from "react";
import Image from "next/image";
import { useAuth } from "@/providers/auth-provider";
import { useLayout } from "./DashboardLayout";
import { Menu, Calendar, ShieldCheck } from "lucide-react";

interface TopbarProps {
  title: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
  actions?: React.ReactNode;
}

export function Topbar({ title, subtitle, onOpenMobileMenu, actions }: TopbarProps) {
  const { user } = useAuth();
  const layout = useLayout();
  const handleOpenMenu = onOpenMobileMenu || layout.onOpenMobileMenu;
  const [currentDate] = React.useState<string>(() => {
    const now = new Date();
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(now);
  });

  return (
    <header className="sticky top-4 z-30 mb-6">
      <div className="glass-panel rounded-2xl px-5 py-3.5 flex items-center justify-between gap-4 border border-white/10 shadow-lg">
        {/* Left Side: Mobile Menu Button & Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={handleOpenMenu}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="lg:hidden shrink-0">
            <Image
              src="/logo1.png"
              alt="KOPANJO"
              width={32}
              height={32}
              className="w-8 h-8 object-contain drop-shadow-md"
            />
          </div>

          <div className="flex flex-col min-w-0">
            <h1 className="text-lg md:text-xl font-bold text-white tracking-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-400 truncate hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Date, Actions & User Badge */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Custom Action buttons if passed */}
          {actions}

          {/* Current Date Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>{currentDate || "Memuat..."}</span>
          </div>

          {/* User Pill */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500/30 to-purple-500/40 border border-white/20 flex items-center justify-center text-white text-xs font-semibold shadow-inner">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 leading-tight">
                {user?.name || "Admin"}
              </span>
              <span className="text-[10px] text-blue-400 font-medium flex items-center gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5" />
                Admin
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
