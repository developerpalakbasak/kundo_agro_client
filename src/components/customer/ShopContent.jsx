// @ts-nocheck
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/modal";
import { useLanguage } from "@/hooks/languageContext";
import { getProducts, createFishSeedProduct, getCategories, getDistricts, getUnits } from "@/lib/api/products";
import { useCart } from "@/context/cartContext";

/**
 * ShopContent — shared product listing UI.
 * Accepts `initialCategory` (the full category string or "all").
 * When the user switches categories, navigates to /products/[encodedCategory]
 * or /products for "all".
 */
export function ShopContent({ initialCategory = "all" }) {
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [units, setUnits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedDistrict, setSelectedDistrict] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
    const [districtSearchQuery, setDistrictSearchQuery] = useState("");

    // Product Detail modal state
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { t, language } = useLanguage();
    const { addToCart } = useCart();

    // When the parent page changes the initialCategory prop (e.g. browser back/forward),
    // keep internal state in sync.
    useEffect(() => {
        (async () => {
            setSelectedCategory(initialCategory);
            setSelectedDistrict("all");
        })()
    }, [initialCategory]);

    // Fetch master category list, districts and units from server API
    useEffect(() => {
        getCategories()
            .then((res) => {
                if (res.categories && Array.isArray(res.categories)) {
                    // Map to plain name strings for the dropdown
                    const serverNames = res.categories.map((c) => c.name);
                    setCategories(serverNames);
                }
            })
            .catch((err) => {
                console.error("Failed to load categories from server:", err);
            });

        getDistricts()
            .then((res) => {
                if (res.districts && Array.isArray(res.districts)) {
                    setDistricts(res.districts);
                }
            })
            .catch((err) => {
                console.error("Failed to load districts from server:", err);
            });

        getUnits()
            .then((res) => {
                if (res.units && Array.isArray(res.units)) {
                    setUnits(res.units);
                }
            })
            .catch((err) => {
                console.error("Failed to load units from server:", err);
            });
    }, []);

    // Fetch products from backend API
    useEffect(() => {
        const loadProducts = async () => {
            setIsLoading(true);
            setLoadError(null);
            try {
                const params = {};
                if (selectedCategory !== "all") params.category = selectedCategory;
                if (searchQuery.trim()) params.search = searchQuery.trim();

                const res = await getProducts(params);
                if (res.data && Array.isArray(res.data)) {
                    setProducts(res.data);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                setLoadError(err.message || "Failed to load products from server.");
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => {
            loadProducts();
        }, 300); // debounce search query

        return () => clearTimeout(timer);
    }, [selectedCategory, searchQuery]);

    // Navigate to category path URL and update local state instantly for UI feedback
    const handleCategoryChange = (cat) => {
        setSelectedDistrict("all");
        setSelectedCategory(cat);
        if (cat === "all") {
            router.push("/products", { scroll: false });
        } else {
            router.push(`/products/${encodeURIComponent(cat)}`, { scroll: false });
        }
    };

    const sellerDistricts = Array.from(
        new Set(products.map((p) => p.sellerDistrict).filter(Boolean))
    ).sort();

    const filteredDistricts = districts.filter((d) =>
        d.toLowerCase().includes(districtSearchQuery.toLowerCase())
    );

    const filteredProducts = products.filter((p) => {
        const matchesDistrict =
            selectedDistrict === "all" || p.sellerDistrict === selectedDistrict;
        return matchesDistrict;
    });

    const isFishSeedCategory = selectedCategory === "Fish seed / মাছের পোনা";

    return (
        <div className="w-full">
            {/* Header & Search */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                        {t("productsTitle")}
                        {isFishSeedCategory && (
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-800">
                                🐟 Fish Seed Marketplace
                            </span>
                        )}
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                        {filteredProducts.length} {t("productsSubtitleCount")}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t("searchProductsPlaceholder")}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pl-10 text-xs shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-4 mt-4">
                <button
                    type="button"
                    onClick={() => handleCategoryChange("all")}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${selectedCategory === "all"
                        ? "bg-primary text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                >
                    {t("allCategories")}
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategoryChange(cat)}
                        className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${selectedCategory === cat
                            ? "bg-primary text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* District Filter (only shown for fish-seed or when districts exist) */}
            {(isFishSeedCategory || sellerDistricts.length > 0) && (
                <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/90 to-teal-50/40 p-4 sm:p-5 shadow-sm space-y-3 mt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/60 pb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                                📍 {language === "bn" ? "বিক্রেতার জেলা দিয়ে ফিল্টার করুন:" : "Filter Sellers by District:"}
                            </span>
                        </div>
                        {selectedDistrict !== "all" && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedDistrict("all");
                                    setDistrictSearchQuery("");
                                }}
                                className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer"
                            >
                                {language === "bn" ? "সব জেলা দেখুন" : "Clear Filter"}
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsDistrictDropdownOpen(!isDistrictDropdownOpen)}
                            className="w-full flex items-center justify-between gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-xs font-bold text-emerald-950 shadow-sm hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-all"
                        >
                            <span className="flex items-center gap-2 truncate">
                                <span>📍</span>
                                <span>
                                    {selectedDistrict === "all"
                                        ? language === "bn"
                                            ? "সকল জেলা (All Districts)"
                                            : "All Districts of Bangladesh"
                                        : selectedDistrict}
                                </span>
                            </span>
                            <span className="flex items-center gap-1.5 text-emerald-700 flex-shrink-0">
                                <span className="text-[10px] font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                                    {selectedDistrict === "all"
                                        ? `${districts.length} Districts`
                                        : "Selected"}
                                </span>
                                <svg
                                    className={`w-4 h-4 transition-transform ${isDistrictDropdownOpen ? "rotate-180" : ""}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </button>
                        {isDistrictDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-20" onClick={() => setIsDistrictDropdownOpen(false)} />
                                <div className="absolute left-0 right-0 top-full mt-1.5 z-30 rounded-2xl border border-emerald-200 bg-white p-3 shadow-xl space-y-2">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={districtSearchQuery}
                                            onChange={(e) => setDistrictSearchQuery(e.target.value)}
                                            placeholder={
                                                language === "bn"
                                                    ? "জেলা খুঁজুন (যেমন: বগুড়া, ময়মনসিংহ, যশোর)..."
                                                    : "Search district name (e.g. Bogura, Mymensingh)..."
                                            }
                                            autoFocus
                                            className="w-full rounded-xl border border-emerald-200 bg-emerald-50/40 px-3.5 py-2 pl-9 text-xs outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                        <svg
                                            className="absolute left-3 top-2.5 h-4 w-4 text-emerald-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedDistrict("all");
                                                setIsDistrictDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${selectedDistrict === "all" ? "bg-emerald-700 text-white" : "hover:bg-emerald-50 text-gray-800"}`}
                                        >
                                            <span>{language === "bn" ? "সকল জেলা (All Districts)" : "All Districts of Bangladesh"}</span>
                                            {selectedDistrict === "all" && <span>✓</span>}
                                        </button>
                                        {filteredDistricts.map((district) => {
                                            const sellerCount = products.filter((p) => p.sellerDistrict === district).length;
                                            return (
                                                <button
                                                    key={district}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedDistrict(district);
                                                        setIsDistrictDropdownOpen(false);
                                                    }}
                                                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors cursor-pointer ${selectedDistrict === district
                                                        ? "bg-emerald-700 text-white font-bold"
                                                        : sellerCount > 0
                                                            ? "bg-emerald-50/80 text-emerald-950 font-bold hover:bg-emerald-100"
                                                            : "hover:bg-gray-100 text-gray-700"
                                                        }`}
                                                >
                                                    <span className="flex items-center gap-1.5">
                                                        <span>{district}</span>
                                                        {sellerCount > 0 && (
                                                            <span className="text-[10px] bg-emerald-200 text-emerald-900 rounded-full px-1.5 py-0.2 font-bold">
                                                                {sellerCount} {language === "bn" ? "টি" : "item"}
                                                            </span>
                                                        )}
                                                    </span>
                                                    {selectedDistrict === district && <span>✓</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Products Grid / Loading Skeleton / Empty State */}
            {isLoading ? (
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="animate-pulse rounded-2xl border border-gray-100 bg-white p-4 space-y-4 shadow-sm">
                            <div className="h-44 rounded-xl bg-gray-200 w-full" />
                            <div className="h-4 rounded bg-gray-200 w-3/4" />
                            <div className="h-3 rounded bg-gray-100 w-full" />
                            <div className="h-8 rounded-xl bg-gray-200 w-1/3" />
                        </div>
                    ))}
                </div>
            ) : loadError ? (
                <div className="mt-12 rounded-2xl border border-red-100 bg-red-50/60 p-8 text-center max-w-md mx-auto space-y-3">
                    <p className="text-sm font-semibold text-red-600">⚠️ {loadError}</p>
                    <button
                        type="button"
                        onClick={loadProducts}
                        className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="mt-12 w-full text-center py-12 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
                    <p className="text-base font-semibold text-gray-600">No products found</p>
                    <p className="text-xs text-gray-400 mt-1">Try resetting your filters or search query.</p>
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((product) => {
                        const isFishSeed = product.category === "Fish seed / মাছের পোনা";
                        return (
                            <div
                                key={product._id || product.id}
                                onClick={() => setSelectedProduct(product)}
                                className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer"
                            >
                                <div>
                                    <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gray-100 mb-3">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_API_URL}${product.thumbnail}`}
                                            alt={product.name}
                                            fill
                                            unoptimized
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {isFishSeed && (
                                            <span className="absolute top-2 left-2 rounded-lg bg-emerald-600/90 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-xs shadow-xs">
                                                🐟 Fish Seed
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                        {product.category}
                                    </span>
                                    <h3 className="mt-1 text-base font-bold text-foreground group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                                        {product.description}
                                    </p>
                                    {product.sellerName && (
                                        <div className="mt-2.5 rounded-lg bg-emerald-50/60 p-2 text-[11px] text-emerald-950 space-y-0.5">
                                            <div className="font-semibold flex items-center gap-1">
                                                <span>👨‍🌾</span> <span>{product.sellerName}</span>
                                            </div>
                                            {product.sellerDistrict && (
                                                <div className="text-emerald-800">
                                                    📍 {product.sellerDistrict}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                    <div>
                                        <span className="text-lg font-extrabold text-foreground">
                                            ৳{product.price}
                                        </span>
                                        <span className="text-xs text-muted-foreground ml-1">
                                            / {product.unit || "piece"}
                                        </span>
                                        {product.compareAtPrice && (
                                            <span className="block text-[11px] text-gray-400 line-through">
                                                ৳{product.compareAtPrice}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                        {product.sellerPhone && (
                                            <a
                                                href={`tel:${product.sellerPhone}`}
                                                className="rounded-xl border border-emerald-600 bg-emerald-50 px-2.5 py-2 text-xs font-bold text-emerald-800 shadow-xs hover:bg-emerald-100 transition-colors flex items-center gap-1"
                                                title={language === "bn" ? "বিক্রেতাকে কল করুন" : "Call Seller"}
                                            >
                                                📞 {language === "bn" ? "কল" : "Call"}
                                            </a>
                                        )}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(product);
                                            }}
                                            className="cursor-pointer rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary/90 transition-colors"
                                        >
                                            {t("addToCart")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Product Detail Modal */}
            <Modal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                title={selectedProduct?.name || "Product Details"}
                maxWidth="lg"
            >
                {selectedProduct && (
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                            <div className="relative h-56 sm:h-64 w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm border border-gray-100">
                                <Image
                                    src={selectedProduct.thumbnail}
                                    alt={selectedProduct.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="space-y-3">
                                <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                                    {selectedProduct.category}
                                </span>
                                <h2 className="text-xl font-extrabold text-foreground">
                                    {selectedProduct.name}
                                </h2>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-primary">
                                        ৳{selectedProduct.price}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        / {selectedProduct.unit || "piece"}
                                    </span>
                                    {selectedProduct.compareAtPrice && (
                                        <span className="text-xs text-gray-400 line-through ml-2">
                                            ৳{selectedProduct.compareAtPrice}
                                        </span>
                                    )}
                                </div>
                                {selectedProduct.sellerName && (
                                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs space-y-1">
                                        <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                                            👨‍🌾 {selectedProduct.sellerName}
                                        </p>
                                        {selectedProduct.sellerDistrict && (
                                            <p className="text-emerald-800 font-medium">
                                                📍 {language === "bn" ? "জেলা:" : "District:"} {selectedProduct.sellerDistrict}
                                            </p>
                                        )}
                                        {selectedProduct.sellerPhone && (
                                            <p className="text-emerald-900 font-bold">
                                                📞 {selectedProduct.sellerPhone}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="border-t border-gray-100 pt-4 space-y-1.5">
                            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                                {language === "bn" ? "পণ্যের বিস্তারিত বিবরণ" : "Product Description"}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                {selectedProduct.description || (language === "bn" ? "কোন বিশেষ বিবরণ দেওয়া নেই।" : "No additional description provided.")}
                            </p>
                        </div>
                        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm flex items-center justify-end gap-3 pt-4 border-t border-gray-100 z-10">
                            {selectedProduct.sellerPhone && (
                                <a
                                    href={`tel:${selectedProduct.sellerPhone}`}
                                    className="rounded-xl border border-emerald-600 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800 shadow-xs hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                                >
                                    📞 {language === "bn" ? "বিক্রেতাকে কল করুন" : "Call Seller"}
                                </a>
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    addToCart(selectedProduct);
                                    setSelectedProduct(null);
                                }}
                                className="cursor-pointer rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-colors"
                            >
                                {t("addToCart")}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
