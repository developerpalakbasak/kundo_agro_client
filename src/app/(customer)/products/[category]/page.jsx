// @ts-nocheck
"use client";

import { use } from "react";
import { ShopContent } from "@/components/customer/ShopContent";

/**
 * /products/[category] - Pre-filtered product listing by category.
 *
 * The [category] segment is the full category name, URL-encoded.
 * e.g. /products/Fish%20seed%20%2F%20...
 * Next.js automatically decodes params, so params.category === "Fish seed / macher pona"
 *
 * The same backend API (GET /api/v1/products?category=...) is used - no server changes needed.
 */
export default function CategoryProductsPage({ params }) {
    const resolvedParams = use(params);
    const category = decodeURIComponent(resolvedParams.category || "");

    return (
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <ShopContent initialCategory={category || "all"} />
        </div>
    );
}