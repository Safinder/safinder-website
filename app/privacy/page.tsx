"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Lock, Eye, Users, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PrivacyPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <nav className="hidden md:flex gap-4 lg:gap-6">
          <Link
            href="/"
            className="text-sm lg:text-base text-pink-700 hover:text-pink-500 transition-colors hover:underline font-bold"
          >
            Back home
          </Link>
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
                Back home
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-yellow-500 to-pink-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-xl text-pink-700 mb-8 max-w-2xl mx-auto">
            Your privacy and safety are our top priorities. Here's how we
            protect your personal information and create a safe space for our
            community.
          </p>
          <p className="text-sm text-pink-600 bg-pink-100 rounded-full px-4 py-2 inline-block">
            Last updated: January 2025
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
                  Data Encryption
                </h3>
                <p className="text-pink-600 text-sm">
                  All your data is encrypted and securely stored
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardContent className="p-6 text-center">
                <Eye className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-yellow-700 mb-2">
                  No Data Selling
                </h3>
                <p className="text-yellow-600 text-sm">
                  We never sell your personal information to third parties
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-orange-700 mb-2">
                  Community First
                </h3>
                <p className="text-orange-600 text-sm">
                  Built by and for the sapphic community
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Privacy Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200">
              <CardHeader>
                <CardTitle className="text-2xl text-pink-700 flex items-center">
                  <MessageCircle className="h-6 w-6 mr-3" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-pink-700">
                <div>
                  <h4 className="font-semibold mb-2">Profile Information</h4>
                  <p className="text-pink-600 leading-relaxed">
                    We collect the information you provide when creating your
                    profile, including your name, age, location, photos, and
                    bio. This information is used to create your profile and
                    help you connect with compatible matches.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    Weekly Question Responses
                  </h4>
                  <p className="text-pink-600 leading-relaxed">
                    Your responses to our weekly questions are the heart of our
                    matching algorithm. These responses help us understand your
                    personality, values, and preferences to find you compatible
                    matches.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Usage Data</h4>
                  <p className="text-pink-600 leading-relaxed">
                    We collect information about how you use the app, including
                    which profiles you view, who you match with, and your
                    messaging activity. This helps us improve our matching
                    algorithm and user experience.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-2xl text-yellow-700 flex items-center">
                  <Shield className="h-6 w-6 mr-3" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-yellow-700">
                <div>
                  <h4 className="font-semibold mb-2">Matching & Connections</h4>
                  <p className="text-yellow-600 leading-relaxed">
                    We use your profile information and question responses to
                    calculate compatibility percentages and suggest potential
                    matches. Our algorithm is designed to help you find
                    meaningful connections.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Safety & Security</h4>
                  <p className="text-yellow-600 leading-relaxed">
                    We use your information to verify profiles, prevent fraud,
                    and maintain a safe community environment. This includes
                    monitoring for inappropriate behavior and enforcing our
                    community guidelines.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">App Improvement</h4>
                  <p className="text-yellow-600 leading-relaxed">
                    We analyze usage patterns to improve our matching algorithm,
                    develop new features, and enhance the overall user
                    experience. All analysis is done with aggregated, anonymized
                    data.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 border-orange-200">
              <CardHeader>
                <CardTitle className="text-2xl text-orange-700 flex items-center">
                  <Lock className="h-6 w-6 mr-3" />
                  Data Protection & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-orange-700">
                <div>
                  <h4 className="font-semibold mb-2">Encryption</h4>
                  <p className="text-orange-600 leading-relaxed">
                    All data is encrypted both in transit and at rest using
                    industry-standard encryption protocols. Your personal
                    information is protected with the highest level of security.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Access Controls</h4>
                  <p className="text-orange-600 leading-relaxed">
                    Access to your personal data is strictly limited to
                    authorized personnel who need it to provide our services.
                    All access is logged and monitored.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Data Retention</h4>
                  <p className="text-orange-600 leading-relaxed">
                    We only keep your data for as long as necessary to provide
                    our services. You can delete your account and all associated
                    data at any time through the app settings.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200">
              <CardHeader>
                <CardTitle className="text-2xl text-pink-700 flex items-center">
                  <Users className="h-6 w-6 mr-3" />
                  Your Rights & Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-pink-700">
                <div>
                  <h4 className="font-semibold mb-2">Profile Control</h4>
                  <p className="text-pink-600 leading-relaxed">
                    You have complete control over your profile information and
                    can update, modify, or delete any information at any time
                    through the app settings.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Data Access</h4>
                  <p className="text-pink-600 leading-relaxed">
                    You can request a copy of all the personal data we have
                    about you. We'll provide this information in a readable
                    format within 30 days of your request.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Account Deletion</h4>
                  <p className="text-pink-600 leading-relaxed">
                    You can permanently delete your account and all associated
                    data at any time. Once deleted, your information cannot be
                    recovered, and you'll be removed from all matches and
                    conversations.
                  </p>
                </div>
              </CardContent>
            </Card>

            <section id="contact">
              <Card className="bg-gradient-to-r from-pink-100 to-yellow-100 border-2 border-pink-300">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-pink-700 mb-4">
                    Questions About Privacy?
                  </h3>
                  <p className="text-pink-600 mb-6 leading-relaxed">
                    We're committed to transparency and are here to answer any
                    questions about how we handle your data. Your trust is
                    essential to our community.
                  </p>
                  <a
                    href="mailto:admin@safinder.com"
                    className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-3 rounded-full"
                  >
                    Contact Privacy Team
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
              Home
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
             <Link href="/privacy/#contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          <p className="text-pink-300">
            © 2025 Safinder. Made with 💖 for the sapphic community.
          </p>
        </div>
      </footer>
    </div>
  );
}
