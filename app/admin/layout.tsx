"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Inbox,
  Mail,
  BookOpen,
  Users,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Shield,
  Sparkles,
  ChevronRight,
  Building2,
  BellRing,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SALES";
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // If on login page, render clean layout without dashboard chrome
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;

    // Fetch active session user info
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch((err) => console.error("Failed to load user session:", err));
  }, [pathname, isLoginPage]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      roles: ["ADMIN", "SALES"],
    },
    {
      label: "Stand Briefs",
      href: "/admin/briefs",
      icon: Layers,
      roles: ["ADMIN", "SALES"],
    },
    {
      label: "Contact Inquiries",
      href: "/admin/contacts",
      icon: Inbox,
      roles: ["ADMIN", "SALES"],
    },
    {
      label: "Newsletter Subscribers",
      href: "/admin/subscribers",
      icon: Mail,
      roles: ["ADMIN", "SALES"],
    },
    {
      label: "Journal Articles",
      href: "/admin/blog",
      icon: BookOpen,
      roles: ["ADMIN", "SALES"],
    },
    {
      label: "Team & Roles",
      href: "/admin/users",
      icon: Users,
      roles: ["ADMIN"],
      adminOnly: true,
    },
  ];

  const userRole = currentUser?.role || "ADMIN";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row antialiased">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Branding Section */}
        <div>
          <div className="h-18 px-6 flex items-center justify-between border-b border-slate-100">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 group"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#003E95] to-[#00A7F5] flex items-center justify-center text-white shadow-md shadow-[#003E95]/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 tracking-tight text-base block">
                  IMPACT B2B
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#003E95] font-bold block -mt-0.5">
                  Control Center
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Operations & CRM
            </div>

            {navItems.map((item) => {
              if (item.adminOnly && userRole !== "ADMIN") return null;

              const isActive =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                    isActive
                      ? "bg-gradient-to-r from-[#003E95] to-[#0055CC] text-white shadow-sm shadow-[#003E95]/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.adminOnly && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                      isActive ? "bg-white/20 text-white" : "bg-blue-50 text-[#003E95]"
                    }`}>
                      Admin
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout Bottom Section */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser?.name?.slice(0, 2).toUpperCase() || "IM"}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {currentUser?.name || "Authenticating..."}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      currentUser?.role === "ADMIN" ? "bg-indigo-500" : "bg-emerald-500"
                    }`}
                  />
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-500">
                    {currentUser?.role || "SALES"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </Link>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="py-2 px-3 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? "..." : "Logout"}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-18 px-4 sm:px-6 bg-white/85 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Title */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>Admin</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-800 font-semibold capitalize">
                {pathname.replace("/admin/", "").replace("/admin", "Dashboard") || "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>cPanel Standalone Node</span>
            </div>
          </div>
        </header>

        {/* Page Children Container - Full Width */}
        <main className="flex-1 p-4 sm:p-6 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
