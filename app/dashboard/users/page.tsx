"use client";
import { useState, useEffect, useMemo } from 'react';
import {
    collection,
    getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ChevronLeft, ChevronRight, Search, X, Loader2 } from 'lucide-react';
import UserDetailView from '@/components/admin/UserDetailView';

const PAGE_SIZE = 20;

export default function UsersPage() {
    // Data State
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Pagination & UI State
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // 1. Fetch ALL users on mount for global search/filtering
    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        setLoading(true);
        try {
            const usersRef = collection(db, "users");
            // We fetch everything ordered by date
            const snapshot = await getDocs(usersRef);
            
            const list = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data() 
            }));
            setAllUsers(list);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. Filter Logic (Searches across all fields)
    const filteredResults = useMemo(() => {
        if (!searchTerm.trim()) return allUsers;

        const term = searchTerm.toLowerCase();
        return allUsers.filter(user => 
            user.username?.toLowerCase().includes(term) ||
            user.email?.toLowerCase().includes(term) ||
            user.city?.toLowerCase().includes(term) ||
            user.interest?.toLowerCase().includes(term) ||
            (user.isPremium ? 'premium' : 'free').includes(term)
        );
    }, [allUsers, searchTerm]);

    // 3. Pagination Logic (Calculated from filtered results)
    const totalPages = Math.ceil(filteredResults.length / PAGE_SIZE);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const paginatedUsers = filteredResults.slice(startIndex, startIndex + PAGE_SIZE);

    // Reset to page 1 when searching
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">User Directory</h1>
                    <p className="text-sm text-slate-500">
                        {searchTerm ? `Found ${filteredResults.length} matches` : `Total Users: ${allUsers.length}`}
                    </p>
                </div>

                {/* SEARCH BAR */}
                <div className="relative w-full md:w-80">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search name, email, city..."
                        className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm("")}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                            <tr>
                                <th className="px-6 py-4">User Details</th>
                                <th className="px-6 py-4">Plan</th>
                                <th className="px-6 py-4">Interest</th>
                                <th className="px-6 py-4">Ciudad</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                                        <span className="text-slate-400">Loading directory...</span>
                                    </td>
                                </tr>
                            ) : paginatedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-20 text-slate-400">
                                        No users found matching "{searchTerm}"
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((user) => (
                                    <tr 
                                        key={user.id} 
                                        onClick={() => setSelectedUser(user)} 
                                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900">{user.username || 'Anonymous'}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                user.isPremium ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                                {user.isSocial ? 'Social' : user.isPremium ? 'Premium' : 'Free'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-pink-50 text-pink-700 rounded text-[10px] font-bold uppercase">
                                                {user.interest || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {user.city || 'N/A'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION CONTROLS */}
                {!loading && filteredResults.length > 0 && (
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                        <p className="text-xs text-slate-500">
                            Showing {startIndex + 1} to {Math.min(startIndex + PAGE_SIZE, filteredResults.length)} of {filteredResults.length}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => p - 1)}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-300 bg-white text-sm font-medium disabled:opacity-50 hover:bg-slate-50"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => p + 1)}
                                disabled={currentPage >= totalPages}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-300 bg-white text-sm font-medium disabled:opacity-50 hover:bg-slate-50"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {selectedUser && (
                <>
                    <div 
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" 
                        onClick={() => setSelectedUser(null)} 
                    />
                    <UserDetailView
                        user={selectedUser}
                        onClose={() => setSelectedUser(null)}
                    />
                </>
            )}
        </div>
    );
}