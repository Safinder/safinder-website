"use client"; // 1. Necessary to use hooks like usePathname

import React from 'react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { usePathname } from 'next/navigation'; // 2. Import the hook
import Link from 'next/link'; // 3. Use Link instead of <a> for better performance
import { Users, Calendar, Settings, LayoutDashboard, LogOut, FileQuestion } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // 4. Get the current path (e.g., "/dashboard/users")

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      // Optionally handle error
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-slate-900">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-pink-600">Safinder Admin</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {/* 5. Compare current pathname with the href */}
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
            // badge="5" 
          />
          <NavItem 
            icon={<Calendar size={20} />} 
            label="Events" 
            href="/dashboard/events" 
            active={pathname === "/dashboard/events"} 
          />
          <NavItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            href="/dashboard/settings" 
            active={pathname === "/dashboard/settings"} 
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
        {/* ... Header stays the same ... */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
            {/* Header Content */}
        </header>
        
        <section className="p-8 overflow-y-auto">
          {children}
        </section>
      </main>
    </div>
  );
}

// Updated Helper Component using Link
function NavItem({ icon, label, href, active, badge }: any) {
  return (
    <Link 
      href={href} 
      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
        active 
          ? 'bg-pink-50 text-pink-700 font-bold' // Styles for active
          : 'text-slate-600 hover:bg-slate-50'    // Styles for inactive
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