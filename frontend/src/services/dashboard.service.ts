import api from "@/lib/api";
import {
  AgeAnalytics,
  ApiResponse,
  DashboardStatistics,
  EducationAnalytics,
  GenderAnalytics,
} from "@/types";

export const dashboardService = {
  async getStatistics(): Promise<ApiResponse<DashboardStatistics>> {
    const response = await api.get<ApiResponse<DashboardStatistics>>("/dashboard/statistics");
    return response.data;
  },

  async getGenderAnalytics(): Promise<ApiResponse<GenderAnalytics>> {
    const response = await api.get<ApiResponse<GenderAnalytics>>("/dashboard/gender");
    return response.data;
  },

  async getEducationAnalytics(): Promise<ApiResponse<EducationAnalytics>> {
    const response = await api.get<ApiResponse<EducationAnalytics>>("/dashboard/education");
    return response.data;
  },

  async getAgeAnalytics(): Promise<ApiResponse<AgeAnalytics>> {
    const response = await api.get<ApiResponse<AgeAnalytics>>("/dashboard/age");
    return response.data;
  },
};

