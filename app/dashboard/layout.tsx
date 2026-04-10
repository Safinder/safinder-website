"use client";

import React, { useState, useEffect } from 'react';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { Users, Calendar, LayoutDashboard, LogOut, FileQuestion, TriangleAlert, Star } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // 1. Create state for the user and the loading process
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. Listen for auth changes. This runs once when the component mounts.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Only redirect if we are sure there is no user after initialization
        router.push('/login');
      }
      setLoading(false); // Auth is no longer "initializing"
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // 3. Show a loading screen while Firebase checks the session
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 4. If not loading and no user, the useEffect will handle the redirect, 
  // but we return null here to prevent flashing the admin UI
  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50 text-slate-900">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-pink-600">Safinder Admin</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Overview"
            href="/dashboard"
            active={pathname === "/dashboard"}
          />
          <NavItem
            icon={<Users size={20} />}
            label="User Management"
            href="/dashboard/users"
            active={pathname === "/dashboard/users"}
          />
          <NavItem
            icon={<FileQuestion size={20} />}
            label="Questions"
            href="/dashboard/questions"
            active={pathname === "/dashboard/questions"}
          />
          <NavItem
            icon={<Calendar size={20} />}
            label="Events"
            href="/dashboard/events"
            active={pathname === "/dashboard/events"}
          />
          <NavItem
            icon={<TriangleAlert size={20} />}
            label="Reports"
            href="/dashboard/reports"
            active={pathname === "/dashboard/reports"}
          />
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            className="flex items-center gap-3 text-slate-500 hover:text-red-600 transition-colors w-full px-2 py-2"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-8 py-5 self-end">  
          <div className="flex items-center gap-4">
            <div className="mr-0">
              {/* Use the local user state instead of authInstance.currentUser */}
              <p className="text-xs font-semibold mb-1">{user.email}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold">
              <Star size={16} color='#be185d' />
            </div>
          </div>
        </header>

        <section className="p-8 overflow-y-auto">
          {children}
        </section>
      </main>
    </div>
  );
}

function NavItem({ icon, label, href, active, badge }: any) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all ${active
          ? 'bg-pink-50 text-pink-700 font-bold'
          : 'text-slate-600 hover:bg-slate-50'
        }`}
    >
      <div className="flex items-center gap-3 text-sm">
        {icon}
        {label}
      </div>
      {badge && (
        <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}