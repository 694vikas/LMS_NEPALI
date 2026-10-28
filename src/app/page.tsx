import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { Student } from "@/models/Student";
import { Teacher } from "@/models/Teacher";
import { FeeInvoice } from "@/models/FeeInvoice";
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
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  try {
    await connectDB();
    const students = await Student.find({}).lean();
    const teachers = await Teacher.find({}).lean();
    const invoices = await FeeInvoice.find({}).lean();

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
            Welcome to the centralized management system for students, faculty routines, and monthly fee administration.
          </p>
        </div>
      </div>

      {!data.hasData && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
          <Sparkles className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900 text-sm">
              Database is currently empty
            </h3>
            <p className="text-xs text-amber-700 mt-1">
              Click the <strong className="font-semibold text-rose-700">“Seed Sample Data”</strong> button in the top navigation bar to instantly load realistic Nepali students, teachers, and fee records.
            </p>
          </div>
        </div>
      )}

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Students
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">{data.totalStudents}</p>
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-slate-500">Across all classes</span>
            <Link
              href="/students"
              className="text-blue-600 font-medium hover:underline flex items-center gap-1"
            >
              Class Roster <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Total Teachers */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Faculty / Teachers
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">{data.totalTeachers}</p>
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-slate-500">Subject & Class Teachers</span>
            <Link
              href="/teachers"
              className="text-emerald-600 font-medium hover:underline flex items-center gap-1"
            >
              Teacher Directory <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Fee Collected */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Fee Collected (Kartik)
            </span>
            <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">
            रु {data.totalCollected.toLocaleString("en-IN")}
          </p>
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {data.paidCount} Students Paid
            </span>
            <Link
              href="/fees"
              className="text-slate-600 font-medium hover:underline flex items-center gap-1"
            >
              View Invoices <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Pending Dues */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Dues (बक्यौता)
            </span>
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-600 mt-2">
            रु {data.totalDues.toLocaleString("en-IN")}
          </p>
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-rose-600 font-medium">
              {data.unpaidCount + data.partialCount} Incomplete
            </span>
            <Link
              href="/fees?status=Pending"
              className="text-rose-600 font-medium hover:underline flex items-center gap-1"
            >
              Collect Now <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sections: Class Breakdown & Fee Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class-wise Student Distribution */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h2 className="font-bold text-slate-800 text-base">
                Class-wise Student Distribution (कक्षागत विद्यार्थी संख्या)
              </h2>
              <p className="text-xs text-slate-500">
                Click on any class to open its filtered student roster
              </p>
            </div>
            <Link
              href="/students"
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
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
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-rose-50/50 hover:border-rose-300 transition-all group"
                >
                  <p className="text-xs text-slate-500 group-hover:text-rose-600 font-medium">
                    {className}
                  </p>
                  <p className="text-xl font-bold text-slate-800 mt-1">
                    {count}{" "}
                    <span className="text-xs font-normal text-slate-500">
                      students
                    </span>
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-500 col-span-3 py-6 text-center">
                No classes registered yet. Use Seed Sample Data to preview.
              </p>
            )}
          </div>
        </div>

        {/* Fee Collection Status */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-slate-800 text-base">
              Fee Collection Status
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Current Month: Kartik 2081 B.S.
            </p>

            <div className="mt-5 space-y-4">
              {/* Paid Status */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-900">
                    Fully Paid (सम्पन्न)
                  </span>
                </div>
                <span className="font-bold text-emerald-700 text-sm">
                  {data.paidCount} students
                </span>
              </div>

              {/* Partial Status */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-medium text-amber-900">
                    Partially Paid (आंशिक)
                  </span>
                </div>
                <span className="font-bold text-amber-700 text-sm">
                  {data.partialCount} students
                </span>
              </div>

              {/* Pending Status */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-rose-50 border border-rose-100">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-medium text-rose-900">
                    Pending / Unpaid (बाँकी)
                  </span>
                </div>
                <span className="font-bold text-rose-700 text-sm">
                  {data.unpaidCount} students
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/fees"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
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

