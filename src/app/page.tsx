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
  CheckCircle,
  Clock,
  Sparkles,
  ClipboardCheck,
  BellRing,
  BookOpen,
  Pin,
  Calendar,
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner / Welcome */}
      <div className="bg-gradient-to-r from-rose-700 via-rose-800 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-semibold tracking-wide text-rose-200 mb-3 border border-white/20">
            <School className="w-3.5 h-3.5" />
            <span>Academic Session २०८१-२०८२ (2081 B.S.)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Namaste, School Administration Portal
          </h1>
          <p className="text-rose-100 text-sm mt-1 max-w-2xl">
            Welcome to the centralized management system for students, faculty routines, daily attendance, study materials, and monthly fee administration.
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Link
              href="/attendance"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/20 font-medium transition-colors"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Take Today&apos;s Attendance</span>
            </Link>
            <Link
              href="/lms"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/20 font-medium transition-colors"
            >
              <BellRing className="w-3.5 h-3.5 text-amber-400" />
              <span>School Notice Board ({data.noticesCount})</span>
            </Link>
            <Link
              href="/lms?tab=materials"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/20 font-medium transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Study Notes & Past Questions ({data.materialsCount})</span>
            </Link>
          </div>
        </div>
      </div>

      {!data.hasData && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-5 flex items-start gap-4">
          <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
              Database is currently empty
            </h3>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              Click the <strong className="font-semibold text-rose-700 dark:text-rose-400">“Seed Sample Data”</strong> button in the top navigation bar to instantly load realistic Nepali students, teachers, and fee records.
            </p>
          </div>
        </div>
      )}

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Students
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">{data.totalStudents}</p>
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Across all classes</span>
            <Link
              href="/students"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
            >
              Class Roster <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Total Teachers */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Faculty / Teachers
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">{data.totalTeachers}</p>
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Subject & Class Teachers</span>
            <Link
              href="/teachers"
              className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
            >
              Teacher Directory <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Fee Collected */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Fee Collected (Kartik)
            </span>
            <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">
            रु {data.totalCollected.toLocaleString("en-IN")}
          </p>
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {data.paidCount} Students Paid
            </span>
            <Link
              href="/fees"
              className="text-slate-600 dark:text-slate-400 font-medium hover:underline flex items-center gap-1"
            >
              View Invoices <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Pending Dues */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pending Dues (बक्यौता)
            </span>
            <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2">
            रु {data.totalDues.toLocaleString("en-IN")}
          </p>
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-rose-600 dark:text-rose-400 font-medium">
              {data.unpaidCount + data.partialCount} Incomplete
            </span>
            <Link
              href="/fees?status=Pending"
              className="text-rose-600 dark:text-rose-400 font-medium hover:underline flex items-center gap-1"
            >
              Collect Now <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sections: Class Breakdown & Fee Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class-wise Student Distribution */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                Class-wise Student Distribution (कक्षागत विद्यार्थी संख्या)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click on any class to open its filtered student roster
              </p>
            </div>
            <Link
              href="/students"
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:underline"
            >
              View All Students →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.keys(data.classCountMap).length > 0 ? (
              Object.entries(data.classCountMap).map(([className, count]) => (
                <Link
                  key={className}
                  href={`/students?className=${encodeURIComponent(className)}`}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-rose-50/50 dark:hover:bg-slate-800 hover:border-rose-300 dark:hover:border-rose-500/50 transition-all group"
                >
                  <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 font-medium">
                    {className}
                  </p>
                  <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                    {count}{" "}
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                      students
                    </span>
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 col-span-3 py-6 text-center">
                No classes registered yet. Use Seed Sample Data to preview.
              </p>
            )}
          </div>

          {/* Latest Notice Preview */}
          {data.notices.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <BellRing className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  Latest School Notice (ताजा सूचना)
                </span>
                <Link
                  href="/lms"
                  className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  All Notices ({data.noticesCount}) →
                </Link>
              </div>

              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    {data.notices[0].isPinned && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        <Pin className="w-3 h-3 rotate-45" /> Pinned
                      </span>
                    )}
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {data.notices[0].category} • {data.notices[0].dateBS}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {data.notices[0].title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                    {data.notices[0].content}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fee Collection Status */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base">
              Fee Collection Status
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Current Month: Kartik 2081 B.S.
            </p>

            <div className="mt-5 space-y-4">
              {/* Paid Status */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/50">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-900 dark:text-emerald-200">
                    Fully Paid (सम्पन्न)
                  </span>
                </div>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                  {data.paidCount} students
                </span>
              </div>

              {/* Partial Status */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-800/50">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-medium text-amber-900 dark:text-amber-200">
                    Partially Paid (आंशिक)
                  </span>
                </div>
                <span className="font-bold text-amber-700 dark:text-amber-400 text-sm">
                  {data.partialCount} students
                </span>
              </div>

              {/* Pending Status */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-800/50">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span className="text-xs font-medium text-rose-900 dark:text-rose-200">
                    Pending / Unpaid (बाँकी)
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
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-rose-600 dark:hover:bg-rose-700 text-white font-medium text-xs transition-colors"
            >
              <span>Open Fee Management & Invoices</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
