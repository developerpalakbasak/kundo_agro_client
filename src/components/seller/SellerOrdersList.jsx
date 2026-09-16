"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/hooks/languageContext";
import { getImageUrl } from "@/lib/api/axios";

function formatPrice(val, locale) {
  const num = Number(val) || 0;
  return `৳${num.toLocaleString(locale === "bn" ? "bn-BD" : "en-US")}`;
}

function formatDate(dateStr, locale) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SellerOrdersList({ orders = [] }) {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter((order) => {
    const id = (order.orderId || order._id || "").toString().toLowerCase();
    const name = (order.customerName || "").toLowerCase();
    const phone = (order.phone || "").toLowerCase();
    const query = search.toLowerCase().trim();

    const matchesSearch =
      !query || id.includes(query) || name.includes(query) || phone.includes(query);

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            {language === "bn" ? "অর্ডার ও চাষীদের ইনকোয়ারি" : "Orders & Inquiries"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {orders.length === 0
              ? language === "bn"
                ? "এখনও কোন অর্ডার পাওয়া যায়নি"
                : "No customer orders received yet."
              : `${orders.length} ${
                  language === "bn" ? "টি অর্ডার নথিভুক্ত আছে" : "orders on record"
                }`}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder={
              language === "bn"
                ? "অর্ডার আইডি, গ্রাহকের নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
                : "Search by Order ID, customer name, or phone..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 outline-none transition-colors focus:border-emerald-600"
          >
            <option value="all">
              {language === "bn" ? "সব স্ট্যাটাস" : "All Statuses"}
            </option>
            <option value="processing">
              {language === "bn" ? "প্রক্রিয়াধীন" : "Processing"}
            </option>
            <option value="shipped">
              {language === "bn" ? "ডেলিভারির পথে" : "Shipped"}
            </option>
            <option value="delivered">
              {language === "bn" ? "সম্পন্ন" : "Delivered"}
            </option>
            <option value="cancelled">
              {language === "bn" ? "বাতিল" : "Cancelled"}
            </option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-xs">
          <span className="text-4xl">📋</span>
          <p className="text-base font-bold text-gray-900">
            {language === "bn" ? "কোন অর্ডার পাওয়া যায়নি" : "No orders found"}
          </p>
          <p className="max-w-md text-sm text-gray-500">
            {search || statusFilter !== "all"
              ? language === "bn"
                ? "ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।"
                : "Try changing your search query or filter selection."
              : language === "bn"
              ? "চাষীরা আপনার হ্যাচারির পণ্য কিনলে এখানে তাদের অর্ডার বিস্তারিত দেখতে পাবেন।"
              : "When customers purchase your hatchery products, their orders will appear here."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => {
            const orderId = order.orderId || order._id;
            const items = order.items || [];
            const sellerTotal = items.reduce(
              (acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 1),
              0
            );

            return (
              <div
                key={orderId}
                onClick={() => setSelectedOrder(order)}
                className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition-all hover:border-emerald-300 hover:shadow-md"
              >
                {/* Header Row: ID, Date, Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-lg bg-gray-100 px-2.5 py-1 font-mono text-xs font-bold text-gray-800">
                      {orderId}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(order.createdAt, language)}
                    </span>
                  </div>

                  <span
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                      order.status === "delivered"
                        ? "bg-emerald-100 text-emerald-800"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {order.status || "processing"}
                  </span>
                </div>

                {/* Body Row: Customer info & Items summary */}
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Customer Details */}
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">
                      {language === "bn" ? "চাষী / ক্রেতার তথ্য" : "Customer / Farmer"}
                    </span>
                    <p className="text-sm font-bold text-gray-900">
                      {order.customerName || "N/A"}
                    </p>
                    {order.phone && (
                      <p className="text-xs text-gray-600 mt-0.5">
                        📞 {order.phone}
                      </p>
                    )}
                    {order.city && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        📍 {order.city}
                      </p>
                    )}
                  </div>

                  {/* Purchased Items Preview */}
                  <div className="sm:col-span-1 lg:col-span-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">
                      {language === "bn" ? "অর্ডারকৃত পণ্য" : "Your Ordered Items"}
                    </span>
                    <div className="space-y-1 text-xs text-gray-700">
                      {items.slice(0, 2).map((it, idx) => (
                        <div key={idx} className="truncate">
                          &bull; {it.name || "Product"} × {it.quantity}
                        </div>
                      ))}
                      {items.length > 2 && (
                        <span className="text-[11px] text-gray-400 italic">
                          +{items.length - 2} more items...
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Revenue / Earnings */}
                  <div className="flex flex-col justify-center sm:items-end">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-0.5">
                      {language === "bn" ? "আপনার আয়" : "Your Line Total"}
                    </span>
                    <span className="text-lg font-black text-emerald-600">
                      {formatPrice(sellerTotal, language)}
                    </span>
                    <span className="text-[11px] text-gray-400 mt-0.5">
                      {items.length} {language === "bn" ? "টি আইটেম" : "item(s)"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-xs text-gray-400 block">Order Details</span>
                <h3 className="text-base font-bold text-gray-900">
                  {selectedOrder.orderId || selectedOrder._id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Customer Info Card */}
            <div className="rounded-xl bg-gray-50 p-3.5 text-xs space-y-1.5">
              <span className="font-bold text-gray-700 block">
                {language === "bn" ? "গ্রাহকের যোগাযোগের তথ্য" : "Customer Contact Info"}
              </span>
              <p>
                <span className="text-gray-400">Name:</span>{" "}
                <strong className="text-gray-800">{selectedOrder.customerName}</strong>
              </p>
              <p>
                <span className="text-gray-400">Phone:</span>{" "}
                <strong className="text-gray-800">{selectedOrder.phone}</strong>
              </p>
              {selectedOrder.address && (
                <p>
                  <span className="text-gray-400">Address:</span>{" "}
                  <span className="text-gray-800">
                    {selectedOrder.address}, {selectedOrder.city}
                  </span>
                </p>
              )}
              {selectedOrder.notes && (
                <p className="italic text-gray-600 border-t border-gray-200 pt-1">
                  &ldquo;Note: {selectedOrder.notes}&rdquo;
                </p>
              )}
            </div>

            {/* Items Table */}
            <div>
              <span className="text-xs font-bold text-gray-800 block mb-2">
                {language === "bn" ? "পণ্যসমূহ" : "Items in this Order"}
              </span>
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                {(selectedOrder.items || []).map((it, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 text-xs hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {it.thumbnail && (
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <Image
                            src={getImageUrl(it.thumbnail)}
                            alt={it.name || "Item"}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate">
                          {it.name || "Product"}
                        </p>
                        <p className="text-gray-500">
                          ৳{it.price} × {it.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600 shrink-0">
                      ৳{(Number(it.price) || 0) * (Number(it.quantity) || 1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
