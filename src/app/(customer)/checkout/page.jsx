"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cartContext";
import { useLanguage } from "@/hooks/languageContext";
import { createOrder } from "@/lib/api/orders";
import { getImageUrl } from "@/lib/api/axios";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "Cash on Delivery",
    notes: "",
  });

  const [deliveryFee] = useState(60); // ৳60 standard delivery fee
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const grandTotal = totalPrice + (items.length > 0 ? deliveryFee : 0);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (items.length === 0) {
      setErrorMessage(
        language === "bn"
          ? "আপনার কার্ট খালি। অনুগ্রহ করে পণ্য যোগ করুন।"
          : "Your cart is empty. Please add products before placing an order."
      );
      return;
    }

    if (!formData.customerName.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.city.trim()) {
      setErrorMessage(
        language === "bn"
          ? "অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন।"
          : "Please fill in all required delivery details."
      );
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        customerName: formData.customerName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        deliveryFee: deliveryFee,
        items: items.map((item) => ({
          product: item.product._id || item.product.id,
          name: item.product.name,
          thumbnail: item.product.thumbnail,
          price: item.product.price,
          quantity: item.quantity,
          unit: item.product.unit || "piece",
        })),
      };

      const res = await createOrder(payload);

      if (res?.success || res?.order) {
        const createdOrderId = res?.order?.orderId || "";
        clearCart();
        router.push(`/orders?placed=${encodeURIComponent(createdOrderId)}`);
      } else {
        setErrorMessage(res?.message || "Failed to place order.");
      }
    } catch (err) {
      console.error("Order submission error:", err);
      setErrorMessage(
        err.response?.data?.message ||
          (language === "bn" ? "অর্ডার সাবমিট করতে সমস্যা হয়েছে।" : "Something went wrong while placing your order.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
            <Link href="/" className="hover:text-primary transition-colors">
              {language === "bn" ? "হোম" : "Home"}
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary transition-colors">
              {language === "bn" ? "পণ্যসমূহ" : "Products"}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">
              {language === "bn" ? "অর্ডার সম্পন্ন করুন" : "Checkout"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            🛒 {language === "bn" ? "চেকআউট ও ডেলিভারি তথ্য" : "Checkout & Order Details"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {language === "bn"
              ? "অর্ডার সম্পন্ন করতে নিচের ডেলিভারি ফর্মটি পূরণ করুন।"
              : "Complete your delivery details below to finalize your order."}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
              🛒
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              {language === "bn" ? "আপনার কার্ট বর্তমানে খালি!" : "Your Cart is Empty!"}
            </h2>
            <p className="text-xs text-gray-500 mt-1 mb-6">
              {language === "bn"
                ? "অর্ডার করার জন্য প্রথমে আমাদের প্রোডাক্ট ক্যাটাগরি ব্রাউজ করুন।"
                : "Explore our products to add items before checking out."}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 transition-colors"
            >
              {language === "bn" ? "পণ্য ব্রাউজ করুন" : "Browse Products"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Customer Info Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-base font-extrabold text-foreground mb-6 flex items-center gap-2">
                📋 {language === "bn" ? "শিপিং ও ডেলিভারি তথ্য" : "Shipping & Delivery Information"}
              </h2>

              {errorMessage && (
                <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-700 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {language === "bn" ? "আপনার পূর্ণ নাম *" : "Full Name *"}
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder={language === "bn" ? "যেমন: মোঃ রহিম উদ্দিন" : "e.g., John Doe"}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-xs text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {language === "bn" ? "মোবাইল নম্বর *" : "Phone Number *"}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={language === "bn" ? "যেমন: 01700000000" : "e.g., 01700000000"}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-xs text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {language === "bn" ? "সম্পূর্ণ ঠিকানা *" : "Full Delivery Address *"}
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder={language === "bn" ? "রোড/বাড়ি নং, এলাকা" : "House/Street address, area"}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-xs text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {language === "bn" ? "জেলা / শহর *" : "District / City *"}
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder={language === "bn" ? "যেমন: ঢাকা / বগুড়া" : "e.g., Dhaka / Bogura"}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-xs text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {language === "bn" ? "পেমেন্ট মাধ্যম *" : "Payment Method *"}
                    </label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-xs text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-white"
                    >
                      <option value="Cash on Delivery">
                        {language === "bn" ? "ক্যাশ অন ডেলিভারি (COD)" : "Cash on Delivery (COD)"}
                      </option>
                      <option value="bKash">bKash (Mobile Banking)</option>
                      <option value="Nagad">Nagad (Mobile Banking)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {language === "bn" ? "অতিরিক্ত নোটিশ (ঐচ্ছিক)" : "Special Instructions / Notes (Optional)"}
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder={
                      language === "bn"
                        ? "ডেলিভারি সম্পর্কিত কোনো বিশেষ নির্দেশ থাকলে লিখুন..."
                        : "Write any special instructions for delivery..."
                    }
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-xs text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-4 rounded-2xl bg-primary py-4 text-xs font-extrabold text-white shadow-lg hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{language === "bn" ? "অর্ডার সাবমিট হচ্ছে..." : "Submitting Order..."}</span>
                    </>
                  ) : (
                    <span>
                      {language === "bn" ? "অর্ডার নিশ্চিত করুন 🚀" : "Confirm & Place Order 🚀"}
                    </span>
                  )}
                </button>
              </form>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm sticky top-24">
                <h2 className="text-base font-extrabold text-foreground mb-4 border-b border-gray-100 pb-3 flex items-center justify-between">
                  <span>{language === "bn" ? "অর্ডার সারসংক্ষেপ" : "Order Summary"}</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    {items.reduce((acc, i) => acc + i.quantity, 0)} {language === "bn" ? "পণ্য" : "items"}
                  </span>
                </h2>

                <div className="max-h-72 overflow-y-auto pr-1 space-y-3 divide-y divide-gray-50">
                  {items.map((item) => {
                    const id = item.product._id || item.product.id;
                    return (
                      <div key={id} className="pt-3 first:pt-0 flex items-center gap-3">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                          <Image
                            src={getImageUrl(item.product.thumbnail)}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {item.product.name}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            ৳{item.product.price} × {item.quantity} {item.product.unit || "piece"}
                          </p>
                        </div>
                        <p className="text-xs font-extrabold text-foreground">
                          ৳{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-100 mt-6 pt-4 space-y-2.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>{language === "bn" ? "পণ্যের মোট মূল্য:" : "Subtotal:"}</span>
                    <span className="font-bold text-gray-900">৳{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === "bn" ? "ডেলিভারি চার্জ:" : "Delivery Fee:"}</span>
                    <span className="font-bold text-gray-900">৳{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between text-sm font-extrabold text-gray-900">
                    <span>{language === "bn" ? "সর্বমোট মূল্য:" : "Grand Total:"}</span>
                    <span className="text-base text-primary font-black">
                      ৳{grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
