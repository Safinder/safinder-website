"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Users,
  MessageCircle,
  Sparkles,
  Download,
  Smartphone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LanguageSelector } from "@/components/language-selector";
import {
  translations,
  type Language,
  type TranslationKey,
} from "@/lib/translations";

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");

  const t = (key: TranslationKey) => translations[currentLanguage][key];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-orange-50">
      {/* Header */}
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

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-yellow-500 to-pink-600 bg-clip-text text-transparent leading-tight">
                  {t("heroTitle")}
                </h1>
                <p className="text-xl md:text-2xl text-pink-700 mb-8 leading-relaxed">
                  {t("heroDescription")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  <svg
                    className="mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.9389 0.18598C16.4702 0.102408 16.9725 0.454097 17.0757 0.981975C17.2725 2.31354 17.3264 3.7032 16.8963 4.99818C17.2323 5.03578 17.587 5.11567 17.961 5.24909C19.6655 5.85718 20.6768 7.22288 21.2493 8.61139C21.385 8.94043 21.3355 9.31677 21.1195 9.5996C20.9034 9.88243 20.5533 10.0291 20.2002 9.98476C18.8395 9.81385 18 11.2888 18 12.4723C18 13.6663 18.8616 15.1578 20.2343 14.9551C20.5813 14.9039 20.9298 15.0383 21.1526 15.3092C21.3755 15.5801 21.4401 15.9479 21.3228 16.2786C20.4042 18.8697 18.6123 21.3691 16.5131 22.6239C15.8866 22.9983 15.2619 23.0364 14.6928 22.8996C14.2283 22.7879 13.8054 22.5607 13.3896 22.3325C12.7985 22.0087 12.4181 21.8215 12 21.8215C11.5819 21.8215 11.2015 22.0087 10.6104 22.3325C10.1946 22.5607 9.77173 22.7879 9.30716 22.8996C8.73813 23.0364 8.11336 22.9983 7.48692 22.6239C5.94833 21.7042 4.58791 20.1238 3.61563 18.3615C2.64111 16.5951 2 14.5441 2 12.6156C2 11.4859 2.18364 9.98182 2.75469 8.60172C3.3278 7.21662 4.33844 5.85577 6.03899 5.24909C8.01136 4.54543 9.44668 5.33051 10.4392 5.95795C10.452 5.00574 10.6115 3.69261 11.3364 2.6573C12.34 1.22403 14.2513 0.452307 15.9389 0.18598ZM6.71101 7.13281C7.86767 6.72016 8.60885 7.15971 9.62114 7.80866C10.3434 8.27332 11.1111 8.74136 12 8.74136C12.8889 8.74136 13.6566 8.27331 14.3789 7.80866C15.3911 7.15972 16.1323 6.72017 17.289 7.13281C17.8735 7.34135 18.349 7.71032 18.7314 8.19753C17.0785 8.80977 16 10.5855 16 12.4723C16 14.435 17.167 16.2775 18.9336 16.8152C18.0714 18.5969 16 20.7925 15.4869 20.9072C15.0892 20.9961 14.6435 20.739 14.3506 20.5786C13.6174 20.1761 12.8553 19.8215 12 19.8215C11.0276 19.8215 10.2323 20.2584 9.70567 20.5477C9.39395 20.7188 8.88337 21.1285 8.51308 20.9072C7.36157 20.2189 6.22198 18.9454 5.36679 17.3954C4.51384 15.8493 4 14.1294 4 12.6156C4 11.6677 4.1588 10.4393 4.60273 9.36639C5.04459 8.2985 5.72146 7.48584 6.71101 7.13281ZM14.6893 5.005C14.1791 5.73362 13.2659 6.12202 12.4439 6.38708C12.4119 5.52406 12.4645 4.53307 12.9747 3.80445C13.4849 3.07582 14.3981 2.68742 15.22 2.42236C15.2521 3.28539 15.1995 4.27637 14.6893 5.005Z"
                        fill="#ffffff"
                      ></path>{" "}
                    </g>
                  </svg>
                  {t("soonIOS")}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-pink-400 text-pink-600 hover:bg-pink-50 px-8 py-4 text-lg rounded-full bg-transparent"
                >
                  <Smartphone className="mr-2 h-5 w-5" />
                  {t("soonAndroid")}
                </Button>
              </div>

              {/* Stats or additional info */}
              <div className="flex flex-wrap gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600">100%</div>
                  <div className="text-pink-500 text-sm">
                    {t("madeByWomen")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">95%</div>
                  <div className="text-yellow-500 text-sm">
                    {t("matchSuccess")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">Safe</div>
                  <div className="text-orange-500 text-sm">
                    {t("safeCommunity")}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - App screenshot */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <Image
                  src="/hero-section.png"
                  alt="Safinder App Screenshot"
                  width={500}
                  height={800}
                />
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 bg-white/60 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-pink-600 to-yellow-600 bg-clip-text text-transparent">
            {t("whySafinder")}
          </h2>
          <p className="text-xl text-pink-700 text-center mb-16 max-w-2xl mx-auto">
            {t("whySafinderDesc")}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-pink-700 mb-4">
                  {t("weeklyQuestions")}
                </h3>
                <p className="text-pink-600 leading-relaxed">
                  {t("weeklyQuestionsDesc")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-yellow-700 mb-4">
                  {t("smartMatching")}
                </h3>
                <p className="text-yellow-600 leading-relaxed">
                  {t("smartMatchingDesc")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-orange-700 mb-4">
                  {t("safeCommunity")}
                </h3>
                <p className="text-orange-600 leading-relaxed">
                  {t("safeCommunityDesc")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 bg-gradient-to-r from-pink-600 to-yellow-600 bg-clip-text text-transparent">
            {t("howItWorksTitle")}
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold text-pink-700 mb-4">
                {t("step1Title")}
              </h3>
              <p className="text-pink-600 leading-relaxed">{t("step1Desc")}</p>
            </div>

            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold text-yellow-700 mb-4">
                {t("step2Title")}
              </h3>
              <p className="text-yellow-600 leading-relaxed">
                {t("step2Desc")}
              </p>
            </div>

            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold text-orange-700 mb-4">
                {t("step3Title")}
              </h3>
              <p className="text-orange-600 leading-relaxed">
                {t("step3Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-100 via-yellow-100 to-pink-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16 bg-gradient-to-r from-pink-600 to-yellow-600 bg-clip-text text-transparent">
            {t("loveStories")}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200">
              <CardContent className="p-10">
                <p className="text-pink-700 mb-6 italic text-lg leading-relaxed">
                  "{t("testimonial1")}"
                </p>
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">A</span>
                  </div>
                  <div>
                    <p className="font-bold text-pink-700">Alex, 26</p>
                    <p className="text-pink-600 text-sm">Barcelona</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 border-yellow-200">
              <CardContent className="p-10">
                <p className="text-yellow-700 mb-6 italic text-lg leading-relaxed">
                  "{t("testimonial2")}"
                </p>
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mr-4 mt-8">
                    <span className="text-white font-bold">S</span>
                  </div>
                  <div>
                    <p className="mt-8 font-bold text-yellow-700">Sofia, 22</p>
                    <p className=" text-yellow-600 text-sm">Bilbao</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 border-orange-200">
              <CardContent className="p-8">
                <p className="text-orange-700 mb-6 italic text-lg leading-relaxed">
                  "{t("testimonial3")}"
                </p>
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mr-4 mt-2">
                    <span className="text-white font-bold">L</span>
                  </div>
                  <div>
                    <p className="mt-3 font-bold text-orange-700">Laura, 27</p>
                    <p className="text-orange-600 text-sm">Madrid</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-pink-500 via-pink-400 to-yellow-400 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t("readyTitle")}
          </h2>
          <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
            {t("readyDesc")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-pink-600 hover:bg-pink-50 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <Download className="mr-2 h-5 w-5" />
              {t("downloadSoon")}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-pink-900 text-pink-100 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Image
              src="/logo.png"
              alt="Safinder logo"
              width={100}
              height={100}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              {currentLanguage === "en"
                ? "Home"
                : currentLanguage === "es"
                ? "Inicio"
                : "Home"}
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              {currentLanguage === "en"
                ? "Privacy Policy"
                : currentLanguage === "es"
                ? "Política de Privacidad"
                : "Privacybeleid"}
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              {currentLanguage === "en"
                ? "Terms & Conditions"
                : currentLanguage === "es"
                ? "Términos y Condiciones"
                : "Algemene Voorwaarden"}
            </Link>
            <Link
              href="/privacy/#contact"
              className="hover:text-white transition-colors"
            >
              {currentLanguage === "en"
                ? "Contact"
                : currentLanguage === "es"
                ? "Contacto"
                : "Contact"}
            </Link>
          </div>

          <p className="text-pink-300">
            © 2025 Safinder.{" "}
            {currentLanguage === "en"
              ? "Made with 💖 for the sapphic community."
              : currentLanguage === "es"
              ? "Hecho con 💖 para la comunidad sáfica."
              : "Gemaakt met 💖 voor de saffische gemeenschap."}
          </p>
        </div>
      </footer>
    </div>
  );
}
