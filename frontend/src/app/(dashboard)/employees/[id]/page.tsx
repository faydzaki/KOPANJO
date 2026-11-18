"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DeleteConfirmationDialog } from "@/components/employees/DeleteConfirmationDialog";
import { employeeService } from "@/services/employee.service";
import { Employee } from "@/types";
import { formatDate, calculateAge } from "@/lib/utils";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  User,
  Phone,
  Briefcase,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [employee, setEmployee] = React.useState<Employee | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!id) return;
    const fetchEmployee = async () => {
      setIsLoading(true);
      try {
        const response = await employeeService.getEmployee(id);
        if (response.success && response.data) {
          setEmployee(response.data);
        }
      } catch (error: unknown) {
        console.error("Fetch employee error:", error);
        toast.error("Pegawai Tidak Ditemukan", {
          description: "Data pegawai tidak dapat ditemukan atau telah dihapus.",
        });
        router.push("/employees");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [id, router]);

  const handleDeleteConfirm = async () => {
    if (!employee) return;
    setIsDeleting(true);
    try {
      const response = await employeeService.deleteEmployee(employee.id);
      if (response.success) {
        toast.success("Pegawai Berhasil Dihapus", {
          description: `Data pegawai ${employee.nama} telah dihapus dari sistem.`,
        });
        setShowDeleteModal(false);
        router.push("/employees");
      }
    } catch (error: unknown) {
      console.error("Delete error:", error);
      toast.error("Gagal Menghapus Pegawai", {
        description: "Terjadi kesalahan saat menghapus data pegawai.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Topbar
          title="Detail Pegawai"
          subtitle="Memuat profil lengkap pegawai..."
        />
        <div className="min-h-[400px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (!employee) return null;

  const age = calculateAge(employee.tanggal_lahir);

  return (
    <div className="space-y-6">
      <Topbar
        title="Detail Pegawai"
        subtitle={`Profil dan informasi administrasi ${employee.nama}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => router.push("/employees")}>
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Kembali
            </Button>
            <Link href={`/employees/${employee.id}/edit`}>
              <Button variant="primary" size="sm">
                <Pencil className="w-3.5 h-3.5 mr-1" />
                Edit Data
              </Button>
            </Link>
          </div>
        }
      />

      {/* Hero Profile Glass Card */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-500/15 via-violet-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar Big */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 border-2 border-white/20 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-500/25 shrink-0">
              {employee.nama.charAt(0)}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {employee.nama}
                </h2>
                <Badge variant={employee.jenis_kelamin === "Laki-laki" ? "primary" : "purple"}>
                  {employee.jenis_kelamin}
                </Badge>
              </div>

              <p className="text-sm text-blue-400 font-medium flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 shrink-0" />
                {employee.jabatan}
              </p>

              <p className="text-xs text-slate-400 font-mono">
                NIP: {employee.nip}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-white/10">
            <Link href={`/employees/${employee.id}/edit`}>
              <Button variant="secondary" size="md">
                <Pencil className="w-4 h-4 mr-2" />
                Ubah Profil
              </Button>
            </Link>
            <Button
              variant="danger"
              size="md"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus Pegawai
            </Button>
          </div>
        </div>
      </div>

      {/* Detail Information Grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Details */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-white font-semibold text-sm">
            <User className="w-4 h-4 text-blue-400" />
            Data Personal
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Nama Lengkap</span>
              <p className="font-semibold text-white">{employee.nama}</p>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Nomor Induk Pegawai (NIP)</span>
              <p className="font-mono text-slate-200">{employee.nip}</p>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Jenis Kelamin</span>
              <p className="font-medium text-slate-200">{employee.jenis_kelamin}</p>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Tempat & Tanggal Lahir</span>
              <p className="font-medium text-slate-200">
                {employee.tempat_lahir}, {formatDate(employee.tanggal_lahir)}
              </p>
              <span className="text-[11px] text-blue-400 font-medium">Usia: {age} tahun</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Alamat Lengkap</span>
              <p className="text-slate-300 leading-relaxed">{employee.alamat}</p>
            </div>
          </div>
        </Card>

        {/* Contact Details */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-white font-semibold text-sm">
            <Phone className="w-4 h-4 text-violet-400" />
            Kontak & Komunikasi
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Alamat Email</span>
              <a
                href={`mailto:${employee.email}`}
                className="font-medium text-blue-400 hover:underline break-all"
              >
                {employee.email}
              </a>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Nomor Telepon / WhatsApp</span>
              <a
                href={`tel:${employee.no_telepon}`}
                className="font-medium text-slate-200 hover:text-white"
              >
                {employee.no_telepon}
              </a>
            </div>
            <div className="pt-2">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-[11px] text-slate-400 block">Status Akun Sistem</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Aktif Terverifikasi
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Career & Organization Details */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-white font-semibold text-sm">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            Pekerjaan & Pendidikan
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Jabatan / Posisi</span>
              <p className="font-semibold text-white">{employee.jabatan}</p>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Pendidikan Terakhir</span>
              <p className="font-medium text-slate-200">{employee.pendidikan_terakhir}</p>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Tanggal Masuk Organisasi</span>
              <p className="font-medium text-slate-200">{formatDate(employee.tanggal_masuk)}</p>
            </div>
            <div className="pt-2 border-t border-white/5">
              <span className="text-slate-400 block mb-0.5">Tanggal Terdaftar di Sistem</span>
              <p className="text-slate-400 font-mono text-[11px]">
                {formatDate(employee.created_at)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        employee={employee}
        isLoading={isDeleting}
      />
    </div>
  );
}
