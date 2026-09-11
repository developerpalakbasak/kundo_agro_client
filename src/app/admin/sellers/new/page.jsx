"use client";

import Link from "next/link";
import { SellerForm } from "@/components/admin/SellerForm";

export default function NewSellerPage() {
  const handleSubmit = async (formData) => {
    // Front-end state handler for adding sellers
    console.log("Adding new seller:", formData);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Add New Seller</h1>
          <p className="mt-1 text-sm text-gray-500">Register a new fish seed / agro product seller.</p>
        </div>
        <Link
          href="/admin/sellers"
          className="text-xs font-semibold text-gray-500 hover:text-gray-900"
        >
          ← Back to sellers
        </Link>
      </div>

      <SellerForm onSubmit={handleSubmit} />
    </div>
  );
}
