"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/hooks/languageContext";
import { getImageUrl } from "@/lib/api/axios";

function formatCurrency(num, locale) {
  const val = Number(num) || 0;
  return `৳ ${val.toLocaleString(locale === "bn" ? "bn-BD" : "en-US")}`;
}

function formatDate(dateStr, locale) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function SellerDashboardContent({
  stats = {},
  breakdown = {},
  recent = {},
  seller = {},
}) {
  const { t, language } = useLanguage();

  const totalProducts = stats.totalProducts || 0;
  const availableProducts = stats.availableProducts || 0;
  const outOfStock = stats.outOfStock || 0;
  const totalOrders = stats.totalOrders || 0;
  const totalRevenue = stats.totalRevenue || 0;

  const orderStatuses = breakdown.orderStatuses || {
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  const recentProducts = recent.products || [];
  const recentOrders = recent.orders || [];

  return (
    <div className="flex flex-col gap-8">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            {language === "bn"
              ? `স্বাগতম, ${seller.name || "বিক্রেতা"}!`
              : `Welcome back, ${seller.name || "Seller"}!`}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("sellerPortalSubtitle") ||
              "Manage your hatchery fry stock, price quotes, and farmer orders."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/seller/products/new"
            className="cursor-pointer rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-95"
          >
            {t("addProduct") || "+ Add Product"}
          </Link>
          <Link
            href="/seller/products"
            className="cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            {t("manageProducts") || "View Products"}
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Products */}
        <Link
          href="/seller/products"
          className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition-all hover:border-emerald-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {language === "bn" ? "মোট পণ্য" : "Total Products"}
            </span>
            <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600 text-lg">
              🐟
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-gray-900">{totalProducts}</p>
          <p className="mt-1 text-xs text-gray-500">
            {availableProducts} {language === "bn" ? "পাওয়া যাচ্ছে" : "in stock"}
          </p>
        </Link>

        {/* Available Products */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {language === "bn" ? "স্টকে আছে" : "Active & In Stock"}
            </span>
            <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600 text-lg">
              ✅
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-emerald-600">
            {availableProducts}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {outOfStock} {language === "bn" ? "স্টক শেষ" : "out of stock"}
          </p>
        </div>

        {/* Total Orders */}
        <Link
          href="/seller/orders"
          className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition-all hover:border-blue-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {language === "bn" ? "মোট অর্ডার" : "Orders Received"}
            </span>
            <span className="rounded-lg bg-blue-50 p-2 text-blue-600 text-lg">
              📦
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-gray-900">{totalOrders}</p>
          <p className="mt-1 text-xs text-gray-500">
            {orderStatuses.processing} {language === "bn" ? "প্রক্রিয়াধীন" : "processing"}
          </p>
        </Link>

        {/* Total Revenue */}
        <div className="rounded-2xl border border-transparent bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
              {t("totalRevenue") || "Seller Revenue"}
            </span>
            <span className="rounded-lg bg-white/20 p-2 text-lg">৳</span>
          </div>
          <p className="mt-3 text-3xl font-extrabold tracking-tight">
            {formatCurrency(totalRevenue, language)}
          </p>
          <p className="mt-1 text-xs text-emerald-100">
            {language === "bn" ? "সরাসরি বিক্রয় আয়" : "Net sales from products"}
          </p>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
        <h2 className="text-base font-bold text-gray-900 mb-4">
          {language === "bn" ? "অর্ডার স্ট্যাটাস সারাংশ" : "Order Status Breakdown"}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-amber-50/70 border border-amber-100 p-3.5">
            <span className="text-xs font-bold text-amber-700">
              ⏳ {language === "bn" ? "প্রক্রিয়াধীন" : "Processing"}
            </span>
            <p className="mt-1 text-2xl font-black text-amber-900">
              {orderStatuses.processing || 0}
            </p>
          </div>
          <div className="rounded-xl bg-blue-50/70 border border-blue-100 p-3.5">
            <span className="text-xs font-bold text-blue-700">
              🚚 {language === "bn" ? "ডেলিভারির পথে" : "Shipped"}
            </span>
            <p className="mt-1 text-2xl font-black text-blue-900">
              {orderStatuses.shipped || 0}
            </p>
          </div>
          <div className="rounded-xl bg-emerald-50/70 border border-emerald-100 p-3.5">
            <span className="text-xs font-bold text-emerald-700">
              🎉 {language === "bn" ? "সম্পন্ন" : "Delivered"}
            </span>
            <p className="mt-1 text-2xl font-black text-emerald-900">
              {orderStatuses.delivered || 0}
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-3.5">
            <span className="text-xs font-bold text-gray-600">
              ❌ {language === "bn" ? "বাতিল" : "Cancelled"}
            </span>
            <p className="mt-1 text-2xl font-black text-gray-800">
              {orderStatuses.cancelled || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Products & Recent Orders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Products */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">
                {language === "bn" ? "সাম্প্রতিক পণ্যসমূহ" : "Recent Products"}
              </h2>
              <Link
                href="/seller/products"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                {language === "bn" ? "সবগুলো দেখুন →" : "View All →"}
              </Link>
            </div>

            {recentProducts.length === 0 ? (
              <div className="py-10 text-center text-gray-400">
                <p className="text-2xl mb-2">🐟</p>
                <p className="text-sm font-medium">
                  {language === "bn" ? "কোন পণ্য যোগ করা হয়নি" : "No products added yet."}
                </p>
                <Link
                  href="/seller/products/new"
                  className="mt-3 inline-block text-xs font-bold text-emerald-600 hover:underline"
                >
                  {language === "bn" ? "+ প্রথম পণ্য যোগ করুন" : "+ Add your first product"}
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentProducts.map((prod) => {
                  const id = prod._id || prod.id;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between py-3 hover:bg-gray-50/50 px-1 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={getImageUrl(prod.thumbnail)}
                            alt={prod.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-gray-900">
                            {prod.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ৳{prod.price} / {prod.unit || "piece"} &bull;{" "}
                            <span
                              className={
                                prod.isAvailable
                                  ? "text-emerald-600 font-semibold"
                                  : "text-red-500 font-semibold"
                              }
                            >
                              {prod.isAvailable
                                ? language === "bn"
                                  ? "স্টকে আছে"
                                  : "In Stock"
                                : language === "bn"
                                ? "স্টক শেষ"
                                : "Out of Stock"}
                            </span>
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/seller/products/${id}/edit`}
                        className="shrink-0 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:border-emerald-600 hover:text-emerald-600 transition-colors"
                      >
                        {t("edit") || "Edit"}
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <Link
              href="/seller/products/new"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              <span>+</span>
              <span>{t("addProduct") || "Add New Product"}</span>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">
                {language === "bn" ? "সাম্প্রতিক অর্ডারসমূহ" : "Recent Orders"}
              </h2>
              <Link
                href="/seller/orders"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                {language === "bn" ? "সবগুলো দেখুন →" : "View All →"}
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="py-10 text-center text-gray-400">
                <p className="text-2xl mb-2">📋</p>
                <p className="text-sm font-medium">
                  {language === "bn"
                    ? "এখনও কোন অর্ডার পাওয়া যায়নি"
                    : "No orders received yet."}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {language === "bn"
                    ? "চাষীরা আপনার পণ্য অর্ডার করলে এখানে দেখতে পাবেন।"
                    : "Customer orders for your products will appear here."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentOrders.map((ord) => {
                  const id = ord._id || ord.orderId;
                  const sellerItemTotal = (ord.items || []).reduce(
                    (acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 1),
                    0
                  );

                  return (
                    <div
                      key={id}
                      className="py-3 hover:bg-gray-50/50 px-1 rounded-xl transition-colors flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">
                            {ord.orderId || id}
                          </span>
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                              ord.status === "delivered"
                                ? "bg-emerald-100 text-emerald-800"
                                : ord.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : ord.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {ord.status || "processing"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {ord.customerName} {ord.phone ? `(${ord.phone})` : ""} &bull;{" "}
                          {formatDate(ord.createdAt, language)}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-emerald-600 block">
                          ৳ {sellerItemTotal.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {ord.items?.length || 1} {language === "bn" ? "আইটেম" : "item(s)"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <Link
              href="/seller/orders"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              <span>{language === "bn" ? "সমস্ত অর্ডার বিস্তারিত দেখুন" : "View Full Order List"}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
