"use client";

import { useEffect, useState } from "react";
import { getAdminSellers } from "@/lib/api/admin";
import { SellersContent } from "@/components/admin/SellersContent";

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSellers = async () => {
    try {
      setIsLoading(true);
      const res = await getAdminSellers();
      if (res && res.data && Array.isArray(res.data)) {
        // Derive unique sellers from products with seller info
        const sellerList = [];
        const seen = new Set();

        res.data.forEach((p) => {
          if (p.sellerName || p.sellerDistrict) {
            const key = `${p.sellerName || ""}-${p.sellerDistrict || ""}`;
            if (!seen.has(key)) {
              seen.add(key);
              sellerList.push({
                id: p._id || p.id,
                hatcheryName: p.sellerName || "Agro / Fish Hatchery",
                name: p.sellerName || "Registered Seller",
                phone: p.sellerPhone || "N/A",
                district: p.sellerDistrict || "Bangladesh",
                status: "Verified",
              });
            }
          }
        });

        setSellers(sellerList);
      } else {
        setSellers([]);
      }
    } catch (err) {
      console.error("Failed to load admin sellers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSellers();
  }, []);

  const handleDeleteSeller = async (id) => {
    setSellers((prev) => prev.filter((s) => s.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-emerald-600">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <span className="text-xs font-semibold text-gray-500">Loading sellers directory...</span>
        </div>
      </div>
    );
  }

  return <SellersContent sellers={sellers} onDeleteSeller={handleDeleteSeller} />;
}
