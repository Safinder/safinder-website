"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Users, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { LanguageSelector } from "@/components/language-selector";
import Navbar from "@/components/layout/Navbar";
import type { Language } from "@/lib/translations";

const termsContent = {
  en: {
    title: "Terms and Conditions of Use of Safinder",
    lastUpdated: "Last updated: July, 2025",
    intro:
      "This document regulates the use of the Safinder application, a dating and friendship app designed exclusively for girls from the sapphic and LGBTQ+ community. By registering and using our app, you accept these Terms and Conditions.",
    sections: [
      {
        title: "1. Purpose of the App",
        content:
          "Safinder allows sapphic girls (lesbians, bisexuals, pansexuals, queer, etc.) to meet other like-minded people for friendship or dating in a safe and inclusive environment.",
      },
      {
        title: "2. Minimum Age",
        content:
          "Only people over 18 years of age can register. Any account that violates this rule will be deleted.",
      },
      {
        title: "3. Registration and Account",
        content:
          "To use the app, you must:\n- Provide truthful and updated information.\n- Not impersonate other people.\n- Use only one account per person.\n- Keep your login credentials secure.",
      },
      {
        title: "4. Acceptable Use",
        content:
          "Users agree to:\n- Treat other users with respect and kindness.\n- Not share inappropriate, offensive or discriminatory content.\n- Not use the app for commercial purposes without authorization.\n- Report inappropriate behavior.",
      },
      {
        title: "5. Prohibited Content",
        content:
          "The following is strictly prohibited:\n- Hate speech or discrimination.\n- Sexual or explicit content without consent.\n- Harassment or bullying.\n- Spam or unsolicited advertising.\n- Content that violates intellectual property rights.",
      },
      {
        title: "6. Privacy and Data Protection",
        content:
          "Your privacy is fundamental to us. Please review our Privacy Policy to understand how we collect, use and protect your personal information.",
      },
      {
        title: "7. Intellectual Property",
        content:
          "All content, design, logos and functionality of Safinder are the property of the company and are protected by intellectual property laws.",
      },
      {
        title: "8. Limitation of Liability",
        content:
          "Safinder is not responsible for:\n- Interactions between users outside the app.\n- Technical problems or service interruptions.\n- Loss of data due to technical failures.\n- Actions of third parties.",
      },
      {
        title: "9. Account Suspension or Termination",
        content:
          "We reserve the right to suspend or terminate accounts that:\n- Violate these terms and conditions.\n- Engage in inappropriate behavior.\n- Provide false information.\n- Use the app for illegal purposes.",
      },
      {
        title: "10. Changes to Terms",
        content:
          "We may modify these terms at any time. Significant changes will be notified through the app or by email.",
      },
      {
        title: "11. Applicable Law",
        content:
          "These terms are governed by Spanish law. Any dispute will be resolved in the competent courts of Spain.",
      },
      {
        title: "12. Contact",
        content:
          "For questions about these terms, contact us at: soporte@safinder.es",
      },
    ],
  },
  es: {
    title: "Términos y Condiciones de Uso de Safinder",
    lastUpdated: "Última actualización: 9 de julio de 2025",
    intro:
      "Este documento regula el uso de la aplicación Safinder, una app de citas y amistades diseñada exclusivamente para chicas del colectivo sáfico y LGTBQ+. Al registrarte y usar nuestra app, aceptas estos Términos y Condiciones.",
    sections: [
      {
        title: "1. Objeto de la App",
        content:
          "Safinder permite a chicas sáficas (lesbianas, bisexuales, pansexuales, queer, etc.) conocer a otras personas afines con fines de amistad o citas en un entorno seguro e inclusivo.",
      },
      {
        title: "2. Edad mínima",
        content:
          "Solo pueden registrarse personas mayores de 18 años. Cualquier cuenta que incumpla esta norma será eliminada.",
      },
      {
        title: "3. Registro y cuenta",
        content:
          "Para usar la app, debes:\n- Proporcionar información veraz y actualizada.\n- No suplantar a otras personas.\n- Usar solo una cuenta por persona.\n- Mantener seguras tus credenciales de acceso.",
      },
      {
        title: "4. Uso aceptable",
        content:
          "Las usuarias se comprometen a:\n- Tratar a otras usuarias con respeto y amabilidad.\n- No compartir contenido inapropiado, ofensivo o discriminatorio.\n- No usar la app con fines comerciales sin autorización.\n- Reportar comportamientos inapropiados.",
      },
      {
        title: "5. Contenido prohibido",
        content:
          "Está estrictamente prohibido:\n- Discurso de odio o discriminación.\n- Contenido sexual o explícito sin consentimiento.\n- Acoso o bullying.\n- Spam o publicidad no solicitada.\n- Contenido que viole derechos de propiedad intelectual.",
      },
      {
        title: "6. Privacidad y protección de datos",
        content:
          "Tu privacidad es fundamental para nosotras. Revisa nuestra Política de Privacidad para entender cómo recopilamos, usamos y protegemos tu información personal.",
      },
      {
        title: "7. Propiedad intelectual",
        content:
          "Todo el contenido, diseño, logos y funcionalidad de Safinder son propiedad de la empresa y están protegidos por las leyes de propiedad intelectual.",
      },
      {
        title: "8. Limitación de responsabilidad",
        content:
          "Safinder no se hace responsable de:\n- Interacciones entre usuarias fuera de la app.\n- Problemas técnicos o interrupciones del servicio.\n- Pérdida de datos por fallos técnicos.\n- Acciones de terceros.",
      },
      {
        title: "9. Suspensión o terminación de cuenta",
        content:
          "Nos reservamos el derecho de suspender o terminar cuentas que:\n- Violen estos términos y condiciones.\n- Tengan comportamientos inapropiados.\n- Proporcionen información falsa.\n- Usen la app para fines ilegales.",
      },
      {
        title: "10. Cambios en los términos",
        content:
          "Podemos modificar estos términos en cualquier momento. Los cambios significativos serán notificados a través de la app o por email.",
      },
      {
        title: "11. Ley aplicable",
        content:
          "Estos términos se rigen por la ley española. Cualquier disputa se resolverá en los tribunales competentes de España.",
      },
      {
        title: "12. Contacto",
        content:
          "Para preguntas sobre estos términos, contáctanos en: soporte@safinder.es",
      },
    ],
  },
  nl: {
    title: "Algemene Voorwaarden voor het Gebruik van Safinder",
    lastUpdated: "Laatst bijgewerkt: 9 juli 2025",
    intro:
      "Dit document regelt het gebruik van de Safinder applicatie, een dating en vriendschap app exclusief ontworpen voor meisjes uit de saffische en LGBTQ+ gemeenschap. Door je te registreren en onze app te gebruiken, accepteer je deze Algemene Voorwaarden.",
    sections: [
      {
        title: "1. Doel van de App",
        content:
          "Safinder stelt saffische meisjes (lesbiennes, biseksuelen, panseksuelen, queer, etc.) in staat om andere gelijkgestemde mensen te ontmoeten voor vriendschap of dating in een veilige en inclusieve omgeving.",
      },
      {
        title: "2. Minimumleeftijd",
        content:
          "Alleen personen ouder dan 18 jaar kunnen zich registreren. Elk account dat deze regel overtreedt zal worden verwijderd.",
      },
      {
        title: "3. Registratie en Account",
        content:
          "Om de app te gebruiken, moet je:\n- Waarheidsgetrouwe en actuele informatie verstrekken.\n- Geen andere personen imiteren.\n- Slechts één account per persoon gebruiken.\n- Je inloggegevens veilig houden.",
      },
      {
        title: "4. Acceptabel Gebruik",
        content:
          "Gebruikers stemmen ermee in om:\n- Andere gebruikers met respect en vriendelijkheid te behandelen.\n- Geen ongepaste, beledigende of discriminerende content te delen.\n- De app niet voor commerciële doeleinden te gebruiken zonder toestemming.\n- Ongepast gedrag te rapporteren.",
      },
      {
        title: "5. Verboden Content",
        content:
          "Het volgende is strikt verboden:\n- Haatspraak of discriminatie.\n- Seksuele of expliciete content zonder toestemming.\n- Intimidatie of pesten.\n- Spam of ongevraagde reclame.\n- Content die intellectuele eigendomsrechten schendt.",
      },
      {
        title: "6. Privacy en Gegevensbescherming",
        content:
          "Je privacy is fundamenteel voor ons. Bekijk ons Privacybeleid om te begrijpen hoe we je persoonlijke informatie verzamelen, gebruiken en beschermen.",
      },
      {
        title: "7. Intellectueel Eigendom",
        content:
          "Alle content, ontwerp, logo's en functionaliteit van Safinder zijn eigendom van het bedrijf en worden beschermd door intellectuele eigendomswetten.",
      },
      {
        title: "8. Beperking van Aansprakelijkheid",
        content:
          "Safinder is niet verantwoordelijk voor:\n- Interacties tussen gebruikers buiten de app.\n- Technische problemen of service-onderbrekingen.\n- Gegevensverlies door technische storingen.\n- Acties van derden.",
      },
      {
        title: "9. Account Opschorting of Beëindiging",
        content:
          "We behouden ons het recht voor om accounts op te schorten of te beëindigen die:\n- Deze algemene voorwaarden overtreden.\n- Ongepast gedrag vertonen.\n- Valse informatie verstrekken.\n- De app gebruiken voor illegale doeleinden.",
      },
      {
        title: "10. Wijzigingen in Voorwaarden",
        content:
          "We kunnen deze voorwaarden op elk moment wijzigen. Significante wijzigingen zullen worden gemeld via de app of per e-mail.",
      },
      {
        title: "11. Toepasselijk Recht",
        content:
          "Deze voorwaarden worden beheerst door Spaans recht. Elk geschil zal worden opgelost in de bevoegde rechtbanken van Spanje.",
      },
      {
        title: "12. Contact",
        content:
          "Voor vragen over deze voorwaarden, neem contact met ons op via: soporte@safinder.es",
      },
    ],
  },
};

