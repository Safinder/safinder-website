"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import type { Language } from "@/lib/translations";

const easiContent = {
  en: {
    title: "Safinder’s Standards Against Child Exploitation and Abuse (EASI)",
    lastUpdated: "Last updated: July 2025",
    intro:
      "Safinder is committed to the absolute protection and safety of all users, especially minors. Our platform operates under a strict zero-tolerance policy for any form of child sexual exploitation and abuse.",
    sections: [
      {
        title: "Our Commitments",
        content: `- Zero tolerance for exploitation and abuse: Any related account is immediately blocked and reported to authorities.
- Active moderation: We use automated tools and human review to detect suspicious behaviors or content.
- Reporting: Users can report inappropriate behavior directly within the app. All reports are reviewed with the highest priority.
- Age verification: Only persons over 18 can register; strict verification mechanisms are in place.
- Law Enforcement: We collaborate with authorities and follow strict protocols for any suspected or reported cases.
- Education: We offer safety resources in the app so all users understand how to protect themselves and others.`
      },
      {
        title: "What You Can Do",
        content: `If you witness or suspect any form of child exploitation or abuse on Safinder:
- Report the user or content through the app’s built-in tool.
- Contact our support team at soporte@safinder.es.`
      },
      {
        title: "Legal Framework",
        content: `Safinder strictly applies national and international legislation regarding the protection of minors and the fight against child sexual exploitation and abuse.`
      },
      {
        title: "Contact",
        content: "For concerns or urgent reports related to child exploitation or abuse, please email us at: soporte@safinder.es"
      }
    ]
  },
  es: {
    title: "Estándares de Safinder contra la Explotación y el Abuso Sexual Infantil (EASI)",
    lastUpdated: "Última actualización: julio 2025",
    intro:
      "Safinder está plenamente comprometida con la protección y seguridad de todas las usuarias, especialmente las menores. Nuestra plataforma opera bajo una política de cero tolerancia ante cualquier forma de explotación o abuso sexual infantil.",
    sections: [
      {
        title: "Nuestros compromisos",
        content: `- Cero tolerancia: Cualquier cuenta involucrada en explotación o abuso es bloqueada inmediatamente y reportada a las autoridades.
- Moderación activa: Utilizamos herramientas automáticas y revisión humana para detectar comportamientos o contenidos sospechosos.
- Reportes: Las usuarias pueden reportar conductas inapropiadas desde la app. Todas las denuncias se revisan con máxima prioridad.
- Verificación de edad: Solo pueden registrarse mayores de 18 años; existen mecanismos de verificación estrictos.
- Colaboración con autoridades: Cooperamos con las autoridades y seguimos protocolos estrictos en cualquier caso sospechoso o denunciado.
- Educación: Proporcionamos recursos y mensajes de seguridad en la app para que todas las usuarias conozcan cómo protegerse y proteger a otras.`
      },
      {
        title: "Qué puedes hacer",
        content: `Si presencias o sospechas cualquier forma de explotación o abuso sexual infantil en Safinder:
- Utiliza la herramienta de reporte integrada en la app.
- O escríbenos a soporte@safinder.es.`
      },
      {
        title: "Marco Legal",
        content: `Safinder aplica estrictamente la legislación nacional e internacional vigente en materia de protección de menores y lucha contra la explotación y el abuso sexual infantil.`
      },
      {
        title: "Contacto",
        content: "Para dudas o denuncias urgentes relacionadas con la explotación o el abuso sexual infantil, escribe a: soporte@safinder.es"
      }
    ]
  },
  nl: {
    title: "Safinder-standaarden tegen kinderuitbuiting en -misbruik (EASI)",
    lastUpdated: "Laatst bijgewerkt: juli 2025",
    intro:
      "Safinder zet zich volledig in voor de bescherming en veiligheid van alle gebruikers, vooral minderjarigen. Ons platform hanteert een streng zerotolerancebeleid tegen elke vorm van seksuele uitbuiting of misbruik van kinderen.",
    sections: [
      {
        title: "Onze toezeggingen",
        content: `- Zerotolerancebeleid: Elke account die betrokken is bij uitbuiting of misbruik wordt direct geblokkeerd en gemeld bij de autoriteiten.
- Actieve moderatie: We gebruiken automatische tools en menselijke controle voor het opsporen van verdachte gedragingen of inhoud.
- Meldingen: Gebruikers kunnen ongepast gedrag melden via de app. Alle meldingen worden met hoogste prioriteit behandeld.
- Leeftijdsverificatie: Alleen personen van 18 jaar en ouder kunnen zich registreren; er gelden strenge verificatiemechanismen.
- Samenwerking met autoriteiten: We werken samen met opsporingsinstanties en volgen strikte protocollen bij verdachte of gemelde gevallen.
- Educatie: We bieden veiligheidsinformatie binnen de app zodat alle gebruikers weten hoe ze zichzelf en anderen kunnen beschermen.`
      },
      {
        title: "Wat jij kunt doen",
        content: `Als je enige vorm van kinderuitbuiting of -misbruik op Safinder vermoedt of waarneemt:
- Gebruik het meldsysteem in de app.
- Of mail ons via soporte@safinder.es.`
      },
      {
        title: "Wettelijk Kader",
        content: `Safinder past strikt de nationale en internationale regelgeving toe betreffende de bescherming van minderjarigen en de bestrijding van seksuele uitbuiting/misbruik van kinderen.`
      },
      {
        title: "Contact",
        content: "Voor vragen of dringende meldingen met betrekking tot kinderuitbuiting of -misbruik: soporte@safinder.es"
      }
    ]
  }
};

export default function EasiStandardsPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("es"); // español por defecto

  const content = easiContent[currentLanguage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-orange-50">
      <Navbar
              currentLanguage={currentLanguage}
              setCurrentLanguage={setCurrentLanguage}
              t={(key) => {
                const value = easiContent[currentLanguage][key as keyof typeof easiContent[typeof currentLanguage]];
                return typeof value === "string" ? value : key;
              }}
            />

      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-yellow-500 to-pink-600 bg-clip-text text-transparent">
            {content.title}
          </h1>
          <p className="text-xl text-pink-700 mb-8">
            {content.intro}
          </p>
          <p className="text-sm text-pink-600 bg-pink-100 rounded-full px-4 py-2 inline-block">
            {content.lastUpdated}
          </p>
        </div>
      </section>
      {/* Sections */}
      <section className="py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {content.sections.map((section, index) => (
            <Card
              key={index}
              className="bg-white/80 backdrop-blur-sm border-2 border-pink-200"
            >
              <CardHeader>
                <CardTitle className="text-xl text-pink-700 flex items-center">
                  <Shield className="h-6 w-6 mr-3" />
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
        </div>
      </section>
      {/* Footer */}
      <footer className="py-12 px-4 bg-pink-900 text-pink-100 mt-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Image src="/logo.png" alt="Safinder logo" width={100} height={100} />
          </div>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Safinder
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
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
            <Link href="/easi-standards" className="hover:text-white transition-colors">
              {currentLanguage === "en"
                ? "EASI Standards"
                : currentLanguage === "es"
                ? "Estándares EASI"
                : "EASI-standaarden"}
            </Link>
            <Link href="/privacy/#contact" className="hover:text-white transition-colors">
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
