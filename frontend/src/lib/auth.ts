import Cookies from "js-cookie";
import { User } from "@/types";

const TOKEN_KEY = "kopanjo_auth_token";
const USER_KEY = "kopanjo_user";

export function getToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return Cookies.get(TOKEN_KEY);
}

export function setToken(token: string): void {
  // Store token in cookie with 7 days expiration
  Cookies.set(TOKEN_KEY, token, {
    expires: 7,
    sameSite: "Lax",
    secure: window.location.protocol === "https:",
  });
}

export function removeToken(): void {
  Cookies.remove(TOKEN_KEY);
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson) as User;
  } catch {
    return null;
  }
}

export function setUser(user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
}

export function clearAuth(): void {
  removeToken();
  removeUser();
}
