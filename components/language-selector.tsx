"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import type { Language } from "@/lib/translations";

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSelector({
  currentLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en" as Language, name: "English", flag: "🇺🇸" },
    { code: "es" as Language, name: "Español", flag: "🇪🇸" },
    { code: "nl" as Language, name: "Nederlands", flag: "🇳🇱" },
  ];

  const currentLang = languages.find((lang) => lang.code === currentLanguage);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-pink-700 hover:text-pink-500 transition-colors rounded-lg hover:bg-pink-50"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">{currentLang?.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-pink-200 z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                onLanguageChange(language.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-pink-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                currentLanguage === language.code
                  ? "bg-pink-100 text-pink-700"
                  : "text-gray-700"
              }`}
            >
              <span className="mr-2">{language.flag}</span>
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
