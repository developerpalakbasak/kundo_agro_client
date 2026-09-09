"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/languageContext";
import { LanguageToggle } from "@/hooks/languageToggle";
import { CustomerAuthModal } from "./CustomerAuthModal";
import { getCurrentUser, logoutUser } from "@/lib/api/auth";
import { useCart } from "@/context/cartContext";

export function CustomerHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Dropdown states
  const [portalsDropdownOpen, setPortalsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const portalsRef = useRef(null);
  const userRef = useRef(null);

  const pathname = usePathname();
  const { t, language } = useLanguage();
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res.user) setUser(res.user);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (portalsRef.current && !portalsRef.current.contains(event.target)) {
        setPortalsDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setUserDropdownOpen(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const primaryNavLinks = [
    { href: "/", key: "home" },
    { href: "/products", key: "shop" },
    ...(user ? [{ href: "/orders", key: "myOrders" }] : []),
    { href: "/blogs", key: "blogs" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <Image
              src="/kundu_logo.png"
              alt="Kundu Agro and Fisheries logo"
              width={38}
              height={38}
              className="rounded-xl shadow-sm object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {t("brandName")}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-6 lg:flex">
            {primaryNavLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors whitespace-nowrap ${
                    isActive
                      ? "text-primary font-bold"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  {t(link.key)}
                </Link>
              );
            })}

            {/* Portals Dropdown */}
            <div className="relative" ref={portalsRef}>
              <button
                type="button"
                onClick={() => setPortalsDropdownOpen(!portalsDropdownOpen)}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors cursor-pointer py-1.5 px-2.5 rounded-xl hover:bg-gray-50 ${
                  pathname.startsWith("/seller") || pathname.startsWith("/admin")
                    ? "text-primary bg-primary/5"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                <span>{language === "bn" ? "পোর্টালসমূহ" : "Portals"}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    portalsDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {portalsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl animate-scale-in z-50 space-y-1">
                  <Link
                    href="/seller"
                    onClick={() => setPortalsDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    <span className="text-base">🐟</span>
                    <div>
                      <div>{language === "bn" ? "পোনা বিক্রেতা পোর্টাল" : "Fish Seed Seller Portal"}</div>
                      <div className="text-[10px] font-normal text-gray-400">Hatchery & Fry Management</div>
                    </div>
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setPortalsDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <span className="text-base">⚙️</span>
                    <div>
                      <div>{language === "bn" ? "এডমিন প্যানেল" : "Admin Panel"}</div>
                      <div className="text-[10px] font-normal text-gray-400">Store Management & Settings</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            <LanguageToggle />

            {/* Shopping Cart Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open Shopping Cart"
              className="relative flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200/80 p-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-xs animate-scale-in">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Account / Profile Dropdown (Desktop) */}
            <div className="hidden lg:block relative" ref={userRef}>
              {user ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 rounded-xl bg-gray-100/80 border border-gray-200/60 px-3 py-1.5 text-xs font-bold text-gray-800 hover:bg-gray-200/70 transition-all cursor-pointer"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-[10px] font-black">
                      {user.name ? user.name.charAt(0).toUpperCase() : "👤"}
                    </div>
                    <span className="truncate max-w-[120px]">{user.name}</span>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        userDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl animate-scale-in z-50 space-y-1">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user.email || user.phone}</p>
                      </div>
                      <Link
                        href="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                      >
                        📦 {language === "bn" ? "আমার অর্ডারসমূহ" : "My Orders"}
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        🚪 {language === "bn" ? "লগ আউট" : "Log out"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="cursor-pointer rounded-xl bg-primary px-4 py-2 text-xs font-extrabold text-white shadow-md hover:bg-primary/90 transition-all whitespace-nowrap"
                >
                  {language === "bn" ? "সাইন ইন" : "Sign In"}
                </button>
              )}
            </div>

            {/* Mobile / Tablet Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex cursor-pointer items-center justify-center rounded-xl p-2 text-gray-700 hover:bg-gray-100 lg:hidden transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <div className="relative w-5 h-4 flex flex-col justify-between">
                <span
                  className={`h-0.5 w-full bg-current rounded-full transition-transform duration-300 ${
                    mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-current rounded-full transition-opacity duration-300 ${
                    mobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-current rounded-full transition-transform duration-300 ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Drawer Menu */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 top-16 z-30 bg-black/40 backdrop-blur-xs lg:hidden animate-fade-in"
              onClick={() => setMobileMenuOpen(false)}
            />

            <div className="relative z-40 border-b border-gray-100 bg-white px-4 py-4 lg:hidden shadow-lg space-y-3 animate-drawer-down">
              {/* User Info / Sign In */}
              <div className="pb-3 border-b border-gray-100">
                {user ? (
                  <div className="flex items-center justify-between gap-2 bg-gray-50 rounded-xl p-2.5">
                    <div>
                      <span className="text-xs font-bold text-gray-800 block truncate">
                        👤 {user.name}
                      </span>
                      <span className="text-[10px] text-gray-500">{user.email || user.phone}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="rounded-lg bg-red-50 border border-red-100 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary/90 transition-colors"
                  >
                    Sign In / Register
                  </button>
                )}
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                {primaryNavLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                      }`}
                    >
                      {t(link.key)}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Portals Section */}
              <div className="pt-2 border-t border-gray-100 space-y-1">
                <p className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {language === "bn" ? "পোর্টালসমূহ" : "Portals"}
                </p>
                <Link
                  href="/seller"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  🐟 {language === "bn" ? "পোনা বিক্রেতা পোর্টাল" : "Fish Seed Seller Portal"}
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  ⚙️ {language === "bn" ? "এডমিন প্যানেল" : "Admin Panel"}
                </Link>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Customer Auth Modal */}
      <CustomerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(authenticatedUser) => setUser(authenticatedUser)}
      />
    </>
  );
}
