import * as React from "react";
import Link from "next/link";
import { Employee } from "@/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ArrowUpRight } from "lucide-react";

interface RecentEmployeesTableProps {
  employees: Employee[];
  isLoading?: boolean;
}

export function RecentEmployeesTable({ employees, isLoading }: RecentEmployeesTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 rounded-xl bg-white/[0.04] animate-pulse" />
        ))}
      </div>
    );
  }

  if (!employees || employees.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Belum ada data pegawai yang terdaftar.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-white/10 text-slate-400 bg-white/[0.02]">
          <tr>
            <th className="py-3 px-4 font-semibold">Pegawai</th>
            <th className="py-3 px-4 font-semibold">Jenis Kelamin</th>
            <th className="py-3 px-4 font-semibold">Jabatan</th>
            <th className="py-3 px-4 font-semibold">Pendidikan</th>
            <th className="py-3 px-4 font-semibold">Tanggal Masuk</th>
            <th className="py-3 px-4 font-semibold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-white/[0.03] transition-colors group">
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500/20 to-violet-500/30 border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {emp.nama.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors truncate">
                      {emp.nama}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">{emp.nip}</p>
                  </div>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <Badge variant={emp.jenis_kelamin === "Laki-laki" ? "primary" : "purple"}>
                  {emp.jenis_kelamin}
                </Badge>
              </td>
              <td className="py-3.5 px-4 font-medium text-slate-200">{emp.jabatan}</td>
              <td className="py-3.5 px-4">
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-slate-300">
                  {emp.pendidikan_terakhir}
                </span>
              </td>
              <td className="py-3.5 px-4 text-slate-400">{formatDate(emp.tanggal_masuk)}</td>
              <td className="py-3.5 px-4 text-right">
                <Link
                  href={`/employees/${emp.id}`}
                  className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Detail
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-3 border-t border-white/5 bg-white/[0.01] flex justify-end">
        <Link
          href="/employees"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          Lihat Semua Data Pegawai
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
