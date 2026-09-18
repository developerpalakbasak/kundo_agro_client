"use client";

import { useEffect, useState } from "react";
import { getSellerDashboardStats } from "@/lib/api/seller";
import { SellerDashboardContent } from "@/components/seller/SellerDashboardContent";

export default function SellerDashboardPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await getSellerDashboardStats();
      if (res && res.data) {
        setData(res.data);
      } else if (res) {
        setData(res);
      }
    } catch (err) {
      console.error("Failed to load seller dashboard stats:", err);
      setErrorMsg(err.message || "Failed to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await getSellerDashboardStats();
        if (active) {
          setData(res?.data || res || {});
        }
      } catch (err) {
        if (active) {
          setErrorMsg(err.message || "Failed to load dashboard data.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-emerald-600">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <span className="text-xs font-semibold text-gray-500">
            Loading dashboard analytics...
          </span>
        </div>
      </div>
    );
  }

  if (errorMsg && !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center space-y-3">
        <p className="text-sm font-semibold text-red-600">⚠️ {errorMsg}</p>
        <button
          onClick={loadStats}
          className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <SellerDashboardContent
      stats={data?.stats || {}}
      breakdown={data?.breakdown || {}}
      recent={data?.recent || {}}
      seller={data?.seller || {}}
    />
  );
}
