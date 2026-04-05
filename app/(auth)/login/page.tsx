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
import { Trash2, AlertTriangle, Shield, Lock, Frown } from "lucide-react";
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
        loginTitle: "Login",
        loginSubtitle: "Please sign in to access the admin panel",
        signedInAs: "Signed in as:",
        cancelButton: "Cancel & Sign Out",
        additionalInfoLabel: "Additional Information (Optional)",
        emailLabel: "Email Address",
        passwordLabel: "Password",
        signInButton: "Sign In",
        signingInButton: "Signing In...",
    },
    es: {
        title: "Inicia Sesión",
        loginTitle: "Inicia Sesión",
        loginSubtitle: "Por favor inicia sesión",
        signedInAs: "Sesión iniciada como:",
        emailLabel: "Dirección de Email",
        passwordLabel: "Contraseña",
        signInButton: "Iniciar Sesión",
        signingInButton: "Iniciando Sesión...",
    },
    nl: {
        title: "Iniciar Sesión",
        loginTitle: "Iniciar Sesión",
        loginSubtitle: "Por favor inicia sesión",
        signedInAs: "Sesión iniciada como:",
        emailLabel: "Dirección de Email",
        passwordLabel: "Contraseña",
        signInButton: "Iniciar Sesión",
        signingInButton: "Iniciando Sesión...",
    }
};

export default function AdminPage() {
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
                setLoginError('Hmm parece ser que no tienes permisos de administrador. Si crees que esto es un error, por favor contacta con soporte.');
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
            <div className="max-w-md m-auto px-4 w-full ">
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200">
                    <CardHeader>
                        <CardTitle className="text-2xl text-pink-700 text-center flex items-center justify-center">
                            {adminContent.es.loginTitle}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            {loginError && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                                    <Frown size={16} className="inline-block mr-2" />
                                    {loginError}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-pink-700 mb-1">
                                    {adminContent.es.emailLabel}
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
                                    {adminContent.es.passwordLabel}
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
                                {isLoggingIn ? adminContent.es.signingInButton : adminContent.es.signInButton}
                            </button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}