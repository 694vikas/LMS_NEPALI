"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "TEACHER";
  phone?: string;
  employeeId?: string;
  subjects?: string[];
  isClassTeacher?: boolean;
  assignedClass?: string;
  assignedSection?: string;
  qualification?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (credentials: {
    role: "ADMIN" | "TEACHER";
    identifier?: string;
    password?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchUser: (teacherUser: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ADMIN: AuthUser = {
  id: "admin-01",
  fullName: "School Principal / Administrator",
  email: "principal@school.edu.np",
  role: "ADMIN",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(DEFAULT_ADMIN);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lms_auth_user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default to Admin if not explicitly logged in as a teacher
        setUser(DEFAULT_ADMIN);
      }
    } catch (e) {
      console.error("Error restoring auth user:", e);
      setUser(DEFAULT_ADMIN);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: {
    role: "ADMIN" | "TEACHER";
    identifier?: string;
    password?: string;
  }) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("lms_auth_user", JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      // continue
    }
    setUser(null);
    localStorage.removeItem("lms_auth_user");
    router.push("/login");
  };

  const switchUser = (newUser: AuthUser) => {
    setUser(newUser);
    localStorage.setItem("lms_auth_user", JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
