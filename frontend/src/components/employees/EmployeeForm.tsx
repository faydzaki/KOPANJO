"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { EmployeePayload } from "@/services/employee.service";
import { Employee } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  CreditCard,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Briefcase,
  Save,
  ArrowLeft,
} from "lucide-react";

const employeeSchema = z.object({
  nip: z
    .string()
    .min(1, "NIP wajib diisi.")
    .max(30, "NIP maksimal 30 karakter."),
  nama: z
    .string()
    .min(1, "Nama lengkap wajib diisi.")
    .max(150, "Nama maksimal 150 karakter."),
  tempat_lahir: z
    .string()
    .min(1, "Tempat lahir wajib diisi.")
    .max(100, "Tempat lahir maksimal 100 karakter."),
  tanggal_lahir: z
    .string()
    .min(1, "Tanggal lahir wajib diisi.")
    .refine((val) => !isNaN(Date.parse(val)), "Format tanggal lahir tidak valid.")
    .refine((val) => new Date(val) < new Date(), "Tanggal lahir harus sebelum hari ini."),
  jenis_kelamin: z.enum(["Laki-laki", "Perempuan"], {
    message: "Pilih jenis kelamin Laki-laki atau Perempuan.",
  }),
  alamat: z.string().min(1, "Alamat lengkap wajib diisi."),
  no_telepon: z
    .string()
    .min(1, "Nomor telepon wajib diisi.")
    .max(20, "Nomor telepon maksimal 20 karakter.")
    .regex(/^[0-9+\-\s()]+$/, "Format nomor telepon tidak valid."),
  email: z
    .string()
    .min(1, "Email wajib diisi.")
    .email("Format email tidak valid.")
    .max(150, "Email maksimal 150 karakter."),
  pendidikan_terakhir: z
    .string()
    .min(1, "Pendidikan terakhir wajib diisi.")
    .max(100, "Pendidikan maksimal 100 karakter."),
  jabatan: z
    .string()
    .min(1, "Jabatan wajib diisi.")
    .max(100, "Jabatan maksimal 100 karakter."),
  tanggal_masuk: z
    .string()
    .min(1, "Tanggal masuk wajib diisi.")
    .refine((val) => !isNaN(Date.parse(val)), "Format tanggal masuk tidak valid."),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  initialData?: Employee | null;
  onSubmit: (data: EmployeePayload) => Promise<void>;
  isLoading?: boolean;
  title: string;
  subtitle: string;
}

export function EmployeeForm({
  initialData,
  onSubmit,
  isLoading = false,
  title,
  subtitle,
}: EmployeeFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData
      ? {
          nip: initialData.nip,
          nama: initialData.nama,
          tempat_lahir: initialData.tempat_lahir,
          tanggal_lahir: initialData.tanggal_lahir,
          jenis_kelamin: initialData.jenis_kelamin,
          alamat: initialData.alamat,
          no_telepon: initialData.no_telepon,
          email: initialData.email,
          pendidikan_terakhir: initialData.pendidikan_terakhir,
          jabatan: initialData.jabatan,
          tanggal_masuk: initialData.tanggal_masuk,
        }
      : {
          nip: "",
          nama: "",
          tempat_lahir: "",
          tanggal_lahir: "",
          jenis_kelamin: "Laki-laki",
          alamat: "",
          no_telepon: "",
          email: "",
          pendidikan_terakhir: "S1",
          jabatan: "",
          tanggal_masuk: new Date().toISOString().split("T")[0],
        },
  });

  const onFormSubmit = async (values: EmployeeFormValues) => {
    await onSubmit(values);
  };

  const educations = ["SMA/SMK", "D3", "S1", "S2", "S3"];
  const commonPositions = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Project Manager",
    "HR Specialist",
    "Finance Officer",
    "Marketing Executive",
    "Operations Lead",
    "General Affairs",
    "Legal Officer",
    "Data Analyst",
    "Staff Administrasi",
  ];

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Batal
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
            <Save className="w-4 h-4 mr-1.5" />
            Simpan Pegawai
          </Button>
        </div>
      </div>

      {/* SECTION 1: INFORMASI PERSONAL */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Informasi Personal</h3>
            <p className="text-xs text-slate-400">Data identitas utama pegawai</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* NIP */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              NIP (Nomor Induk Pegawai) <span className="text-rose-400">*</span>
            </label>
            <Input
              {...register("nip")}
              placeholder="Contoh: 199501012022031001"
              error={errors.nip?.message}
              icon={<CreditCard className="w-4 h-4" />}
            />
          </div>

          {/* Nama Lengkap */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Nama Lengkap <span className="text-rose-400">*</span>
            </label>
            <Input
              {...register("nama")}
              placeholder="Nama lengkap beserta gelar jika ada"
              error={errors.nama?.message}
              icon={<User className="w-4 h-4" />}
            />
          </div>

          {/* Tempat Lahir */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Tempat Lahir <span className="text-rose-400">*</span>
            </label>
            <Input
              {...register("tempat_lahir")}
              placeholder="Kota tempat lahir"
              error={errors.tempat_lahir?.message}
              icon={<MapPin className="w-4 h-4" />}
            />
          </div>

          {/* Tanggal Lahir */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Tanggal Lahir <span className="text-rose-400">*</span>
            </label>
            <Input
              type="date"
              {...register("tanggal_lahir")}
              error={errors.tanggal_lahir?.message}
              icon={<Calendar className="w-4 h-4" />}
            />
          </div>

          {/* Jenis Kelamin */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Jenis Kelamin <span className="text-rose-400">*</span>
            </label>
            <select
              {...register("jenis_kelamin")}
              className="w-full h-11 px-4 text-sm rounded-xl glass-input bg-[#111A2E] text-slate-100 cursor-pointer"
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            {errors.jenis_kelamin && (
              <p className="mt-1 text-xs text-rose-400">{errors.jenis_kelamin.message}</p>
            )}
          </div>

          {/* Alamat */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Alamat Lengkap <span className="text-rose-400">*</span>
            </label>
            <textarea
              {...register("alamat")}
              rows={3}
              placeholder="Alamat domisili lengkap pegawai..."
              className="w-full px-4 py-3 text-sm rounded-xl glass-input placeholder:text-slate-500"
            />
            {errors.alamat && (
              <p className="mt-1 text-xs text-rose-400">{errors.alamat.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: INFORMASI KONTAK */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
          <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Informasi Kontak</h3>
            <p className="text-xs text-slate-400">Saluran komunikasi aktif</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* No Telepon */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Nomor Telepon / WhatsApp <span className="text-rose-400">*</span>
            </label>
            <Input
              {...register("no_telepon")}
              placeholder="081234567890"
              error={errors.no_telepon?.message}
              icon={<Phone className="w-4 h-4" />}
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Email Pegawai <span className="text-rose-400">*</span>
            </label>
            <Input
              type="email"
              {...register("email")}
              placeholder="pegawai@kopanjo.test"
              error={errors.email?.message}
              icon={<Mail className="w-4 h-4" />}
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: INFORMASI PEKERJAAN */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Informasi Pekerjaan & Pendidikan</h3>
            <p className="text-xs text-slate-400">Peran dan kualifikasi dalam organisasi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pendidikan Terakhir */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Pendidikan Terakhir <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <select
                {...register("pendidikan_terakhir")}
                className="w-full h-11 px-4 text-sm rounded-xl glass-input bg-[#111A2E] text-slate-100 cursor-pointer"
              >
                {educations.map((edu) => (
                  <option key={edu} value={edu}>
                    {edu}
                  </option>
                ))}
              </select>
            </div>
            {errors.pendidikan_terakhir && (
              <p className="mt-1 text-xs text-rose-400">{errors.pendidikan_terakhir.message}</p>
            )}
          </div>

          {/* Jabatan */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Jabatan / Posisi <span className="text-rose-400">*</span>
            </label>
            <Input
              list="positions-list"
              {...register("jabatan")}
              placeholder="Pilih atau ketik jabatan"
              error={errors.jabatan?.message}
              icon={<Briefcase className="w-4 h-4" />}
            />
            <datalist id="positions-list">
              {commonPositions.map((pos) => (
                <option key={pos} value={pos} />
              ))}
            </datalist>
          </div>

          {/* Tanggal Masuk */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Tanggal Masuk / Bergabung <span className="text-rose-400">*</span>
            </label>
            <Input
              type="date"
              {...register("tanggal_masuk")}
              error={errors.tanggal_masuk?.message}
              icon={<Calendar className="w-4 h-4" />}
            />
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          Simpan Data Pegawai
        </Button>
      </div>
    </form>
  );
}
