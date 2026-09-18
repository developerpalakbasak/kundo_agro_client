"use client";

import Link from "next/link";
import { SellerProductForm } from "@/components/seller/SellerProductForm";
import { createSellerProduct } from "@/lib/api/seller";

export default function NewSellerProductPage() {
  const handleSubmit = async (formData) => {
    await createSellerProduct(formData);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Add New Product
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Publish a new fish seed batch or agro item to your store catalog.
          </p>
        </div>
        <Link
          href="/seller/animale/products"
          className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Back to products
        </Link>
      </div>

      <SellerProductForm onSubmit={handleSubmit} isEditing={false} />
    </div>
  );
}
