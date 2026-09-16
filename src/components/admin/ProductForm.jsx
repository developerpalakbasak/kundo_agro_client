"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAdminCategories, createProductCategory } from "@/lib/api/admin";

const inputClass =
  "h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20";

export function ProductForm({ initialData = null, onSubmit, isEditing = false }) {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState(["kg", "gram", "litre", "piece", "dozen", "pack", "thousand / হাজার"]);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    unit: initialData?.unit || "kg",
    price: initialData?.price || "",
    compareAtPrice: initialData?.compareAtPrice || "",
    sellerName: initialData?.sellerName || "",
    sellerDistrict: initialData?.sellerDistrict || "",
    sellerPhone: initialData?.sellerPhone || "",
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(initialData?.thumbnail || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [catSearchQuery, setCatSearchQuery] = useState("");
  const catDropdownRef = useRef(null);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target)) {
        setIsCatDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCategories = categories.filter((c) =>
    c.toLowerCase().includes(catSearchQuery.toLowerCase())
  );

  useEffect(() => {
    getAdminCategories()
      .then((res) => {
        if (res && res.categories && Array.isArray(res.categories)) {
          const names = res.categories.map((c) => (typeof c === "string" ? c : c.name));
          setCategories(names);
        }
      })
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleCategorySelect = (e) => {
    setFormData((prev) => ({ ...prev, category: e.target.value }));
  };

  const handleAddCustomCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (trimmed) {
      try {
        await createProductCategory(trimmed);
      } catch (err) {
        console.error("Failed to create category on backend:", err);
      }
      if (!categories.includes(trimmed)) {
        setCategories((prev) => [...prev, trimmed]);
      }
      setFormData((prev) => ({ ...prev, category: trimmed }));
    }
    setShowCategoryModal(false);
    setNewCategoryName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const data = new FormData();
      
      if (!formData.name.trim()) throw new Error("Product name is required.");
      if (!formData.category) throw new Error("Category is required.");
      if (!formData.price) throw new Error("Price is required.");
      if (!isEditing && !thumbnailFile && !thumbnailPreview) {
        throw new Error("Main thumbnail image is required.");
      }

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("unit", formData.unit);
      data.append("price", formData.price);
      if (formData.compareAtPrice) data.append("compareAtPrice", formData.compareAtPrice);
      if (formData.sellerName) data.append("sellerName", formData.sellerName);
      if (formData.sellerDistrict) data.append("sellerDistrict", formData.sellerDistrict);
      if (formData.sellerPhone) data.append("sellerPhone", formData.sellerPhone);

      if (thumbnailFile) {
        data.append("thumbnail", thumbnailFile);
      }

      if (onSubmit) {
        await onSubmit(data);
      }
      router.push("/admin/products");
    } catch (err) {
      setErrorMsg(err.message || "An error occurred while saving the product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Basic Info */}
      <fieldset className="flex flex-col gap-4" disabled={isSubmitting}>
        <legend className="mb-2 text-sm font-bold text-gray-900">Basic Information</legend>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">Product Name *</span>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Fisheries Medicine X"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">Description *</span>
          <textarea
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe product specs, usage, dosage, packaging..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
          />
        </label>
      </fieldset>

      {/* Category & Unit */}
      <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2" disabled={isSubmitting}>
        <legend className="mb-2 text-sm font-bold text-gray-900">Category & Unit</legend>

        <label className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Category *</span>
          </div>

          <div className="relative" ref={catDropdownRef}>
            <div
              onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
              className={`${inputClass} flex items-center justify-between cursor-pointer bg-white`}
            >
                <span className={formData.category ? "text-gray-900" : "text-gray-400"}>
                  {formData.category || "Select category"}
                </span>
                <span className="text-gray-400 text-xs">▼</span>
              </div>

              {isCatDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
                  <div className="p-2 border-b border-gray-100">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search category..."
                      value={catSearchQuery}
                      onChange={(e) => setCatSearchQuery(e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                  <ul className="max-h-60 overflow-y-auto py-1">
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((cat) => (
                        <li
                          key={cat}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, category: cat }));
                            setIsCatDropdownOpen(false);
                            setCatSearchQuery("");
                          }}
                          className={`cursor-pointer px-3 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 ${formData.category === cat ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-700"}`}
                        >
                          {cat}
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-2 text-sm text-gray-500">No categories found</li>
                    )}
                    <li
                      onClick={() => {
                        setIsCatDropdownOpen(false);
                        setShowCategoryModal(true);
                      }}
                      className="cursor-pointer px-3 py-2 text-sm text-emerald-600 font-medium hover:bg-emerald-50 border-t border-gray-100"
                    >
                      + Add Custom Category...
                    </li>
                  </ul>
                </div>
              )}
            </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">Unit *</span>
          <select
            name="unit"
            required
            value={formData.unit}
            onChange={handleChange}
            className={inputClass}
          >
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </label>
      </fieldset>

      {/* Pricing */}
      <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2" disabled={isSubmitting}>
        <legend className="mb-2 text-sm font-bold text-gray-900">Pricing</legend>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">Price (৳) *</span>
          <input
            type="number"
            name="price"
            required
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g. 350.00"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">Old Price (৳, optional)</span>
          <input
            type="number"
            name="compareAtPrice"
            step="0.01"
            value={formData.compareAtPrice}
            onChange={handleChange}
            placeholder="e.g. 400.00"
            className={inputClass}
          />
        </label>
      </fieldset>

      {/* Seller Info */}
      <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-3" disabled={isSubmitting}>
        <legend className="mb-2 text-sm font-bold text-gray-900">Seller Details (Optional)</legend>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">Seller Name</span>
          <input
            type="text"
            name="sellerName"
            value={formData.sellerName}
            onChange={handleChange}
            placeholder="e.g. Rahim Fisheries"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">Seller District</span>
          <input
            type="text"
            name="sellerDistrict"
            value={formData.sellerDistrict}
            onChange={handleChange}
            placeholder="e.g. Khulna"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">Seller Phone</span>
          <input
            type="text"
            name="sellerPhone"
            value={formData.sellerPhone}
            onChange={handleChange}
            placeholder="e.g. 01700000000"
            className={inputClass}
          />
        </label>
      </fieldset>

      {/* Main Thumbnail */}
      <fieldset className="flex flex-col gap-3" disabled={isSubmitting}>
        <legend className="text-sm font-bold text-gray-900">Main Thumbnail Image</legend>

        {thumbnailPreview && (
          <div className="relative h-44 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            <Image
              src={
                thumbnailPreview.startsWith("blob:") || thumbnailPreview.startsWith("http")
                  ? thumbnailPreview
                  : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${thumbnailPreview.startsWith("/") ? "" : "/"}${thumbnailPreview}`
              }
              alt="Thumbnail Preview"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-6 text-sm text-gray-500 hover:border-emerald-600 hover:text-emerald-600">
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="sr-only"
          />
          {thumbnailPreview ? "Click to change thumbnail" : "Click to upload product thumbnail image"}
        </label>
      </fieldset>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : isEditing ? "Update Product" : "Save Product"}
        </button>
      </div>

      {/* Custom Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Add Custom Category</h3>
            <input
              type="text"
              autoFocus
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g. Organic Fertilizers"
              className={inputClass}
            />
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowCategoryModal(false);
                  setNewCategoryName("");
                }}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustomCategory}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
