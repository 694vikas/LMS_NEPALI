"use client";

import { usePathname } from "next/navigation";
import NextLink from "next/link";
import {
  GraduationCap,
  Users,
  UserCheck,
  CreditCard,
  LayoutDashboard,
  CalendarDays,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  BellRing,
} from "lucide-react";
import { useUI } from "@/context/UIContext";

const navigation = [
  { name: "Overview", shortName: "Home", href: "/", icon: LayoutDashboard },
  { name: "Students (कक्षा/विद्यार्थी)", shortName: "Students", href: "/students", icon: Users },
  { name: "Teachers (शिक्षक खण्ड)", shortName: "Teachers", href: "/teachers", icon: UserCheck },
  { name: "Fees & Dues (शुल्क लेखा)", shortName: "Fees", href: "/fees", icon: CreditCard },
  { name: "Attendance (दैनिक हाजिरी)", shortName: "Attendance", href: "/attendance", icon: ClipboardCheck },
  { name: "LMS & Notices (सूचना/सिकाइ)", shortName: "LMS", href: "/lms", icon: BellRing },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useUI();

  return (
    <aside
      className={`bg-slate-900 dark:bg-slate-950 text-slate-100 flex flex-col flex-shrink-0 min-h-screen border-r border-slate-800 dark:border-slate-800/80 transition-all duration-300 ease-in-out relative z-40 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* School Header & Toggle */}
      <div
        className={`p-4 border-b border-slate-800 flex items-center justify-between ${
          isCollapsed ? "justify-center flex-col gap-2" : ""
        }`}
      >
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-blue-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 transition-opacity duration-200">
              <h1 className="font-bold text-sm tracking-wide text-white leading-tight truncate">
                Himalayan Sec. School
              </h1>
              <p className="text-xs text-rose-400 font-medium truncate">
                LMS Nepal • २०८१
              </p>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
            isCollapsed ? "mt-1" : ""
          }`}
          title={isCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse to Icons"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-x-hidden">
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Core Portals
          </div>
        )}

        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <NextLink
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={`flex items-center rounded-lg text-sm font-medium transition-all group relative ${
                isCollapsed
                  ? "justify-center p-3"
                  : "px-3 py-2.5"
              } ${
                isActive
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <Icon
                className={`shrink-0 transition-transform ${
                  isCollapsed ? "w-5 h-5 group-hover:scale-110" : "w-5 h-5 mr-3"
                }`}
              />
              {!isCollapsed && (
                <span className="truncate">{item.name}</span>
              )}

              {/* Floating Tooltip when Collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-slate-700">
                  {item.name}
                </div>
              )}
            </NextLink>
          );
        })}

        {!isCollapsed && (
          <>
            <div className="pt-6 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Academic Tools
            </div>
            <div className="px-3 py-2 text-xs text-slate-400 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">Academic Year: 2081 B.S.</span>
            </div>
            <div className="px-3 py-2 text-xs text-slate-400 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">Grading: CDC Nepal (GPA)</span>
            </div>
          </>
        )}
      </nav>

      {/* Footer Info */}
      <div
        className={`border-t border-slate-800 text-xs text-slate-400 transition-all ${
          isCollapsed ? "p-3 flex justify-center" : "p-4"
        }`}
      >
        {isCollapsed ? (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            NP
          </span>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-300 font-medium">Session 2081/82</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                NEPAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Kathmandu, Bagmati</p>
          </div>
        )}
      </div>
    </aside>
  );
}
