"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LanguageProvider, useLanguage } from "@/hooks/languageContext";
import { LanguageToggle } from "@/hooks/languageToggle";
import { useAuth } from "@/context/AuthContext";
import { SellerHeaderNav } from "./SellerHeaderNav";
import { SellerMobileNav } from "./SellerMobileNav";

function SellerLayoutInner({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isVerifiedSeller, isSeller } = useAuth();
  const { t, language } = useLanguage();

  const isAuthPage =
    pathname === "/seller/login" || pathname === "/seller/register";

  useEffect(() => {
    if (!loading && !isAuthPage) {
      if (!user) {
        router.push("/seller/login");
      } else if (!isSeller) {
        router.push("/seller/login?error=unauthorized");
      }
    }
  }, [loading, user, isSeller, isAuthPage, router]);

  if (isAuthPage) {
    return <div className="w-full min-h-screen bg-slate-900 text-slate-100">{children}</div>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50/50 text-emerald-600">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <span className="text-xs font-semibold text-gray-500">Loading Seller Portal...</span>
        </div>
      </div>
    );
  }

  if (!user || !isSeller) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-gray-50/50 text-gray-900">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          {/* Brand & Portal Badge */}
          <Link href="/seller" className="flex items-center gap-3 group">
            <Image
              src="/kundu_logo.png"
              alt="Kundu Agro and Fisheries logo"
              width={36}
              height={36}
              className="rounded-lg object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-gray-900">
                {t("brandName") || "Kundu Agro"}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600">
                {language === "bn" ? "পোনা বিক্রেতা পোর্টাল" : "Seller Portal"}
              </span>
            </div>
          </Link>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-3">
            <SellerHeaderNav />
            <LanguageToggle />
            <SellerMobileNav />
          </div>
        </div>
      </header>

      {/* Pending Admin Approval Banner */}
      {!isVerifiedSeller && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 border-b border-amber-200 px-4 py-3">
          <div className="mx-auto flex max-w-6xl items-center gap-3 text-amber-900">
            <span className="text-lg">⚠️</span>
            <div className="text-xs sm:text-sm">
              <span className="font-bold">
                {t("pendingApprovalBanner") || "Account Pending Admin Approval"}:
              </span>{" "}
              {t("pendingApprovalDesc") ||
                "Your hatchery account is under review by our administration. You can add and manage your products now; they will become publicly visible once approved."}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}

export function SellerLayoutWrapper({ children }) {
  return (
    <LanguageProvider>
      <SellerLayoutInner>{children}</SellerLayoutInner>
    </LanguageProvider>
  );
}
