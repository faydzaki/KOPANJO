"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/layout/Topbar";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { employeeService, EmployeePayload } from "@/services/employee.service";
import { toast } from "sonner";

export default function CreateEmployeePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const handleSubmit = async (payload: EmployeePayload) => {
    setIsSubmitting(true);
    try {
      const response = await employeeService.createEmployee(payload);
      if (response.success) {
        toast.success("Pegawai Berhasil Ditambahkan!", {
          description: `Data pegawai ${payload.nama} telah tersimpan di sistem.`,
        });
        router.push("/employees");
      }
    } catch (error: unknown) {
      console.error("Create employee error:", error);
      let errorMsg = "Terjadi kesalahan saat menambahkan data pegawai.";
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
      toast.error("Gagal Menambahkan Pegawai", {
        description: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Topbar
        title="Tambah Pegawai Baru"
        subtitle="Daftarkan data pegawai baru ke dalam sistem organisasi KOPANJO"
      />

      <EmployeeForm
        title="Formulir Tambah Pegawai"
        subtitle="Lengkapi seluruh data personal, kontak, dan posisi pekerjaan pegawai dengan benar"
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}

