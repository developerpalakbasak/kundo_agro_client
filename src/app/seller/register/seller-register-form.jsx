"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function SellerRegisterForm() {
  const router = useRouter();
  const { registerSeller } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await registerSeller({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
      });

      router.push("/seller");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center gap-2 mb-5">
        <div className="relative p-2 rounded-2xl bg-emerald-50/90 ring-1 ring-emerald-500/20 shadow-sm transition-transform hover:scale-105">
          <Link href="/">
            <Image
              src="/kundu_logo.png"
              alt="Kundu Agro & Fisheries"
              width={52}
              height={52}
              priority
              className="rounded-xl object-contain"
            />
          </Link>
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100/80 text-emerald-800 tracking-wide uppercase mb-1">
            🐟 Hatchery Registration
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Register as Seller
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            List your fish seeds & agro products directly to farmers
          </p>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl bg-red-50 p-3.5 border border-red-200/80 text-xs sm:text-sm text-red-700 animate-fade-in"
          >
            <span className="text-red-500 font-bold">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Notice on Approval */}
        <div className="rounded-xl bg-emerald-50/70 border border-emerald-100 p-3 text-[11px] text-emerald-800 leading-relaxed">
          ℹ️ Newly registered hatcheries will start as <strong>Pending Approval</strong>. You can immediately log in and set up your catalog!
        </div>

        {/* Full Name / Hatchery Name */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Hatchery or Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. Kamrul Hassan Hatchery"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
          />
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="hatchery@example.com"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
          />
        </div>

        {/* Phone Field */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="017xxxxxxxx"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Password (Min 6 chars) *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 pr-16 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs font-semibold text-slate-500 hover:text-emerald-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Confirm Password *
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex items-center justify-center h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none"
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
              Creating Account...
            </span>
          ) : (
            "Create Hatchery Account"
          )}
        </button>

        {/* Login Option */}
        <div className="mt-2 text-center border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-500">
            Already have a seller account?{" "}
            <Link
              href="/seller/login"
              className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Sign In →
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
