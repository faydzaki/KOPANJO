"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = React.useState<string>("admin@kopanjo.test");
  const [password, setPassword] = React.useState<string>("admin123");
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Silakan masukkan email dan password.");
      return;
    }

    setIsSubmitting(true);
    const success = await login({ email, password });
    setIsSubmitting(false);

    if (success) {
      router.push("/dashboard");
    } else {
      setErrorMessage("Email atau password yang Anda masukkan salah.");
    }
  };

  const handleFillDemo = () => {
    setEmail("admin@kopanjo.test");
    setPassword("admin123");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full filter blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-8 sm:p-10 border border-white/15 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-500">
        {/* Glow Border Effect */}
        <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-blue-500/20 via-indigo-500/10 to-violet-500/20 -z-10 blur-sm pointer-events-none" />

        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-3 group hover:scale-105 transition-transform duration-300">
            <Image
              src="/logo2.png"
              alt="KOPANJO"
              width={220}
              height={73}
              priority
              className="h-14 sm:h-16 w-auto object-contain drop-shadow-[0_0_25px_rgba(79,140,255,0.35)]"
            />
          </div>

          <p className="text-[11px] text-blue-400 font-medium tracking-wider uppercase mt-1">
            Kolaborasi Pengelolaan Administrasi & Organisasi
          </p>

          <div className="mt-5 space-y-1">
            <h2 className="text-lg font-semibold text-slate-100">Welcome Back</h2>
            <p className="text-xs text-slate-400">
              Sign in to manage your workforce and organization
            </p>
          </div>
        </div>

        {/* Demo Credentials Alert Banner */}
        <div className="mb-6 p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="truncate">Demo Admin: admin@kopanjo.test</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-2 shrink-0 cursor-pointer"
          >
            Auto-fill
          </button>
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 font-medium animate-in shake">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@kopanjo.test"
              required
              icon={<Mail className="w-4 h-4" />}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">Password</label>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                icon={<Lock className="w-4 h-4" />}
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full text-sm font-semibold tracking-wide"
              isLoading={isSubmitting}
            >
              Sign In to Dashboard
            </Button>
          </div>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center text-[11px] text-slate-500">
          KOPANJO &bull; Enterprise Employee Management System
        </div>
      </div>
    </div>
  );
}

