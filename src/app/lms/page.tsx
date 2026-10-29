"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  BellRing,
  BookOpen,
  Pin,
  Calendar,
  User,
  Plus,
  FileText,
  Download,
  ExternalLink,
  Sparkles,
  X,
  Filter,
  CheckCircle,
  Tag,
} from "lucide-react";
import { CLASSES } from "@/lib/constants";

interface NoticeItem {
  _id: string;
  title: string;
  content: string;
  category: "Notice" | "Holiday" | "Exam" | "Event";
  priority: "High" | "Normal" | "Urgent";
  targetAudience: string;
  dateBS: string;
  author: string;
  isPinned: boolean;
}

interface MaterialItem {
  _id: string;
  title: string;
  description?: string;
  className: string;
  subject: string;
  fileType: "PDF" | "Document" | "Link" | "Video";
  fileUrl: string;
  uploadedBy: string;
  downloadsCount: number;
}

function LMSContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "notices";

  const [activeTab, setActiveTab] = useState<"notices" | "materials">(
    initialTab === "materials" ? "materials" : "notices"
  );

  // Notice State
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [noticeCategory, setNoticeCategory] = useState<string>("All");
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    content: "",
    category: "Notice",
    priority: "Normal",
    targetAudience: "All Students & Guardians",
    dateBS: "२०८१ कार्तिक १५",
    author: "Administration",
    isPinned: false,
  });

  // Material State
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("All");
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    title: "",
    description: "",
    className: "Class 10 (SEE)",
    subject: "Compulsory Mathematics",
    fileType: "PDF",
    fileUrl: "https://moecdc.gov.np",
    uploadedBy: "Faculty",
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (noticeCategory !== "All") params.append("category", noticeCategory);
      const res = await fetch(`/api/notices?${params.toString()}`);
      const json = await res.json();
      if (json.success) setNotices(json.data);
    } catch (err) {
      console.error("Error fetching notices:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedClass !== "All") params.append("className", selectedClass);
      const res = await fetch(`/api/materials?${params.toString()}`);
      const json = await res.json();
      if (json.success) setMaterials(json.data);
    } catch (err) {
      console.error("Error fetching materials:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "notices") {
      fetchNotices();
    } else {
      fetchMaterials();
    }
  }, [activeTab, noticeCategory, selectedClass]);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noticeForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowNoticeModal(false);
        fetchNotices();
        setNoticeForm({
          title: "",
          content: "",
          category: "Notice",
          priority: "Normal",
          targetAudience: "All Students & Guardians",
          dateBS: "२०८१ कार्तिक १५",
          author: "Administration",
          isPinned: false,
        });
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(materialForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowMaterialModal(false);
        fetchMaterials();
        setMaterialForm({
          title: "",
          description: "",
          className: "Class 10 (SEE)",
          subject: "Compulsory Mathematics",
          fileType: "PDF",
          fileUrl: "https://moecdc.gov.np",
          uploadedBy: "Faculty",
        });
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BellRing className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            LMS & Digital Notice Board (सूचना तथा सिकाइ केन्द्र)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official school announcements, festival holiday alerts, CDC syllabus materials, and past question bank.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {activeTab === "notices" ? (
            <button
              onClick={() => setShowNoticeModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Notice (नयाँ सूचना)</span>
            </button>
          ) : (
            <button
              onClick={() => setShowMaterialModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Material (सामग्री थप्नुहोस्)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("notices")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all ${
            activeTab === "notices"
              ? "border-rose-600 text-rose-600 dark:text-rose-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          }`}
        >
          <BellRing className="w-4 h-4" />
          <span>Notice Board (डिजिटल सूचना पाटी)</span>
        </button>

        <button
          onClick={() => setActiveTab("materials")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all ${
            activeTab === "materials"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Study Materials & Question Bank (अध्ययन सामग्री)</span>
        </button>
      </div>

      {/* TAB 1: NOTICES */}
      {activeTab === "notices" && (
        <div className="space-y-4">
          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {["All", "Holiday", "Exam", "Notice", "Event"].map((cat) => (
              <button
                key={cat}
                onClick={() => setNoticeCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-all ${
                  noticeCategory === cat
                    ? "bg-slate-900 dark:bg-rose-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                {cat === "All"
                  ? "All Notices (सबै)"
                  : cat === "Holiday"
                  ? "Festivals & Holidays (विदा)"
                  : cat === "Exam"
                  ? "Exams (परीक्षा)"
                  : cat}
              </button>
            ))}
          </div>

          {/* Notices Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-2 py-12 text-center text-slate-400 text-xs">
                Loading notices...
              </div>
            ) : notices.length === 0 ? (
              <div className="col-span-2 py-12 text-center text-slate-400 text-xs">
                No notices published in this category yet.
              </div>
            ) : (
              notices.map((n) => (
                <div
                  key={n._id}
                  className={`bg-white dark:bg-slate-900 rounded-xl p-5 border shadow-sm flex flex-col justify-between transition-all ${
                    n.isPinned
                      ? "border-rose-300 dark:border-rose-800/80 bg-rose-50/10 dark:bg-rose-950/20"
                      : "border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div>
                    {/* Header badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            n.category === "Holiday"
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                              : n.category === "Exam"
                              ? "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                              : "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          }`}
                        >
                          {n.category}
                        </span>

                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          Audience: {n.targetAudience}
                        </span>
                      </div>

                      {n.isPinned && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                          <Pin className="w-3 h-3 rotate-45" /> Pinned
                        </span>
                      )}
                    </div>

                    {/* Notice Title */}
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                      {n.title}
                    </h3>

                    {/* Notice Content */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed whitespace-pre-line">
                      {n.content}
                    </p>
                  </div>

                  {/* Footer Meta */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {n.dateBS}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {n.author}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: STUDY MATERIALS */}
      {activeTab === "materials" && (
        <div className="space-y-4">
          {/* Class Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="font-semibold text-slate-500 dark:text-slate-400 shrink-0">Class:</span>
            <button
              onClick={() => setSelectedClass("All")}
              className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-all ${
                selectedClass === "All"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
              }`}
            >
              All Classes
            </button>
            {CLASSES.slice(6).map((c) => (
              <button
                key={c}
                onClick={() => setSelectedClass(c)}
                className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-all ${
                  selectedClass === c
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-3 py-12 text-center text-slate-400 text-xs">
                Loading study materials...
              </div>
            ) : materials.length === 0 ? (
              <div className="col-span-3 py-12 text-center text-slate-400 text-xs">
                No study materials found for this class. Click "Upload Material" to add.
              </div>
            ) : (
              materials.map((m) => (
                <div
                  key={m._id}
                  className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {m.subject}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {m.className}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                      {m.title}
                    </h3>

                    {m.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                        {m.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      By {m.uploadedBy}
                    </span>

                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-semibold text-xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: Create Notice */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowNoticeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <BellRing className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              Publish Official Notice (नयाँ सूचना जारी गर्नुहोस्)
            </h3>

            <form onSubmit={handleCreateNotice} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Notice Title (सूचनाको शीर्षक) *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. तिहार तथा छठ पर्वको विदा सम्बन्धी सूचना"
                  value={noticeForm.title}
                  onChange={(e) =>
                    setNoticeForm({ ...noticeForm, title: e.target.value })
                  }
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Category *
                  </label>
                  <select
                    value={noticeForm.category}
                    onChange={(e) =>
                      setNoticeForm({ ...noticeForm, category: e.target.value as any })
                    }
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Notice">General Notice (साधारण सूचना)</option>
                    <option value="Holiday">Festival / Holiday (विदा)</option>
                    <option value="Exam">Examination (परीक्षा)</option>
                    <option value="Event">Sports & Event (कार्यक्रम)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. All Students / Class 10"
                    value={noticeForm.targetAudience}
                    onChange={(e) =>
                      setNoticeForm({ ...noticeForm, targetAudience: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Notice Details / Content (सूचना विवरण) *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type the full notice announcement in Nepali or English..."
                  value={noticeForm.content}
                  onChange={(e) =>
                    setNoticeForm({ ...noticeForm, content: e.target.value })
                  }
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Date (B.S.)
                  </label>
                  <input
                    type="text"
                    value={noticeForm.dateBS}
                    onChange={(e) =>
                      setNoticeForm({ ...noticeForm, dateBS: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Issuing Authority
                  </label>
                  <input
                    type="text"
                    placeholder="Principal / Exam Dept"
                    value={noticeForm.author}
                    onChange={(e) =>
                      setNoticeForm({ ...noticeForm, author: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={noticeForm.isPinned}
                    onChange={(e) =>
                      setNoticeForm({ ...noticeForm, isPinned: e.target.checked })
                    }
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span>Pin this notice to top of board</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
                >
                  {isSubmitting ? "Publishing..." : "Publish Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Upload Study Material */}
      {showMaterialModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowMaterialModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Upload Study Material / Question Paper
            </h3>

            <form onSubmit={handleCreateMaterial} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Material Title *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. SEE Compulsory Math Model Set 2081 (CDC)"
                  value={materialForm.title}
                  onChange={(e) =>
                    setMaterialForm({ ...materialForm, title: e.target.value })
                  }
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Class *
                  </label>
                  <select
                    value={materialForm.className}
                    onChange={(e) =>
                      setMaterialForm({ ...materialForm, className: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    {CLASSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Subject *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Science / Mathematics"
                    value={materialForm.subject}
                    onChange={(e) =>
                      setMaterialForm({ ...materialForm, subject: e.target.value })
                    }
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  File / Download URL *
                </label>
                <input
                  required
                  type="url"
                  placeholder="https://..."
                  value={materialForm.fileUrl}
                  onChange={(e) =>
                    setMaterialForm({ ...materialForm, fileUrl: e.target.value })
                  }
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Chapter coverage or instructions..."
                  value={materialForm.description}
                  onChange={(e) =>
                    setMaterialForm({ ...materialForm, description: e.target.value })
                  }
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                ></textarea>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Uploaded By (Teacher / Dept)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Bhattarai (Math Faculty)"
                  value={materialForm.uploadedBy}
                  onChange={(e) =>
                    setMaterialForm({ ...materialForm, uploadedBy: e.target.value })
                  }
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMaterialModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  {isSubmitting ? "Uploading..." : "Save Material"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LMSPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-400">
          Loading LMS & Notice Board...
        </div>
      }
    >
      <LMSContent />
    </Suspense>
  );
}
