
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kundu Agro and Fisheries",
  description: "Kundu Agro and Fisheries",
  icons: {
    icon: [
      { url: "/kundu_logo.png", type: "image/png" },
    ],
    shortcut: "/kundu_logo.png",
    apple: "/kundu_logo.png",
  },
};

import { LanguageProvider } from "../../hooks/languageContext";
import { CartProvider } from "@/context/cartContext";
import { CustomerHeader } from "@/components/customer/Navbar";
import { CustomerFooter } from "@/components/customer/Footer";
import { CartDrawer } from "@/components/customer/CartDrawer";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <CartProvider>
            <CustomerHeader />
            <CartDrawer />
            <main className="flex-1 w-full">{children}</main>
            <CustomerFooter />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
