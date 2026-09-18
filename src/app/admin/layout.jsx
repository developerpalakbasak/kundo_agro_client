import { AuthProvider } from "@/context/AuthContext";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import "../globals.css";

export const metadata = {
  title: "Admin Panel | Kundu Agro & Fisheries",
  description: "Management system for Kundu Agro & Fisheries",
};

export default function AdminRootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full font-sans">
        <AuthProvider>
          <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}



<>


</>