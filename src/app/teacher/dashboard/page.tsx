"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserCheck,
  School,
  BookOpen,
  ClipboardCheck,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  FileText,
  Upload,
  Plus,
  ArrowRight,
  Sparkles,
  Calendar,
  Save,
  Check,
  X,
  Download,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { FileUploadInput } from "@/components/FileUploadInput";

interface StudentItem {
  _id: string;
  studentId: string;
  rollNo: number;
  fullName: string;
  nepaliName?: string;
  className: string;
  section: string;
  guardianName: string;
  guardianPhone: string;
  bloodGroup?: string;
}

interface MaterialItem {
  _id: string;
  title: string;
  className: string;
  subject: string;
  fileUrl: string;
  downloadsCount: number;
}

interface AttendanceRecord {
  studentId: string;
  rollNo: number;
  studentName: string;
  status: "Present" | "Absent" | "Late" | "Leave";
  remarks?: string;
}

function TeacherDashboardContent() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [students, setStudents] = useState<StudentItem[]>([]);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isAttendanceRecorded, setIsAttendanceRecorded] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [attendanceSaved, setAttendanceSaved] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Quick Upload Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    className: "",
    subject: "",
    fileUrl: "https://moecdc.gov.np",
    fileType: "PDF",
  });
  const [uploading, setUploading] = useState(false);

  // Default class & section
  const assignedClass = user?.assignedClass || "Class 10 (SEE)";
  const assignedSection = user?.assignedSection || "A";
  const teacherSubjects = user?.subjects || ["Compulsory Mathematics"];

  // Fetch teacher's specific class data
  const loadTeacherData = async () => {
    setLoadingData(true);
    try {
      // 1. Fetch students for assigned class
      const stdRes = await fetch(
        `/api/students?className=${encodeURIComponent(assignedClass)}&section=${encodeURIComponent(assignedSection)}`
      );
      const stdJson = await stdRes.json();
      if (stdJson.success) {
        setStudents(stdJson.data);
      }

      // 2. Fetch today's attendance for this class
      const todayBS = "2081-07-15";
      const attRes = await fetch(
        `/api/attendance?className=${encodeURIComponent(assignedClass)}&section=${encodeURIComponent(assignedSection)}&dateBS=${todayBS}`
      );
      const attJson = await attRes.json();
      if (attJson.success && attJson.data) {
        setAttendanceRecords(attJson.data.records || []);
        setIsAttendanceRecorded(Boolean(attJson.isRecorded));
      }

      // 3. Fetch materials uploaded or matching teacher's class
      const matRes = await fetch(`/api/materials?className=${encodeURIComponent(assignedClass)}`);
      const matJson = await matRes.json();
      if (matJson.success) {
        setMaterials(matJson.data);
      }
    } catch (e) {
      console.error("Error loading teacher data:", e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      loadTeacherData();
      setUploadForm((prev) => ({
        ...prev,
        className: assignedClass,
        subject: teacherSubjects[0] || "Mathematics",
      }));
    }
  }, [user, authLoading]);

  const updateAttendanceStatus = (index: number, newStatus: "Present" | "Absent" | "Late" | "Leave") => {
    setAttendanceRecords((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], status: newStatus };
      return copy;
    });
  };

  const markAllPresent = () => {
    setAttendanceRecords((prev) => prev.map((r) => ({ ...r, status: "Present" })));
  };

  const saveDailyAttendance = async () => {
    setSavingAttendance(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          className: assignedClass,
          section: assignedSection,
          dateBS: "2081-07-15",
          records: attendanceRecords,
          takenBy: user?.fullName || "Class Teacher",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAttendanceRecorded(true);
        setAttendanceSaved(true);
        setTimeout(() => setAttendanceSaved(false), 3000);
      }
    } catch (err: any) {
      alert("Error saving: " + err.message);
    } finally {
      setSavingAttendance(false);
    }
  };

  const handleUploadMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...uploadForm,
          uploadedBy: user?.fullName || "Faculty",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowUploadModal(false);
        loadTeacherData();
        setUploadForm({
          title: "",
          description: "",
          className: assignedClass,
          subject: teacherSubjects[0] || "Mathematics",
          fileUrl: "https://moecdc.gov.np",
          fileType: "PDF",
        });
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const presentCount = attendanceRecords.filter((r) => r.status === "Present").length;
  const absentCount = attendanceRecords.filter((r) => r.status === "Absent").length;
  const attendancePercent =
    attendanceRecords.length > 0 ? Math.round((presentCount / attendanceRecords.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Teacher Profile Banner */}
      <div className="bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-950 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden card-shine border border-emerald-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-extrabold text-2xl shadow-lg shrink-0">
              {user?.fullName?.charAt(0) || "T"}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold mb-1.5 border border-white/15">
                <School className="w-3.5 h-3.5 text-emerald-300" />
                <span>
                  {user?.isClassTeacher
                    ? `Class Teacher: ${assignedClass} (${assignedSection})`
                    : "Faculty Member"}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                Namaste, {user?.fullName || "Teacher"} Sir/Madam!
              </h1>
              <p className="text-emerald-100/90 text-xs mt-1">
                {user?.employeeId || "TCH-101"} • {user?.qualification || "Faculty"} • Academic Session २०८१-२०८२ B.S.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <Upload className="w-4 h-4 text-emerald-700" />
              <span>Upload Notes / Question Paper</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Teacher KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Class Students Count */}
        <div className="bg-white dark:bg-[#0d1527] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              My Class Students
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50 shadow-sm">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-2.5 tracking-tight">
            {students.length}
          </p>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            Enrolled in {assignedClass} ({assignedSection})
          </div>
        </div>

        {/* Today's Class Attendance Status */}
        <div className="bg-white dark:bg-[#0d1527] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Today&apos;s Roll Call
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/50 shadow-sm">
              <ClipboardCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-2.5 flex items-center gap-2 tracking-tight">
            {isAttendanceRecorded ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" /> {attendancePercent}% Present
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Clock className="w-5 h-5" /> Roll Call Pending
              </span>
            )}
          </p>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            {presentCount} Present • {absentCount} Absent
          </div>
        </div>

        {/* Subjects Taught */}
        <div className="bg-white dark:bg-[#0d1527] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Assigned Subjects
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-2.5 tracking-tight">
            {teacherSubjects.length}
          </p>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
            {teacherSubjects.join(", ")}
          </div>
        </div>

        {/* Study Materials */}
        <div className="bg-white dark:bg-[#0d1527] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Study Notes & Sets
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/50 shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-2.5 tracking-tight">
            {materials.length}
          </p>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            Published for {assignedClass}
          </div>
        </div>
      </div>

      {/* Primary Section 1: Embedded Daily Attendance Register */}
      {user?.isClassTeacher && (
        <div className="bg-white dark:bg-[#0d1527] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
          <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-800/30">
            <div>
              <h2 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Today&apos;s Class Roll Call — {assignedClass} ({assignedSection})</span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Date: <strong>२०८१ कार्तिक १५ (2081-07-15 B.S.)</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={markAllPresent}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 transition-all active:scale-95"
              >
                Mark All Present
              </button>

              <button
                type="button"
                onClick={saveDailyAttendance}
                disabled={savingAttendance}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-all active:scale-95 flex items-center gap-1.5 ${
                  attendanceSaved ? "bg-emerald-600" : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {attendanceSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingAttendance ? "Saving..." : "Save Roll Call"}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 w-14">Roll</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4 text-center">Attendance Status</th>
                  <th className="py-3 px-4">Guardian Emergency Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {attendanceRecords.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400">
                      No students enrolled in {assignedClass} ({assignedSection}).
                    </td>
                  </tr>
                ) : (
                  attendanceRecords.map((r, idx) => {
                    const studentObj = students.find((s) => s.studentId === r.studentId);
                    return (
                      <tr
                        key={r.studentId}
                        className={`transition-colors ${
                          r.status === "Absent"
                            ? "bg-rose-50/50 dark:bg-rose-950/15 border-l-4 border-l-rose-500"
                            : r.status === "Leave"
                            ? "bg-blue-50/50 dark:bg-blue-950/15 border-l-4 border-l-blue-500"
                            : r.status === "Late"
                            ? "bg-amber-50/50 dark:bg-amber-950/15 border-l-4 border-l-amber-500"
                            : "border-l-4 border-l-emerald-500 hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <td className="py-2.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                          <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs">
                            {r.rollNo}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                          {r.studentName}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                            <button
                              type="button"
                              onClick={() => updateAttendanceStatus(idx, "Present")}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all active:scale-95 ${
                                r.status === "Present"
                                  ? "bg-emerald-600 text-white shadow-sm"
                                  : "text-slate-600 dark:text-slate-400 hover:text-emerald-600"
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => updateAttendanceStatus(idx, "Absent")}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all active:scale-95 ${
                                r.status === "Absent"
                                  ? "bg-rose-600 text-white shadow-sm"
                                  : "text-slate-600 dark:text-slate-400 hover:text-rose-600"
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              type="button"
                              onClick={() => updateAttendanceStatus(idx, "Leave")}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all active:scale-95 ${
                                r.status === "Leave"
                                  ? "bg-blue-600 text-white shadow-sm"
                                  : "text-slate-600 dark:text-slate-400 hover:text-blue-600"
                              }`}
                            >
                              Leave
                            </button>
                            <button
                              type="button"
                              onClick={() => updateAttendanceStatus(idx, "Late")}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all active:scale-95 ${
                                r.status === "Late"
                                  ? "bg-amber-600 text-white shadow-sm"
                                  : "text-slate-600 dark:text-slate-400 hover:text-amber-600"
                              }`}
                            >
                              Late
                            </button>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">
                          {studentObj?.guardianPhone ? (
                            <a
                              href={`tel:${studentObj.guardianPhone}`}
                              className="inline-flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{studentObj.guardianPhone}</span>
                              <span className="text-[10px] text-slate-400">({studentObj.guardianName})</span>
                            </a>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid: My Class Students List & My Uploaded Study Materials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Class Students Roster */}
        <div className="bg-white dark:bg-[#0d1527] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>My Class Students Roster ({assignedClass})</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Direct student directory and emergency guardian contact
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/70 text-xs max-h-72 overflow-y-auto">
              {students.map((std) => (
                <div key={std._id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-xs border border-slate-200/60 dark:border-slate-700/60">
                      {std.rollNo}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {std.fullName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Guardian: {std.guardianName} • Blood: {std.bloodGroup || "O+ve"}
                      </p>
                    </div>
                  </div>

                  <a
                    href={`tel:${std.guardianPhone}`}
                    className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200/60 dark:border-emerald-800/50 transition-all inline-flex items-center gap-1.5 text-[11px] font-semibold active:scale-95"
                    title="Call Guardian"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Study Materials & Uploads */}
        <div className="bg-white dark:bg-[#0d1527] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Subject Notes & Model Question Sets</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Shared with {assignedClass}
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Set</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/70 text-xs max-h-72 overflow-y-auto">
              {materials.length === 0 ? (
                <p className="py-12 text-center text-slate-400">No materials uploaded yet.</p>
              ) : (
                materials.map((m) => (
                  <div key={m._id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 mb-1">
                        {m.subject}
                      </span>
                      <p className="font-medium text-slate-900 dark:text-slate-100 leading-tight">
                        {m.title}
                      </p>
                    </div>

                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Study Material Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Upload Chapter Notes / Model Question Set</span>
            </h3>

            <form onSubmit={handleUploadMaterial} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Title / Topic *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Unit 3 Geometry Model Problems & Formulas"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Class
                  </label>
                  <input
                    readOnly
                    type="text"
                    value={uploadForm.className}
                    className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Subject *
                  </label>
                  <select
                    value={uploadForm.subject}
                    onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                    className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    {teacherSubjects.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PDF & File Upload Component */}
              <FileUploadInput
                label="Attach PDF / Question Paper / Note File"
                currentUrl={uploadForm.fileUrl}
                onFileUploaded={(url, fileType, name) => {
                  setUploadForm((prev) => ({
                    ...prev,
                    fileUrl: url,
                    fileType: fileType,
                    title: prev.title || name.replace(/\.[^/.]+$/, ""),
                  }));
                }}
              />

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Description / Instructions for Students
                </label>
                <textarea
                  rows={2}
                  placeholder="Must-solve problems for upcoming terminal examination..."
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-950/20 transition-all active:scale-95"
                >
                  {uploading ? "Uploading..." : "Share with Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TeacherDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-400 font-medium">
          Loading Teacher Portal...
        </div>
      }
    >
      <TeacherDashboardContent />
    </Suspense>
  );
}
