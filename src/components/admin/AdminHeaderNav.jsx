"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/languageContext";
import { useAuth } from "@/context/AuthContext";
import { ChangePasswordModal } from "./ChangePasswordModal";

const navLinks = [
  { href: "/admin", key: "dashboard", label: "Dashboard" },
  { href: "/admin/products", key: "products", label: "Products" },
  { href: "/admin/sellers", key: "sellers", label: "Sellers" },
  { href: "/admin/blogs", key: "blogs", label: "Blogs" },
  { href: "/admin/users", key: "users", label: "Users" },
  { href: "/admin/orders", key: "orders", label: "Orders" },
];

export function AdminHeaderNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      <div className="hidden items-center gap-4 md:flex">
        <nav className="flex items-center gap-4">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`cursor-pointer text-sm font-medium transition-colors ${isActive
                    ? "font-semibold text-emerald-600"
                    : "text-gray-600 hover:text-emerald-600"
                  }`}
              >
                {t(link.key) || link.label}
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 border border-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>{user.name || user.email}</span>
            <span className="rounded bg-gray-200/80 px-1.5 py-0.5 text-[10px] text-gray-600">
              {user.role || "Admin"}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowPasswordModal(true)}
          className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-emerald-600 hover:text-emerald-600"
          title="Change Password"
        >
          🔑 Password
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-emerald-600 hover:text-emerald-600"
        >
          {t("logout") || "Logout"}
        </button>
      </div>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
}
