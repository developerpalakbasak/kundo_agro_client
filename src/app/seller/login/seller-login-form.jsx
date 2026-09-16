"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function SellerLoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await login({ email: email.trim(), password });

      const role = res?.user?.role;
      if (role && ["Seller", "Admin"].includes(role)) {
        router.push("/seller");
      } else {
        setError(
          "Access denied. This account is registered as a customer. Please use a Seller account."
        );
      }
    } catch (err) {
      setError(err.message || "Invalid credentials or login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center gap-2 mb-6">
        <div className="relative p-2 rounded-2xl bg-emerald-50/90 ring-1 ring-emerald-500/20 shadow-sm transition-transform hover:scale-105">
          <Image
            src="/kundu_logo.png"
            alt="Kundu Agro & Fisheries"
            width={52}
            height={52}
            priority
            className="rounded-xl object-contain"
          />
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100/80 text-emerald-800 tracking-wide uppercase mb-1">
            🐟 Hatchery & Seller Portal
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Seller Sign In
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Manage your fish seed inventory, quotes, and orders
          </p>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl bg-red-50 p-3.5 border border-red-200/80 text-xs sm:text-sm text-red-700 animate-fade-in"
          >
            <span className="text-red-500 font-bold">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="seller-email"
            className="text-xs font-semibold uppercase tracking-wider text-slate-600"
          >
            Email or Phone
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </div>
            <input
              id="seller-email"
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              placeholder="kamrul.hatchery@gmail.com"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="seller-password"
              className="text-xs font-semibold uppercase tracking-wider text-slate-600"
            >
              Password
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <input
              id="seller-password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-20 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex items-center justify-center h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-600/35 active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign In to Seller Portal"
          )}
        </button>

        {/* Register Option */}
        <div className="mt-3 text-center border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-500">
            Don&apos;t have a seller account yet?{" "}
            <Link
              href="/seller/register"
              className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Register your Hatchery →
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
