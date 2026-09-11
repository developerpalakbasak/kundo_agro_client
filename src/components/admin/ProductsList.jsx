"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/hooks/languageContext";
import { getImageUrl } from "@/lib/api/axios";

function formatPrice(value, locale) {
  const num = Number(value) || 0;
  return `৳${num.toLocaleString(locale === "bn" ? "bn-BD" : "en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value, locale) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ProductsList({ products = [], onDeleteProduct }) {
  const { t, language } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id, name, e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
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
    <>
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {t("productsTitle") || "Products"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {products.length === 0
                ? "No products in catalog."
                : `${products.length} products available`}
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700 shadow-xs"
          >
            {t("addProduct") || "+ Add Product"}
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-xs">
            <p className="text-sm font-medium text-gray-900">Your catalog is empty</p>
            <p className="max-w-sm text-sm text-gray-500">
              Get started by adding your first product to the marketplace.
            </p>
            <Link
              href="/admin/products/new"
              className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700 shadow-xs"
            >
              + Add Product
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {products.map((product) => {
              const productId = product._id || product.id;
              return (
                <li
                  key={productId}
                  onClick={() => setSelectedProduct(product)}
                  className="group flex cursor-pointer flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs transition-all hover:border-emerald-500/30 hover:shadow-md sm:flex-row sm:items-center sm:p-5"
                >
                  <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-20 sm:w-20">
                    <Image
                      src={getImageUrl(product.thumbnail)}
                      alt={product.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-emerald-600">
                        {product.name}
                      </h2>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                        {product.category}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                      {product.description}
                    </p>
                    {product.createdAt && (
                      <p className="mt-1.5 text-xs text-gray-400">
                        Added on {formatDate(product.createdAt, language)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end sm:justify-center sm:gap-2">
                    <div className="sm:text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {formatPrice(product.price, language)}
                        <span className="ml-1 text-xs font-normal text-gray-500">
                          / {product.unit}
                        </span>
                      </p>
                      {product.compareAtPrice ? (
                        <p className="text-xs text-gray-400 line-through">
                          {formatPrice(product.compareAtPrice, language)}
                        </p>
                      ) : null}
                    </div>

                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        href={`/admin/products/${productId}/edit`}
                        className="cursor-pointer rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-emerald-600 hover:text-emerald-600"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(productId, product.name, e)}
                        disabled={deletingId === productId}
                        className="cursor-pointer rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === productId ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

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
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                  {selectedProduct.category}
                </span>
                <h3 className="mt-1 text-lg font-bold text-gray-900">{selectedProduct.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
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

            <p className="text-sm text-gray-600 leading-relaxed">{selectedProduct.description}</p>

            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <div>
                <p className="text-xs text-gray-500">Price</p>
                <p className="text-base font-bold text-gray-900">
                  ৳{selectedProduct.price} / {selectedProduct.unit}
                </p>
              </div>
              <Link
                href={`/admin/products/${selectedProduct._id || selectedProduct.id}/edit`}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Edit Product
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
