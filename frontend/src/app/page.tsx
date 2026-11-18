"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Loader2 } from "lucide-react";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Image
        src="/logo1.png"
        alt="KOPANJO"
        width={48}
        height={48}
        priority
        className="w-12 h-12 object-contain animate-pulse drop-shadow-[0_0_15px_rgba(79,140,255,0.4)]"
      />
      <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
    </div>
  );
}
