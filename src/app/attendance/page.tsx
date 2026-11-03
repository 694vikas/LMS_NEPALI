"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ClipboardCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  UserX,
  Save,
  Check,
  Users,
  Sparkles,
} from "lucide-react";
import { CLASSES, SECTIONS } from "@/lib/constants";

interface RecordItem {
  studentId: string;
  rollNo: number;
  studentName: string;
  status: "Present" | "Absent" | "Late" | "Leave";
  remarks?: string;
}

function AttendanceContent() {
  const searchParams = useSearchParams();
  const initialClass = searchParams.get("className") || "Class 10 (SEE)";

  const [selectedClass, setSelectedClass] = useState<string>(initialClass);
  const [selectedSection, setSelectedSection] = useState<string>("A");
  const [dateBS, setDateBS] = useState<string>("2081-07-15");
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRecorded, setIsRecorded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchAttendance = async () => {
    setLoading(true);
    setSaveSuccess(false);
    try {
      const params = new URLSearchParams({
        className: selectedClass,
        section: selectedSection,
        dateBS,
      });
      const res = await fetch(`/api/attendance?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setRecords(json.data.records || []);
        setIsRecorded(Boolean(json.isRecorded));
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedClass, selectedSection, dateBS]);

  const updateStatus = (index: number, newStatus: "Present" | "Absent" | "Late" | "Leave") => {
    setRecords((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], status: newStatus };
      return updated;
    });
  };

  const updateRemarks = (index: number, remarks: string) => {
    setRecords((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], remarks };
      return updated;
    });
  };

  const markAllPresent = () => {
    setRecords((prev) => prev.map((r) => ({ ...r, status: "Present" })));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          className: selectedClass,
          section: selectedSection,
          dateBS,
          records,
          takenBy: "Class Teacher",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsRecorded(true);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert("Failed to save attendance: " + data.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Metrics
  const total = records.length;
  const presentCount = records.filter((r) => r.status === "Present").length;
  const absentCount = records.filter((r) => r.status === "Absent").length;
  const leaveCount = records.filter((r) => r.status === "Leave").length;
  const lateCount = records.filter((r) => r.status === "Late").length;
  const attendanceRate = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2.5 tracking-tight">
            <ClipboardCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>Daily Student Attendance (दैनिक हाजिरी)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Roll call register for faculty & class teachers. Mark present, absent, medical leave, or late arrivals.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={markAllPresent}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800 font-medium text-xs transition-all active:scale-95 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Mark All Present</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving || records.length === 0}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs shadow-md transition-all active:scale-95 ${
              saveSuccess
                ? "bg-emerald-600 text-white shadow-emerald-600/20"
                : "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20"
            }`}
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 animate-bounce" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Roll Call"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Class, Section & Date Filter Card */}
      <div className="bg-white dark:bg-[#0d1527] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        {/* Class Selector */}
        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            Class (कक्षा)
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
          >
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Section Selector */}
        <div>
          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            Section (खण्ड)
          </label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
          >
            {SECTIONS.map((sec) => (
              <option key={sec} value={sec}>
                Section {sec}
              </option>
            ))}
          </select>
        </div>

        {/* Nepali Date BS */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300 block">
              Nepali Date (मिति B.S.)
            </label>
            <div className="flex gap-1.5 text-[10px]">
              <button
                type="button"
                onClick={() => setDateBS("2081-07-15")}
                className="text-rose-600 dark:text-rose-400 font-semibold hover:underline"
              >
                Today
              </button>
              <span className="text-slate-400">•</span>
              <button
                type="button"
                onClick={() => setDateBS("2081-07-14")}
                className="text-slate-500 hover:underline"
              >
                Yesterday
              </button>
            </div>
          </div>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={dateBS}
              onChange={(e) => setDateBS(e.target.value)}
              placeholder="YYYY-MM-DD (e.g. 2081-07-15)"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/30"
            />
          </div>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white dark:bg-[#0d1527] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Enrolled
          </span>
          <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{total}</p>
        </div>

        <div className="bg-white dark:bg-[#0d1527] p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Present (उपस्थित)
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">{presentCount}</p>
        </div>

        <div className="bg-white dark:bg-[#0d1527] p-4 rounded-2xl border border-rose-200/80 dark:border-rose-900/50 bg-gradient-to-br from-rose-50/50 to-white dark:from-rose-950/20 dark:to-slate-900/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
              Absent (अनुपस्थित)
            </span>
            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <p className="text-2xl font-extrabold text-rose-700 dark:text-rose-400 mt-1">{absentCount}</p>
        </div>

        <div className="bg-white dark:bg-[#0d1527] p-4 rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-slate-900/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              Leave (विदा)
            </span>
            <UserX className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-extrabold text-blue-700 dark:text-blue-400 mt-1">{leaveCount}</p>
        </div>

        <div className="bg-white dark:bg-[#0d1527] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Attendance Rate
          </span>
          <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
            {attendanceRate}%
          </p>
        </div>
      </div>

      {/* Roster & Roll Call Table */}
      <div className="bg-white dark:bg-[#0d1527] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium">
            {selectedClass} ({selectedSection}) • Roll Register: <strong className="text-slate-800 dark:text-slate-100">{dateBS} B.S.</strong>
          </span>
          <span
            className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              isRecorded
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
            }`}
          >
            {isRecorded ? "Registered for this date" : "Unsaved roll call"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 w-16">Roll</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Student ID</th>
                <th className="py-3.5 px-4 text-center">Status (स्थिति)</th>
                <th className="py-3.5 px-4">Remarks / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    Loading student attendance roster...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No students found in {selectedClass} ({selectedSection}).
                  </td>
                </tr>
              ) : (
                records.map((r, idx) => (
                  <tr
                    key={r.studentId}
                    className={`transition-colors ${
                      r.status === "Absent"
                        ? "bg-rose-50/50 dark:bg-rose-950/15 border-l-4 border-l-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/25"
                        : r.status === "Leave"
                        ? "bg-blue-50/50 dark:bg-blue-950/15 border-l-4 border-l-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/25"
                        : r.status === "Late"
                        ? "bg-amber-50/50 dark:bg-amber-950/15 border-l-4 border-l-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/25"
                        : "border-l-4 border-l-emerald-500 hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs">
                        {r.rollNo}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {r.studentName}
                    </td>

                    <td className="py-3 px-4 text-slate-400 dark:text-slate-500 font-mono text-[11px]">
                      {r.studentId}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                        {/* Present */}
                        <button
                          type="button"
                          onClick={() => updateStatus(idx, "Present")}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                            r.status === "Present"
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                          }`}
                        >
                          Present
                        </button>

                        {/* Absent */}
                        <button
                          type="button"
                          onClick={() => updateStatus(idx, "Absent")}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                            r.status === "Absent"
                              ? "bg-rose-600 text-white shadow-sm"
                              : "text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                          }`}
                        >
                          Absent
                        </button>

                        {/* Leave */}
                        <button
                          type="button"
                          onClick={() => updateStatus(idx, "Leave")}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                            r.status === "Leave"
                              ? "bg-blue-600 text-white shadow-sm"
                              : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                          }`}
                        >
                          Leave
                        </button>

                        {/* Late */}
                        <button
                          type="button"
                          onClick={() => updateStatus(idx, "Late")}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                            r.status === "Late"
                              ? "bg-amber-600 text-white shadow-sm"
                              : "text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400"
                          }`}
                        >
                          Late
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="e.g. sick note from parent..."
                        value={r.remarks || ""}
                        onChange={(e) => updateRemarks(idx, e.target.value)}
                        className="w-full py-1.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs bg-slate-50/50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500/30"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AttendancePage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 text-sm font-medium">
          Loading Attendance System...
        </div>
      }
    >
      <AttendanceContent />
    </Suspense>
  );
}
