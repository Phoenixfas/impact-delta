"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  PlusCircle,
  Shield,
  KeyRound,
  Trash2,
  Edit3,
  CheckCircle2,
  X,
  AlertCircle,
  RefreshCw,
  UserCheck,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SALES";
  createdAt: string;
  _count?: {
    assignedBriefs: number;
    posts: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TeamMember | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "SALES" as "ADMIN" | "SALES",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successBanner, setSuccessBanner] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to create user");
        setIsSubmitting(false);
        return;
      }

      setShowCreateModal(false);
      setFormData({ name: "", email: "", password: "", role: "SALES" });
      setSuccessBanner(`Created ${data.user.name} (${data.user.role})`);
      setTimeout(() => setSuccessBanner(""), 3500);
      fetchUsers();
    } catch {
      setFormError("Network error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setFormError("");
    setIsSubmitting(true);

    try {
      const updatePayload: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };
      if (formData.password.trim()) {
        updatePayload.password = formData.password.trim();
      }

      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to update user");
        setIsSubmitting(false);
        return;
      }

      setShowEditModal(false);
      setSelectedUser(null);
      setSuccessBanner(`Updated account for ${data.user.name}`);
      setTimeout(() => setSuccessBanner(""), 3500);
      fetchUsers();
    } catch {
      setFormError("Network error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete ${name}?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setSuccessBanner(`Deleted account for ${name}`);
        setTimeout(() => setSuccessBanner(""), 3500);
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const openEdit = (user: TeamMember) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // empty means don't reset password
      role: user.role,
    });
    setFormError("");
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Team Members & Role RBAC
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#003E95] text-xs font-mono font-bold">
              {users.length} Members
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage executive administrators and sales team members with role-based access permissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-xs transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => {
              setFormData({ name: "", email: "", password: "", role: "SALES" });
              setFormError("");
              setShowCreateModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#003E95] hover:bg-[#002D6E] text-white text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {successBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/60 text-[11px] font-mono uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role Access</th>
                <th className="py-3 px-4">Assigned Briefs</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#003E95]" />
                      <span>Loading team accounts...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No users registered in database.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Name */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center font-bold text-xs">
                        {user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{user.name}</span>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {user.email}
                    </td>

                    {/* Role Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${
                          user.role === "ADMIN"
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Assigned Briefs Count */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                      {user._count?.assignedBriefs ?? 0} Briefs
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openEdit(user)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 text-[#003E95] hover:border-blue-200 transition-colors shadow-2xs"
                        title="Edit User / Reset Password"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-rose-600 hover:border-rose-200 transition-colors shadow-2xs"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200/80 shadow-2xl rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#003E95] flex items-center justify-center font-bold">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add Team Member</h3>
                  <span className="text-xs text-slate-400">Configure credentials & role</span>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono font-bold uppercase text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tariq Al-Mansoor"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5]"
                />
              </div>

              <div>
                <label className="block font-mono font-bold uppercase text-slate-700 mb-1">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tariq@impactmakersevents.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5]"
                />
              </div>

              <div>
                <label className="block font-mono font-bold uppercase text-slate-700 mb-1">
                  Initial Password (Min 6 chars) *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5]"
                />
              </div>

              <div>
                <label className="block font-mono font-bold uppercase text-slate-700 mb-1">
                  Role Assignment *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as "ADMIN" | "SALES" })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 font-semibold focus:bg-white focus:outline-none focus:border-[#00A7F5]"
                >
                  <option value="SALES">SALES — Manage Briefs, Contacts & Notes only</option>
                  <option value="ADMIN">ADMIN — Full System Access, Blog & Team</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#003E95] text-white font-semibold hover:bg-[#002D6E] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER / RESET PASSWORD MODAL */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200/80 shadow-2xl rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#003E95] flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Team Member</h3>
                  <span className="text-xs text-slate-400">{selectedUser.name}</span>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleEditUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono font-bold uppercase text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5]"
                />
              </div>

              <div>
                <label className="block font-mono font-bold uppercase text-slate-700 mb-1">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5]"
                />
              </div>

              <div>
                <label className="block font-mono font-bold uppercase text-slate-700 mb-1">
                  Reset Password (Leave blank to keep unchanged)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="New password (optional)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00A7F5]"
                />
              </div>

              <div>
                <label className="block font-mono font-bold uppercase text-slate-700 mb-1">
                  Role Assignment *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as "ADMIN" | "SALES" })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 font-semibold focus:bg-white focus:outline-none focus:border-[#00A7F5]"
                >
                  <option value="SALES">SALES</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#003E95] text-white font-semibold hover:bg-[#002D6E] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
