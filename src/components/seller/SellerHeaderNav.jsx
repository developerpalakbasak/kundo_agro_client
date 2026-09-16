"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/languageContext";
import { useAuth } from "@/context/AuthContext";
import { ChangePasswordModal } from "@/components/admin/ChangePasswordModal";

const navLinks = [
  { href: "/seller", key: "sellerDashboard", label: "Dashboard" },
  { href: "/seller/products", key: "products", label: "Products" },
  { href: "/seller/products/new", key: "addProduct", label: "+ Add Product" },
  { href: "/seller/orders", key: "orders", label: "Orders" },
];

export function SellerHeaderNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user, logout, isVerifiedSeller } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      router.push("/seller/login");
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
              link.href === "/seller"
                ? pathname === "/seller"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`cursor-pointer text-sm font-medium transition-colors ${
                  isActive
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
          <div className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700">
            <span
              className={`h-2 w-2 rounded-full ${
                isVerifiedSeller ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
              }`}
            />
            <span className="max-w-[130px] truncate">{user.name || user.email}</span>
            <span
              className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                isVerifiedSeller
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {isVerifiedSeller
                ? language === "bn"
                  ? "অনুমোদিত"
                  : "Verified"
                : language === "bn"
                ? "অপেক্ষমান"
                : "Pending"}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowPasswordModal(true)}
          className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-emerald-600 hover:text-emerald-600"
          title="Change Password"
        >
          🔑 {language === "bn" ? "পাসওয়ার্ড" : "Password"}
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
