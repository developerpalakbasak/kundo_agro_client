import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailsActions } from "./ProductDetailsActions";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function getProduct(idOrSlug) {
  try {
    const res = await fetch(`${API_BASE}/api/v1/products/${encodeURIComponent(idOrSlug)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { idOrSlug } = await params;
  const product = await getProduct(idOrSlug);

  if (!product) {
    return {
      title: "Product Not Found | Kundu Agro & Fisheries",
    };
  }

  const title = `${product.name} | Kundu Agro & Fisheries`;
  const description =
    product.description?.slice(0, 160) ||
    "Order quality fresh fish, fish seeds, and agro products from Kundu Agro & Fisheries.";
  
  const imageUrl = product.thumbnail?.startsWith("http")
    ? product.thumbnail
    : `${API_BASE}${product.thumbnail?.startsWith("/") ? "" : "/"}${product.thumbnail}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { idOrSlug } = await params;
  const product = await getProduct(idOrSlug);

  if (!product) {
    notFound();
  }

  const isFishSeed = product.category === "Fish seed / মাছের পোনা";
  const imageUrl = product.thumbnail
    ? (product.thumbnail.startsWith("http")
        ? product.thumbnail
        : `${API_BASE}${product.thumbnail.startsWith("/") ? "" : "/"}${product.thumbnail}`)
    : "/fish.jpg";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center space-x-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary transition-colors">
          Products
        </Link>
        <span>/</span>
        <Link
          href={`/products/${encodeURIComponent(product.category)}`}
          className="hover:text-primary transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm">
        {/* Left: Product Images */}
        <div className="space-y-4">
          <div className="relative h-96 sm:h-[450px] w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              unoptimized
              priority
              className="object-cover object-center"
            />
            {isFishSeed && (
              <span className="absolute top-4 left-4 rounded-xl bg-emerald-600/95 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                🐟 Fish Seed
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Details & Actions */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              {product.category}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {product.name}
            </h1>

            {/* Price section */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-black text-primary">
                ৳{product.price}
              </span>
              <span className="text-sm font-semibold text-gray-500">
                / {product.unit || "piece"}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ৳{product.compareAtPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                Description / বিবরণ
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Seller info if available */}
            {(product.sellerName || product.sellerDistrict) && (
              <div className="rounded-2xl bg-emerald-50/70 p-4 border border-emerald-100 space-y-2 mt-4">
                <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Seller Information / বিক্রেতার তথ্য
                </h3>
                <div className="text-sm text-emerald-900 space-y-1">
                  {product.sellerName && (
                    <p className="flex items-center gap-2">
                      <span>👨‍🌾</span>
                      <span className="font-semibold">{product.sellerName}</span>
                    </p>
                  )}
                  {product.sellerDistrict && (
                    <p className="flex items-center gap-2 text-xs">
                      <span>📍</span>
                      <span>District: {product.sellerDistrict}</span>
                    </p>
                  )}
                  {product.sellerPhone && (
                    <p className="flex items-center gap-2 text-xs font-semibold">
                      <span>📞</span>
                      <a href={`tel:${product.sellerPhone}`} className="hover:underline">
                        {product.sellerPhone}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Client Actions (Quantity, Add to Cart, Call) */}
          <div className="pt-6 mt-6 border-t border-gray-100">
            <ProductDetailsActions product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
