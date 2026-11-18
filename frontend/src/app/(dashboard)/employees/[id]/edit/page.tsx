"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Topbar } from "@/components/layout/Topbar";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { employeeService, EmployeePayload } from "@/services/employee.service";
import { Employee } from "@/types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [employee, setEmployee] = React.useState<Employee | null>(null);
  const [isLoadingData, setIsLoadingData] = React.useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!id) return;
    const fetchEmployee = async () => {
      setIsLoadingData(true);
      try {
        const response = await employeeService.getEmployee(id);
        if (response.success && response.data) {
          setEmployee(response.data);
        }
      } catch (error: unknown) {
        console.error("Fetch employee error:", error);
        toast.error("Pegawai Tidak Ditemukan", {
          description: "Data pegawai tidak dapat dimuat untuk diedit.",
        });
        router.push("/employees");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchEmployee();
  }, [id, router]);

  const handleSubmit = async (payload: EmployeePayload) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const response = await employeeService.updateEmployee(id, payload);
      if (response.success) {
        toast.success("Data Pegawai Berhasil Diperbarui!", {
          description: `Perubahan data pegawai ${payload.nama} telah disimpan.`,
        });
        router.push(`/employees/${id}`);
      }
    } catch (error: unknown) {
      console.error("Update employee error:", error);
      let errorMsg = "Terjadi kesalahan saat memperbarui data pegawai.";
      if (typeof error === "object" && error !== null && "response" in error) {
        const res = (error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }).response;
        if (res?.data?.message) {
          errorMsg = res.data.message;
        }
        if (res?.data?.errors) {
          const firstErrKey = Object.keys(res.data.errors)[0];
          if (firstErrKey && res.data.errors[firstErrKey][0]) {
            errorMsg = res.data.errors[firstErrKey][0];
          }
        }
      }
      toast.error("Gagal Memperbarui Pegawai", {
        description: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="space-y-6">
        <Topbar
          title="Edit Data Pegawai"
          subtitle="Memuat formulir edit pegawai..."
        />
        <div className="min-h-[400px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (!employee) return null;

  return (
    <div className="space-y-6">
      <Topbar
        title="Edit Data Pegawai"
        subtitle={`Perbarui data informasi ${employee.nama}`}
      />

      <EmployeeForm
        initialData={employee}
        title="Formulir Perubahan Data Pegawai"
        subtitle="Ubah informasi yang diperlukan kemudian tekan Simpan Pegawai"
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}

