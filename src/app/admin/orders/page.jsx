"use client";

import { useEffect, useState } from "react";
import { getAdminOrders, updateOrderStatus } from "@/lib/api/admin";
import { OrdersList } from "@/components/admin/OrdersList";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const res = await getAdminOrders();
      if (res && res.orders && Array.isArray(res.orders)) {
        setOrders(res.orders);
      } else if (res && res.data && Array.isArray(res.data)) {
        setOrders(res.data);
      } else if (Array.isArray(res)) {
        setOrders(res);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Failed to load admin orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => { loadOrders(); })();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-emerald-600">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <span className="text-xs font-semibold text-gray-500">Loading orders...</span>
        </div>
      </div>
    );
  }

  return <OrdersList initialOrders={orders} onUpdateStatus={handleUpdateStatus} />;
}
