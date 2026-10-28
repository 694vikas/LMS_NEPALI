"use client";

import { useState, useEffect } from "react";
import {
  UserCheck,
  Search,
  Plus,
  Mail,
  Phone,
  BookOpen,
  Award,
  Calendar,
  X,
  Sparkles,
  School,
} from "lucide-react";

interface TeacherData {
  _id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  subjects: string[];
  isClassTeacher: boolean;
  assignedClass?: string;
  assignedSection?: string;
  qualification: string;
  joinedDateBS: string;
  status: "Active" | "On Leave";
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subjects: "Compulsory Mathematics, Opt. Math",
    isClassTeacher: true,
    assignedClass: "Class 10 (SEE)",
    assignedSection: "A",
    qualification: "M.Sc. Mathematics, TU",
    joinedDateBS: "2078-01-15",
  });

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      const res = await fetch(`/api/teachers?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setTeachers(json.data);
      }
    } catch (err) {
      console.error("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [searchQuery]);

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const subjectArray = formData.subjects
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          subjects: subjectArray,
          status: "Active",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        fetchTeachers();
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          subjects: "",
          isClassTeacher: false,
          assignedClass: "",
          assignedSection: "A",
          qualification: "",
          joinedDateBS: "2080-01-01",
        });
      } else {
        alert("Failed to add teacher: " + data.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-600" />
            Teacher Section & Faculty Directory (शिक्षक खण्ड)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage teaching faculty, subject specializations, and class teacher allocations.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Teacher</span>
        </button>
      </div>

      {/* Search and Summary */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search teacher by name, ID or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total Faculty Members: <strong className="text-slate-800">{teachers.length}</strong>
        </div>
      </div>

      {/* Teacher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-slate-400 text-xs">
            Loading faculty records...
          </div>
        ) : teachers.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-slate-400 text-xs">
            No teachers found. Click "Add New Teacher" or use "Seed Sample Data".
          </div>
        ) : (
          teachers.map((teacher) => (
            <div
              key={teacher._id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
            >
              {/* Top Row: Avatar & Name */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold text-base shadow">
                      {teacher.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {teacher.fullName}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {teacher.employeeId}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${
                      teacher.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {teacher.status}
                  </span>
                </div>

                {/* Class Teacher Badge */}
                {teacher.isClassTeacher && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-medium">
                    <School className="w-3.5 h-3.5" />
                    <span>
                      Class Teacher: <strong>{teacher.assignedClass}</strong> ({teacher.assignedSection})
                    </span>
                  </div>
                )}

                {/* Subject Tags */}
                <div className="mt-3">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-emerald-600" />
                    Subjects Taught:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {teacher.subjects.map((sub, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Qualification & Join Date */}
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{teacher.qualification}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Joined: {teacher.joinedDateBS} B.S.</span>
                  </div>
                </div>
              </div>

              {/* Contact Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <a
                  href={`tel:${teacher.phone}`}
                  className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{teacher.phone}</span>
                </a>
                <a
                  href={`mailto:${teacher.email}`}
                  className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate max-w-[120px]">{teacher.email}</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Teacher Modal */}
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
              <UserCheck className="w-5 h-5 text-emerald-600" />
              Register New Faculty / Teacher (शिक्षक दर्ता)
            </h3>

            <form onSubmit={handleCreateTeacher} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Full Name (पूरा नाम) *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Ramesh Prasad Bhattarai"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="ramesh@school.edu.np"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Phone Number (फोन) *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="9841XXXXXX"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Subjects Taught (comma separated) *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Compulsory Mathematics, Opt. Math, Science"
                  value={formData.subjects}
                  onChange={(e) =>
                    setFormData({ ...formData, subjects: e.target.value })
                  }
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Qualification (शैक्षिक योग्यता) *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. M.Sc. Mathematics, TU"
                    value={formData.qualification}
                    onChange={(e) =>
                      setFormData({ ...formData, qualification: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Joined Date (B.S.)
                  </label>
                  <input
                    type="text"
                    placeholder="2079-01-15"
                    value={formData.joinedDateBS}
                    onChange={(e) =>
                      setFormData({ ...formData, joinedDateBS: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Class Teacher Allocation */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <label className="flex items-center gap-2 text-slate-800 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isClassTeacher}
                    onChange={(e) =>
                      setFormData({ ...formData, isClassTeacher: e.target.checked })
                    }
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>Designate as Class Teacher (कक्षा शिक्षक)</span>
                </label>

                {formData.isClassTeacher && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="font-medium text-slate-600 block mb-1">
                        Assigned Class
                      </label>
                      <input
                        type="text"
                        placeholder="Class 10 (SEE)"
                        value={formData.assignedClass}
                        onChange={(e) =>
                          setFormData({ ...formData, assignedClass: e.target.value })
                        }
                        className="w-full p-2 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-slate-600 block mb-1">
                        Section
                      </label>
                      <select
                        value={formData.assignedSection}
                        onChange={(e) =>
                          setFormData({ ...formData, assignedSection: e.target.value })
                        }
                        className="w-full p-2 border border-slate-200 rounded-lg"
                      >
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                      </select>
                    </div>
                  </div>
                )}
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
                  className="px-4 py-2 font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                >
                  {isSubmitting ? "Saving..." : "Save Teacher Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

