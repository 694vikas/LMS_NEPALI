import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { Student } from "@/models/Student";
import { Teacher } from "@/models/Teacher";
import { FeeInvoice } from "@/models/FeeInvoice";
import { Notice } from "@/models/Notice";
import { StudyMaterial } from "@/models/StudyMaterial";
import {
  Users,
  UserCheck,
  CreditCard,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  School,
  CheckCircle2,
  Clock,
  Sparkles,
  ClipboardCheck,
  BellRing,
  BookOpen,
  Pin,
  Calendar,
  Layers,
  GraduationCap,
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  try {
    await connectDB();
    const students = await Student.find({}).lean();
    const teachers = await Teacher.find({}).lean();
    const invoices = await FeeInvoice.find({}).lean();
    const notices = await Notice.find({}).sort({ isPinned: -1, createdAt: -1 }).limit(3).lean();
    const noticesCount = await Notice.countDocuments();
    const materialsCount = await StudyMaterial.countDocuments();

    const totalStudents = students.length;
    const totalTeachers = teachers.length;

    const totalBilled = invoices.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
    const totalCollected = invoices.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
    const totalDues = invoices.reduce((acc, curr) => acc + (curr.balanceAmount || 0), 0);

    const paidCount = invoices.filter((i) => i.status === "Paid").length;
    const unpaidCount = invoices.filter((i) => i.status === "Pending").length;
    const partialCount = invoices.filter((i) => i.status === "Partial").length;

    // Group students by Class
    const classCountMap: Record<string, number> = {};
    students.forEach((s) => {
      classCountMap[s.className] = (classCountMap[s.className] || 0) + 1;
    });

    return {
      totalStudents,
      totalTeachers,
      totalBilled,
      totalCollected,
      totalDues,
      paidCount,
      unpaidCount,
      partialCount,
      classCountMap,
      notices,
      noticesCount,
      materialsCount,
      hasData: totalStudents > 0,
    };
  } catch (error) {
    console.error("Dashboard data error:", error);
    return {
      totalStudents: 0,
      totalTeachers: 0,
      totalBilled: 0,
      totalCollected: 0,
      totalDues: 0,
      paidCount: 0,
      unpaidCount: 0,
      partialCount: 0,
      classCountMap: {},
      notices: [],
      noticesCount: 0,
      materialsCount: 0,
      hasData: false,
    };
  }
}

