"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Users,
  Search,
  Filter,
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
        body: JSON.stringify({
          ...formData,
          rollNo: Number(formData.rollNo),
          feeStatus: "Pending",
          outstandingDue: 3500,
        }),
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
        alert("Failed to add student: " + data.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-rose-600" />
            Class-Based Student Dashboard (कक्षागत विद्यार्थी सूची)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Filter, search and monitor student academic records and fee clearance status.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Student Admission</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-4">
        {/* Class Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-semibold text-slate-500 shrink-0">Class:</span>
          <button
            onClick={() => setSelectedClass("All")}
            className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-all ${
              selectedClass === "All"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Classes
          </button>
          {CLASSES.slice(6).map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-all ${
                selectedClass === cls
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* Filters Row: Section, Fee Status, and Search */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student name, roll number, or guardian..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-slate-50/50"
            />
          </div>

          {/* Section Filter */}
          <div>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full py-1.5 px-3 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50 text-slate-700"
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
              className="w-full py-1.5 px-3 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50 text-slate-700"
            >
              <option value="All">All Fee Statuses</option>
              <option value="Paid">Paid Only (सम्पन्न)</option>
              <option value="Pending">Unpaid / Pending Only (बाँकी)</option>
              <option value="Partial">Partial Only (आंशिक)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{students.length}</strong> students{" "}
            {selectedClass !== "All" && `in ${selectedClass}`}
            {selectedSection !== "All" && ` (Section ${selectedSection})`}
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            Session २०८१ B.S.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Roll</th>
                <th className="py-3 px-4">Student Details</th>
                <th className="py-3 px-4">Class & Sec</th>
                <th className="py-3 px-4">Guardian Contact</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Fee Status</th>
                <th className="py-3 px-4 text-right">Outstanding</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Loading student records...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No students found matching your filters.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Roll No */}
                    <td className="py-3 px-4 font-bold text-slate-800">
                      <span className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                        {student.rollNo}
                      </span>
                    </td>

                    {/* Student Name */}
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          {student.fullName}
                          {student.nepaliName && (
                            <span className="text-slate-400 font-normal text-[11px]">
                              ({student.nepaliName})
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {student.studentId} • {student.gender}
                        </p>
                      </div>
                    </td>

                    {/* Class & Section */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-700">
                        {student.className} - {student.section}
                      </span>
                    </td>

                    {/* Guardian Contact */}
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">
                        {student.guardianName}
                      </div>
                      <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{student.guardianPhone}</span>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="py-3 px-4">
                      <div className="text-slate-600 flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{student.address}</span>
                      </div>
                    </td>

                    {/* Fee Status Badge */}
                    <td className="py-3 px-4">
                      {student.feeStatus === "Paid" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Paid
                        </span>
                      )}
                      {student.feeStatus === "Pending" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                          <AlertCircle className="w-3 h-3" />
                          Unpaid
                        </span>
                      )}
                      {student.feeStatus === "Partial" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3" />
                          Partial
                        </span>
                      )}
                    </td>

                    {/* Outstanding Due */}
                    <td className="py-3 px-4 text-right font-medium">
                      {student.outstandingDue > 0 ? (
                        <span className="text-rose-600 font-bold">
                          रु {student.outstandingDue.toLocaleString("en-IN")}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-medium">रु ०</span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setActiveStudent(student)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          title="View Student Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <a
                          href={`/fees?search=${encodeURIComponent(student.fullName)}`}
                          className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in duration-200">
            <button
              onClick={() => setActiveStudent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow">
                {activeStudent.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  {activeStudent.fullName}
                </h3>
                <p className="text-xs text-slate-500">
                  {activeStudent.studentId} • Roll: {activeStudent.rollNo} • {activeStudent.className} ({activeStudent.section})
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 font-medium block">Guardian</span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                  {activeStudent.guardianName}
                </span>
                <span className="text-slate-500">{activeStudent.guardianPhone}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 font-medium block">Address</span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                  {activeStudent.address}
                </span>
                <span className="text-slate-500">Nepal</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 font-medium block">Date of Birth</span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                  {activeStudent.dateOfBirthBS || "2068 B.S."}
                </span>
                <span className="text-slate-500">Blood: {activeStudent.bloodGroup || "O+ve"}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 font-medium block">Fee Balance</span>
                <span className="font-bold text-rose-600 text-sm mt-0.5 block">
                  रु {activeStudent.outstandingDue.toLocaleString("en-IN")}
                </span>
                <span className="text-slate-500">Status: {activeStudent.feeStatus}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setActiveStudent(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <a
                href={`/fees?search=${encodeURIComponent(activeStudent.fullName)}`}
                className="px-4 py-2 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg inline-flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Go to Fee Ledger</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-rose-600" />
              New Student Admission (नयाँ भर्ना)
            </h3>

            <form onSubmit={handleCreateStudent} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
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
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Nepali Name (नेपाली नाम)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. सुजन श्रेष्ठ"
                    value={formData.nepaliName}
                    onChange={(e) =>
                      setFormData({ ...formData, nepaliName: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Class *
                  </label>
                  <select
                    value={formData.className}
                    onChange={(e) =>
                      setFormData({ ...formData, className: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  >
                    {CLASSES.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Section *
                  </label>
                  <select
                    value={formData.section}
                    onChange={(e) =>
                      setFormData({ ...formData, section: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  >
                    {SECTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
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
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
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
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
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
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
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
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Blood Group
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) =>
                      setFormData({ ...formData, bloodGroup: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg"
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

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
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
        <div className="p-8 text-center text-xs text-slate-400">
          Loading student dashboard...
        </div>
      }
    >
      <StudentsContent />
    </Suspense>
  );
}

