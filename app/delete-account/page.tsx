"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  deleteUser,
  User
} from 'firebase/auth';
import { collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, AlertTriangle, Shield, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import type { Language } from "@/lib/translations";

interface LoginFormData {
  email: string;
  password: string;
}

interface DeletionFormData {
  reason: string;
  additionalInfo: string;
  confirmationWord: string;
}

const deleteAccountContent = {
  en: {
    title: "Delete Your Account",
    subtitle: "We're sorry to see you go",
    loginTitle: "Sign In to Delete Account",
    loginSubtitle: "Please sign in to delete your account",
    signedInAs: "Signed in as:",
    warningTitle: "Warning: This action cannot be undone",
    warningText: "Deleting your account will permanently remove all your data from our systems. This action is irreversible and cannot be undone.",
    deleteButton: "Delete My Account",
    cancelButton: "Cancel & Sign Out",
    confirmTitle: "Confirm Account Deletion",
    reasonLabel: "Reason for Deletion",
    additionalInfoLabel: "Additional Information (Optional)",
    confirmationLabel: "Type \"eliminar\" to confirm",
    submitButton: "Delete Account",
    submittingButton: "Deleting...",
    cancelModalButton: "Cancel",
    successTitle: "Account Deleted Successfully",
    successText: "Your account has been permanently deleted. All your data has been removed from our systems. Thank you for using our service.",
    returnHome: "Return to Home",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    signInButton: "Sign In",
    signingInButton: "Signing In...",
    reasons: {
      "no-longer-needed": "No longer need the service",
      "privacy-concerns": "Privacy concerns",
      "switching-services": "Switching to another service",
      "technical-issues": "Technical issues",
      "other": "Other"
    }
  },
  es: {
    title: "Eliminar Tu Cuenta",
    subtitle: "Lamentamos que te vayas",
    loginTitle: "Iniciar Sesión para Eliminar Cuenta",
    loginSubtitle: "Por favor inicia sesión para eliminar tu cuenta",
    signedInAs: "Sesión iniciada como:",
    warningTitle: "Advertencia: Esta acción no se puede deshacer",
    warningText: "Eliminar tu cuenta eliminará permanentemente todos tus datos de nuestros sistemas. Esta acción es irreversible y no se puede deshacer.",
    deleteButton: "Eliminar Mi Cuenta",
    cancelButton: "Cancelar y Cerrar Sesión",
    confirmTitle: "Confirmar Eliminación de Cuenta",
    reasonLabel: "Motivo de Eliminación",
    additionalInfoLabel: "Información Adicional (Opcional)",
    confirmationLabel: "Escribe \"eliminar\" para confirmar",
    submitButton: "Eliminar Cuenta",
    submittingButton: "Eliminando...",
    cancelModalButton: "Cancelar",
    successTitle: "Cuenta Eliminada Exitosamente",
    successText: "Tu cuenta ha sido eliminada permanentemente. Todos tus datos han sido removidos de nuestros sistemas. Gracias por usar nuestro servicio.",
    returnHome: "Volver al Inicio",
    emailLabel: "Dirección de Email",
    passwordLabel: "Contraseña",
    signInButton: "Iniciar Sesión",
    signingInButton: "Iniciando Sesión...",
    reasons: {
      "no-longer-needed": "Ya no necesito el servicio",
      "privacy-concerns": "Preocupaciones de privacidad",
      "switching-services": "Cambio a otro servicio",
      "technical-issues": "Problemas técnicos",
      "other": "Otro"
    }
  },
  nl: {
    title: "Account Verwijderen",
    subtitle: "We vinden het jammer dat je weggaat",
    loginTitle: "Inloggen om Account te Verwijderen",
    loginSubtitle: "Log in om je account te verwijderen",
    signedInAs: "Ingelogd als:",
    warningTitle: "Waarschuwing: Deze actie kan niet ongedaan worden gemaakt",
    warningText: "Het verwijderen van je account zal permanent al je data uit onze systemen verwijderen. Deze actie is onomkeerbaar en kan niet ongedaan worden gemaakt.",
    deleteButton: "Mijn Account Verwijderen",
    cancelButton: "Annuleren & Uitloggen",
    confirmTitle: "Account Verwijdering Bevestigen",
    reasonLabel: "Reden voor Verwijdering",
    additionalInfoLabel: "Aanvullende Informatie (Optioneel)",
    confirmationLabel: "Typ \"eliminar\" om te bevestigen",
    submitButton: "Account Verwijderen",
    submittingButton: "Verwijderen...",
    cancelModalButton: "Annuleren",
    successTitle: "Account Succesvol Verwijderd",
    successText: "Je account is permanent verwijderd. Al je data is uit onze systemen verwijderd. Bedankt voor het gebruik van onze service.",
    returnHome: "Terug naar Home",
    emailLabel: "Email Adres",
    passwordLabel: "Wachtwoord",
    signInButton: "Inloggen",
    signingInButton: "Inloggen...",
    reasons: {
      "no-longer-needed": "Heb de service niet meer nodig",
      "privacy-concerns": "Privacy zorgen",
      "switching-services": "Wissel naar andere service",
      "technical-issues": "Technische problemen",
      "other": "Anders"
    }
  }
};

export default function DeleteAccount() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDeletionModal, setShowDeletionModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  // Login form state
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Deletion form state
  const [deletionData, setDeletionData] = useState<DeletionFormData>({
    reason: '',
    additionalInfo: '',
    confirmationWord: ''
  });
  const [deletionError, setDeletionError] = useState<string>('');

  const content = deleteAccountContent[currentLanguage];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeletionChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setDeletionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      setLoginData({ email: '', password: '' });
    } catch (error: any) {
      setLoginError('Invalid email or password. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDeleteAccount = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setDeletionError('');

    if (deletionData.confirmationWord.toLowerCase() !== 'eliminar') {
      setDeletionError('Please type "eliminar" to confirm account deletion.');
      return;
    }

    if (!user) {
      setDeletionError('User not authenticated.');
      return;
    }

    setIsDeleting(true);

    try {
      // Delete user document from Firestore 'users' collection using user.uid
      await deleteDoc(doc(db, 'users', user.uid));

      // Optionally log deletion request as you did before
      await addDoc(collection(db, 'deletion-requests'), {
        email: user.email,
        reason: deletionData.reason,
        additionalInfo: deletionData.additionalInfo,
        timestamp: serverTimestamp(),
        status: 'completed',
        userId: user.uid
      });

      // Delete the user from Firebase Authentication
      await deleteUser(user);

      // Sign out (usually after user deletion this happens automatically)
      await signOut(auth);

      setIsDeleted(true);
      setShowDeletionModal(false);
    } catch (error: any) {
      console.error('Error deleting account:', error);

      if (error.code === 'auth/requires-recent-login') {
        setDeletionError('For security reasons, please log out and log back in before deleting your account.');
      } else {
        setDeletionError('Failed to delete account. Please try again or contact support.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeletionModal = (): void => {
    setShowDeletionModal(true);
    setDeletionData({
      reason: '',
      additionalInfo: '',
      confirmationWord: ''
    });
    setDeletionError('');
  };

  const closeDeletionModal = (): void => {
    setShowDeletionModal(false);
    setDeletionData({
      reason: '',
      additionalInfo: '',
      confirmationWord: ''
    });
    setDeletionError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-pink-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isDeleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-orange-50">
        <Navbar
          currentLanguage={currentLanguage}
          setCurrentLanguage={setCurrentLanguage}
          t={(key) => {
            const value = deleteAccountContent[currentLanguage][key as keyof typeof deleteAccountContent[typeof currentLanguage]];
            return typeof value === "string" ? value : key;
          }}
        />

        <div className="min-h-screen flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-green-700 mb-4">
                  {content.successTitle}
                </h2>
                <p className="text-green-600 mb-6 leading-relaxed">
                  {content.successText}
                </p>
                <Link
                  href="/"
                  className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-3 rounded-full inline-block transition-all"
                >
                  {content.returnHome}
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-orange-50">
        <Navbar
          currentLanguage={currentLanguage}
          setCurrentLanguage={setCurrentLanguage}
          t={(key) => {
            const value = deleteAccountContent[currentLanguage][key as keyof typeof deleteAccountContent[typeof currentLanguage]];
            return typeof value === "string" ? value : key;
          }}
        />

        {/* Hero Section */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <Trash2 className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 bg-clip-text text-transparent">
              {content.title}
            </h1>
            <p className="text-xl text-pink-700 mb-8 max-w-2xl mx-auto">
              {content.subtitle}
            </p>
          </div>
        </section>

        <div className="max-w-md mx-auto px-4 pb-16">
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200">
            <CardHeader>
              <CardTitle className="text-2xl text-pink-700 text-center flex items-center justify-center">
                <Lock className="h-6 w-6 mr-3" />
                {content.loginTitle}
              </CardTitle>
              <p className="text-center text-pink-600">
                {content.loginSubtitle}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                    {loginError}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-pink-700 mb-1">
                    {content.emailLabel}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Enter your email address"
                    value={loginData.email}
                    onChange={handleLoginChange}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-pink-700 mb-1">
                    {content.passwordLabel}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-3 py-2 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-2 px-4 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingIn ? content.signingInButton : content.signInButton}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-orange-50">
        <Navbar
          currentLanguage={currentLanguage}
          setCurrentLanguage={setCurrentLanguage}
          t={(key) => {
            const value = deleteAccountContent[currentLanguage][key as keyof typeof deleteAccountContent[typeof currentLanguage]];
            return typeof value === "string" ? value : key;
          }}
        />

        {/* Hero Section */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <Trash2 className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 bg-clip-text text-transparent">
              {content.title}
            </h1>
            <p className="text-xl text-pink-700 mb-4 max-w-2xl mx-auto">
              {content.subtitle}
            </p>
            <p className="text-pink-600 bg-pink-100 rounded-full px-4 py-2 inline-block">
              {content.signedInAs} <span className="font-medium">{user.email}</span>
            </p>
          </div>
        </section>

        <div className="max-w-md mx-auto px-4 pb-16">
          <Card className="bg-red-50 border-2 border-red-200 mb-6">
            <CardContent className="p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-red-800 mb-2">
                    {content.warningTitle}
                  </h3>
                  <p className="text-red-700 text-sm leading-relaxed">
                    {content.warningText}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <button
              onClick={openDeletionModal}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-md transition-all font-medium"
            >
              {content.deleteButton}
            </button>

            <button
              onClick={() => signOut(auth)}
              className="w-full bg-white hover:bg-gray-50 text-pink-700 py-2 px-4 rounded-md border-2 border-pink-200 transition-all"
            >
              {content.cancelButton}
            </button>
          </div>
        </div>
      </div>

      {/* Deletion Confirmation Modal */}
      {showDeletionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl text-red-700">
                {content.confirmTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDeleteAccount} className="space-y-4">
                {deletionError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
                    {deletionError}
                  </div>
                )}

                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                    {content.reasonLabel}
                  </label>
                  <select
                    id="reason"
                    name="reason"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                    value={deletionData.reason}
                    onChange={handleDeletionChange}
                  >
                    <option value="">Select a reason</option>
                    {Object.entries(content.reasons).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                    {content.additionalInfoLabel}
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                    placeholder="Any additional details..."
                    value={deletionData.additionalInfo}
                    onChange={handleDeletionChange}
                  />
                </div>

                <div>
                  <label htmlFor="confirmationWord" className="block text-sm font-medium text-gray-700 mb-1">
                    {content.confirmationLabel}
                  </label>
                  <input
                    id="confirmationWord"
                    name="confirmationWord"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                    placeholder="eliminar"
                    value={deletionData.confirmationWord}
                    onChange={handleDeletionChange}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeDeletionModal}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    {content.cancelModalButton}
                  </button>
                  <button
                    type="submit"
                    disabled={isDeleting}
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? content.submittingButton : content.submitButton}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

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
    </>
  );
}