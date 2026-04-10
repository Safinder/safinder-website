"use client";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    startAfter,
    Timestamp,
    QueryDocumentSnapshot,
    DocumentData,
    doc,
    updateDoc,
    addDoc,
    serverTimestamp,
    where,
    deleteDoc
} from 'firebase/firestore';
import {
    Search, ChevronLeft, ChevronRight
} from 'lucide-react';
import DetailsModal from '@/components/admin/DetailsModal';
import ReportModal from '@/components/admin/ReportModal';
import EventCard from '@/components/admin/EventCard';

const EVENTS_PER_PAGE = 9;

export default function EventsPage() {
    // --- STATE ---
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modals State
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
    const [reportingEvent, setReportingEvent] = useState<any | null>(null);

    // Pagination State
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [page, setPage] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false);

    // --- LOGIC: FETCHING ---
    const fetchEvents = async (direction: 'next' | 'initial' = 'initial') => {
        if (events.length === 0) setLoading(true);
        try {
            const eventsRef = collection(db, "events");
            let constraints: any[] = [];

            // 1. Handle Search vs. Normal Load
            if (searchTerm) {
                constraints.push(where("title", ">=", searchTerm));
                constraints.push(where("title", "<=", searchTerm + '\uf8ff'));
                constraints.push(orderBy("title"));
            } else {
                // No isSpam filter here anymore!
                constraints.push(orderBy("createdAt", "asc"));
            }

            // 2. Handle Pagination
            let q;
            if (direction === 'next' && lastDoc && !searchTerm) {
                q = query(eventsRef, ...constraints, startAfter(lastDoc), limit(EVENTS_PER_PAGE));
            } else {
                q = query(eventsRef, ...constraints, limit(EVENTS_PER_PAGE));
                setPage(1);
            }

            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                let list = snapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title, ...doc.data() }));
                if (searchTerm) {
                    const lowerTerm = searchTerm.toLowerCase();
                    list = list.filter(event =>
                        event.title?.toLowerCase().includes(lowerTerm)
                    );
                }
                setEvents(list);
                setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
                setIsLastPage(snapshot.docs.length < EVENTS_PER_PAGE);
            } else {
                setEvents([]);
                if (direction === 'next') setIsLastPage(true);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchEvents('initial');
        }, 500); // Wait 500ms after user stops typing

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    // --- LOGIC: REPORTING ---
    const handleReportSpam = async (eventId: string, ownerId: string, reason: string) => {
        const eventRef = doc(db, "events", eventId);
        const reportRef = collection(db, "reports");

        try {
            await updateDoc(eventRef, {
                isSpam: true,
                updatedAt: serverTimestamp()
            });

            await addDoc(reportRef, {
                eventId: eventId,
                ownerId: ownerId || "unknown",
                reason: reason,
                status: "pending",
                createdAt: serverTimestamp(),
                severity: 1
            });

            // UPDATE: Instead of filtering out, we update the object in state
            setEvents(prev => prev.map(e => e.id === eventId ? { ...e, isSpam: true } : e));
            setReportingEvent(null);

            alert("Evento marcado como spam.");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // --- LOGIC: DELETION ---
    const handleDeleteEvent = async (eventId: string) => {
        // Standard confirmation dialog
        if (!window.confirm("¿Estás seguro de que deseas eliminar este evento permanentemente?")) return;

        try {
            const eventRef = doc(db, "events", eventId);
            await deleteDoc(eventRef);

            // Update local state to remove the card
            setEvents(prev => prev.filter(e => e.id !== eventId));

            // Close modal if it was open
            setSelectedEvent(null);

            alert("Evento eliminado correctamente.");
        } catch (error) {
            console.error("Error deleting event:", error);
            alert("Hubo un error al intentar eliminar el evento.");
        }
    };

    const handleNext = () => {
        setPage(prev => prev + 1);
        fetchEvents('next');
    };

    const handleReset = () => {
        setPage(1);
        fetchEvents('initial');
    };


    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Eventos de la Comunidad</h1>
                    <p className="text-slate-500 text-sm">Gestiona las quedadas y grupos de chat de Safinder.</p>
                </div>
            </div>

            {/* SEARCH & PAGINATION CONTROLS */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por título o ciudad..."
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl w-full outline-none focus:ring-2 focus:ring-pink-500 bg-white shadow-sm"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500 font-medium">Página {page}</span>
                    <div className="flex gap-1">
                        <button
                            onClick={handleReset}
                            disabled={page === 1 || loading}
                            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={isLastPage || loading}
                            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex flex-col items-center py-20 text-slate-400">
                        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p>Cargando eventos...</p>
                    </div>
                ) : events.length > 0 ? (
                    events.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onOpenDetails={() => setSelectedEvent(event)}
                            onReport={() => setReportingEvent(event)}
                            onDelete={() => handleDeleteEvent(event.id)}
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center py-20 text-slate-400 italic">No se encontraron eventos.</p>
                )}
            </div>

            {/* MODALS */}
            {selectedEvent && (
                <DetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
            )}

            {reportingEvent && (
                <ReportModal
                    event={reportingEvent}
                    onClose={() => setReportingEvent(null)}
                    onConfirm={handleReportSpam}
                />
            )}
        </div>
    );
}