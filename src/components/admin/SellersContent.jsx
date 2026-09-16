"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/languageContext";

export function SellersContent({ sellers = [], onToggleStatus, onDeleteSeller }) {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [isUpdating, setIsUpdating] = useState(null);

  const filteredSellers = sellers.filter((seller) => {
    const name = seller.sellerName || "";
    const district = seller.sellerDistrict || "";
    const phone = seller.sellerPhone || "";

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      district.toLowerCase().includes(search.toLowerCase()) ||
      phone.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || (seller.isVerifiedSeller ? "Verified" : "Pending") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (seller, nextStatus) => {
    const id = seller._id || seller.id;
    try {
      setIsUpdating(id);
      if (onToggleStatus) await onToggleStatus(id, nextStatus);
      if (selectedSeller && (selectedSeller._id || selectedSeller.id) === id) {
        setSelectedSeller((prev) => (prev ? { ...prev, isVerifiedSeller: nextStatus === "Verified" } : null));
      }
    } catch (err) {
      alert(err.message || "Failed to update seller status.");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async (sellerId) => {
    if (!confirm("Are you sure you want to remove this seller?")) return;
    try {
      setIsUpdating(sellerId);
      if (onDeleteSeller) await onDeleteSeller(sellerId);
      if (selectedSeller && (selectedSeller._id || selectedSeller.id) === sellerId) {
        setSelectedSeller(null);
      }
    } catch (err) {
      alert(err.message || "Failed to delete seller.");
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {t("sellers") || "Sellers & Hatcheries"}
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Manage verified fish seed & agro product sellers across Bangladesh.
          </p>
        </div>
        <Link
          href="/admin/sellers/new"
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700"
        >
          + Add New Seller
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by hatchery, seller name, or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs outline-none transition-all focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
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

        <div className="flex items-center gap-2">
          {["All", "Verified", "Pending"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === status
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Sellers List / Table */}
      {filteredSellers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-xl">
            🐟
          </div>
          <h3 className="mt-4 text-base font-bold text-gray-900">No sellers found</h3>
          <p className="mt-1 text-xs text-gray-500">
            Try adjusting your search query or status filter.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="border-b border-gray-100 bg-gray-50/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Seller / Hatchery</th>
                  <th className="px-6 py-4">District</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredSellers.map((seller) => {
                  const id = seller._id || seller.id;
                  const name = seller.sellerName || "Unnamed Seller";
                  const contactName = seller.sellerName || "Contact";
                  const district = seller.sellerDistrict || "—";
                  const phone = seller.sellerPhone || "—";
                  const status = seller.isVerifiedSeller ? "Verified" : "Pending";

                  return (
                    <tr key={id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedSeller(seller)}
                          className="font-bold text-gray-900 hover:text-emerald-600 transition-colors text-left cursor-pointer"
                        >
                          {name}
                        </button>
                        <p className="text-[11px] text-gray-400 mt-0.5">👤 {contactName}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-700">📍 {district}</td>
                      <td className="px-6 py-4 text-gray-600">📞 {phone}</td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={status}
                          disabled={isUpdating === id || !seller.isUser}
                          onChange={(e) => handleStatusChange(seller, e.target.value)}
                          className={`rounded-lg border px-2.5 py-1 text-xs font-semibold cursor-pointer outline-none disabled:cursor-not-allowed disabled:opacity-70 ${
                            status === "Verified"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : status === "Pending"
                              ? "bg-amber-100 text-amber-800 border-amber-200"
                              : "bg-gray-100 text-gray-600 border-gray-200"
                          }`}
                        >
                          <option value="Verified">Verified</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setSelectedSeller(seller)}
                          className="cursor-pointer text-xs font-semibold text-emerald-600 hover:underline"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          disabled={isUpdating === id}
                          onClick={() => handleDelete(id)}
                          className="cursor-pointer text-xs font-semibold text-red-600 
                          hover:underline disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Seller Details Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  Seller Details
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">
                  {selectedSeller.hatcheryName || selectedSeller.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSeller(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4">
                <div>
                  <span className="text-gray-400 block font-semibold text-[10px] uppercase">Contact Person</span>
                  <span className="font-bold text-gray-900">{selectedSeller.name || selectedSeller.sellerName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold text-[10px] uppercase">Phone</span>
                  <a href={`tel:${selectedSeller.phone || selectedSeller.sellerPhone}`} className="font-bold text-emerald-600 hover:underline">
                    {selectedSeller.phone || selectedSeller.sellerPhone || "—"}
                  </a>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold text-[10px] uppercase">District</span>
                  <span className="font-bold text-gray-900">{selectedSeller.district || selectedSeller.sellerDistrict || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold text-[10px] uppercase">Status</span>
                  <span className="font-bold text-emerald-800">{selectedSeller.status || "Verified"}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedSeller(null)}
                className="cursor-pointer rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
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
