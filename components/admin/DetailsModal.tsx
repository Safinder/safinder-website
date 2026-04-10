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
    where
} from 'firebase/firestore';
import { Clock, MapPin, Plus, X } from 'lucide-react';
import { useEffect, useState } from "react";

function DetailsModal({ event, onClose }: any) {
    const [lastMessageTime, setLastMessageTime] = useState<string | null>("Cargando...");

    useEffect(() => {
        const fetchLastMessage = async () => {
            try {
                // Path: events/{eventId}/groupChat
                const chatRef = collection(db, "events", event.id, "groupChat");
                // Query the latest message by timestamp
                const q = query(chatRef, orderBy("timestamp", "desc"), limit(1));
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    const data = snapshot.docs[0].data();
                    const ts = data.timestamp;
                    if (ts instanceof Timestamp) {
                        const date = ts.toDate();
                        setLastMessageTime(date.toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        }));
                    } else {
                        setLastMessageTime("Fecha no válida");
                    }
                } else {
                    setLastMessageTime("Sin mensajes");
                }
            } catch (error) {
                console.error("Error fetching last message:", error);
                setLastMessageTime("Error al cargar");
            }
        };

        fetchLastMessage();
    }, [event.id]);

    const createdAt = event.createdAt instanceof Timestamp
        ? event.createdAt.toDate().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : "No disponible";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm !mt-0">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header Image/Icon Section */}
                <div className="relative h-4 bg-gradient-to-r from-pink-500 to-rose-400 p-6">
                    <button onClick={onClose} className="absolute top-2 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors">
                        <X size={20} />
                    </button>
                    <div className="absolute -bottom-10 left-8 text-5xl bg-white w-20 h-20 flex items-center justify-center rounded-3xl shadow-xl border-4 border-white">
                        {event.icon || "📍"}
                    </div>
                </div>

                <div className="pt-14 p-8 space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{event.title}</h2>
                        <p className="text-slate-500 flex items-center gap-1 mt-1">
                            <MapPin size={16} /> {event.address}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100">
                            <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Creado el</p>
                            <div className="flex items-center gap-2 text-blue-900 font-semibold text-[11px]">
                                <Clock size={14} /> {createdAt}
                            </div>
                        </div>
                        {/* NEW: Last Message Component */}
                        <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                            <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Última actividad</p>
                            <div className="flex items-center gap-2 text-emerald-900 font-semibold text-[11px]">
                                <Plus size={14} className="rotate-45" /> {lastMessageTime}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Descripción</h4>
                        <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm">
                            {event.description || "Sin descripción proporcionada."}
                        </p>
                    </div>

                    <div className="bg-purple-50 p-3 rounded-2xl border border-purple-100">
                        <p className="text-[10px] font-bold text-purple-400 uppercase mb-1">ID del Creador</p>
                        <div className="text-purple-900 font-mono text-[11px] truncate">
                            {event.idUser || "N/A"}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2">
                            Joiners IDs ({event.joiners_id?.length || 0})
                        </h4>
                        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-2 custom-scrollbar">
                            {event.joiners_id && event.joiners_id.length > 0 ? (
                                event.joiners_id.map((id: string) => (
                                    <span key={id} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-mono border border-slate-200">
                                        {id}
                                    </span>
                                ))
                            ) : (
                                <p className="text-slate-400 text-sm italic">Nadie se ha unido aún.</p>
                            )}
                        </div>
                    </div>

                    <button onClick={onClose} className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all mt-2">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DetailsModal;