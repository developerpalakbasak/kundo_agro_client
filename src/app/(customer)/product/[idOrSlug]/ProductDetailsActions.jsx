"use client";

import { useState } from "react";
import { useCart } from "@/context/cartContext";
import { useLanguage } from "@/hooks/languageContext";

export function ProductDetailsActions({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();
  const { language } = useLanguage();

  const handleAddToCart = () => {
    // Add product with specific quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Quantity & Add to Cart row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Quantity selector */}
        <div className="flex items-center justify-between sm:justify-start border border-gray-200 rounded-xl p-1 bg-gray-50">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-10 w-10 flex items-center justify-center rounded-lg bg-white shadow-xs text-gray-700 font-bold hover:bg-gray-100 transition-colors"
          >
            -
          </button>
          <span className="w-12 text-center font-bold text-gray-800 text-sm">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="h-10 w-10 flex items-center justify-center rounded-lg bg-white shadow-xs text-gray-700 font-bold hover:bg-gray-100 transition-colors"
          >
            +
          </button>
        </div>

        {/* Add to Cart button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-3.5 px-6 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <span>🛒</span>
          <span>
            {isAdded
              ? language === "bn"
                ? "কার্টে যুক্ত হয়েছে!"
                : "Added to Cart!"
              : language === "bn"
              ? "কার্টে যোগ করুন"
              : "Add to Cart"}
          </span>
        </button>
      </div>

      {/* Seller Direct Call Button if phone exists */}
      {product.sellerPhone && (
        <a
          href={`tel:${product.sellerPhone}`}
          className="w-full py-3 px-4 rounded-xl border border-emerald-600 bg-emerald-50 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
        >
          <span>📞</span>
          <span>
            {language === "bn"
              ? `বিক্রেতাকে কল করুন (${product.sellerPhone})`
              : `Call Seller Directly (${product.sellerPhone})`}
          </span>
        </a>
      )}
    </div>
  );
}
