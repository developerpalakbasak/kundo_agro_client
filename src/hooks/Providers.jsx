"use client";

import { LanguageProvider } from "./languageContext";

export default function Providers({ children }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
