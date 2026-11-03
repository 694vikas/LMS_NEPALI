"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  RefreshCw,
  CheckCircle2,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useUI } from "@/context/UIContext";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const { theme, toggleTheme, isCollapsed, toggleSidebar } = useUI();
  const { user } = useAuth();

  const handleSeed = async () => {
    if (!confirm("Populate database with Nepali school sample students, teachers, and fees?")) {
      return;
    }
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSeedSuccess(true);
        setTimeout(() => {
          setSeedSuccess(false);
          window.location.reload();
        }, 1200);
      } else {
        alert("Seed failed: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error seeding: " + err.message);
    } finally {
      setSeeding(false);
    }
  };

  const isTeacher = user?.role === "TEACHER";
  const userInitials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AD";

  return (
    <header className="h-16 bg-white/85 dark:bg-[#0b1220]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      {/* Left: Sidebar Toggle & School Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all active:scale-95"
          title={isCollapsed ? "Expand Sidebar" : "Collapse to Icons"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>

        <div>
          <h2 className="text-sm md:text-base font-semibold text-slate-800 dark:text-slate-100 leading-tight tracking-tight flex items-center gap-2">
            <span>Himalayan Secondary English Boarding School</span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 rounded-full">
              २०८१ B.S.
            </span>
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
            Approved by Ministry of Education, Nepal • Code: 27-012-0045
          </p>
        </div>
      </div>

      {/* Right Controls: Theme Toggle, Date, Seed, Profile */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Date Display (BS) */}
        <div className="hidden lg:flex items-center bg-gradient-to-r from-rose-50 to-orange-50/40 dark:from-rose-950/20 dark:to-slate-800/40 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-900 dark:text-rose-200 space-x-2 border border-rose-200/60 dark:border-rose-900/30">
          <Calendar className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          <span className="font-medium tracking-tight">कार्तिक २०८१ (Kartik 2081 B.S.)</span>
        </div>

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 transition-all active:scale-95 shadow-sm"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700 transition-transform duration-200 hover:-rotate-12" />
          )}
        </button>

        {/* Quick Seed Button */}
        <button
          onClick={handleSeed}
          disabled={seeding || seedSuccess}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95 shadow-sm ${
            seedSuccess
              ? "bg-emerald-600 text-white shadow-emerald-600/20"
              : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800/80"
          }`}
          title="Seed realistic Nepali student, teacher and fee data"
        >
          {seedSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-white animate-bounce" />
              <span className="hidden sm:inline">Loaded!</span>
            </>
          ) : seeding ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">Seeding...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span className="hidden sm:inline">Seed Data</span>
            </>
          )}
        </button>

        {/* User Profile Badge / Switcher */}
        <Link
          href="/login"
          className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800 group"
          title="Click to Switch User / Sign in"
        >
          <div className="relative">
            <div
              className={`w-8 h-8 rounded-xl text-white flex items-center justify-center font-bold text-xs shadow-md transition-transform group-hover:scale-105 ${
                isTeacher
                  ? "bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/20"
                  : "bg-gradient-to-tr from-rose-600 to-rose-700 shadow-rose-600/20"
              }`}
            >
              {userInitials}
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0b1220] absolute -bottom-0.5 -right-0.5"></span>
          </div>
          <div className="hidden xl:block text-left text-xs">
            <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              {user?.fullName?.split(" ")[0] || "Admin"}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              {isTeacher
                ? user?.isClassTeacher
                  ? `${user.assignedClass} Teacher`
                  : "Faculty"
                : "Principal / Admin"}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
