"use client";

import { useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/api/axios";

export function OrdersList({ initialOrders = [], onUpdateStatus }) {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      if (onUpdateStatus) {
        await onUpdateStatus(orderId, newStatus);
      }
      setOrders((prev) =>
        prev.map((o) => {
          const id = o._id || o.id;
          return id === orderId ? { ...o, status: newStatus } : o;
        })
      );
      if (selectedOrder && (selectedOrder._id || selectedOrder.id) === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      alert(err.message || "Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    // Status filter
    if (filter !== "all" && (o.status || "").toLowerCase() !== filter.toLowerCase()) {
      return false;
    }

    // Search query filter (Order ID & Mobile Phone number, plus customer name)
    if (searchTerm.trim()) {
      const query = searchTerm.trim().toLowerCase().replace(/^#/, "");
      const fullId = String(o._id || o.id || "").toLowerCase();
      const shortId = fullId.slice(-6);
      const customOrderId = String(o.orderId || "").toLowerCase();
      const phone = String(o.phone || o.user?.phone || "").toLowerCase();
      const name = String(o.customerName || o.user?.name || "").toLowerCase();

      const matchesId =
        fullId.includes(query) ||
        shortId.includes(query) ||
        customOrderId.includes(query);
      const matchesPhone = phone.includes(query);
      const matchesName = name.includes(query);

      return matchesId || matchesPhone || matchesName;
    }

    return true;
  });

  const getBadgeStyle = (status) => {
    switch ((status || "").toLowerCase()) {
      case "processing":
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Search / Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Orders Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            View customer orders and update dispatch / delivery statuses.
          </p>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search Input Box */}
          <div className="relative min-w-[260px] sm:min-w-[300px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Order ID (#...) or Phone..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-8 text-xs font-medium text-gray-900 placeholder-gray-400 shadow-2xs outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="inline-flex rounded-xl bg-gray-100 p-1 border border-gray-200 overflow-x-auto">
            {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map(
              (statusKey) => (
                <button
                  key={statusKey}
                  type="button"
                  onClick={() => setFilter(statusKey)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap ${filter === statusKey
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  {statusKey}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <p className="text-sm font-semibold text-gray-700">No matching orders found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {searchTerm
                        ? `No orders found matching "${searchTerm}". Try checking the Order ID or phone number.`
                        : "There are no orders in this category."}
                    </p>
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm("")}
                        className="mt-3 text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
                      >
                        Clear search
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const orderId = order._id || order.id;
                  const customerName = order.customerName || order.user?.name || "Guest Customer";
                  const phone = order.phone || order.user?.phone || "N/A";
                  const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : (order.date || "");
                  const total = order.totalAmount || order.total || 0;

                  return (
                    <tr key={orderId} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">#{orderId.slice(-6)}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{customerName}</p>
                        <p className="text-[11px] text-gray-500">{phone}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{dateStr}</td>
                      <td className="px-6 py-4 font-bold text-emerald-600">
                        ৳{total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          disabled={updatingId === orderId}
                          value={order.status || "processing"}
                          onChange={(e) => handleStatusChange(orderId, e.target.value)}
                          className={`rounded-lg border px-2.5 py-1 text-xs font-bold transition-all cursor-pointer outline-none ${getBadgeStyle(
                            order.status
                          )}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-emerald-600 hover:text-emerald-600 transition-all cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Order Details #{(selectedOrder._id || selectedOrder.id).slice(-6)}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Customer Details */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-1 text-xs">
              <span className="font-bold text-gray-400 uppercase tracking-wider block text-[10px]">
                Customer & Shipping Address
              </span>
              <p className="font-bold text-gray-900">{selectedOrder.customerName || selectedOrder.user?.name}</p>
              <p className="text-gray-600">{selectedOrder.phone || selectedOrder.user?.phone}</p>
              <p className="text-gray-500">
                {selectedOrder.shippingAddress || selectedOrder.address || "Standard Delivery"}
              </p>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <span className="font-bold text-gray-400 uppercase tracking-wider block text-xs">
                Items ({selectedOrder.items?.length || 0})
              </span>
              <div className="rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-bold text-gray-900">{item.name || item.product?.name}</p>
                      <p className="text-gray-500">
                        ৳{item.price} × {item.quantity} {item.unit || "unit"}
                      </p>
                    </div>
                    <span className="font-bold text-gray-900">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-xs font-bold text-gray-900">Total Order Amount</span>
              <span className="text-base font-extrabold text-emerald-600">
                ৳{(selectedOrder.totalAmount || selectedOrder.total || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
