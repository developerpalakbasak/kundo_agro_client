"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cartContext";
import { useLanguage } from "@/hooks/languageContext";
import { getImageUrl } from "@/lib/api/axios";

export function CartDrawer() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();
  const { t, language } = useLanguage();

  if (!isCartOpen) return null;

  const formattedTotal = `৳${totalPrice.toLocaleString(
    language === "bn" ? "bn-BD" : "en-IN",
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-modal-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-extrabold text-foreground">
              🛒 {language === "bn" ? "আপনার শপিং কার্ট" : "Your Shopping Cart"}
            </h2>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {language === "bn" ? "আপনার কার্ট খালি" : "Your cart is empty"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {language === "bn"
                    ? "পণ্য যোগ করতে ক্যাটালগ ব্রাউজ করুন।"
                    : "Browse our catalog to add items to your cart."}
                </p>
              </div>
            ) : (
              items.map((item) => {
                const id = item.product._id || item.product.id;
                return (
                  <div
                    key={id}
                    className="flex items-center gap-4 rounded-2xl border border-gray-100 p-3 bg-white shadow-xs hover:border-gray-200 transition-colors"
                  >
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50">
                      <Image
                        src={getImageUrl(item.product.thumbnail)}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-foreground truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs font-extrabold text-primary mt-0.5">
                        ৳{item.product.price} / {item.product.unit || "piece"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(id, -1)}
                          className="h-6 w-6 rounded-lg border border-gray-200 text-xs font-bold flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold px-1">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(id, 1)}
                          className="h-6 w-6 rounded-lg border border-gray-200 text-xs font-bold flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(id)}
                      className="text-gray-400 hover:text-red-500 text-xs font-medium cursor-pointer p-1"
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 space-y-3">
              <div className="flex items-center justify-between text-sm font-bold text-gray-900">
                <span>{language === "bn" ? "মোট মূল্য:" : "Subtotal:"}</span>
                <span className="text-lg text-primary font-black">{formattedTotal}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={clearCart}
                  className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  {language === "bn" ? "কার্ট খালি করুন" : "Clear Cart"}
                </button>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 text-center rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-colors"
                >
                  {language === "bn" ? "অর্ডার সম্পন্ন করুন" : "Proceed to Checkout"}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
