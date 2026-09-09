import { LanguageProvider } from "@/hooks/languageContext";
import Home from "../../components/Home";

// Demo data for preview – replace with real API data later
const demoProducts = [
  {
    id: "1",
    name: "Sample Seed",
    category: "Seeds",
    thumbnail: "/seed.jpg",
    description: "A demo seed product.",
    price: 120,
    unit: "kg",
  },
  {
    id: "2",
    name: "Sample Fish",
    category: "Fish",
    thumbnail: "/fish.jpg",
    description: "A demo fish product.",
    price: 250,
    unit: "kg",
  },
];

export default function HomePage() {
  return (
    <div>
      <LanguageProvider>
        <Home featuredProducts={demoProducts} latestBlogs={[]} />

      </LanguageProvider>
    </div>
  );
}
