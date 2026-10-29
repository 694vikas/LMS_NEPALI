"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchUser } = useAuth();

  const [activeTab, setActiveTab] = useState<"TEACHER" | "ADMIN">("TEACHER");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("teacher123");
  const [adminPassword, setAdminPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await login({
      role: "TEACHER",
      identifier,
      password,
    });

    if (res.success) {
      router.push("/teacher/dashboard");
    } else {
      setError(res.error || "Failed to sign in");
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await login({
      role: "ADMIN",
      password: adminPassword,
    });

    if (res.success) {
      router.push("/");
    } else {
      setError(res.error || "Failed to sign in as Admin");
      setLoading(false);
    }
  };

  // 1-Click Fast Login for Demo
  const handleFastLogin = async (teacherId: string) => {
    setLoading(true);
    setError("");
    const res = await login({
      role: "TEACHER",
      identifier: teacherId,
      password: "teacher123",
    });
    if (res.success) {
      router.push("/teacher/dashboard");
    } else {
      setError(res.error || "Login error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-800 to-slate-900 p-6 text-white text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 mx-auto flex items-center justify-center shadow-lg mb-3">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h2 className="font-bold text-lg leading-tight">
            Himalayan Secondary School
          </h2>
          <p className="text-xs text-rose-200 mt-1">
            LMS Portal • Session २०८१-२०८२ B.S.
          </p>
        </div>

        {/* Tab Switcher: Teacher vs Admin */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab("TEACHER");
              setError("");
            }}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "TEACHER"
                ? "bg-white dark:bg-slate-900 border-b-2 border-emerald-600 text-emerald-600 dark:text-emerald-400"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Teacher Login (शिक्षक लगइन)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("ADMIN");
              setError("");
            }}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "ADMIN"
                ? "bg-white dark:bg-slate-900 border-b-2 border-rose-600 text-rose-600 dark:text-rose-400"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Principal / Admin</span>
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* TEACHER LOGIN FORM */}
          {activeTab === "TEACHER" ? (
            <form onSubmit={handleTeacherSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Employee ID or Email (शिक्षक परिचय नं. वा इमेल)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    required
                    type="text"
                    placeholder="e.g. TCH-101 or ramesh.bhattarai@school.edu.np"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Password (पासवर्ड)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Default: teacher123"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{loading ? "Signing in..." : "Sign In to Teacher Portal"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* ADMIN LOGIN FORM */
            <form onSubmit={handleAdminSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Administrator Username
                </label>
                <input
                  disabled
                  type="text"
                  value="principal@school.edu.np (Administrator)"
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Admin Master Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    required
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="admin123"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{loading ? "Signing in..." : "Sign In as Administrator"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Quick Demo Fast Sign-In:
            </p>
            <div className="space-y-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleFastLogin("TCH-101")}
                className="w-full text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600">
                    Ramesh Prasad Bhattarai
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    TCH-101 • Class 10 (SEE) Teacher (Math)
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
              </button>

              <button
                type="button"
                onClick={() => handleFastLogin("TCH-102")}
                className="w-full text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600">
                    Sarita Devi K.C.
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    TCH-102 • Class 9 Teacher (Science)
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
              </button>

              <button
                type="button"
                onClick={() => handleFastLogin("TCH-103")}
                className="w-full text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600">
                    Hari Prasad Dahal
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    TCH-103 • Class 8 Teacher (Nepali & Social)
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
