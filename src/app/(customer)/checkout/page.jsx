"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cartContext";
import { useLanguage } from "@/hooks/languageContext";
import { createOrder } from "@/lib/api/orders";
import { getImageUrl } from "@/lib/api/axios";
import { PAYMENT_CONFIG, PAYMENT_METHODS } from "@/lib/payment-config";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: PAYMENT_METHODS.COD,
    senderNumber: "",
    transactionId: "",
    bankName: "",
    notes: "",
  });

  const [deliveryFee] = useState(60); // ৳60 standard delivery fee
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const grandTotal = totalPrice + (items.length > 0 ? deliveryFee : 0);
  const activePaymentConfig = PAYMENT_CONFIG[formData.paymentMethod] || PAYMENT_CONFIG[PAYMENT_METHODS.COD];

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

    // Manual payment transaction verification requirement
    if (activePaymentConfig.requiresTransaction) {
      if (!formData.senderNumber.trim() || !formData.transactionId.trim()) {
        setErrorMessage(
          language === "bn"
            ? `অনুগ্রহ করে ${activePaymentConfig.nameBn} পেমেন্টের প্রেরক নম্বর এবং TrxID প্রদান করুন।`
            : `Please provide your sender number / account and Transaction ID for ${activePaymentConfig.name}.`
        );
        return;
      }
    }

    try {
      setSubmitting(true);
      const payload = {
        customerName: formData.customerName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        paymentMethod: activePaymentConfig.badge || formData.paymentMethod,
        notes: formData.notes,
        deliveryFee: deliveryFee,
        senderNumber: activePaymentConfig.requiresTransaction ? formData.senderNumber.trim() : null,
        transactionId: activePaymentConfig.requiresTransaction ? formData.transactionId.trim() : null,
        bankName: formData.paymentMethod === PAYMENT_METHODS.BANK ? activePaymentConfig.bankName : null,
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
        const createdOrder = res.order;
        const createdOrderId = createdOrder?.orderId || "";
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

                  <div className="col-span-1 sm:col-span-2">
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                        {language === "bn" ? "পেমেন্ট মাধ্যম বেছে নিন" : "Select Payment Method"} *
                      </label>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        {language === "bn" ? "নিরাপদ লেনদেন" : "100% Secure Checkout"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.values(PAYMENT_CONFIG).map((method) => {
                        const isSelected = formData.paymentMethod === method.id;
                        return (
                          <div
                            key={method.id}
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                paymentMethod: method.id,
                              }))
                            }
                            className={`group relative flex flex-col justify-between p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-left ${
                              isSelected
                                ? "border-emerald-600 bg-linear-to-b from-emerald-50/90 to-white shadow-md ring-4 ring-emerald-500/10 scale-[1.01]"
                                : "border-gray-200/90 bg-white hover:border-gray-300 hover:shadow-xs hover:-translate-y-0.5"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-3">
                              {/* Brand Logo Box */}
                              <div className="flex h-11 w-14 shrink-0 items-center justify-center rounded-xl bg-white border border-gray-100 p-1.5 shadow-2xs group-hover:scale-105 transition-transform">
                                {method.logo ? (
                                  <Image
                                    src={method.logo}
                                    alt={method.name}
                                    width={46}
                                    height={46}
                                    className="h-full w-full object-contain"
                                  />
                                ) : (
                                  <span className="text-2xl">{method.icon}</span>
                                )}
                              </div>

                              {/* Radio Selection Pill */}
                              <div
                                className={`flex items-center justify-center h-5 w-5 rounded-full border transition-all ${
                                  isSelected
                                    ? "border-emerald-600 bg-emerald-600 text-white shadow-xs"
                                    : "border-gray-300 bg-gray-50 group-hover:border-gray-400"
                                }`}
                              >
                                {isSelected ? (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                ) : null}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-1">
                              <h4
                                className={`text-xs font-extrabold leading-snug break-words transition-colors ${
                                  isSelected ? "text-emerald-950" : "text-gray-900 group-hover:text-emerald-700"
                                }`}
                              >
                                {language === "bn" ? method.nameBn : method.name}
                              </h4>
                              <div className="flex items-center gap-1.5 pt-0.5">
                                <span
                                  className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                    method.requiresTransaction
                                      ? "bg-amber-50 text-amber-800 border border-amber-200/60"
                                      : "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                                  }`}
                                >
                                  {method.requiresTransaction
                                    ? language === "bn"
                                      ? "ম্যানুয়াল TrxID"
                                      : "Manual TrxID"
                                    : language === "bn"
                                    ? "ক্যাশ অন ডেলিভারি"
                                    : "Cash On Delivery"}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Manual Payment Information & Transaction Form */}
                {activePaymentConfig.requiresTransaction && (
                  <div className="rounded-3xl border-2 border-emerald-500/25 bg-linear-to-b from-emerald-50/70 via-white to-white p-5 sm:p-6 space-y-5 shadow-sm animate-in fade-in transition-all">
                    {/* Header with Large Logo and Instructions */}
                    <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                      <div className="flex h-14 w-16 shrink-0 items-center justify-center rounded-2xl bg-white border border-gray-200/80 p-2 shadow-xs">
                        {activePaymentConfig.logo ? (
                          <Image
                            src={activePaymentConfig.logo}
                            alt={activePaymentConfig.name}
                            width={52}
                            height={52}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="text-3xl">{activePaymentConfig.icon}</span>
                        )}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-gray-900">
                            {language === "bn"
                              ? `${activePaymentConfig.nameBn} পেমেন্ট নির্দেশিকা`
                              : `${activePaymentConfig.name} Payment Instructions`}
                          </h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            Step 2: Transfer & Submit
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed font-medium">
                          {language === "bn" ? activePaymentConfig.instructionBn : activePaymentConfig.instructionEn}
                        </p>
                      </div>
                    </div>

                    {/* Account Details Box */}
                    <div className="rounded-2xl border border-emerald-200 bg-white p-4 space-y-2.5 text-xs shadow-2xs">
                      {activePaymentConfig.accountType && (
                        <div className="flex justify-between items-center text-gray-600">
                          <span className="font-semibold">{language === "bn" ? "অ্যাকাউন্টের ধরণ:" : "Account Type:"}</span>
                          <span className="font-bold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-md">
                            {activePaymentConfig.accountType}
                          </span>
                        </div>
                      )}
                      {activePaymentConfig.accountNumber && (
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-emerald-50/80 border border-emerald-200/70 p-3 rounded-xl gap-1">
                          <span className="font-bold text-emerald-900 text-xs">
                            {language === "bn" ? "অ্যাকাউন্ট / মোবাইল নম্বর:" : "Account / Mobile No:"}
                          </span>
                          <span className="font-mono font-black text-base text-emerald-800 tracking-wider select-all">
                            {activePaymentConfig.accountNumber}
                          </span>
                        </div>
                      )}
                      {activePaymentConfig.bankName && (
                        <div className="flex justify-between items-center text-gray-600">
                          <span className="font-semibold">{language === "bn" ? "ব্যাংকের নাম:" : "Bank Name:"}</span>
                          <span className="font-bold text-gray-900">{activePaymentConfig.bankName}</span>
                        </div>
                      )}
                      {activePaymentConfig.accountName && (
                        <div className="flex justify-between items-center text-gray-600">
                          <span className="font-semibold">{language === "bn" ? "অ্যাকাউন্টের নাম:" : "Account Name:"}</span>
                          <span className="font-bold text-gray-900">{activePaymentConfig.accountName}</span>
                        </div>
                      )}
                      {activePaymentConfig.branchName && (
                        <div className="flex justify-between items-center text-gray-600">
                          <span className="font-semibold">{language === "bn" ? "শাখা / Branch:" : "Branch:"}</span>
                          <span className="font-bold text-gray-900">{activePaymentConfig.branchName}</span>
                        </div>
                      )}
                      {activePaymentConfig.routingNumber && (
                        <div className="flex justify-between items-center text-gray-600">
                          <span className="font-semibold">{language === "bn" ? "রাউটিং নম্বর:" : "Routing No:"}</span>
                          <span className="font-mono font-bold text-gray-900">{activePaymentConfig.routingNumber}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center border-t border-gray-100 pt-3 text-gray-900">
                        <span className="font-bold text-xs">{language === "bn" ? "পরিশোধযোগ্য মোট টাকা:" : "Amount to Pay:"}</span>
                        <span className="text-base font-black text-emerald-600">৳{grandTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Sender and TrxID Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">
                          {language === "bn" ? activePaymentConfig.senderLabelBn : activePaymentConfig.senderLabelEn} *
                        </label>
                        <input
                          type="text"
                          name="senderNumber"
                          required
                          value={formData.senderNumber}
                          onChange={handleChange}
                          placeholder={language === "bn" ? "যেমন: 017XXXXXXXX" : "e.g., 017XXXXXXXX"}
                          className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-3 text-xs text-gray-900 font-medium placeholder-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-3 focus:ring-emerald-500/20 shadow-2xs transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">
                          {language === "bn" ? activePaymentConfig.trxLabelBn : activePaymentConfig.trxLabelEn} *
                        </label>
                        <input
                          type="text"
                          name="transactionId"
                          required
                          value={formData.transactionId}
                          onChange={handleChange}
                          placeholder={language === "bn" ? "যেমন: 9K72BXYZ" : "e.g., 9K72BXYZ"}
                          className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-3 text-xs text-gray-900 font-mono font-bold uppercase placeholder-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-3 focus:ring-emerald-500/20 shadow-2xs transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

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
