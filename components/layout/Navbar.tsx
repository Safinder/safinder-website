"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LanguageSelector } from "@/components/language-selector";
import {
  translations,
  type Language,
  type TranslationKey,
} from "@/lib/translations";

export default function Navbar(
  currentLanguage: Language,
  setCurrentLanguage: (lang: Language) => void,
  t: (key: TranslationKey) => string
) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div>
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-pink-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Safinder logo"
            width={100}
            height={100}
            className="w-32 object-scale-down"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4 lg:gap-6 items-center">
          <Link
            href="/"
            className="text-sm lg:text-base text-pink-700 hover:text-pink-500 transition-colors hover:underline font-bold"
          >
            Safinder
          </Link>
          <Link
            href="/terms"
            className="text-sm lg:text-base hover:underline font-bold text-pink-700 hover:text-pink-500 transition-colors"
          >
            {currentLanguage === "en"
              ? "Terms and Conditions"
              : currentLanguage === "es"
              ? "Términos y Condiciones"
              : "Algemene Voorwaarden"}
          </Link>
          <Link
            href="/privacy"
            className="text-sm lg:text-base hover:underline font-bold text-pink-700 hover:text-pink-500 transition-colors"
          >
            {currentLanguage === "en"
              ? "Privacy Policy"
              : currentLanguage === "es"
              ? "Política de Privacidad"
              : "Privacybeleid"}
          </Link>
          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
          />
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-pink-700 hover:text-pink-500 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </header>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40">
          <div className="bg-white/95 w-full backdrop-blur-sm mt-16 p-6 rounded-b-2xl shadow-xl">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-lg text-pink-700 hover:text-pink-500 transition-colors font-bold py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Safinder
              </Link>
              <Link
                href="/terms"
                className="text-lg text-pink-700 hover:text-pink-500 transition-colors font-bold py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {currentLanguage === "en"
                  ? "Terms and Conditions"
                  : currentLanguage === "es"
                  ? "Términos y Condiciones"
                  : "Algemene Voorwaarden"}
              </Link>
              <Link
                href="/privacy"
                className="text-lg text-pink-700 hover:text-pink-500 transition-colors font-bold py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {currentLanguage === "en"
                  ? "Privacy Policy"
                  : currentLanguage === "es"
                  ? "Política de Privacidad"
                  : "Privacybeleid"}
              </Link>
              <div className="pt-2">
                <LanguageSelector
                  currentLanguage={currentLanguage}
                  onLanguageChange={setCurrentLanguage}
                />
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
