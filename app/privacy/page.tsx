"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, Users, Cookie } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import type { Language } from "@/lib/translations";

const cookiesContent = {
  en: {
    title: "Safinder Cookie Policy",
    lastUpdated: "Last updated: July, 2025",
    intro:
      "At Safinder, we use cookies to improve user experience and ensure the proper functioning of the platform. This policy explains what cookies we use, what they are for, and how you can manage them.",
    sections: [
      {
        title: "1. What are cookies?",
        content:
          "Cookies are small files that are stored on your device (mobile, tablet or computer) when you use our app. They allow us to recognize your device, remember your preferences and facilitate your navigation.",
      },
      {
        title: "2. Types of cookies we use",
        content:
          "At Safinder we use different types of cookies, each with a specific purpose:\n\n- Essential cookies: These are necessary for the basic functioning of the app, such as logging in or accessing certain secure functions.\n- Personalization cookies: They allow us to remember your preferences, such as language or your approximate location, to offer you a more adapted experience.\n- Analytical cookies: They help us understand how users interact with the app, detect errors and improve our services.\n- Third-party cookies: Some services we use, such as analytics tools or push notifications, may install their own cookies. These cookies are managed by third parties and have their own privacy policies.",
      },
      {
        title: "3. Why do we use cookies?",
        content:
          "- So you can log in and use the app normally.\n- To remember your preferences (language, location, settings).\n- To analyze app usage and improve features.\n- To prevent fraud or abusive use.",
      },
      {
        title: "4. Can I disable them?",
        content:
          "Yes. You can accept, reject or configure your cookies from the consent banner when you first enter, or change them at any time from the Cookie Settings section of the app or your browser.\n\nIf you disable essential cookies, the app may not work properly.",
      },
      {
        title: "5. Third-party cookies",
        content:
          "We use tools such as:\n- Google Analytics: to analyze app usage.\n- Firebase: for error control and performance.\n- OneSignal or similar: for push notifications.\n\nThese providers could make international transfers. In all cases, we guarantee that they comply with adequate protection measures.",
      },
      {
        title: "6. Changes to this Policy",
        content:
          "We may update this policy at any time. We will notify you if significant changes are made.",
      },
    ],
  },
  es: {
    title: "Política de Cookies de Safinder",
    lastUpdated: "Última actualización: 9 de julio 2025",
    intro:
      "En Safinder, utilizamos cookies para mejorar la experiencia de las usuarias y garantizar el buen funcionamiento de la plataforma. Esta política explica qué cookies usamos, para qué sirven y cómo puedes gestionarlas.",
    sections: [
      {
        title: "1. ¿Qué son las cookies?",
        content:
          "Las cookies son pequeños archivos que se almacenan en tu dispositivo (móvil, tablet u ordenador) cuando utilizas nuestra app. Permiten reconocer tu dispositivo, recordar tus preferencias y facilitar tu navegación.",
      },
      {
        title: "2. Tipos de cookies que utilizamos",
        content:
          "En Safinder utilizamos diferentes tipos de cookies, cada una con una finalidad concreta:\n\n- Cookies esenciales: Son necesarias para el funcionamiento básico de la app, como iniciar sesión o acceder a ciertas funciones seguras.\n- Cookies de personalización: Permiten recordar tus preferencias, como el idioma o tu ubicación aproximada, para ofrecerte una experiencia más adaptada.\n- Cookies analíticas: Nos ayudan a comprender cómo interactúan las usuarias con la app, detectar errores y mejorar nuestros servicios.\n- Cookies de terceros: Algunos servicios que utilizamos, como herramientas de análisis o notificaciones push, pueden instalar sus propias cookies. Estas cookies están gestionadas por terceros y tienen sus propias políticas de privacidad.",
      },
      {
        title: "3. ¿Por qué usamos cookies?",
        content:
          "- Para que puedas iniciar sesión y usar la app con normalidad.\n- Para recordar tus preferencias (idioma, ubicación, ajustes).\n- Para analizar el uso de la app y mejorar funciones.\n- Para evitar fraudes o usos abusivos.",
      },
      {
        title: "4. ¿Puedo desactivarlas?",
        content:
          "Sí. Puedes aceptar, rechazar o configurar tus cookies desde el banner de consentimiento cuando entras por primera vez, o cambiarlas en cualquier momento desde la sección de Configuración de Cookies de la app o tu navegador.\n\nSi desactivas las cookies esenciales, es posible que la app no funcione correctamente.",
      },
      {
        title: "5. Cookies de terceros",
        content:
          "Usamos herramientas como:\n- Google Analytics: para analizar el uso de la app.\n- Firebase: para control de errores y rendimiento.\n- OneSignal o similares: para notificaciones push.\n\nEstos proveedores podrían realizar transferencias internacionales. En todos los casos, garantizamos que cumplen con las medidas adecuadas de protección.",
      },
      {
        title: "6. Cambios en esta Política",
        content:
          "Podemos actualizar esta política en cualquier momento. Te avisaremos si se realizan cambios importantes.",
      },
    ],
  },
  nl: {
    title: "Safinder Cookie Beleid",
    lastUpdated: "Laatst bijgewerkt: 9 juli 2025",
    intro:
      "Bij Safinder gebruiken we cookies om de gebruikerservaring te verbeteren en de goede werking van het platform te garanderen. Dit beleid legt uit welke cookies we gebruiken, waarvoor ze dienen en hoe je ze kunt beheren.",
    sections: [
      {
        title: "1. Wat zijn cookies?",
        content:
          "Cookies zijn kleine bestanden die worden opgeslagen op je apparaat (mobiel, tablet of computer) wanneer je onze app gebruikt. Ze stellen ons in staat je apparaat te herkennen, je voorkeuren te onthouden en je navigatie te vergemakkelijken.",
      },
      {
        title: "2. Soorten cookies die we gebruiken",
        content:
          "Bij Safinder gebruiken we verschillende soorten cookies, elk met een specifiek doel:\n\n- Essentiële cookies: Deze zijn noodzakelijk voor de basisfunctionaliteit van de app, zoals inloggen of toegang tot bepaalde beveiligde functies.\n- Personalisatie cookies: Ze stellen ons in staat je voorkeuren te onthouden, zoals taal of je geschatte locatie, om je een meer aangepaste ervaring te bieden.\n- Analytische cookies: Ze helpen ons begrijpen hoe gebruikers interacteren met de app, fouten detecteren en onze diensten verbeteren.\n- Cookies van derden: Sommige diensten die we gebruiken, zoals analysetools of push-notificaties, kunnen hun eigen cookies installeren. Deze cookies worden beheerd door derden en hebben hun eigen privacybeleid.",
      },
      {
        title: "3. Waarom gebruiken we cookies?",
        content:
          "- Zodat je kunt inloggen en de app normaal kunt gebruiken.\n- Om je voorkeuren te onthouden (taal, locatie, instellingen).\n- Om app-gebruik te analyseren en functies te verbeteren.\n- Om fraude of misbruik te voorkomen.",
      },
      {
        title: "4. Kan ik ze uitschakelen?",
        content:
          "Ja. Je kunt cookies accepteren, weigeren of configureren via de toestemmingsbanner wanneer je voor het eerst binnenkomt, of ze op elk moment wijzigen via de Cookie-instellingen sectie van de app of je browser.\n\nAls je essentiële cookies uitschakelt, werkt de app mogelijk niet goed.",
      },
      {
        title: "5. Cookies van derden",
        content:
          "We gebruiken tools zoals:\n- Google Analytics: om app-gebruik te analyseren.\n- Firebase: voor foutcontrole en prestaties.\n- OneSignal of vergelijkbaar: voor push-notificaties.\n\nDeze providers kunnen internationale overdrachten uitvoeren. In alle gevallen garanderen we dat ze voldoen aan adequate beschermingsmaatregelen.",
      },
      {
        title: "6. Wijzigingen in dit Beleid",
        content:
          "We kunnen dit beleid op elk moment bijwerken. We zullen je op de hoogte stellen als er belangrijke wijzigingen worden aangebracht.",
      },
    ],
  },
};

