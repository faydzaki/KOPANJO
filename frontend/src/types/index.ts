export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: number;
  nip: string;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: "Laki-laki" | "Perempuan";
  alamat: string;
  no_telepon: string;
  email: string;
  pendidikan_terakhir: string;
  jabatan: string;
  tanggal_masuk: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: PaginationMeta;
  errors?: Record<string, string[]> | null;
}

export interface DashboardStatistics {
  total_pegawai: number;
  total_laki_laki: number;
  total_perempuan: number;
  pendidikan_terakhir: Record<string, number>;
}

export interface GenderBreakdown {
  jenis_kelamin: "Laki-laki" | "Perempuan";
  total: number;
  percentage: number;
}

export interface GenderAnalytics {
  total: number;
  breakdown: GenderBreakdown[];
  summary: {
    "Laki-laki": number;
    "Perempuan": number;
  };
}

export interface EducationBreakdown {
  pendidikan: string;
  total: number;
  percentage: number;
}

export interface EducationAnalytics {
  total: number;
  breakdown: EducationBreakdown[];
  summary: Record<string, number>;
}

export interface AgeBreakdown {
  group: string;
  key: string;
  total: number;
  percentage: number;
}

export interface AgeAnalytics {
  total: number;
  breakdown: AgeBreakdown[];
  summary: {
    under_25: number;
    age_25_35: number;
    age_36_45: number;
    age_46_55: number;
    above_55: number;
  };
}
