"use client";

import { useEffect, useState } from "react";
import { getSellerProducts, deleteSellerProduct } from "@/lib/api/seller";
import { SellerProductsList } from "@/components/seller/SellerProductsList";

export default function SellerProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await getSellerProducts({ limit: 100 });
      if (res && res.data && Array.isArray(res.data)) {
        setProducts(res.data);
      } else if (Array.isArray(res)) {
        setProducts(res);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Failed to load seller products:", err);
      setErrorMsg(err.message || "Failed to load products.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await getSellerProducts({ limit: 100 });
        if (active) {
          const list = res?.data && Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
          setProducts(list);
        }
      } catch (err) {
        if (active) {
          setErrorMsg(err.message || "Failed to load products.");
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

  const handleDeleteProduct = async (id) => {
    await deleteSellerProduct(id);
    setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-emerald-600">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <span className="text-xs font-semibold text-gray-500">
            Loading your products catalog...
          </span>
        </div>
      </div>
    );
  }

  if (errorMsg && products.length === 0) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center space-y-3">
        <p className="text-sm font-semibold text-red-600">⚠️ {errorMsg}</p>
        <button
          onClick={loadProducts}
          className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <SellerProductsList
      products={products}
      onDeleteProduct={handleDeleteProduct}
    />
  );
}
