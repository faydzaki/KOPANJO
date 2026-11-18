"use client";

import * as React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { AgeBreakdown } from "@/types";

interface AgeBarChartProps {
  data: AgeBreakdown[];
  isLoading?: boolean;
}

export function AgeBarChart({ data, isLoading }: AgeBarChartProps) {
  const COLORS = ["#38BDF8", "#4F8CFF", "#6366F1", "#8B5CF6", "#A855F7"];

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs">
        <p>Belum ada data demografi usia</p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.group,
    total: item.total,
    percentage: item.percentage,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "#94A3B8", fontSize: 10 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748B", fontSize: 10 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const entry = payload[0].payload;
                return (
                  <div className="glass-panel p-2.5 rounded-xl border border-white/15 text-xs shadow-xl">
                    <p className="font-semibold text-white">{entry.name}</p>
                    <p className="text-violet-400 font-medium">
                      {entry.total} Pegawai ({entry.percentage}%)
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={45}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