export default function PrivacyPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");

  const content = cookiesContent[currentLanguage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-orange-50">
      <Navbar
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        t={(key) => {
          const value = cookiesContent[currentLanguage][key as keyof typeof cookiesContent[typeof currentLanguage]];
          return typeof value === "string" ? value : key;
        }}
      />

      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <Cookie className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-yellow-500 to-pink-600 bg-clip-text text-transparent">
            {content.title}
          </h1>
          <p className="text-xl text-pink-700 mb-8 max-w-2xl mx-auto">
            {content.intro}
          </p>
          <p className="text-sm text-pink-600 bg-pink-100 rounded-full px-4 py-2 inline-block">
            {content.lastUpdated}
          </p>
        </div>
      </section>

      {/* Privacy Overview Cards */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100">
              <CardContent className="p-6 text-center">
                <Lock className="h-12 w-12 text-pink-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-pink-700 mb-2">
                  {currentLanguage === "en"
                    ? "Data Encryption"
                    : currentLanguage === "es"
                      ? "Encriptación de Datos"
                      : "Data Encryptie"}
                </h3>
                <p className="text-pink-600 text-sm">
                  {currentLanguage === "en"
                    ? "All your data is encrypted and securely stored"
                    : currentLanguage === "es"
                      ? "Todos tus datos están encriptados y almacenados de forma segura"
                      : "Al je data is versleuteld en veilig opgeslagen"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardContent className="p-6 text-center">
                <Eye className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-yellow-700 mb-2">
                  {currentLanguage === "en"
                    ? "No Data Selling"
                    : currentLanguage === "es"
                      ? "No Vendemos Datos"
                      : "Geen Data Verkoop"}
                </h3>
                <p className="text-yellow-600 text-sm">
                  {currentLanguage === "en"
                    ? "We never sell your personal information to third parties"
                    : currentLanguage === "es"
                      ? "Nunca vendemos tu información personal a terceros"
                      : "We verkopen nooit je persoonlijke informatie aan derden"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-orange-700 mb-2">
                  {currentLanguage === "en"
                    ? "Community First"
                    : currentLanguage === "es"
                      ? "Comunidad Primero"
                      : "Gemeenschap Eerst"}
                </h3>
                <p className="text-orange-600 text-sm">
                  {currentLanguage === "en"
                    ? "Built by and for the sapphic community"
                    : currentLanguage === "es"
                      ? "Construido por y para la comunidad sáfica"
                      : "Gebouwd door en voor de saffische gemeenschap"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {content.sections.map((section, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-sm border-2 border-pink-200"
              >
                <CardHeader>
                  <CardTitle className="text-2xl text-pink-700 flex items-center">
                    <Cookie className="h-6 w-6 mr-3" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-pink-700">
                  <div className="text-pink-600 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </CardContent>
              </Card>
            ))}

            <section id="contact">
              <Card className="bg-gradient-to-r from-pink-100 to-yellow-100 border-2 border-pink-300">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-pink-700 mb-4">
                    {currentLanguage === "en"
                      ? "Questions About Privacy?"
                      : currentLanguage === "es"
                        ? "¿Preguntas sobre Privacidad?"
                        : "Vragen over Privacy?"}
                  </h3>
                  <p className="text-pink-600 mb-6 leading-relaxed">
                    {currentLanguage === "en"
                      ? "We're committed to transparency and are here to answer any questions about how we handle your data. Your trust is essential to our community."
                      : currentLanguage === "es"
                        ? "Estamos comprometidas con la transparencia y estamos aquí para responder cualquier pregunta sobre cómo manejamos tus datos. Tu confianza es esencial para nuestra comunidad."
                        : "We zijn toegewijd aan transparantie en zijn hier om vragen te beantwoorden over hoe we je data behandelen. Je vertrouwen is essentieel voor onze gemeenschap."}
                  </p>
                  <a
                    href="mailto:admin@safinder.es"
                    className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-3 rounded-full inline-block transition-all"
                  >
                    {currentLanguage === "en"
                      ? "Contact Privacy Team"
                      : currentLanguage === "es"
                        ? "Contactar Equipo de Privacidad"
                        : "Contact Privacy Team"}
                  </a>
                </CardContent>
              </Card>
            </section>
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
              Safinder
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
