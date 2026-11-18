import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: "blue" | "purple" | "emerald" | "amber";
  subtitle?: string;
  isLoading?: boolean;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  color = "blue",
  subtitle,
  isLoading = false,
}: StatCardProps) {
  const colorSchemes = {
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      glow: "hover:shadow-blue-500/15",
    },
    purple: {
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
      iconBg: "bg-violet-500/20",
      iconColor: "text-violet-400",
      glow: "hover:shadow-violet-500/15",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      glow: "hover:shadow-emerald-500/15",
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
      glow: "hover:shadow-amber-500/15",
    },
  };

  const scheme = colorSchemes[color];

  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300",
        scheme.glow
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-medium text-slate-400 truncate">{label}</p>
          {isLoading ? (
            <div className="h-8 w-24 rounded-lg bg-white/10 animate-pulse mt-1" />
          ) : (
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {value}
            </h3>
          )}
          {subtitle && (
            <p className="text-[11px] text-slate-400 font-medium truncate pt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-110",
            scheme.iconBg,
            scheme.border
          )}
        >
          <Icon className={cn("w-6 h-6", scheme.iconColor)} />
        </div>
      </div>
    </div>
  );
}
