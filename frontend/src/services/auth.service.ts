import api from "@/lib/api";
import { ApiResponse, User } from "@/types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponseData {
  token: string;
  token_type: string;
  user: User;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponseData>> {
    const response = await api.post<ApiResponse<LoginResponseData>>("/login", credentials);
    return response.data;
  },

  async me(): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>("/me");
    return response.data;
  },

  async logout(): Promise<ApiResponse<null>> {
    const response = await api.post<ApiResponse<null>>("/logout");
    return response.data;
  },
};

