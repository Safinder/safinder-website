"use client";
import { useState, useEffect } from 'react';
import {
    collection,
    query,
    orderBy,
    limit,
    getDocs,
    startAfter,
    limitToLast,
    endBefore
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import UserDetailView from '@/components/admin/UserDetailView';

const PAGE_SIZE = 10;

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination State
    const [firstDoc, setFirstDoc] = useState<any>(null); // For "Previous"
    const [lastDoc, setLastDoc] = useState<any>(null);   // For "Next"
    const [page, setPage] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    // Initial Fetch
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async (cursor?: any, direction?: 'next' | 'prev') => {
        setLoading(true);
        try {
            const usersRef = collection(db, "users");
            let q;

            if (direction === 'next' && cursor) {
                q = query(usersRef, orderBy("createdAt", "desc"), startAfter(cursor), limit(PAGE_SIZE));
            } else if (direction === 'prev' && cursor) {
                q = query(usersRef, orderBy("createdAt", "desc"), endBefore(cursor), limitToLast(PAGE_SIZE));
            } else {
                // Default first load
                q = query(usersRef, orderBy("createdAt", "desc"), limit(PAGE_SIZE));
            }

            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(list);
                setFirstDoc(snapshot.docs[0]);
                setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

                // Simple check if we might be at the end
                setIsLastPage(snapshot.docs.length < PAGE_SIZE);
            }
        } catch (error) {
            console.error("Pagination error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        setPage(p => p + 1);
        fetchUsers(lastDoc, 'next');
    };

    const handlePrev = () => {
        if (page <= 1) return;
        setPage(p => p - 1);
        fetchUsers(firstDoc, 'prev');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">User Directory</h1>
                <span className="text-sm text-slate-500 font-medium">Page {page}</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
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
                            <tr><td colSpan={3} className="text-center py-10 text-slate-400">Loading users...</td></tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} onClick={() => setSelectedUser(user)} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-900">{user.username || 'New User'}</div>
                                        <div className="text-xs text-slate-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-[10px] font-bold uppercase">
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

                {/* PAGINATION CONTROLS */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                    <button
                        onClick={handlePrev}
                        disabled={page === 1 || loading}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-300 bg-white text-sm font-medium disabled:opacity-50 hover:bg-slate-50 transition-colors"
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={isLastPage || loading}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-300 bg-white text-sm font-medium disabled:opacity-50 hover:bg-slate-50 transition-colors"
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>

                {selectedUser && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 animate-in fade-in"
                            onClick={() => setSelectedUser(null)}
                        />
                        <UserDetailView
                            user={selectedUser}
                            onClose={() => setSelectedUser(null)}
                        />
                    </>
                )}
            </div>
        </div>
    );
}