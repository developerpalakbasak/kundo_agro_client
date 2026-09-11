import React from "react";
import { AdminLoginForm } from "./admin-login-form";

export const metadata = {
  title: "Admin Login | Kundu Agro & Fisheries",
  description: "Administrative portal login for Kundu Agro & Fisheries",
};

export default function AdminLoginPage() {
  return (
    <main className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-slate-900 p-4">
      {/* Dynamic Ambient Background Gradients */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md my-auto">
        <div className="rounded-3xl border border-white/10 bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/50">
          <AdminLoginForm />
        </div>
        
        {/* Footer Credit / Copyright */}
        <p className="mt-4 text-center text-xs font-medium text-slate-400">
          &copy; {new Date().getFullYear()} Kundu Agro & Fisheries. All rights reserved.
        </p>
      </div>
    </main>
  );
}

