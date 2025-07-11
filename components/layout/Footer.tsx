import Image from "next/image";
import Link from "next/link";

export default function Footer(
  currentLanguage: string,
) {
  return (
    <footer className="py-12 px-4 bg-pink-900 text-pink-100 mt-16">
      <div className="max-w-4xl mx-auto text-center">
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
  );
}
