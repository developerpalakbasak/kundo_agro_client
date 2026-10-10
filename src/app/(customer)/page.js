import { LanguageProvider } from "@/hooks/languageContext";
import Home from "../../components/Home";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Fallback demo data for preview if backend is unreachable
const fallbackProducts = [
  {
    id: "1",
    _id: "1",
    name: "Sample Seed",
    category: "Seeds",
    thumbnail: "/seed.jpg",
    description: "A demo seed product.",
    price: 120,
    unit: "kg",
  },
  {
    id: "2",
    _id: "2",
    name: "Sample Fish",
    category: "Fish",
    thumbnail: "/fish.jpg",
    description: "A demo fish product.",
    price: 250,
    unit: "kg",
  },
];

async function getLatestProducts() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/products?limit=6&sort=-createdAt`, {
      cache: "no-store",
    });
    if (!res.ok) return fallbackProducts;
    const json = await res.json();
    return json.data && json.data.length > 0 ? json.data : fallbackProducts;
  } catch (error) {
    console.warn("Failed to fetch products from backend, using fallback:", error.message);
    return fallbackProducts;
  }
}

export default async function HomePage() {
  const products = await getLatestProducts();

  return (
    <div>
      <LanguageProvider>
        <Home featuredProducts={products} latestBlogs={[]} />
      </LanguageProvider>
    </div>
  );
}

