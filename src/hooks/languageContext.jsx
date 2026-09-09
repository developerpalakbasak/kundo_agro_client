"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/lib/translations";


const LanguageContext = createContext();

const LANGUAGE_STORAGE_KEY = "kundu_agro_lang";

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState("en");

  // Sync with localStorage after component mounts (client‑only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === "en" || saved === "bn") {
        setLanguageState(saved);
      }
    }
  }, []);


    const setLanguage = (lang) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  };

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "bn" : "en");
    };

    const t = (key) => {
        const langDict = translations[language] || translations.en;
        return langDict[key] || translations.en[key] || key;
    };

    return (
        <LanguageContext.Provider
        value={{
            language,
            setLanguage,
            toggleLanguage,
            t,
        }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
