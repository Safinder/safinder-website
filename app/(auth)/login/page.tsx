"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    deleteUser,
    User
} from 'firebase/auth';
import { collection, addDoc, serverTimestamp, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, AlertTriangle, Shield, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import type { Language } from "@/lib/translations";
import { useRouter } from 'next/navigation';
interface LoginFormData {
    email: string;
    password: string;
}

const adminContent = {
    en: {
        title: "Admin",
        subtitle: "We're sorry to see you go",
        loginTitle: "Login",
        loginSubtitle: "Please sign in to access the admin panel    ",
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

export default function AdminPage() {
    const [currentLanguage, setCurrentLanguage] = useState<Language>("es");
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
const router = useRouter();
    // Login form state
    const [loginData, setLoginData] = useState<LoginFormData>({
        email: '',
        password: ''
    });
    const [loginError, setLoginError] = useState<string>('');
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

    const content = adminContent[currentLanguage];

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

    const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setIsLoggingIn(true);
        setLoginError('');

        try {
            // 1. Authenticate the user
            const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
            const user = userCredential.user;

            // 2. Fetch the user's document from Firestore to check permissions
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists() && userDoc.data().isAdmin === true) {
                // Success: User is an admin
                setLoginData({ email: '', password: '' });
                // Redirect to dashboard
                router.push('/dashboard');
            } else {
                // 3. Reject if not an admin and sign them out immediately
                await signOut(auth);
                setLoginError('Access denied. You do not have administrator privileges.');
            }

        } catch (error: any) {
            setLoginError('Invalid email or password. Please try again.');
            console.error('Login error:', error);
        } finally {
            setIsLoggingIn(false);
        }
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


    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-orange-50 flex items-center justify-center py-12">
            <div className="max-w-md m-auto px-4">
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200">
                    <CardHeader>
                        <CardTitle className="text-2xl text-pink-700 text-center flex items-center justify-center">
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