"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/languageContext";
import { LanguageToggle } from "@/hooks/languageToggle";
import { CustomerAuthModal } from "./CustomerAuthModal";
import { getCurrentUser, logoutUser } from "@/lib/api/auth";
import { useCart } from "@/context/cartContext";

const navLinks = [
  { href: "/", key: "home" },
  { href: "/products", key: "shop" },
  { href: "/orders", key: "myOrders" },
  { href: "/blogs", key: "blogs" },
  { href: "/seller", key: "sellerPortal" },
  { href: "/admin", key: "adminPanel" },
];

export function CustomerHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const pathname = usePathname();
  const { t } = useLanguage();
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    // Check active user session on mount
    getCurrentUser()
      .then((res) => {
        if (res.user) setUser(res.user);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const visibleNavLinks = navLinks.filter((link) => {
    if (link.href === "/orders" && !user) return false;
    return true;
  });

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-3 sm:px-4">
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

          {/* Desktop Navigation Links (lg:flex) */}
          <nav className="hidden items-center gap-5 lg:gap-7 lg:flex">
            {visibleNavLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  {t(link.key)}
                </Link>
              );
            })}
          </nav>

          {/* Header Right Actions (Language Toggle + Auth + Cart + Mobile/Tablet Menu Toggle) */}
          <div className="flex items-center gap-2 lg:gap-3">
            <LanguageToggle />

            {/* Customer User Account Action (Desktop lg:flex) */}
            <div className="hidden lg:flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-700 bg-gray-100 rounded-full px-3 py-1 truncate max-w-[160px]">
                    👤 {user.name}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="cursor-pointer rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="cursor-pointer rounded-xl bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all whitespace-nowrap"
                >
                  Sign In / Register
                </button>
              )}
            </div>

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

            {/* Mobile & Tablet Animated Hamburger Toggle (< lg) */}
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

        {/* Mobile & Tablet Drawer Navigation (< lg) */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 top-16 z-30 bg-black/40 backdrop-blur-xs lg:hidden animate-fade-in"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <div className="relative z-40 border-b border-gray-100 bg-white px-4 py-4 lg:hidden shadow-lg space-y-3 animate-drawer-down">
              {/* Mobile/Tablet Auth Button / User Banner */}
              <div className="pb-3 border-b border-gray-100 lg:hidden">
                {user ? (
                  <div className="flex items-center justify-between gap-2 bg-gray-50 rounded-xl p-2.5">
                    <span className="text-xs font-bold text-gray-800 truncate">
                      👤 {user.name}
                    </span>
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
                {visibleNavLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
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
            </div>
          </>
        )}
      </header>

      {/* Customer Authentication Modal */}
      <CustomerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(authenticatedUser) => setUser(authenticatedUser)}
      />
    </>
  );
}
