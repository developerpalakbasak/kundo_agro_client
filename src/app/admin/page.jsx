"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getDashboardStats } from "@/lib/api/admin";
import { DashboardContent } from "@/components/admin/DashboardContent";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    productCount: 0,
    userCount: 0,
    blogCount: 0,
    orderCount: 0,
    totalRevenue: 0,
    breakdown: {},
  });
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace("/admin/login");
    }
  }, [user, loading, isAdmin, router]);

  useEffect(() => {
    if (user && isAdmin) {
      getDashboardStats()
        .then((res) => {
          if (res?.data) {
            const dashboardData = res.data;
            setStats({
              productCount: dashboardData.stats?.products || 0,
              userCount: dashboardData.stats?.users || 0,
              blogCount: dashboardData.stats?.blogs || 0,
              orderCount: dashboardData.stats?.orders || 0,
              totalRevenue: dashboardData.stats?.totalRevenue || 0,
              breakdown: dashboardData.breakdown || {},
            });
          }
        })
        .catch((err) => {
          console.error("Failed to load dashboard stats:", err);
        })
        .finally(() => {
          setIsStatsLoading(false);
        });
    }
  }, [user, isAdmin]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-emerald-600">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <span className="text-xs font-semibold text-gray-500">Checking authorization...</span>
        </div>
      </div>
    );
  }

  return (
    <DashboardContent
      productCount={stats.productCount || stats.products || 0}
      userCount={stats.userCount || stats.users || 0}
      blogCount={stats.blogCount || stats.blogs || 0}
      orderCount={stats.orderCount || stats.orders || 0}
      totalRevenue={stats.totalRevenue || 0}
      breakdown={stats.breakdown}
    />
  );
}
