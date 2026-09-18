"use client";

import { useEffect, useState } from "react";
import { getSellerDashboardStats } from "@/lib/api/seller";
import { SellerOrdersList } from "@/components/seller/SellerOrdersList";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await getSellerDashboardStats();
      const recentOrders = res?.data?.recent?.orders || res?.recent?.orders || [];
      setOrders(recentOrders);
    } catch (err) {
      console.error("Failed to load seller orders:", err);
      setErrorMsg(err.message || "Failed to load orders.");
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
          const recentOrders = res?.data?.recent?.orders || res?.recent?.orders || [];
          setOrders(recentOrders);
        }
      } catch (err) {
        if (active) {
          setErrorMsg(err.message || "Failed to load orders.");
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
            Loading customer orders...
          </span>
        </div>
      </div>
    );
  }

  if (errorMsg && orders.length === 0) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center space-y-3">
        <p className="text-sm font-semibold text-red-600">⚠️ {errorMsg}</p>
        <button
          onClick={loadOrders}
          className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return <SellerOrdersList orders={orders} />;
}
