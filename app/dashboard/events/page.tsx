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
  DocumentData
} from 'firebase/firestore';
import { 
  Calendar, Users, MessageSquare, MapPin, Plus, 
  ExternalLink, Search, MoreVertical, ChevronLeft, ChevronRight 
} from 'lucide-react';

const EVENTS_PER_PAGE = 6;

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Estados de Paginación
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [firstDoc, setFirstDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [page, setPage] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async (direction: 'next' | 'prev' | 'initial' = 'initial') => {
        setLoading(true);
        try {
            let q;
            const eventsRef = collection(db, "events");

            if (direction === 'next' && lastDoc) {
                q = query(eventsRef, orderBy("date", "asc"), startAfter(lastDoc), limit(EVENTS_PER_PAGE));
            } else {
                // Por simplicidad en Firestore, el "prev" suele manejarse reiniciando o con cursores complejos.
                // Aquí reiniciamos para asegurar consistencia si no hay estados guardados de páginas previas.
                q = query(eventsRef, orderBy("date", "asc"), limit(EVENTS_PER_PAGE));
                setPage(1);
            }

            const snapshot = await getDocs(q);
            
            if (!snapshot.empty) {
                const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setEvents(list);
                setFirstDoc(snapshot.docs[0]);
                setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
                setIsLastPage(snapshot.docs.length < EVENTS_PER_PAGE);
            } else {
                if (direction === 'next') setIsLastPage(true);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
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

    const filteredEvents = events.filter(event => 
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Eventos de la Comunidad</h1>
                    <p className="text-slate-500 text-sm">Gestiona las quedadas y grupos de chat de Safinder.</p>
                </div>
                <button className="bg-pink-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-pink-700 transition-all shadow-lg shadow-pink-100">
                    <Plus size={18} /> Crear Evento
                </button>
            </div>

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

                {/* CONTROLES PAGINACIÓN */}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex flex-col items-center py-20 text-slate-400">
                        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p>Cargando eventos...</p>
                    </div>
                ) : filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))
                ) : (
                    <p className="col-span-full text-center py-20 text-slate-400 italic">No se encontraron eventos.</p>
                )}
            </div>
        </div>
    );
}

function EventCard({ event }: { event: any }) {
    const eventDate = event.date instanceof Timestamp ? event.date.toDate() : new Date(event.date);

    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-pink-200 transition-all group flex flex-col">
            <div className="p-5 space-y-4 flex-1">
                <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className="text-3xl bg-slate-50 w-14 h-14 flex items-center justify-center rounded-2xl border border-slate-100 shadow-sm transition-transform group-hover:scale-105">
                            {event.icon || "📍"}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-md leading-tight">{event.title}</h3>
                            <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                                <MapPin size={12} className="text-pink-500 shrink-0" />
                                <span className="line-clamp-1">{event.address || "No especificada"}</span>
                            </div>
                        </div>
                    </div>
                    <button className="text-slate-300 hover:text-slate-600 transition-colors">
                        <MoreVertical size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-50">
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Joiners</p>
                        <div className="flex items-center justify-center gap-1 mt-1 text-slate-700 font-bold text-sm">
                            <Users size={14} className="text-blue-500" />
                            {Array.isArray(event.joiners_id) ? event.joiners_id.length : 0}
                        </div>
                    </div>
                    <div className="text-center border-x border-slate-50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Fecha</p>
                        <div className="flex items-center justify-center gap-1 mt-1 text-slate-700 font-bold text-sm">
                            <Calendar size={14} className="text-pink-500" />
                            {eventDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Chat</p>
                        <div className="flex items-center justify-center gap-1 mt-1 text-slate-500 font-mono text-[9px] truncate px-1">
                            {event.groupChat ? event.groupChat.substring(0, 6) + "..." : "N/A"}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button className="text-xs font-bold text-pink-600 flex items-center gap-1 hover:text-pink-700 transition-colors">
                        Editar Evento <ExternalLink size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}