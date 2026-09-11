"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageProvider } from "@/hooks/languageContext";
import { AdminHeaderNav } from "./AdminHeaderNav";
import { AdminMobileNav } from "./AdminMobileNav";

export function AdminLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="w-full min-h-screen bg-slate-900 text-slate-100">{children}</div>;
  }

  return (
    <LanguageProvider>
      <div className="flex min-h-screen flex-1 flex-col bg-gray-50/50 text-gray-900">
        <header className="sticky top-0 z-30 border-b border-gray-100 bg-white shadow-xs">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
            {/* Brand */}
            <Link href="/admin" className="flex items-center gap-3">
              <Image
                src="/kundu_logo.png"
                alt="Kundu Agro and Fisheries logo"
                width={36}
                height={36}
                className="rounded-lg object-contain"
              />
              <span className="text-sm font-semibold tracking-tight text-gray-900">
                Admin Panel
              </span>
            </Link>

            {/* Desktop Nav */}
            <AdminHeaderNav />

            {/* Mobile Nav */}
            <AdminMobileNav />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      </div>
    </LanguageProvider>
  );
}
