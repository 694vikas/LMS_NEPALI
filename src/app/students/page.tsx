"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Users,
  Search,
  Plus,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  CreditCard,
  X,
  GraduationCap,
  ClipboardCheck,
} from "lucide-react";
import { CLASSES, SECTIONS } from "@/lib/constants";

interface StudentData {
  _id: string;
  studentId: string;
  rollNo: number;
  fullName: string;
  nepaliName?: string;
  gender: string;
  className: string;
  section: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  dateOfBirthBS?: string;
  bloodGroup?: string;
  feeStatus: "Paid" | "Pending" | "Partial";
  outstandingDue: number;
}

function StudentsContent() {
  const searchParams = useSearchParams();
  const initialClass = searchParams.get("className") || "All";

  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>(initialClass);
  const [selectedSection, setSelectedSection] = useState<string>("All");
  const [selectedFeeStatus, setSelectedFeeStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal states
  const [activeStudent, setActiveStudent] = useState<StudentData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Student Form State
  const [formData, setFormData] = useState({
    fullName: "",
    nepaliName: "",
    gender: "Male",
    className: "Class 10 (SEE)",
    section: "A",
    rollNo: 1,
    guardianName: "",
    guardianPhone: "",
    address: "",
    bloodGroup: "B+ve",
    dateOfBirthBS: "2068-01-01",
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedClass !== "All") params.append("className", selectedClass);
      if (selectedSection !== "All") params.append("section", selectedSection);
      if (selectedFeeStatus !== "All") params.append("feeStatus", selectedFeeStatus);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await fetch(`/api/students?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setStudents(json.data);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedClass, selectedSection, selectedFeeStatus, searchQuery]);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        fetchStudents();
        setFormData({
          fullName: "",
          nepaliName: "",
          gender: "Male",
          className: "Class 10 (SEE)",
          section: "A",
          rollNo: 1,
          guardianName: "",
          guardianPhone: "",
          address: "",
          bloodGroup: "B+ve",
          dateOfBirthBS: "2068-01-01",
        });
      } else {
        alert("Failed to enroll student: " + data.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2.5 tracking-tight">
            <Users className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            <span>Class-Based Student Roster (कक्षागत विद्यार्थी सूची)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Filter, search and monitor student academic records, roll numbers, and Bikram Sambat fee clearance.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs shadow-md shadow-rose-950/20 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Student Admission</span>
        </button>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white dark:bg-[#0d1527] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        {/* Class Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0 uppercase tracking-wider text-[10px]">
            Grade:
          </span>
          <button
            onClick={() => setSelectedClass("All")}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all active:scale-95 ${
              selectedClass === "All"
                ? "bg-slate-900 dark:bg-rose-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            All Classes
          </button>
          {CLASSES.slice(6).map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all active:scale-95 ${
                selectedClass === cls
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* Filters Row: Section, Fee Status, and Search */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by student name, roll number, or guardian..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 bg-slate-50/50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          {/* Section Filter */}
          <div>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/30 bg-slate-50/50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200"
            >
              <option value="All">All Sections (A, B, C)</option>
              {SECTIONS.map((sec) => (
                <option key={sec} value={sec}>
                  Section {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Fee Status Filter */}
          <div>
            <select
              value={selectedFeeStatus}
              onChange={(e) => setSelectedFeeStatus(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/30 bg-slate-50/50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200"
            >
              <option value="All">All Fee Statuses</option>
              <option value="Paid">Paid Only (सम्पन्न)</option>
              <option value="Pending">Unpaid / Pending Only (बाँकी)</option>
              <option value="Partial">Partial Only (आंशिक)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Roster Table Card */}
      <div className="bg-white dark:bg-[#0d1527] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium">
            Showing <strong className="text-slate-800 dark:text-slate-100">{students.length}</strong> students{" "}
            {selectedClass !== "All" && `in ${selectedClass}`}
            {selectedSection !== "All" && ` (Section ${selectedSection})`}
          </span>
          <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-200/60 dark:border-rose-900/30">
            Session २०८१ B.S.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Roll</th>
                <th className="py-3.5 px-4">Student Details</th>
                <th className="py-3.5 px-4">Class & Sec</th>
                <th className="py-3.5 px-4">Guardian Contact</th>
                <th className="py-3.5 px-4">Address</th>
                <th className="py-3.5 px-4">Fee Status</th>
                <th className="py-3.5 px-4 text-right">Outstanding</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400 dark:text-slate-500">
                    Loading student records...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400 dark:text-slate-500">
                    No students found matching your filters.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Roll No */}
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs">
                        {student.rollNo}
                      </span>
                    </td>

                    {/* Student Name */}
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          {student.fullName}
                          {student.nepaliName && (
                            <span className="text-slate-400 font-normal text-[11px]">
                              ({student.nepaliName})
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                          {student.studentId} • {student.gender}
                        </p>
                      </div>
                    </td>

                    {/* Class & Section */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                        {student.className} - {student.section}
                      </span>
                    </td>

                    {/* Guardian Contact */}
                    <td className="py-3 px-4">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">
                        {student.guardianName}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{student.guardianPhone}</span>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="py-3 px-4">
                      <div className="text-slate-600 dark:text-slate-300 flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{student.address}</span>
                      </div>
                    </td>

                    {/* Fee Status Badge */}
                    <td className="py-3 px-4">
                      {student.feeStatus === "Paid" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Paid
                        </span>
                      )}
                      {student.feeStatus === "Pending" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          <AlertCircle className="w-3 h-3" />
                          Unpaid
                        </span>
                      )}
                      {student.feeStatus === "Partial" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <Clock className="w-3 h-3" />
                          Partial
                        </span>
                      )}
                    </td>

                    {/* Outstanding Due */}
                    <td className="py-3 px-4 text-right font-medium">
                      {student.outstandingDue > 0 ? (
                        <span className="text-rose-600 dark:text-rose-400 font-bold">
                          रु {student.outstandingDue.toLocaleString("en-IN")}
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">रु ०</span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setActiveStudent(student)}
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Student Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <a
                          href={`/fees?search=${encodeURIComponent(student.fullName)}`}
                          className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title="Manage Fee"
                        >
                          <CreditCard className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {activeStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in duration-200">
            <button
              onClick={() => setActiveStudent(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-rose-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md p-3">
                {activeStudent.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 leading-tight">
                  {activeStudent.fullName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeStudent.studentId} • Roll: {activeStudent.rollNo} • {activeStudent.className} ({activeStudent.section})
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800/60 rounded-xl">
                <span className="text-slate-400 dark:text-slate-500 font-medium block">Guardian</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-0.5 block">
                  {activeStudent.guardianName}
                </span>
                <span className="text-slate-500 dark:text-slate-400">{activeStudent.guardianPhone}</span>
              </div>

              <div className="p-3 bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800/60 rounded-xl">
                <span className="text-slate-400 dark:text-slate-500 font-medium block">Address</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-0.5 block">
                  {activeStudent.address}
                </span>
                <span className="text-slate-500 dark:text-slate-400">Nepal</span>
              </div>

              <div className="p-3 bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800/60 rounded-xl">
                <span className="text-slate-400 dark:text-slate-500 font-medium block">Date of Birth</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-0.5 block">
                  {activeStudent.dateOfBirthBS || "2068 B.S."}
                </span>
                <span className="text-slate-500 dark:text-slate-400">Blood: {activeStudent.bloodGroup || "O+ve"}</span>
              </div>

              <div className="p-3 bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800/60 rounded-xl">
                <span className="text-slate-400 dark:text-slate-500 font-medium block">Fee Balance</span>
                <span className="font-extrabold text-rose-600 dark:text-rose-400 text-sm mt-0.5 block">
                  रु {activeStudent.outstandingDue.toLocaleString("en-IN")}
                </span>
                <span className="text-slate-500 dark:text-slate-400">Status: {activeStudent.feeStatus}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2.5">
              <button
                onClick={() => setActiveStudent(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Close
              </button>
              <a
                href={`/attendance?className=${encodeURIComponent(activeStudent.className)}&section=${encodeURIComponent(activeStudent.section)}`}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl inline-flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Mark Attendance</span>
              </a>
              <a
                href={`/fees?search=${encodeURIComponent(activeStudent.fullName)}`}
                className="px-4 py-2 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-xl inline-flex items-center gap-1.5 shadow-md shadow-rose-950/20 transition-all active:scale-95"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Fee Ledger</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1527] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <span>New Student Admission (नयाँ भर्ना)</span>
            </h3>

            <form onSubmit={handleCreateStudent} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Full Name (English) *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Sujan Shrestha"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nepali Name (नेपाली नाम)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. सुजन श्रेष्ठ"
                    value={formData.nepaliName}
                    onChange={(e) =>
                      setFormData({ ...formData, nepaliName: e.target.value })
                    }
                    className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Class *
                  </label>
                  <select
                    value={formData.className}
                    onChange={(e) =>
                      setFormData({ ...formData, className: e.target.value })
                    }
                    className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100"
                  >
                    {CLASSES.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Section *
                  </label>
                  <select
                    value={formData.section}
                    onChange={(e) =>
                      setFormData({ ...formData, section: e.target.value })
                    }
                    className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100"
                  >
                    {SECTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Roll No *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={formData.rollNo}
                    onChange={(e) =>
                      setFormData({ ...formData, rollNo: Number(e.target.value) })
                    }
                    className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Guardian Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Ramesh Shrestha"
                    value={formData.guardianName}
                    onChange={(e) =>
                      setFormData({ ...formData, guardianName: e.target.value })
                    }
                    className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Guardian Phone *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 9841XXXXXX"
                    value={formData.guardianPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, guardianPhone: e.target.value })
                    }
                    className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Address (Municipality/Ward) *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Baneshwor, Kathmandu - 10"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Blood Group
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) =>
                      setFormData({ ...formData, bloodGroup: e.target.value })
                    }
                    className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100"
                  >
                    <option value="A+ve">A+ve</option>
                    <option value="B+ve">B+ve</option>
                    <option value="O+ve">O+ve</option>
                    <option value="AB+ve">AB+ve</option>
                    <option value="A-ve">A-ve</option>
                    <option value="B-ve">B-ve</option>
                    <option value="O-ve">O-ve</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md shadow-rose-950/20 transition-all active:scale-95"
                >
                  {isSubmitting ? "Saving..." : "Enroll Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-400 font-medium">
          Loading student dashboard...
        </div>
      }
    >
      <StudentsContent />
    </Suspense>
  );
}
