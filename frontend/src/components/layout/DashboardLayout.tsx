"use client";

import * as React from "react";
import Image from "next/image";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LayoutContextType {
  onOpenMobileMenu: () => void;
}

const LayoutContext = React.createContext<LayoutContextType>({
  onOpenMobileMenu: () => {},
});

export const useLayout = () => React.useContext(LayoutContext);

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [collapsed, setCollapsed] = React.useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState<boolean>(false);

  // Authentication check
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Loading Screen while verifying session
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl glass-card border border-white/10 shadow-2xl">
          <Image
            src="/logo1.png"
            alt="KOPANJO"
            width={64}
            height={64}
            priority
            className="w-16 h-16 object-contain animate-pulse drop-shadow-[0_0_20px_rgba(79,140,255,0.4)]"
          />
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold text-white tracking-wide">KOPANJO</h2>
            <p className="text-xs text-slate-400">Memverifikasi sesi autentikasi...</p>
          </div>
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin mt-2" />
        </div>
      </div>
    );
  }

  // Not authenticated will redirect, don't render layout content
  if (!isAuthenticated) {
    return null;
  }

  return (
    <LayoutContext.Provider value={{ onOpenMobileMenu: () => setIsMobileOpen(true) }}>
      <div className="min-h-screen flex flex-col">
        {/* Floating Sidebar */}
        <Sidebar
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />

        {/* Main Content Area */}
        <main
          className={cn(
            "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-out",
            "p-4 lg:py-4 lg:pr-6",
            collapsed ? "lg:pl-28" : "lg:pl-72"
          )}
        >
          {children}
        </main>
      </div>
    </LayoutContext.Provider>
  );
}
