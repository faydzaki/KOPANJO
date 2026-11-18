"use client";

import * as React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { GenderBreakdown } from "@/types";

interface GenderDonutChartProps {
  data: GenderBreakdown[];
  total: number;
  isLoading?: boolean;
}

export function GenderDonutChart({ data, total, isLoading }: GenderDonutChartProps) {
  const COLORS = ["#4F8CFF", "#EC4899"];

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-40 h-40 rounded-full border-4 border-white/5 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  if (!data || data.length === 0 || total === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs">
        <p>Belum ada data demografi gender</p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.jenis_kelamin,
    value: item.total,
    percentage: item.percentage,
  }));

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="relative h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const entry = payload[0].payload;
                  return (
                    <div className="glass-panel p-2.5 rounded-xl border border-white/15 text-xs shadow-xl">
                      <p className="font-semibold text-white">{entry.name}</p>
                      <p className="text-blue-400">
                        {entry.value} pegawai ({entry.percentage}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.2)" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Count Indicator */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-white tracking-tight">{total}</span>
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total</span>
        </div>
      </div>

      {/* Legend & Breakdown pills */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
        {chartData.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5">
            <span
              className="w-3 h-3 rounded-md shrink-0 shadow-sm"
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-slate-300 font-medium truncate">{item.name}</span>
              <span className="text-[11px] text-slate-400">
                {item.value} ({item.percentage}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
