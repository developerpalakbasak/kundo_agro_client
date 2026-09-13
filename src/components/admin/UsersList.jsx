"use client";

import { useState } from "react";
import { useLanguage } from "@/hooks/languageContext";
import { createAdminUser, resetUserPasswordByAdmin, deleteAdminUser } from "@/lib/api/admin";

function getInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatDate(value, locale) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getRoleBadgeColor(role) {
  switch (role) {
    case "Admin":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Seller":
    case "Staff":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Customer":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export function UsersList({ users = [], onRoleChange, onRefresh }) {
  const { t, language } = useLanguage();
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [resetUser, setResetUser] = useState(null);

  // Form States for Create User
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Staff",
    status: "Active",
    phone: "",
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  // Form States for Reset Password
  const [resetForm, setResetForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  const handleRoleSelect = async (userId, newRole) => {
    try {
      setUpdatingId(userId);
      if (onRoleChange) await onRoleChange(userId, newRole);
    } catch (err) {
      alert(err.message || "Failed to update user role.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateError("");
    if (!createForm.name || !createForm.email || !createForm.password) {
      setCreateError("Name, email, and password are required.");
      return;
    }
    if (createForm.password.length < 6) {
      setCreateError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setCreateLoading(true);
      await createAdminUser(createForm);
      setShowCreateModal(false);
      setCreateForm({
        name: "",
        email: "",
        password: "",
        role: "Staff",
        status: "Active",
        phone: "",
      });
      if (onRefresh) await onRefresh();
    } catch (err) {
      setCreateError(err.response?.data?.message || err.message || "Failed to create user account.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    if (!resetForm.newPassword) {
      setResetError("New password is required.");
      return;
    }
    if (resetForm.newPassword.length < 6) {
      setResetError("Password must be at least 6 characters long.");
      return;
    }
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }

    const userId = resetUser._id || resetUser.id;

    try {
      setResetLoading(true);
      await resetUserPasswordByAdmin(userId, resetForm.newPassword);
      setResetSuccess(`Password updated successfully for ${resetUser.name}`);
      setTimeout(() => {
        setResetUser(null);
        setResetForm({ newPassword: "", confirmPassword: "" });
        setResetSuccess("");
      }, 1500);
    } catch (err) {
      setResetError(err.response?.data?.message || err.message || "Failed to reset password.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleDelete = async (u) => {
    const userId = u._id || u.id;
    if (!window.confirm(`Are you sure you want to delete user "${u.name}"?`)) return;

    try {
      await deleteAdminUser(userId);
      if (selectedUser && (selectedUser._id === userId || selectedUser.id === userId)) {
        setSelectedUser(null);
      }
      if (onRefresh) await onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to delete user.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {t("users") || "Users Management"}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage registered accounts, create new staff/admin users, assigned roles, and security passwords.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            Total Users: {users.length}
          </span>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 shadow-xs"
          >
            <span className="text-sm font-bold">+</span>
            <span>Add User / Admin</span>
          </button>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-xs">
          <p className="text-sm font-medium text-gray-900">No users found</p>
          <p className="max-w-sm text-sm text-gray-500">
            No registered user accounts found in the database.
          </p>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="mt-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            Create First User
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="border-b border-gray-100 bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {users.map((u) => {
                  const userId = u._id || u.id;
                  const role = u.role || "Customer";
                  return (
                    <tr
                      key={userId}
                      className="hover:bg-emerald-50/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedUser(u)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                            {getInitials(u.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{u.name}</p>
                            <p className="text-[11px] text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          disabled={updatingId === userId}
                          value={role}
                          onChange={(e) => handleRoleSelect(userId, e.target.value)}
                          className={`rounded-lg border px-2.5 py-1 text-xs font-semibold cursor-pointer outline-none ${getRoleBadgeColor(
                            role
                          )}`}
                        >
                          <option value="Customer">Customer</option>
                          <option value="Seller">Seller</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{u.phone || "—"}</td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(u.createdAt, language)}</td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setResetUser(u);
                              setResetForm({ newPassword: "", confirmPassword: "" });
                              setResetError("");
                              setResetSuccess("");
                            }}
                            className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100"
                            title="Reset Password"
                          >
                            🔑 Reset Password
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedUser(u)}
                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-emerald-600 hover:text-emerald-600"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-800">
                  {getInitials(selectedUser.name)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-xs text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <dl className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <dt className="text-gray-400 uppercase font-bold text-[10px]">Role</dt>
                <dd className="mt-1">
                  <span className={`inline-block rounded-full border px-2.5 py-0.5 font-bold ${getRoleBadgeColor(selectedUser.role)}`}>
                    {selectedUser.role || "Customer"}
                  </span>
                </dd>
              </div>

              <div>
                <dt className="text-gray-400 uppercase font-bold text-[10px]">Phone</dt>
                <dd className="mt-1 font-semibold text-gray-900">{selectedUser.phone || "—"}</dd>
              </div>

              <div>
                <dt className="text-gray-400 uppercase font-bold text-[10px]">Joined Date</dt>
                <dd className="mt-1 font-semibold text-gray-900">{formatDate(selectedUser.createdAt, language)}</dd>
              </div>

              <div>
                <dt className="text-gray-400 uppercase font-bold text-[10px]">User ID</dt>
                <dd className="mt-1 font-mono text-[10px] text-gray-500 truncate">{selectedUser._id || selectedUser.id}</dd>
              </div>
            </dl>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setResetUser(selectedUser);
                  setSelectedUser(null);
                }}
                className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100"
              >
                🔑 Reset Password
              </button>

              <button
                type="button"
                onClick={() => handleDelete(selectedUser)}
                className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
              >
                🗑️ Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Create New Account</h3>
                <p className="text-xs text-gray-500">Add a new Admin, Manager, Staff, or Customer user</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            {createError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="e.g. Tanvir Rahman"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="admin@kunduagro.com"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Initial Password *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    placeholder="01700-000000"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Assigned Role</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-emerald-600 font-medium"
                  >
                    <option value="Admin">Admin (Full Access)</option>
                    <option value="Manager">Manager (Operations)</option>
                    <option value="Staff">Staff (Daily Tasks)</option>
                    <option value="Customer">Customer (Storefront)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Account Status</label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-emerald-600 font-medium"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {createLoading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Force-Reset Password Modal */}
      {resetUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setResetUser(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Reset User Password</h3>
                <p className="text-xs text-gray-500">For: <span className="font-semibold text-emerald-700">{resetUser.name}</span> ({resetUser.email})</p>
              </div>
              <button
                type="button"
                onClick={() => setResetUser(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            {resetError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                {resetError}
              </div>
            )}

            {resetSuccess && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
                {resetSuccess}
              </div>
            )}

            <form onSubmit={handleResetSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={resetForm.newPassword}
                  onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={resetForm.confirmPassword}
                  onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })}
                  placeholder="Re-type new password"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResetUser(null)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="rounded-xl bg-amber-600 px-5 py-2 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
                >
                  {resetLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
