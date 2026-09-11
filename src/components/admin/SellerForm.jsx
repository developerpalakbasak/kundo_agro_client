"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20";

export function SellerForm({ onSubmit }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    hatcheryName: "",
    name: "",
    phone: "",
    district: "",
    locationDetails: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      if (!formData.name.trim()) throw new Error("Seller contact name is required.");
      if (!formData.phone.trim()) throw new Error("Phone number is required.");
      if (!formData.district.trim()) throw new Error("District is required.");

      if (onSubmit) {
        await onSubmit(formData);
      }
      router.push("/admin/sellers");
    } catch (err) {
      setErrorMsg(err.message || "Failed to register seller.");
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

      <fieldset className="flex flex-col gap-4" disabled={isSubmitting}>
        <legend className="mb-2 text-sm font-bold text-gray-900">Seller & Hatchery Details</legend>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">Hatchery / Business Name</span>
          <input
            type="text"
            name="hatcheryName"
            value={formData.hatcheryName}
            onChange={handleChange}
            placeholder="e.g. Sonali Fish Hatchery"
            className={inputClass}
          />
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-gray-700">Contact Person Name *</span>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Md. Rahim Mia"
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-gray-700">Phone Number *</span>
            <input
              type="text"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. 01700000000"
              className={inputClass}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">District *</span>
          <input
            type="text"
            name="district"
            required
            value={formData.district}
            onChange={handleChange}
            placeholder="e.g. Bogura"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-gray-700">Full Address / Location Details</span>
          <textarea
            name="locationDetails"
            rows={3}
            value={formData.locationDetails}
            onChange={handleChange}
            placeholder="Village, Thana, Upazila details..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
          />
        </label>
      </fieldset>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.push("/admin/sellers")}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Register Seller"}
        </button>
      </div>
    </form>
  );
}
