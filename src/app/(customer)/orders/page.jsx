// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Modal } from "@/components/modal";
import { useLanguage } from "@/hooks/languageContext";
import { getMyOrders, trackOrder } from "@/lib/api/orders";
import { printOrderInvoice } from "@/lib/invoice";
import Loader from "@/components/Loader";

export default function OrdersPage() {
  const { t, language } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Tracking Search state
  const [trackingId, setTrackingId] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingError, setTrackingError] = useState(null);
  const [isTrackingPending, setIsTrackingPending] = useState(false);

  // Load customer orders from backend
  const fetchOrders = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await getMyOrders();
      if (res.orders && Array.isArray(res.orders)) {
        setOrders(res.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setLoadError(err.message || "Please log in to view your orders.");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchOrders();
    })();
  }, []);

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setTrackingError(null);
    setTrackingResult(null);
    setIsTrackingPending(true);

    try {
      const res = await trackOrder(trackingId.trim());
      if (res.order) {
        setTrackingResult(res.order);
        setSelectedOrder(res.order);
      }
    } catch (err) {
      setTrackingError(err.message || "Order not found. Please check your Order ID.");
    } finally {
      setIsTrackingPending(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "processing") return order.status === "processing" || order.status === "shipped";
    if (filter === "completed") return order.status === "delivered" || order.status === "cancelled";
    return true;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "processing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "processing":
        return language === "bn" ? "প্রসেসিং হচ্ছে" : "Processing";
      case "shipped":
        return language === "bn" ? "ডেলিভারির জন্য বের হয়েছে" : "Shipped";
      case "delivered":
        return language === "bn" ? "ডেলিভারি সম্পন্ন" : "Delivered";
      case "cancelled":
        return language === "bn" ? "বাতিল করা হয়েছে" : "Cancelled";
      default:
        return status;
    }
  };

  const getPaymentStatusBadgeClass = (status) => {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  const getPaymentStatusLabel = (status) => {
    switch (status) {
      case "paid":
        return language === "bn" ? "পেমেন্ট সম্পন্ন" : "Paid";
      case "failed":
        return language === "bn" ? "পেমেন্ট ব্যর্থ" : "Payment Failed";
      default:
        return language === "bn" ? "পেমেন্ট বাকি" : "Pending";
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Order Tracking Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            {language === "bn" ? "আমার অর্ডারসমূহ" : "My Orders"}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {language === "bn"
              ? "আপনার সমস্ত অর্ডার এবং লাইভ ডেলিভারি স্ট্যাটাস দেখুন।"
              : "View and track your orders and delivery status."}
          </p>
        </div>

        {/* Order Tracking Form */}
        <form onSubmit={handleTrackSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="e.g. ORD-2026-8841"
            className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-48 sm:w-56"
          />
          <button
            type="submit"
            disabled={isTrackingPending}
            className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            {isTrackingPending ? "Searching..." : language === "bn" ? "ট্র্যাক করুন" : "Track Order"}
          </button>
        </form>
      </div>

      {trackingError && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700">
          ⚠️ {trackingError}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="inline-flex w-full rounded-xl bg-gray-100 p-1 border border-gray-200/80">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${filter === "all"
            ? "bg-white text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
            }`}
        >
          {language === "bn" ? "সকল অর্ডার" : "All Orders"}
        </button>
        <button
          type="button"
          onClick={() => setFilter("processing")}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${filter === "processing"
            ? "bg-white text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
            }`}
        >
          {language === "bn" ? "প্রসেসিং" : "Processing"}
        </button>
        <button
          type="button"
          onClick={() => setFilter("completed")}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${filter === "completed"
            ? "bg-white text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
            }`}
        >
          {language === "bn" ? "সম্পন্ন / নামঞ্জুর" : "Completed / Cancelled"}
        </button>
      </div>

      {/* Orders List Container */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" text={language === "bn" ? "অর্ডার লোড হচ্ছে..." : "Loading orders..."} />
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-8 text-center max-w-md mx-auto space-y-3">
          <p className="text-sm font-semibold text-amber-800">🔒 {loadError}</p>
          <p className="text-xs text-amber-700">
            {language === "bn"
              ? "আপনার অর্ডার তালিকা দেখতে অনুগ্রহ করে সাইন ইন করুন।"
              : "Please sign in to view your past orders history."}
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center space-y-4 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary text-2xl">
            📦
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {language === "bn" ? "কোন অর্ডার পাওয়া যায়নি" : "No Orders Found"}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {language === "bn"
                ? "আমাদের ক্যাটালগ ব্রাউজ করে অর্ডার করুন।"
                : "Browse our catalog to place your first order."}
            </p>
          </div>
          <Link
            href="/products"
            className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-all"
          >
            {language === "bn" ? "পণ্য দেখুন" : "Browse Shop"}
          </Link>
        </div>
      ) : (
        <div className="space-y-4 w-full">
          {filteredOrders.map((order) => (
            <div
              key={order._id || order.orderId}
              className="group w-full min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition-all hover:border-gray-200 hover:shadow-md space-y-4"
            >
              {/* Top row info */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-foreground tracking-wider">
                    #{order.orderId || order._id}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{order.date || new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold ${getPaymentStatusBadgeClass(
                      order.paymentStatus
                    )}`}
                  >
                    {getPaymentStatusLabel(order.paymentStatus)}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold ${getStatusBadgeClass(
                      order.status
                    )}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>

              {/* Items summary */}
              <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex w-full min-w-0 items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-2.5"
                  >
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-white border border-gray-100">
                      <Image
                        src={
                          item.thumbnail
                        }
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Qty: {item.quantity} ({item.unit || "piece"})
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom row summary & action button */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div>
                  <span className="text-xs text-gray-500">
                    {language === "bn" ? "মোট মূল্য: " : "Total: "}
                  </span>
                  <span className="text-base font-extrabold text-primary">
                    ৳{(order.total || order.subtotal || 0).toLocaleString(
                      language === "bn" ? "bn-BD" : "en-IN"
                    )}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(order)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all cursor-pointer"
                >
                  {language === "bn" ? "অর্ডারের বিস্তারিত দেখুন" : "View Details"} →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details — #${selectedOrder?.orderId || selectedOrder?._id}`}
        maxWidth="lg"
      >
        {selectedOrder && (
          <div className="space-y-5">
            {/* Status Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-emerald-950 to-primary/95 p-4 text-white shadow-md">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                  {language === "bn" ? "অর্ডার স্ট্যাটাস" : "Order Status"}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-extrabold capitalize shadow-xs ${getStatusBadgeClass(
                      selectedOrder.status
                    )}`}
                  >
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-emerald-200 block">
                  {language === "bn" ? "অর্ডারের তারিখ" : "Order Date"}
                </span>
                <span className="text-xs font-bold text-white">
                  {selectedOrder.date || new Date(selectedOrder.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Delivery & Payment Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 space-y-1.5">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">
                  📍 {language === "bn" ? "ডেলিভারি ঠিকানা" : "Delivery Address"}
                </p>
                <p className="font-bold text-xs text-gray-900">{selectedOrder.customerName}</p>
                <p className="text-xs text-gray-600 font-medium">{selectedOrder.phone}</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {selectedOrder.address}, {selectedOrder.city}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 space-y-1.5">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">
                  💳 {language === "bn" ? "পেমেন্ট মাধ্যম" : "Payment Method"}
                </p>
                <span className="inline-block rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-900">
                  {selectedOrder.paymentMethod || "Cash on Delivery"}
                </span>
                <p className="text-[11px] text-gray-500 pt-1">
                  Status: <span className="font-bold text-gray-700 capitalize">{selectedOrder.paymentStatus || "pending"}</span>
                </p>
              </div>
            </div>

            {/* Ordered Items Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {language === "bn" ? "অর্ডারকৃত পণ্যসমূহ" : "Ordered Items"} ({selectedOrder.items?.length || 0})
              </h4>
              <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden divide-y divide-gray-100 shadow-xs">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3 sm:p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-gray-100 border border-gray-100 flex-shrink-0">
                        <Image
                          src={
                            item.thumbnail
                          }
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          ৳{item.price} × {item.quantity} {item.unit || "piece"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-gray-900 flex-shrink-0">
                      ৳{(item.price * item.quantity).toLocaleString(language === "bn" ? "bn-BD" : "en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Cost Breakdown */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">৳{selectedOrder.subtotal || selectedOrder.total}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="font-semibold text-emerald-600">৳{selectedOrder.deliveryFee || 0}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-bold text-gray-900">
                <span>Total</span>
                <span className="text-lg font-black text-primary">৳{selectedOrder.total}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => printOrderInvoice(selectedOrder)}
                className="w-full sm:w-auto rounded-xl bg-primary px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-primary/90 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>📄</span>
                <span>{language === "bn" ? "ইনভয়েস PDF ডাউনলোড" : "Download Invoice PDF"}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-full sm:w-auto rounded-xl bg-gray-900 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-gray-800 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
