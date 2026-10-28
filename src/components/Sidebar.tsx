"use client";

import Link from "next/navigation";
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
  Settings,
  School,
} from "lucide-react";

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Students (कक्षा/विद्यार्थी)", href: "/students", icon: Users },
  { name: "Teachers (शिक्षक खण्ड)", href: "/teachers", icon: UserCheck },
  { name: "Fees & Dues (शुल्क लेखा)", href: "/fees", icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col flex-shrink-0 min-h-screen border-r border-slate-800">
      {/* School Header */}
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-blue-600 flex items-center justify-center text-white shadow-lg">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-wide text-white leading-tight">
            Himalayan Sec. School
          </h1>
          <p className="text-xs text-rose-400 font-medium">LMS Nepal • २०८१</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Core Portals
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <NextLink
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 mr-3 shrink-0" />
              <span>{item.name}</span>
            </NextLink>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Academic Tools
        </div>
        <div className="px-3 py-2 text-xs text-slate-400 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-amber-400" />
          <span>Academic Year: 2081 B.S.</span>
        </div>
        <div className="px-3 py-2 text-xs text-slate-400 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Grading: CDC Nepal (GPA)</span>
        </div>
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center justify-between mb-1">
          <span className="text-slate-300 font-medium">Session 2081/82</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            NEPAL
          </span>
        </div>
        <p className="text-[11px] text-slate-400">Kathmandu, Bagmati</p>
      </div>
    </aside>
  );
}