export default function TermsPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");

  const content = termsContent[currentLanguage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-orange-50">
      <Navbar
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        t={(key) => {
          const value = termsContent[currentLanguage][key as keyof typeof termsContent[typeof currentLanguage]];
          return typeof value === "string" ? value : key;
        }}
      />


      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <FileText className="h-10 w-10 text-white" />
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

      {/* Terms Overview Cards */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-pink-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-pink-700 mb-2">
                  {currentLanguage === "en"
                    ? "Safe Environment"
                    : currentLanguage === "es"
                      ? "Entorno Seguro"
                      : "Veilige Omgeving"}
                </h3>
                <p className="text-pink-600 text-sm">
                  {currentLanguage === "en"
                    ? "Clear rules for a respectful community"
                    : currentLanguage === "es"
                      ? "Reglas claras para una comunidad respetuosa"
                      : "Duidelijke regels voor een respectvolle gemeenschap"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-yellow-700 mb-2">
                  {currentLanguage === "en"
                    ? "Community Guidelines"
                    : currentLanguage === "es"
                      ? "Normas Comunitarias"
                      : "Gemeenschapsrichtlijnen"}
                </h3>
                <p className="text-yellow-600 text-sm">
                  {currentLanguage === "en"
                    ? "Standards for positive interactions"
                    : currentLanguage === "es"
                      ? "Estándares para interacciones positivas"
                      : "Standaarden voor positieve interacties"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-orange-700 mb-2">
                  {currentLanguage === "en"
                    ? "Your Responsibilities"
                    : currentLanguage === "es"
                      ? "Tus Responsabilidades"
                      : "Jouw Verantwoordelijkheden"}
                </h3>
                <p className="text-orange-600 text-sm">
                  {currentLanguage === "en"
                    ? "What we expect from our users"
                    : currentLanguage === "es"
                      ? "Lo que esperamos de nuestras usuarias"
                      : "Wat we verwachten van onze gebruikers"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto ">
          <div className="space-y-8">
            {content.sections.map((section, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-sm border-2 border-pink-200"
              >
                <CardHeader>
                  <CardTitle className="text-2xl text-pink-700 flex items-center">
                    <FileText className="h-6 w-6 mr-3" />
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

            <Card className="bg-gradient-to-r from-pink-100 to-yellow-100 border-2 border-pink-300">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-pink-700 mb-4">
                  {currentLanguage === "en"
                    ? "Questions About These Terms?"
                    : currentLanguage === "es"
                      ? "¿Preguntas sobre estos Términos?"
                      : "Vragen over deze Voorwaarden?"}
                </h3>
                <p className="text-pink-600 mb-6 leading-relaxed">
                  {currentLanguage === "en"
                    ? "If you have any questions about these terms and conditions, please don't hesitate to contact us. We're here to help!"
                    : currentLanguage === "es"
                      ? "Si tienes alguna pregunta sobre estos términos y condiciones, no dudes en contactarnos. ¡Estamos aquí para ayudar!"
                      : "Als je vragen hebt over deze algemene voorwaarden, aarzel dan niet om contact met ons op te nemen. We zijn er om te helpen!"}
                </p>
                <a
                  href="mailto:soporte@safinder.es"
                  className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-3 rounded-full inline-block transition-all"
                >
                  {currentLanguage === "en"
                    ? "Contact Support"
                    : currentLanguage === "es"
                      ? "Contactar Soporte"
                      : "Contact Ondersteuning"}
                </a>
              </CardContent>
            </Card>
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
