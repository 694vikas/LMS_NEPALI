import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { UIProvider } from "@/context/UIContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Nepali School LMS & Management System",
  description: "Comprehensive School Management System tailored for Nepali Schools & Students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex antialiased transition-colors duration-200">
        <UIProvider>
          <AuthProvider>
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
              <Navbar />
              <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
            </div>
          </AuthProvider>
        </UIProvider>
      </body>
    </html>
  );
}