export default async function OverviewPage() {
  const data = await getDashboardData();
  const totalInvoices = data.paidCount + data.partialCount + data.unpaidCount;
  const collectionRate =
    data.totalBilled > 0 ? Math.round((data.totalCollected / data.totalBilled) * 100) : 0;

  return (
    <div className="space-y-7 max-w-7xl mx-auto pb-8">
      {/* Hero Banner: Clean & Eye-Catching Glassmorphism */}
      <div className="relative rounded-3xl p-6 md:p-8 text-white shadow-xl overflow-hidden bg-gradient-to-br from-rose-700 via-rose-800 to-slate-950 border border-rose-500/20 card-shine">
        {/* Ambient Decorative Lighting */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-amber-500/15 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium tracking-wide text-rose-200 border border-white/15 shadow-sm">
              <School className="w-3.5 h-3.5 text-amber-300" />
              <span>शैक्षिक सत्र २०८१-२०८२ • Session 2081 B.S.</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
              Himalayan Secondary School
            </h1>
            <p className="text-rose-100/90 text-xs md:text-sm leading-relaxed">
              Integrated School Information & Learning Management System. Real-time class rosters, daily attendance register, CDC study materials, and Bikram Sambat fee ledger.
            </p>

            {/* Quick Action Pills */}
            <div className="pt-2 flex flex-wrap gap-2.5 text-xs">
              <Link
                href="/attendance"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 font-medium transition-all active:scale-95 shadow-sm"
              >
                <ClipboardCheck className="w-4 h-4 text-emerald-300" />
                <span>Take Attendance</span>
              </Link>
              <Link
                href="/fees"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 font-medium transition-all active:scale-95 shadow-sm"
              >
                <CreditCard className="w-4 h-4 text-amber-300" />
                <span>Collect Fees</span>
              </Link>
              <Link
                href="/lms"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 font-medium transition-all active:scale-95 shadow-sm"
              >
                <BellRing className="w-4 h-4 text-rose-300" />
                <span>Notice Board ({data.noticesCount})</span>
              </Link>
              <Link
                href="/teacher/dashboard"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 font-medium transition-all active:scale-95 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Teacher Portal</span>
              </Link>
            </div>
          </div>

          {/* Quick Stat Pill Widget */}
          <div className="hidden lg:flex flex-col gap-2.5 bg-black/25 backdrop-blur-md p-4 rounded-2xl border border-white/15 min-w-[220px]">
            <div className="flex items-center justify-between text-xs text-rose-200">
              <span>Collection Health</span>
              <span className="font-bold text-white">{collectionRate}%</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${collectionRate}%` }}
              ></div>
            </div>
            <div className="pt-1 flex items-center justify-between text-[11px] text-rose-200/80">
              <span>Kartik 2081 B.S.</span>
              <span>{data.paidCount} / {totalInvoices || 1} Paid</span>
            </div>
          </div>
        </div>
      </div>

      {!data.hasData && (
        <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-amber-900 dark:text-amber-200 text-sm">
              Database is currently empty
            </h3>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              Click the <strong className="font-semibold text-rose-600 dark:text-rose-400">“Seed Data”</strong> button in the top navigation bar to populate sample Nepali students, faculty members, notice posts, and fee records.
            </p>
          </div>
        </div>
      )}

      {/* 4 Eye-Catching KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white dark:bg-[#0d1527] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Students
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/50 shadow-sm">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-3 tracking-tight">
            {data.totalStudents}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/70 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Nursery to Class 10 (SEE)</span>
            <Link
              href="/students"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 group"
            >
              <span>Roster</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Total Faculty */}
        <div className="bg-white dark:bg-[#0d1527] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Faculty / Teachers
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50 shadow-sm">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-3 tracking-tight">
            {data.totalTeachers}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/70 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Subject Teachers</span>
            <Link
              href="/teachers"
              className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 group"
            >
              <span>Faculty</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Fee Collected */}
        <div className="bg-white dark:bg-[#0d1527] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Collected (कार्तिक)
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-100 dark:border-teal-900/50 shadow-sm">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-3 tracking-tight truncate">
            रु {data.totalCollected.toLocaleString("en-IN")}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/70 text-xs">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> {data.paidCount} Fully Paid
            </span>
            <Link
              href="/fees"
              className="text-slate-600 dark:text-slate-400 font-semibold hover:underline flex items-center gap-1 group"
            >
              <span>Ledger</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Pending Dues */}
        <div className="bg-white dark:bg-[#0d1527] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pending Dues (बक्यौता)
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/50 shadow-sm">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-3 tracking-tight truncate">
            रु {data.totalDues.toLocaleString("en-IN")}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/70 text-xs">
            <span className="text-rose-600 dark:text-rose-400 font-semibold">
              {data.unpaidCount + data.partialCount} Incomplete
            </span>
            <Link
              href="/fees?status=Pending"
              className="text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-1 group"
            >
              <span>Collect</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Class Distribution & Financial Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class-wise Student Distribution */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0d1527] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 gap-2 mb-5">
            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Class-wise Student Distribution (कक्षागत विद्यार्थी)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Click any class badge to view its full student directory & roll numbers
              </p>
            </div>
            <Link
              href="/students"
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:underline shrink-0"
            >
              View All Students →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.keys(data.classCountMap).length > 0 ? (
              Object.entries(data.classCountMap).map(([className, count]) => {
                const isSEE = className.includes("SEE") || className.includes("10");
                return (
                  <Link
                    key={className}
                    href={`/students?className=${encodeURIComponent(className)}`}
                    className={`p-4 rounded-xl border transition-all group duration-150 hover:-translate-y-0.5 ${
                      isSEE
                        ? "border-rose-200 dark:border-rose-900/60 bg-gradient-to-br from-rose-50/50 to-white dark:from-rose-950/20 dark:to-slate-900/40 hover:border-rose-400 shadow-sm"
                        : "border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-rose-400 truncate">
                        {className}
                      </p>
                      {isSEE && (
                        <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-rose-600 text-white rounded-md">
                          SEE
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-2 tracking-tight">
                      {count}
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1.5">
                        students
                      </span>
                    </p>
                  </Link>
                );
              })
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 col-span-3 py-8 text-center">
                No classes registered yet. Use Seed Data to preview sample classes.
              </p>
            )}
          </div>

          {/* Latest Notice Bulletin Card */}
          {data.notices.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <BellRing className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  Latest School Announcement (ताजा सूचना)
                </span>
                <Link
                  href="/lms"
                  className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  All Notices ({data.noticesCount}) →
                </Link>
              </div>

              <div className="p-4 rounded-xl border border-rose-200/80 dark:border-rose-900/50 bg-gradient-to-r from-rose-50/40 via-orange-50/20 to-transparent dark:from-rose-950/20 dark:via-slate-900 dark:to-transparent flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    {data.notices[0].isPinned && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-600 text-white">
                        <Pin className="w-3 h-3" /> Pinned
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-300">
                      {data.notices[0].category}
                    </span>
                    <span className="text-[11px] text-slate-400">•</span>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {data.notices[0].dateBS}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {data.notices[0].title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {data.notices[0].content}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fee Collection Status Card */}
        <div className="bg-white dark:bg-[#0d1527] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Fee Health (शुल्क स्थिति)</span>
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                कार्तिक २०८१
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Current Nepali Month Billed: रु {data.totalBilled.toLocaleString("en-IN")}
            </p>

            {/* Segmented Progress Bar */}
            <div className="mt-4">
              <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${totalInvoices ? (data.paidCount / totalInvoices) * 100 : 0}%` }}
                  className="bg-emerald-500 h-full"
                  title={`Paid: ${data.paidCount}`}
                ></div>
                <div
                  style={{ width: `${totalInvoices ? (data.partialCount / totalInvoices) * 100 : 0}%` }}
                  className="bg-amber-400 h-full"
                  title={`Partial: ${data.partialCount}`}
                ></div>
                <div
                  style={{ width: `${totalInvoices ? (data.unpaidCount / totalInvoices) * 100 : 0}%` }}
                  className="bg-rose-500 h-full"
                  title={`Pending: ${data.unpaidCount}`}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 px-0.5">
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Paid ({data.paidCount})
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> Partial ({data.partialCount})
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Unpaid ({data.unpaidCount})
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {/* Paid Status */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/40">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-950 dark:text-emerald-200">
                    Fully Cleared (सम्पन्न)
                  </span>
                </div>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                  {data.paidCount} students
                </span>
              </div>

              {/* Partial Status */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-semibold text-amber-950 dark:text-amber-200">
                    Partial Paid (आंशिक)
                  </span>
                </div>
                <span className="font-bold text-amber-700 dark:text-amber-400 text-sm">
                  {data.partialCount} students
                </span>
              </div>

              {/* Pending Status */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span className="text-xs font-semibold text-rose-950 dark:text-rose-200">
                    Pending / Dues (बाँकी)
                  </span>
                </div>
                <span className="font-bold text-rose-700 dark:text-rose-400 text-sm">
                  {data.unpaidCount} students
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/fees"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-rose-600 dark:hover:bg-rose-700 text-white font-medium text-xs transition-all active:scale-[0.98] shadow-sm"
            >
              <span>Open Nepali Fee Ledger</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
