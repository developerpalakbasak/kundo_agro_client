"use client";

import { useEffect, useState } from "react";
import { getAdminUsers, updateUserRole } from "@/lib/api/admin";
import { UsersList } from "@/components/admin/UsersList";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const res = await getAdminUsers();
      if (res && res.users && Array.isArray(res.users)) {
        setUsers(res.users);
      } else if (res && res.data && Array.isArray(res.data)) {
        setUsers(res.data);
      } else if (Array.isArray(res)) {
        setUsers(res);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Failed to load admin users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    await updateUserRole(userId, newRole);
    setUsers((prev) =>
      prev.map((u) => {
        const id = u._id || u.id;
        return id === userId ? { ...u, role: newRole } : u;
      })
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-emerald-600">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <span className="text-xs font-semibold text-gray-500">Loading user accounts...</span>
        </div>
      </div>
    );
  }

  return <UsersList users={users} onRoleChange={handleRoleChange} />;
}
