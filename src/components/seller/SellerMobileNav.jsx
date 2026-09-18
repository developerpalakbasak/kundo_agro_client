"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/languageContext";
import { useAuth } from "@/context/AuthContext";
import { ChangePasswordModal } from "@/components/admin/ChangePasswordModal";



export function SellerMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const pathname = usePathname();
  const basePath = pathname.startsWith("/seller/animale") ? "/seller/animale" : "/seller/fish";
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user, logout, isVerifiedSeller } = useAuth();

  const navLinks = [
    { href: basePath, key: "sellerDashboard", label: "Dashboard" },
    { href: `${basePath}/products`, key: "products", label: "Products" },
    { href: `${basePath}/products/new`, key: "addProduct", label: "Add Product" },
    { href: `${basePath}/orders`, key: "orders", label: "Orders" },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      router.push(`${basePath}/login`);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setIsOpen(true)}
        className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 md:hidden"
      >
        <span
          className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
            isOpen ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
            isOpen ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-gray-900">
              {language === "bn" ? "বিক্রেতা মেনু" : "Seller Menu"}
            </span>
            {user && (
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                  isVerifiedSeller
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {isVerifiedSeller ? "Verified" : "Pending"}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          {navLinks.map((link) => {
            const isActive =
              link.href === basePath
                ? pathname === basePath
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`cursor-pointer flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-600 font-bold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {t(link.key) || link.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-gray-100 px-3 py-4">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setShowPasswordModal(true);
            }}
            className="w-full cursor-pointer rounded-xl border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            🔑 {language === "bn" ? "পাসওয়ার্ড পরিবর্তন" : "Change Password"}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full cursor-pointer rounded-xl border border-gray-200 px-4 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:border-red-200 hover:bg-red-50"
          >
            {t("logout") || "Logout"}
          </button>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
}
