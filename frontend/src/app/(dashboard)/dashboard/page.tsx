"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { Topbar } from "@/components/layout/Topbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { GenderDonutChart } from "@/components/dashboard/GenderDonutChart";
import { EducationBarChart } from "@/components/dashboard/EducationBarChart";
import { AgeBarChart } from "@/components/dashboard/AgeBarChart";
import { RecentEmployeesTable } from "@/components/dashboard/RecentEmployeesTable";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { dashboardService } from "@/services/dashboard.service";
import { employeeService } from "@/services/employee.service";
import {
  DashboardStatistics,
  GenderAnalytics,
  EducationAnalytics,
  AgeAnalytics,
  Employee,
} from "@/types";
import {
  Users,
  UserCheck,
  UserPlus,
  GraduationCap,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

interface DashboardPageProps {
  onOpenMobileMenu?: () => void;
}

export default function DashboardPage({ onOpenMobileMenu = () => {} }: DashboardPageProps) {
  const { user } = useAuth();

  const [stats, setStats] = React.useState<DashboardStatistics | null>(null);
  const [genderData, setGenderData] = React.useState<GenderAnalytics | null>(null);
  const [educationData, setEducationData] = React.useState<EducationAnalytics | null>(null);
  const [ageData, setAgeData] = React.useState<AgeAnalytics | null>(null);
  const [recentEmployees, setRecentEmployees] = React.useState<Employee[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [statsRes, genderRes, eduRes, ageRes, empRes] = await Promise.all([
          dashboardService.getStatistics(),
          dashboardService.getGenderAnalytics(),
          dashboardService.getEducationAnalytics(),
          dashboardService.getAgeAnalytics(),
          employeeService.getEmployees({ per_page: 5, sort_by: "id", sort_order: "desc" }),
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (genderRes.success) setGenderData(genderRes.data);
        if (eduRes.success) setEducationData(eduRes.data);
        if (ageRes.success) setAgeData(ageRes.data);
        if (empRes.success) setRecentEmployees(empRes.data);
      } catch (error: unknown) {
        console.error("Dashboard data load error:", error);
        toast.error("Gagal Memuat Data", {
          description: "Tidak dapat mengambil data dashboard terkini dari server.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalEducationCategories = stats?.pendidikan_terakhir
    ? Object.keys(stats.pendidikan_terakhir).length
    : 0;

  return (
    <div className="space-y-6">
      {/* Topbar */}
      <Topbar
        title="Dashboard Overview"
        subtitle="Analisis dan statistik komprehensif data pegawai organisasi"
        onOpenMobileMenu={onOpenMobileMenu}
        actions={
          <Link href="/employees/create">
            <Button size="sm" variant="primary" className="gap-1.5 shadow-md shadow-blue-500/20">
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tambah Pegawai</span>
            </Button>
          </Link>
        }
      />

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-violet-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              Real-time Workforce Intelligence
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Selamat Datang, {user?.name || "Administrator"}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Pantau seluruh demografi pegawai, statistik pendidikan, dan kelompok usia organisasi KOPANJO secara akurat dan terintegrasi langsung dari database.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/employees">
              <Button variant="secondary" size="md">
                Kelola Pegawai
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Seluruh Pegawai"
          value={stats?.total_pegawai ?? 0}
          icon={Users}
          color="blue"
          subtitle="Pegawai aktif terdaftar"
          isLoading={isLoading}
        />
        <StatCard
          label="Pegawai Laki-laki"
          value={stats?.total_laki_laki ?? 0}
          icon={UserCheck}
          color="purple"
          subtitle={
            stats && stats.total_pegawai > 0
              ? `${Math.round((stats.total_laki_laki / stats.total_pegawai) * 100)}% dari total workforce`
              : "0% dari total"
          }
          isLoading={isLoading}
        />
        <StatCard
          label="Pegawai Perempuan"
          value={stats?.total_perempuan ?? 0}
          icon={UserCheck}
          color="emerald"
          subtitle={
            stats && stats.total_pegawai > 0
              ? `${Math.round((stats.total_perempuan / stats.total_pegawai) * 100)}% dari total workforce`
              : "0% dari total"
          }
          isLoading={isLoading}
        />
        <StatCard
          label="Kategori Pendidikan"
          value={totalEducationCategories}
          icon={GraduationCap}
          color="amber"
          subtitle="Jenjang kualifikasi aktif"
          isLoading={isLoading}
        />
      </div>

      {/* Charts Section: 3 Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gender Demographics Donut */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/5">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-blue-400" />
                Komposisi Gender
              </CardTitle>
              <CardDescription>Distribusi gender pegawai terdaftar</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pt-4">
            <GenderDonutChart
              data={genderData?.breakdown ?? []}
              total={genderData?.total ?? 0}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Education Distribution Bar Chart */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/5">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                Tingkat Pendidikan
              </CardTitle>
              <CardDescription>Klasifikasi jenjang pendidikan terakhir</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pt-4">
            <EducationBarChart
              data={educationData?.breakdown ?? []}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Age Groups Demographics Bar Chart */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/5">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-violet-400" />
                Demografi Usia
              </CardTitle>
              <CardDescription>Pengelompokan rentang umur pegawai</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pt-4">
            <AgeBarChart
              data={ageData?.breakdown ?? []}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Employees Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/5">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              Pegawai Terbaru
            </CardTitle>
            <CardDescription>Daftar 5 pegawai yang baru terdaftar dalam sistem</CardDescription>
          </div>
          <Link href="/employees/create">
            <Button size="sm" variant="outline" className="text-xs">
              + Tambah Baru
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <RecentEmployeesTable employees={recentEmployees} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
