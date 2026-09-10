import { AuthProvider } from "@/context/AuthContext";
import "../globals.css";

export const metadata = {
  title: "Admin Panel | Kundu Agro & Fisheries",
  description: "Management system for Kundu Agro & Fisheries",
};

export default function AdminRootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-900 font-sans text-slate-100">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
