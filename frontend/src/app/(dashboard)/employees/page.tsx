"use client";

import * as React from "react";
import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DeleteConfirmationDialog } from "@/components/employees/DeleteConfirmationDialog";
import { employeeService, EmployeeQueryParams } from "@/services/employee.service";
import { Employee, PaginationMeta } from "@/types";
import {
  Search,
  UserPlus,
  Filter,
  X,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { toast } from "sonner";

export default function EmployeesPage() {
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [pagination, setPagination] = React.useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // Search & Filter State
  const [searchInput, setSearchInput] = React.useState<string>("");
  const [search, setSearch] = React.useState<string>("");
  const [genderFilter, setGenderFilter] = React.useState<string>("");
  const [educationFilter, setEducationFilter] = React.useState<string>("");
  const [positionFilter, setPositionFilter] = React.useState<string>("");
  const [sortBy, setSortBy] = React.useState<string>("id");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [perPage] = React.useState<number>(10);
  const [refreshTrigger, setRefreshTrigger] = React.useState<number>(0);

  // Delete Dialog State
  const [selectedEmployeeForDelete, setSelectedEmployeeForDelete] = React.useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

  // Debounced search trigger or form search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSearch(searchInput);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setIsLoading(true);
    setSearchInput("");
    setSearch("");
    setGenderFilter("");
    setEducationFilter("");
    setPositionFilter("");
    setSortBy("id");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const hasActiveFilters = !!(search || genderFilter || educationFilter || positionFilter || sortBy !== "id");

  React.useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const params: EmployeeQueryParams = {
          page: currentPage,
          per_page: perPage,
          sort_by: sortBy,
          sort_order: sortOrder,
        };

        if (search) params.search = search;
        if (genderFilter) params.jenis_kelamin = genderFilter;
        if (educationFilter) params.pendidikan_terakhir = educationFilter;
        if (positionFilter) params.jabatan = positionFilter;

        const response = await employeeService.getEmployees(params);
        if (isMounted && response.success) {
          setEmployees(response.data);
          if (response.pagination) {
            setPagination(response.pagination);
          }
        }
      } catch (error: unknown) {
        if (isMounted) {
          console.error("Fetch employees error:", error);
          toast.error("Gagal Memuat Data Pegawai", {
            description: "Terjadi kesalahan saat mengambil daftar pegawai dari server.",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [currentPage, perPage, search, genderFilter, educationFilter, positionFilter, sortBy, sortOrder, refreshTrigger]);

  const handleDeleteConfirm = async () => {
    if (!selectedEmployeeForDelete) return;
    setIsDeleting(true);
    try {
      const response = await employeeService.deleteEmployee(selectedEmployeeForDelete.id);
      if (response.success) {
        toast.success("Pegawai Dihapus", {
          description: `Data pegawai ${selectedEmployeeForDelete.nama} berhasil dihapus.`,
        });
        setSelectedEmployeeForDelete(null);
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (error: unknown) {
      console.error("Delete employee error:", error);
      toast.error("Gagal Menghapus Pegawai", {
        description: "Terjadi kesalahan saat menghapus data pegawai.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Topbar */}
      <Topbar
        title="Data Pegawai"
        subtitle="Manajemen dan administrasi seluruh pegawai organisasi"
        actions={
          <Link href="/employees/create">
            <Button size="sm" variant="primary" className="gap-1.5 shadow-md shadow-blue-500/20">
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tambah Pegawai</span>
            </Button>
          </Link>
        }
      />

      {/* Main Container */}
      <Card className="p-0 overflow-hidden border border-white/10 shadow-2xl">
        <CardHeader className="p-6 pb-4 border-b border-white/5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Daftar Pegawai
              </CardTitle>
              <CardDescription>
                {pagination ? `Total ${pagination.total} pegawai terdaftar` : "Memuat data pegawai..."}
              </CardDescription>
            </div>

            <Link href="/employees/create">
              <Button size="md" variant="primary" className="w-full sm:w-auto gap-2">
                <UserPlus className="w-4 h-4" />
                Tambah Pegawai Baru
              </Button>
            </Link>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 pt-2">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
              <Input
                placeholder="Cari berdasarkan nama atau NIP..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                className="h-10 text-xs"
              />
              <Button type="submit" variant="secondary" size="md" className="shrink-0">
                Cari
              </Button>
            </form>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              {/* Gender Filter */}
              <select
                value={genderFilter}
                onChange={(e) => {
                  setGenderFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 px-3 text-xs rounded-xl glass-input bg-[#111A2E] text-slate-200 cursor-pointer"
              >
                <option value="">Semua Gender</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>

              {/* Education Filter */}
              <select
                value={educationFilter}
                onChange={(e) => {
                  setEducationFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 px-3 text-xs rounded-xl glass-input bg-[#111A2E] text-slate-200 cursor-pointer"
              >
                <option value="">Semua Pendidikan</option>
                <option value="SMA/SMK">SMA/SMK</option>
                <option value="D3">D3</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
              </select>

              {/* Sort By */}
              <select
                value={`${sortBy}:${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split(":");
                  setSortBy(field);
                  setSortOrder(order as "asc" | "desc");
                  setCurrentPage(1);
                }}
                className="h-10 px-3 text-xs rounded-xl glass-input bg-[#111A2E] text-slate-200 cursor-pointer"
              >
                <option value="id:desc">Terbaru Ditambahkan</option>
                <option value="nama:asc">Nama (A-Z)</option>
                <option value="nama:desc">Nama (Z-A)</option>
                <option value="tanggal_masuk:desc">Tanggal Masuk (Terbaru)</option>
                <option value="tanggal_masuk:asc">Tanggal Masuk (Terlama)</option>
              </select>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-10 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 gap-1 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Employee Table */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-slate-400 bg-white/[0.02]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold w-12 text-center">No</th>
                  <th className="py-3.5 px-4 font-semibold">Pegawai</th>
                  <th className="py-3.5 px-4 font-semibold">Jenis Kelamin</th>
                  <th className="py-3.5 px-4 font-semibold">Email</th>
                  <th className="py-3.5 px-4 font-semibold">Jabatan</th>
                  <th className="py-3.5 px-4 font-semibold">Pendidikan</th>
                  <th className="py-3.5 px-4 font-semibold text-center w-36">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td colSpan={7} className="py-4 px-4">
                        <div className="h-6 rounded bg-white/[0.04]" />
                      </td>
                    </tr>
                  ))
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Filter className="w-8 h-8 text-slate-500" />
                        <p className="font-semibold text-slate-300">Tidak ada pegawai yang sesuai kriteria.</p>
                        <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau reset filter.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  employees.map((emp, index) => {
                    const rowNumber = pagination
                      ? (pagination.current_page - 1) * pagination.per_page + index + 1
                      : index + 1;

                    return (
                      <tr key={emp.id} className="hover:bg-white/[0.03] transition-colors group">
                        <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                          {rowNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500/20 to-violet-500/30 border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
                              {emp.nama.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <Link
                                href={`/employees/${emp.id}`}
                                className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors truncate block"
                              >
                                {emp.nama}
                              </Link>
                              <span className="text-[11px] text-slate-400 font-mono">{emp.nip}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant={emp.jenis_kelamin === "Laki-laki" ? "primary" : "purple"}>
                            {emp.jenis_kelamin}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 truncate max-w-[180px]">
                          {emp.email}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-200">
                          {emp.jabatan}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-slate-300">
                            {emp.pendidikan_terakhir}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {/* Detail */}
                            <Link
                              href={`/employees/${emp.id}`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                              title="Lihat Detail Pegawai"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            {/* Edit */}
                            <Link
                              href={`/employees/${emp.id}/edit`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                              title="Edit Data Pegawai"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => setSelectedEmployeeForDelete(emp)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Hapus Pegawai"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.total > 0 && (
            <div className="p-4 border-t border-white/5 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <div>
                Menampilkan <span className="text-white font-medium">{pagination.from ?? 0}</span> sampai{" "}
                <span className="text-white font-medium">{pagination.to ?? 0}</span> dari{" "}
                <span className="text-white font-medium">{pagination.total}</span> pegawai
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={pagination.current_page <= 1 || isLoading}
                  className="gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Sebelumnya
                </Button>

                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-semibold">
                  {pagination.current_page} / {pagination.last_page}
                </span>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.last_page))}
                  disabled={pagination.current_page >= pagination.last_page || isLoading}
                  className="gap-1"
                >
                  Berikutnya
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={!!selectedEmployeeForDelete}
        onClose={() => setSelectedEmployeeForDelete(null)}
        onConfirm={handleDeleteConfirm}
        employee={selectedEmployeeForDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
