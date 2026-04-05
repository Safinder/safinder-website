"use client";
import React, { useState, useEffect } from 'react';
import { Users, Activity, Star, MapPin, Globe, Loader } from 'lucide-react';
import { collection, count, getAggregateFromServer, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import StatCard from '@/components/admin/StartCard';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    premium: 0,
    social: 0,
    cities: {} as Record<string, number>,
    newUsersWeek: 0,
    loading: true
  });

  useEffect(() => {
    loadDashboardData();
  }, []);
  
  async function loadDashboardData() {
    const usersRef = collection(db, "users");

    const date = new Date();
    date.setDate(date.getDate() - 7);
    const oneWeekAgoISO = date.toISOString();

    const premiumQuery = query(usersRef, where("isPremium", "==", true));
    const socialQuery = query(usersRef, where("isSocial", "==", true));
    
    const lastWeekQuery = query(usersRef, where("createdAt", ">=", oneWeekAgoISO));

    const [totalSnap, premiumSnap, socialSnap, lastWeekSnap] = await Promise.all([
      getAggregateFromServer(usersRef, { count: count() }),
      getAggregateFromServer(premiumQuery, { count: count() }),
      getAggregateFromServer(socialQuery, { count: count() }),
      getAggregateFromServer(lastWeekQuery, { count: count() }),
    ]);

    const citySnapshot = await getDocs(usersRef);
    const cityCounts: Record<string, number> = {};

    citySnapshot.forEach(doc => {
      const city = doc.data().city || "Sin ciudad";
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });

    setStats({
      total: totalSnap.data().count,
      premium: premiumSnap.data().count,
      social: socialSnap.data().count,
      newUsersWeek: lastWeekSnap.data().count,
      cities: cityCounts,
      loading: false
    });
  }

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-pink-600" size={30} />
        <span className="ml-2 text-2xl font-bold text-slate-500">Loading dashboard...</span>
      </div>
    );
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
          change={`${stats.newUsersWeek} new this week`}
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

      {/* Card de Ciudades */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <MapPin size={18} className="text-slate-400" />
          <h3 className="font-semibold">Top Cities</h3>
        </div>
        <div className="p-4 space-y-4">
          {Object.entries(stats.cities)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
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
    </div>
  );
}