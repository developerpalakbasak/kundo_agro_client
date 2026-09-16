"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/hooks/languageContext";
import { getImageUrl } from "@/lib/api/axios";

function formatPrice(value, locale) {
  const num = Number(value) || 0;
  return `৳${num.toLocaleString(locale === "bn" ? "bn-BD" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function SellerProductsList({ products = [], onDeleteProduct }) {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Extract unique categories from seller's products
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );

  const filteredProducts = products.filter((product) => {
    const name = product.name || "";
    const desc = product.description || "";
    const cat = product.category || "";
    const loc = product.location || "";

    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      name.toLowerCase().includes(query) ||
      desc.toLowerCase().includes(query) ||
      cat.toLowerCase().includes(query) ||
      loc.toLowerCase().includes(query);

    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" && product.isAvailable) ||
      (statusFilter === "outOfStock" && !product.isAvailable);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = async (id, name, e) => {
    e.stopPropagation();
    const confirmMsg =
      language === "bn"
        ? `আপনি কি নিশ্চিত যে "${name}" পণ্যটি মুছে ফেলতে চান?`
        : `Are you sure you want to delete "${name}"?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      setDeletingId(id);
      if (onDeleteProduct) await onDeleteProduct(id);
    } catch (err) {
      alert(err.message || "Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            {language === "bn" ? "আমার পণ্য তালিকা" : "My Products Catalog"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {products.length === 0
              ? language === "bn"
                ? "কোন পণ্য নেই"
                : "No products in your catalog."
              : `${products.length} ${language === "bn" ? "টি পণ্য পাওয়া গেছে" : "products total"
              }`}
          </p>
        </div>

        <Link
          href="/seller/products/new"
          className="cursor-pointer rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-95"
        >
          {t("addProduct") || "+ Add New Product"}
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder={
              language === "bn"
                ? "নাম, ক্যাটাগরি বা জেলা দিয়ে খুঁজুন..."
                : "Search by name, category, or district..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 outline-none transition-colors focus:border-emerald-600"
          >
            <option value="all">
              {language === "bn" ? "সব ক্যাটাগরি" : "All Categories"}
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Availability Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 outline-none transition-colors focus:border-emerald-600"
          >
            <option value="all">
              {language === "bn" ? "সব অবস্থা" : "All Availability"}
            </option>
            <option value="available">
              {language === "bn" ? "স্টকে আছে" : "In Stock"}
            </option>
            <option value="outOfStock">
              {language === "bn" ? "স্টক শেষ" : "Out of Stock"}
            </option>
          </select>
        </div>
      </div>

      {/* Products List or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-xs">
          <span className="text-4xl">🐟</span>
          <p className="text-base font-bold text-gray-900">
            {language === "bn"
              ? "কোন পণ্য পাওয়া যায়নি"
              : "No matching products found"}
          </p>
          <p className="max-w-md text-sm text-gray-500">
            {search || categoryFilter !== "all" || statusFilter !== "all"
              ? language === "bn"
                ? "আপনার সার্চ ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।"
                : "Try adjusting your search criteria or filters."
              : language === "bn"
                ? "আপনার হ্যাচারি বা ফার্মের পোনা এবং এগ্রো পণ্য বিক্রির জন্য যোগ করুন।"
                : "Get started by adding your first product listing to start receiving orders."}
          </p>
          <Link
            href="/seller/products/new"
            className="cursor-pointer rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-95"
          >
            {t("addProduct") || "+ Add First Product"}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredProducts.map((product) => {
            const productId = product._id || product.id;
            const isDeleting = deletingId === productId;

            return (
              <div
                key={productId}
                onClick={() => setSelectedProduct(product)}
                className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs transition-all hover:border-emerald-300/60 hover:shadow-md sm:flex-row sm:items-center sm:justify-between cursor-pointer"
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-20 sm:w-20">
                    <Image
                      src={getImageUrl(product.thumbnail)}
                      alt={product.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        {product.category}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${product.isAvailable
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {product.isAvailable
                          ? language === "bn"
                            ? "স্টকে আছে"
                            : "In Stock"
                          : language === "bn"
                            ? "স্টক শেষ"
                            : "Out of Stock"}
                      </span>
                    </div>

                    <h3 className="truncate text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                      {product.name}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-baseline gap-2 text-xs text-gray-500">
                      <span className="text-base font-extrabold text-emerald-600">
                        {formatPrice(product.price, language)}
                      </span>
                      <span className="text-gray-400">/ {product.unit || "piece"}</span>
                      {product.compareAtPrice && (
                        <span className="text-xs line-through text-gray-400">
                          {formatPrice(product.compareAtPrice, language)}
                        </span>
                      )}
                      {product.location && (
                        <span className="text-gray-400">
                          &bull; 📍 {product.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div
                  className="flex items-center gap-2 shrink-0 border-t border-gray-100 pt-3 sm:border-0 sm:pt-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    href={`/seller/products/${productId}/edit`}
                    className="cursor-pointer rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-emerald-600 hover:text-emerald-600"
                  >
                    ✏️ {t("edit") || "Edit"}
                  </Link>

                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={(e) => handleDelete(productId, product.name, e)}
                    className="cursor-pointer rounded-xl border border-red-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                  >
                    {isDeleting ? "..." : `🗑️ ${t("delete") || "Delete"}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                {selectedProduct.name}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gray-100">
              <Image
                src={getImageUrl(selectedProduct.thumbnail)}
                alt={selectedProduct.name}
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-gray-50 p-3">
                <span className="font-medium text-gray-400 block">Price / Unit</span>
                <span className="text-sm font-bold text-emerald-600">
                  ৳{selectedProduct.price} / {selectedProduct.unit}
                </span>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <span className="font-medium text-gray-400 block">Category</span>
                <span className="text-sm font-bold text-gray-800">
                  {selectedProduct.category}
                </span>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <span className="font-medium text-gray-400 block">Location</span>
                <span className="text-sm font-bold text-gray-800">
                  {selectedProduct.location || "Bangladesh"}
                </span>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <span className="font-medium text-gray-400 block">Status</span>
                <span
                  className={`text-sm font-bold ${selectedProduct.isAvailable
                      ? "text-emerald-600"
                      : "text-red-500"
                    }`}
                >
                  {selectedProduct.isAvailable ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            {selectedProduct.description && (
              <div className="rounded-xl bg-gray-50 p-3">
                <span className="font-medium text-gray-400 block text-xs mb-1">
                  Description
                </span>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <Link
                href={`/seller/products/${selectedProduct._id || selectedProduct.id}/edit`}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
              >
                Edit Product
              </Link>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
