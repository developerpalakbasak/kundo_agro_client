"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../hooks/languageContext";
import { useCart } from "../context/cartContext";

function getCategoryIcon(categoryName) {
    const lower = categoryName.toLowerCase();
    if (lower.includes("seed") || lower.includes("পোনা")) return "🐠";
    if (lower.includes("fish") && (lower.includes("medicine") || lower.includes("chemical"))) return "🧪";
    if (lower.includes("fish")) return "🐟";
    if (lower.includes("dairy") && lower.includes("medicine")) return "💊";
    if (lower.includes("dairy")) return "🥛";
    if (lower.includes("food")) return "🌾";
    if (lower.includes("feed") || lower.includes("material") || lower.includes("raw")) return "🌱";
    if (lower.includes("import")) return "📦";
    return "🏷️";
}

export default function Home({
    featuredProducts,
    latestBlogs,
}) {
    const { t, language } = useLanguage();
    const { addToCart } = useCart();

    // Demo categories for UI preview
    const demoCategories = ["Seeds", "Fish", "Dairy", "Food", "Feed", "Import"];
    const allCategories = demoCategories;

    return (
        <div className="space-y-16 pb-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-20 rounded-3xl mx-4 my-2 shadow-xl border border-emerald-500/20">
                {/* Background Agro & Fisheries Image & Transparent Cinematic Overlay */}
                <div className="absolute inset-0 -z-10">
                    <Image
                        src="/about-hero.jpg"
                        alt="Kundu Agro and Fisheries scenic ponds and farmland"
                        fill
                        priority
                        className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-gray-900/40 to-gray-950/50" />
                </div>

                <div className="mx-auto max-w-6xl px-4 text-center relative z-10">
                    <span className="inline-flex items-center rounded-full bg-black/40 backdrop-blur-md border border-white/20 px-4 py-1.5 text-xs font-bold text-emerald-300 shadow-sm">
                        {t("heroBadge")}
                    </span>
                    <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-5xl max-w-3xl mx-auto leading-tight drop-shadow-lg">
                        {t("heroTitle")}
                    </h1>
                    <p className="mt-4 text-base text-gray-100 max-w-2xl mx-auto leading-relaxed drop-shadow font-medium">
                        {t("heroSubtitle")}
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Link
                            href="/products"
                            className="rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-[1.02] transition-all"
                        >
                            {t("shopNow")}
                        </Link>
                        <Link
                            href="/blogs"
                            className="rounded-xl border border-white/30 bg-black/30 backdrop-blur-md px-6 py-3.5 text-sm font-semibold text-white hover:bg-black/40 hover:scale-[1.02] transition-all"
                        >
                            {t("exploreBlogs")}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="mx-auto max-w-6xl px-4">
                <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-6">
                    {t("featuredCategories")}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {allCategories?.map((cat) => {
                        const count = featuredProducts?.filter(
                            (p) => p.category === cat
                        ).length;
                        const icon = getCategoryIcon(cat);
                        return (
                            <Link
                                key={cat}
                                href={`/products/${encodeURIComponent(cat)}`}
                                className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl group-hover:bg-primary group-hover:text-white transition-colors">
                                    {icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors truncate">
                                        {cat}
                                    </h3>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {count} {count === 1 ? "Product" : "Products"}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Featured Products Grid */}
            <section className="mx-auto max-w-6xl px-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold tracking-tight text-gray-900">
                        {t("latestProducts")}
                    </h2>
                    <Link
                        href="/products"
                        className="text-xs font-semibold text-primary hover:underline"
                    >
                        {t("viewAllProducts")} →
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {(featuredProducts ?? []).slice(0, 6).map((product) => {
                        const productIdentifier = product.slug || product._id || product.id;
                        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
                        const imageUrl = product.thumbnail
                            ? (product.thumbnail.startsWith("http")
                                ? product.thumbnail
                                : `${API_BASE}${product.thumbnail.startsWith("/") ? "" : "/"}${product.thumbnail}`)
                            : "/fish.jpg";

                        return (
                            <div
                                key={productIdentifier}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
                            >
                                <Link
                                    href={`/product/${encodeURIComponent(productIdentifier)}`}
                                    className="relative h-48 w-full overflow-hidden bg-gray-50 block"
                                >
                                    <Image
                                        src={imageUrl}
                                        alt={product.name}
                                        fill
                                        unoptimized
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-gray-700 shadow-sm">
                                        {product.category}
                                    </span>
                                </Link>
                                <div className="flex flex-1 flex-col p-5">
                                    <Link
                                        href={`/product/${encodeURIComponent(productIdentifier)}`}
                                        className="block"
                                    >
                                        <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <p className="mt-1 line-clamp-2 text-xs text-gray-500 flex-1">
                                        {product.description}
                                    </p>
                                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div>
                                            <span className="text-base font-bold text-primary">
                                                ৳{product.price}
                                            </span>
                                            <span className="text-xs text-gray-400 font-normal ml-1">
                                                / {product.unit}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(product);
                                            }}
                                            className="cursor-pointer rounded-xl bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors"
                                        >
                                            {t("addToCart")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="mx-auto max-w-6xl px-4">
                <div className="rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 p-8 sm:p-12 text-white">
                    <h2 className="text-2xl font-bold tracking-tight text-center mb-8">
                        {t("whyChooseUs")}
                    </h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <div className="text-center space-y-2">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                                🛡️
                            </div>
                            <h3 className="text-base font-bold">{t("qualityAssured")}</h3>
                            <p className="text-xs text-gray-400">{t("qualityAssuredDesc")}</p>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                                🚚
                            </div>
                            <h3 className="text-base font-bold">{t("fastDelivery")}</h3>
                            <p className="text-xs text-gray-400">{t("fastDeliveryDesc")}</p>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                                📞
                            </div>
                            <h3 className="text-base font-bold">{t("support247")}</h3>
                            <p className="text-xs text-gray-400">{t("support247Desc")}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
