import api from "@/lib/api";
import { ApiResponse, Employee } from "@/types";

export interface EmployeeQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  jenis_kelamin?: string;
  pendidikan_terakhir?: string;
  jabatan?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface EmployeePayload {
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
}

export const employeeService = {
  async getEmployees(params?: EmployeeQueryParams): Promise<ApiResponse<Employee[]>> {
    const response = await api.get<ApiResponse<Employee[]>>("/employees", { params });
    return response.data;
  },

  async getEmployee(id: number | string): Promise<ApiResponse<Employee>> {
    const response = await api.get<ApiResponse<Employee>>(`/employees/${id}`);
    return response.data;
  },

  async createEmployee(payload: EmployeePayload): Promise<ApiResponse<Employee>> {
    const response = await api.post<ApiResponse<Employee>>("/employees", payload);
    return response.data;
  },

  async updateEmployee(id: number | string, payload: EmployeePayload): Promise<ApiResponse<Employee>> {
    const response = await api.put<ApiResponse<Employee>>(`/employees/${id}`, payload);
    return response.data;
  },

  async deleteEmployee(id: number | string): Promise<ApiResponse<null>> {
    const response = await api.delete<ApiResponse<null>>(`/employees/${id}`);
    return response.data;
  },
};
