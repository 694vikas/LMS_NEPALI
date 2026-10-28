"use client";

import { useState } from "react";
import { Sparkles, Calendar, Bell, RefreshCw, CheckCircle2 } from "lucide-react";

export function Navbar() {
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const handleSeed = async () => {
    if (!confirm("Populate database with Nepali school sample students, teachers, and fees?")) {
      return;
    }
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSeedSuccess(true);
        setTimeout(() => {
          setSeedSuccess(false);
          window.location.reload();
        }, 1200);
      } else {
        alert("Seed failed: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error seeding: " + err.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="text-base font-semibold text-slate-800">
            Himalayan Secondary English Boarding School
          </h2>
          <p className="text-xs text-slate-500">
            Approved by Ministry of Education, Nepal • Code: 27-012-0045
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Date Display (BS & AD) */}
        <div className="hidden md:flex items-center bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 space-x-2 border border-slate-200">
          <Calendar className="w-4 h-4 text-rose-600" />
          <span>कार्तिक २०८१ (Kartik 2081 B.S.)</span>
        </div>

        {/* Quick Seed Button */}
        <button
          onClick={handleSeed}
          disabled={seeding || seedSuccess}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            seedSuccess
              ? "bg-emerald-600 text-white"
              : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
          }`}
          title="Seed realistic Nepali student, teacher and fee data"
        >
          {seedSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-white animate-bounce" />
              <span>Loaded!</span>
            </>
          ) : seeding ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Seeding DB...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Seed Sample Data</span>
            </>
          )}
        </button>

        {/* User profile badge */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-rose-700 text-white flex items-center justify-center font-bold text-xs shadow">
            AD
          </div>
          <div className="hidden lg:block text-left text-xs">
            <p className="font-semibold text-slate-800 leading-tight">Admin Portal</p>
            <p className="text-[11px] text-slate-500">Principal / Accountant</p>
          </div>
        </div>
      </div>
    </header>
  );
}

