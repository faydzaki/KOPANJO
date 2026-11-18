import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/providers/auth-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KOPANJO — Employee Management System",
  description: "Kolaborasi Pengelolaan Administrasi dan Organisasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
      <body className="min-h-screen bg-[#0B1020] text-slate-100 selection:bg-blue-500/30 selection:text-white relative font-sans">
        {/* Futuristic Ambient Glow Background */}
        <div className="ambient-bg">
          <div className="ambient-glow-1" />
          <div className="ambient-glow-2" />
        </div>

        {/* App Content with Auth Provider */}
        <AuthProvider>
          <div className="relative z-10 flex min-h-screen flex-col">
            {children}
          </div>
        </AuthProvider>

        {/* Notification Toaster */}
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "rgba(17, 26, 46, 0.90)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#F8FAFC",
              boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
            },
          }}
        />
      </body>
    </html>
  );
}
