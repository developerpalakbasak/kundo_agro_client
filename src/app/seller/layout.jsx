import { AuthProvider } from "@/context/AuthContext";
import { SellerLayoutWrapper } from "@/components/seller/SellerLayoutWrapper";
import "../globals.css";

export const metadata = {
  title: "Seller Portal | Kundu Agro & Fisheries",
  description: "Fish Seed & Hatchery Management Portal for Kundu Agro & Fisheries",
  icons: {
    icon: [{ url: "/kundu_logo.png", type: "image/png" }],
    shortcut: "/kundu_logo.png",
    apple: "/kundu_logo.png",
  },
};

export default function SellerRootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full font-sans">
        <AuthProvider>
          <SellerLayoutWrapper>{children}</SellerLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
