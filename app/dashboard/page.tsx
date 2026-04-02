"use client";
import React, { useState, useEffect } from 'react';
import { Users, ShieldAlert, CheckCircle, Activity, Star, MapPin, Globe } from 'lucide-react';
import { collection, count, getAggregateFromServer, query, Timestamp, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    premium: 0,
    social: 0,
    cities: {} as Record<string, number>,
    loading: true
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    const usersRef = collection(db, "users");

    // 1. Conteos Simples (Premium vs Social)
    const premiumQuery = query(usersRef, where("isPremium", "==", true));
    const socialQuery = query(usersRef, where("isSocial", "==", true));

    const [totalSnap, premiumSnap, socialSnap] = await Promise.all([
      getAggregateFromServer(usersRef, { count: count() }),
      getAggregateFromServer(premiumQuery, { count: count() }),
      getAggregateFromServer(socialQuery, { count: count() }),
    ]);

    // 2. Conteo de Ciudades (Firestore no tiene GroupBy, hay que procesar)
    // Nota: Si tienes miles de usuarios, lo ideal es tener un doc "stats" que se actualice con Cloud Functions
    const citySnapshot = await getDocs(usersRef);
    const cityCounts: Record<string, number> = {};
    
    citySnapshot.forEach(doc => {
      const city = doc.data().city || "Unknown";
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });

    setStats({
      total: totalSnap.data().count,
      premium: premiumSnap.data().count,
      social: socialSnap.data().count,
      cities: cityCounts,
      loading: false
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Community Overview</h2>
        <p className="text-slate-500">Real-time pulse of Safinder.</p>
      </div>

      {/* Stats Grid Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sapphics"
          value={stats.total}
          change="+12% this week"
          icon={<Users className="text-blue-600" />}
        />
        <StatCard
          title="Premium Users"
          value={stats.premium}
          change={`${((stats.premium / stats.total) * 100).toFixed(1)}% conversion`}
          icon={<Star className="text-amber-500" />}
        />
        <StatCard
          title="Social Users"
          value={stats.social}
          icon={<Globe className="text-emerald-600" />}
        />
        <StatCard
          title="Active Users (24h)"
          value="???"
          icon={<Activity className="text-pink-600" />}
        />
      </div>

      {/* Nueva Sección: Distribución Geográfica y Tipos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Card de Ciudades */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-fit">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <MapPin size={18} className="text-slate-400" />
            <h3 className="font-semibold">Top Cities</h3>
          </div>
          <div className="p-4 space-y-4">
            {Object.entries(stats.cities)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5) // Mostrar solo las top 5
              .map(([city, count]) => (
                <div key={city} className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 font-medium">{city}</span>
                  <div className="flex items-center gap-3 w-2/3">
                    <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-pink-500 h-full rounded-full" 
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Tabla de Reportes (Tu componente anterior) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-semibold">Recent Reports</h3>
            <button className="text-sm text-pink-600 font-medium hover:underline">View All</button>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Reason</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <ReportRow name="Alex Smith" reason="Impersonation" status="High" />
              <ReportRow name="Jordan Doe" reason="Harassment" status="Medium" />
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

/* --- SMALL HELPER COMPONENTS --- */

function StatCard({ title, value, change, icon, isAlert = false }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
        {change && (
           <p className={`text-xs mt-2 font-medium ${isAlert ? 'text-red-600' : 'text-slate-400'}`}>
            {change}
          </p>
        )}
      </div>
    </div>
  );
}

function ReportRow({ name, reason, status }: any) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 font-medium">{name}</td>
      <td className="px-6 py-4 text-slate-600">{reason}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
          status === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {status}
        </span>
      </td>
    </tr>
  );
}