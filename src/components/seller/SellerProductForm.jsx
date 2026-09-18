"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/hooks/languageContext";
import { getCategories, getDistricts, getUnits } from "@/lib/api/products";
import { getImageUrl } from "@/lib/api/axios";

const defaultUnits = [
  "piece",
  "thousand / হাজার",
  "kg",
  "gram",
  "litre",
  "pack",
  "mon / মণ",
  "bag / বস্তা",
];

const defaultCategories = [
  "Fish seed / মাছের পোনা",
  "Fisheries medicine / chemical",
  "Fish feed / raw materials",
  "Dairy feed / raw materials",
  "Dairy medicine",
  "Human food",
  "Import items",
];

export function SellerProductForm({
  initialData = null,
  onSubmit,
  isEditing = false,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const basePath = pathname.startsWith("/seller/animale") ? "/seller/animale" : "/seller/fish";
  const { t, language } = useLanguage();

  const [categories, setCategories] = useState(defaultCategories);
  const [units, setUnits] = useState(defaultUnits);
  const [districts, setDistricts] = useState([]);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || "Fish seed / মাছের পোনা",
    unit: initialData?.unit || "piece",
    price: initialData?.price || "",
    productFor:basePath == "/seller/animale"?"animale":"fish",
    compareAtPrice: initialData?.compareAtPrice || "",
    location: initialData?.location || initialData?.sellerDistrict || "",
    video: initialData?.video || "",
    isAvailable: initialData?.isAvailable !== undefined ? initialData.isAvailable : true,
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    initialData?.thumbnail ? getImageUrl(initialData.thumbnail) : null
  );
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    // Load dynamic categories
    getCategories()
      .then((res) => {
        if (res && res.categories && Array.isArray(res.categories)) {
          const names = res.categories.map((c) =>
            typeof c === "string" ? c : c.name
          );
          if (names.length > 0) setCategories(names);
        }
      })
      .catch(() => {});

    // Load dynamic units
    getUnits()
      .then((res) => {
        if (res && res.units && Array.isArray(res.units)) {
          setUnits(res.units);
        }
      })
      .catch(() => {});

    // Load Bangladesh districts
    getDistricts()
      .then((res) => {
        if (res && res.districts && Array.isArray(res.districts)) {
          setDistricts(res.districts);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleCategorySelect = (e) => {
    const val = e.target.value;
    if (val === "__CUSTOM__") {
      setIsCustomCategory(true);
      setFormData((prev) => ({ ...prev, category: "" }));
    } else {
      setIsCustomCategory(false);
      setFormData((prev) => ({ ...prev, category: val }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const finalCategory = isCustomCategory
        ? customCategory.trim()
        : formData.category;

      if (!formData.name.trim()) throw new Error("Product name is required.");
      if (!finalCategory) throw new Error("Category is required.");
      if (!formData.unit.trim()) throw new Error("Unit is required.");

      const numericPrice = Number(formData.price);
      if (!formData.price || Number.isNaN(numericPrice) || numericPrice <= 0) {
        throw new Error("Price must be a valid number greater than 0.");
      }

      if (formData.compareAtPrice) {
        const numericCompare = Number(formData.compareAtPrice);
        if (Number.isNaN(numericCompare) || numericCompare <= numericPrice) {
          throw new Error(
            "Old price (compareAtPrice) must be higher than the current price."
          );
        }
      }

      if (!formData.description.trim()) {
        throw new Error("Product description is required.");
      }

      if (!isEditing && !thumbnailFile && !thumbnailPreview) {
        throw new Error("A product thumbnail image is required.");
      }

      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("description", formData.description.trim());
      data.append("category", finalCategory);
      data.append("unit", formData.unit.trim());
      data.append("price", String(numericPrice));

      if (formData.compareAtPrice) {
        data.append("compareAtPrice", String(formData.compareAtPrice));
      }

      if (formData.location) {
        data.append("location", formData.location.trim());
      }

      if (formData.video) {
        data.append("video", formData.video.trim());
      }

      data.append("isAvailable", String(formData.isAvailable));

      if (formData.productFor) {
        data.append("productFor", formData.productFor);
      }

      if (thumbnailFile) {
        data.append("thumbnail", thumbnailFile);
      }

      if (onSubmit) {
        await onSubmit(data);
      }

      router.push(`${basePath}/products`);
    } catch (err) {
      setErrorMsg(err.message || "An error occurred while saving the product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs sm:p-8"
    >
      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 animate-fade-in flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Basic Information Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
          {language === "bn" ? "১. প্রাথমিক তথ্য" : "1. Basic Product Info"}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Product Name */}
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
              {language === "bn" ? "পণ্যের নাম" : "Product Name"} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={
                language === "bn"
                  ? "যেমন: পদ্মা প্রিমিয়াম রুই পোনা (গ্রেড এ)"
                  : "e.g. Padma Premium Rui Fry (Grade A)"
              }
              required
              className="h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
              {language === "bn" ? "ক্যাটাগরি" : "Category"} *
            </label>
            <select
              value={isCustomCategory ? "__CUSTOM__" : formData.category}
              onChange={handleCategorySelect}
              className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm outline-none transition-colors focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="__CUSTOM__">
                {language === "bn" ? "+ নতুন ক্যাটাগরি লিখুন..." : "+ Custom Category..."}
              </option>
            </select>
            {isCustomCategory && (
              <input
                type="text"
                placeholder="Enter custom category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                required
                className="mt-2 h-10 w-full rounded-xl border border-emerald-300 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-600/20"
              />
            )}
          </div>

          {/* Unit */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
              {language === "bn" ? "একক / ইউনিট" : "Selling Unit"} *
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm outline-none transition-colors focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pricing & Location Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
          {language === "bn" ? "২. মূল্য ও অবস্থান" : "2. Pricing & Location"}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Selling Price */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
              {language === "bn" ? "বিক্রয় মূল্য (৳)" : "Selling Price (৳)"} *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 font-bold text-sm">
                ৳
              </span>
              <input
                type="number"
                step="any"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
                className="h-11 w-full rounded-xl border border-gray-200 pl-8 pr-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
              />
            </div>
          </div>

          {/* Compare at Price / Old Price */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-1">
              {language === "bn" ? "আগের মূল্য / ডিসকাউন্ট (৳)" : "Old / Compare Price (৳)"}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 font-bold text-sm">
                ৳
              </span>
              <input
                type="number"
                step="any"
                name="compareAtPrice"
                value={formData.compareAtPrice}
                onChange={handleChange}
                placeholder="Optional"
                className="h-11 w-full rounded-xl border border-gray-200 pl-8 pr-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
              />
            </div>
          </div>

          {/* Hatchery Location / District */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
              {language === "bn" ? "হ্যাচারি জেলা / এলাকা" : "Hatchery District / Location"}
            </label>
            {districts.length > 0 ? (
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none transition-colors focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
              >
                <option value="">
                  {language === "bn" ? "-- জেলা নির্বাচন করুন --" : "-- Select District --"}
                </option>
                {districts.map((dist) => {
                  const distName = typeof dist === "string" ? dist : dist.name;
                  return (
                    <option key={distName} value={distName}>
                      {distName}
                    </option>
                  );
                })}
              </select>
            ) : (
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Rajbari, Mymensingh, Jessore"
                className="h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
              />
            )}
          </div>
        </div>
      </div>

      {/* Thumbnail Upload Section */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
          {language === "bn" ? "৩. পণ্যের ছবি ও মিডিয়া" : "3. Product Image & Media"}
        </h2>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-2">
            {language === "bn" ? "প্রধান থাম্বনেইল ছবি" : "Main Thumbnail Image"} *
          </label>

          <div className="flex flex-col sm:flex-row items-start gap-5">
            {thumbnailPreview ? (
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-xs">
                <Image
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-400">
                <span className="text-2xl">📸</span>
                <span className="mt-1 text-[11px] font-medium">No Image</span>
              </div>
            )}

            <div className="flex-1 space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-xs transition-colors hover:border-emerald-600 hover:text-emerald-600"
              >
                📁 {thumbnailPreview ? "Change Image" : "Upload Thumbnail Image"}
              </button>
              <p className="text-xs text-gray-400">
                JPG, PNG or WEBP. Clear photos of healthy fish fry or agro products increase farmer inquiries.
              </p>
            </div>
          </div>
        </div>

        {/* Video Link */}
        <div className="pt-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-1">
            {language === "bn" ? "ভিডিও লিংক (ঐচ্ছিক)" : "Video Link (Optional YouTube/Vimeo)"}
          </label>
          <input
            type="url"
            name="video"
            value={formData.video}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className="h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
          />
        </div>
      </div>

      {/* Description & Availability Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
          {language === "bn" ? "৪. বিস্তারিত বিবরণ ও স্টক" : "4. Details & Availability"}
        </h2>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
            {language === "bn" ? "পণ্যের বিবরণ" : "Product Description"} *
          </label>
          <textarea
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={
              language === "bn"
                ? "পোনার বয়স, সাইজ, জাত এবং হ্যাচারির গুণগত মান সম্পর্কে বিস্তারিত লিখুন..."
                : "Describe the fry age, size, breed quality, disease resistance, and packing details..."
            }
            required
            className="w-full rounded-xl border border-gray-200 p-3.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
          />
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-4">
          <input
            type="checkbox"
            id="isAvailable"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
            className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
          <label htmlFor="isAvailable" className="cursor-pointer text-xs sm:text-sm font-semibold text-gray-800">
            {language === "bn"
              ? "পণ্যটি বর্তমানে বিক্রয়ের জন্য স্টকে উপলব্ধ রয়েছে"
              : "Product is currently in stock and available for order"}
          </label>
        </div>
      </div>

      {/* Form Submission Actions */}
      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 pt-5">
        <button
          type="button"
          onClick={() => router.push(`${basePath}/products`)}
          className="cursor-pointer rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
        >
          {language === "bn" ? "বাতিল" : "Cancel"}
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>{isEditing ? "Updating..." : "Saving..."}</span>
            </>
          ) : isEditing ? (
            language === "bn" ? "পণ্য আপডেট করুন" : "Update Product"
          ) : (
            language === "bn" ? "পণ্য সংরক্ষণ করুন" : "Publish Product"
          )}
        </button>
      </div>
    </form>
  );
}
