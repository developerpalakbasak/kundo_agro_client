"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/languageContext";
import { DashboardPieChart } from "./DashboardPieChart";

export function DashboardContent({
  productCount = 0,
  userCount = 0,
  blogCount = 0,
  orderCount = 0,
  totalRevenue = 0,
  breakdown,
}) {
  const { t } = useLanguage();

  const stats = [
    { key: "products", label: "Products", value: String(productCount), href: "/admin/products" },
    { key: "users", label: "Users", value: String(userCount), href: "/admin/users" },
    { key: "blogs", label: "Blogs", value: String(blogCount), href: "/admin/blogs" },
    { key: "orders", label: "Orders", value: String(orderCount), href: "/admin/orders" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {t("dashboard") || "Dashboard"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("dashboardSubtitle") || "Overview of system analytics & management"}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700 shadow-xs"
        >
          {t("addProduct") || "+ Add Product"}
        </Link>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.key}
            href={stat.href}
            className="group cursor-pointer rounded-xl border border-gray-100 bg-white p-6 shadow-xs transition-all hover:border-gray-200 hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500 transition-colors group-hover:text-emerald-600">
              {t(stat.key) || stat.label}
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Revenue Card */}
      {totalRevenue > 0 && (
        <div className="rounded-xl border border-gray-100 bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white shadow-xs">
          <p className="text-sm font-medium text-emerald-100">Total Revenue</p>
          <p className="mt-2 text-3xl font-bold">৳ {totalRevenue.toLocaleString()}</p>
        </div>
      )}

      {/* Interactive Analytics Pie Chart */}
      <DashboardPieChart
        stats={{
          products: productCount,
          users: userCount,
          blogs: blogCount,
          orders: orderCount,
        }}
        breakdown={breakdown}
      />
    </div>
  );
}
