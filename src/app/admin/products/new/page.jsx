"use client";

import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { createAdminProduct } from "@/lib/api/admin";

export default function AddProductPage() {
  const handleSubmit = async (formData) => {
    await createAdminProduct(formData);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Add New Product</h1>
          <p className="mt-1 text-sm text-gray-500">Create a new product listing in your catalog.</p>
        </div>
        <Link
          href="/admin/products"
          className="text-xs font-semibold text-gray-500 hover:text-gray-900"
        >
          ← Back to products
        </Link>
      </div>

      <ProductForm onSubmit={handleSubmit} isEditing={false} />
    </div>
  );
}
