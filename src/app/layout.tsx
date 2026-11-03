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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50/80 dark:bg-[#090e17] text-slate-900 dark:text-slate-100 flex font-sans antialiased selection:bg-rose-500 selection:text-white transition-colors duration-250">
        <UIProvider>
          <AuthProvider>
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-gradient-to-b from-slate-50 via-slate-50/50 to-slate-100/40 dark:from-[#090e17] dark:via-[#0b1322] dark:to-[#080d15]">
              <Navbar />
              <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">{children}</main>
            </div>
          </AuthProvider>
        </UIProvider>
      </body>
    </html>
  );
}
