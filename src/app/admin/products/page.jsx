"use client";

import { useEffect, useState } from "react";
import { getAdminProducts, deleteAdminProduct } from "@/lib/api/admin";
import { ProductsList } from "@/components/admin/ProductsList";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const res = await getAdminProducts();
      if (res && res.data && Array.isArray(res.data)) {
        setProducts(res.data);
      } else if (Array.isArray(res)) {
        setProducts(res);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Failed to load admin products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadProducts()
    })();
  }, []);

  const handleDeleteProduct = async (id) => {
    await deleteAdminProduct(id);
    setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-emerald-600">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <span className="text-xs font-semibold text-gray-500">Loading products catalog...</span>
        </div>
      </div>
    );
  }

  return <ProductsList products={products} onDeleteProduct={handleDeleteProduct} />;
}
