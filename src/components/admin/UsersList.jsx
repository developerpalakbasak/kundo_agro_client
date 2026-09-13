"use client";

import { useState } from "react";
import { useLanguage } from "@/hooks/languageContext";

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

export function UsersList({ users = [], onRoleChange, onDeleteUser }) {
  const { t, language } = useLanguage();
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {t("users") || "Users Management"}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage registered accounts, assigned roles, and permissions.
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
          Total Users: {users.length}
        </span>
      </div>

      {users.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-xs">
          <p className="text-sm font-medium text-gray-900">No users found</p>
          <p className="max-w-sm text-sm text-gray-500">
            No registered user accounts found in the database.
          </p>
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
                        <button
                          type="button"
                          onClick={() => setSelectedUser(u)}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-emerald-600 hover:text-emerald-600"
                        >
                          Details
                        </button>
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
          </div>
        </div>
      )}
    </div>
  );
}
