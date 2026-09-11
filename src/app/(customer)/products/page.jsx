// @ts-nocheck
"use client";

import { ShopContent } from "@/components/customer/ShopContent";

/**
 * /products - All products (no category filter)
 */
export default function ProductsPage() {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <ShopContent initialCategory="all" />
        </div>
    );
}