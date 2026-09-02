"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
  AlertCircle,
  KeyRound,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from");
  const redirectUrl =
    !fromParam || fromParam === "/admin" || fromParam === "/admin/" || fromParam === "/admin/login"
      ? "/admin/dashboard"
      : fromParam;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Authentication failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      // Successful login -> navigate to requested page
      router.push(redirectUrl);
      router.refresh();
    } catch {
      setErrorMessage("Network error connecting to the server. Please try again.");
      setIsLoading(false);
    }
  };

  const fillCredentials = (role: "ADMIN" | "SALES") => {
    if (role === "ADMIN") {
      setEmail("admin@impactmakersevents.com");
      setPassword("ImpactAdmin2026!");
    } else {
      setEmail("sales@impactmakersevents.com");
      setPassword("ImpactSales2026!");
    }
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50/40 to-blue-50/60 px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#003E95]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#00A7F5]/15 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#003E95] to-[#00A7F5] shadow-lg shadow-[#003E95]/20 text-white mb-4">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            IMPACT MAKERS
          </h1>
          <p className="text-xs font-mono font-semibold uppercase tracking-widest text-[#003E95] mt-1">
            Enterprise Management Console
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-slate-200/60 rounded-3xl p-6 sm:p-8 transition-all">
          <div className="mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#00A7F5]" />
              Sign in to Portal
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your corporate credentials to access the administrative dashboard.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@impactmakersevents.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#00A7F5] focus:ring-4 focus:ring-[#00A7F5]/10 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#00A7F5] focus:ring-4 focus:ring-[#00A7F5]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#003E95] to-[#00A7F5] hover:opacity-95 text-white font-semibold text-sm shadow-md shadow-[#003E95]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Authenticate Session</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill helper */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider text-center mb-3">
              Fast Development Logins
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials("ADMIN")}
                className="py-1.5 px-2.5 rounded-lg border border-blue-200/80 bg-blue-50/60 hover:bg-blue-100/70 text-[#003E95] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Fill Admin</span>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("SALES")}
                className="py-1.5 px-2.5 rounded-lg border border-sky-200/80 bg-sky-50/60 hover:bg-sky-100/70 text-[#00A7F5] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fill Sales</span>
              </button>
            </div>
          </div>
        </div>

          {/* Security Footer */}
        <div className="text-center mt-6 text-xs text-slate-400 font-medium">
          Protected by AES-256 JWT & HTTP-Only Secure Cookies • cPanel Standalone
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 text-xs">Loading authentication interface...</div>}>
      <LoginForm />
    </Suspense>
  );
}
