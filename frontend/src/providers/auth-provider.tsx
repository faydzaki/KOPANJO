"use client";

import * as React from "react";
import { User } from "@/types";
import { getToken, getUser, setToken, setUser, clearAuth } from "@/lib/auth";
import { authService, LoginCredentials } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setCurrentUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const router = useRouter();

  // Initialize auth state on mount
  React.useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Check cached user first for instant display
      const cachedUser = getUser();
      if (cachedUser) {
        setCurrentUser(cachedUser);
      }

      try {
        const response = await authService.me();
        if (response.success && response.data) {
          setCurrentUser(response.data);
          setUser(response.data);
        }
      } catch {
        // Token invalid or expired
        clearAuth();
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        setToken(response.data.token);
        setUser(response.data.user);
        setCurrentUser(response.data.user);
        toast.success("Login berhasil!", {
          description: `Selamat datang kembali, ${response.data.user.name}.`,
        });
        return true;
      }
      return false;
    } catch (error: unknown) {
      let msg = "Email atau password yang Anda masukkan salah.";
      if (typeof error === "object" && error !== null && "response" in error) {
        const res = (error as { response?: { data?: { message?: string } } }).response;
        if (res?.data?.message) {
          msg = res.data.message;
        }
      }
      toast.error("Gagal Masuk", {
        description: msg,
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch {
      // Ignore network error on logout
    } finally {
      clearAuth();
      setCurrentUser(null);
      toast.info("Anda telah keluar.", {
        description: "Sesi telah diakhiri dengan aman.",
      });
      router.push("/login");
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await authService.me();
      if (response.success && response.data) {
        setCurrentUser(response.data);
        setUser(response.data);
      }
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
