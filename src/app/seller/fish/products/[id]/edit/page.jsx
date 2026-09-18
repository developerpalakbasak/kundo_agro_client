"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { SellerProductForm } from "@/components/seller/SellerProductForm";
import { getSellerProductById, updateSellerProduct } from "@/lib/api/seller";

export default function EditSellerProductPage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    getSellerProductById(productId)
      .then((res) => {
        if (res && res.data) {
          setProduct(res.data);
        } else if (res) {
          setProduct(res);
        }
      })
      .catch((err) => {
        setErrorMsg(err.message || "Failed to fetch product details.");
      })
      .finally(() => setIsLoading(false));
  }, [productId]);

  const handleSubmit = async (formData) => {
    await updateSellerProduct(productId, formData);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-emerald-600">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <span className="text-xs font-semibold text-gray-500">
            Loading product details...
          </span>
        </div>
      </div>
    );
  }

  if (errorMsg || !product) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center space-y-3">
        <p className="text-sm font-semibold text-red-600">
          ⚠️ {errorMsg || "Product not found"}
        </p>
        <Link
          href="/seller/fish/products"
          className="inline-block text-xs font-bold text-red-700 underline"
        >
          ← Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Edit Product
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Update pricing, stock availability, or description for &ldquo;{product.name}&rdquo;.
          </p>
        </div>
        <Link
          href="/seller/fish/products"
          className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Back to products
        </Link>
      </div>

      <SellerProductForm
        initialData={product}
        onSubmit={handleSubmit}
        isEditing={true}
      />
    </div>
  );
}
