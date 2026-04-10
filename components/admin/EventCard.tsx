import { Timestamp } from "firebase/firestore";
import { AlertTriangle, Calendar, MapPin, ShieldAlert, Trash2, Users } from "lucide-react";

function EventCard({ event, onOpenDetails, onReport, onDelete }: any) {
    const eventDate = event.date instanceof Timestamp ? event.date.toDate() : new Date(event.date);
    const isSpam = event.isSpam === true;

    return (
        <div className={`relative bg-white border rounded-2xl overflow-hidden shadow-sm transition-all group flex flex-col
            ${isSpam
                ? 'border-red-200 bg-red-50/30 opacity-80 grayscale-[0.5]'
                : 'border-slate-200 hover:border-pink-200'}`}
        >
            {/* Spam Badge */}
            {isSpam && (
                <div className="absolute top-0 right-0 left-0 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest py-1 text-center z-10">
                    Contenido Reportado
                </div>
            )}

            <div className={`p-5 space-y-4 flex-1 ${isSpam ? 'pt-8' : ''}`}>
                <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className={`text-3xl w-14 h-14 flex items-center justify-center rounded-2xl border shadow-sm transition-transform group-hover:scale-105
                            ${isSpam ? 'bg-red-100 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                            {isSpam ? "🚫" : (event.icon || "📍")}
                        </div>
                        <div>
                            <h3 className={`font-bold text-md leading-tight ${isSpam ? 'text-red-900 line-through' : 'text-slate-900'}`}>
                                {event.title}
                            </h3>
                            <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                                <MapPin size={12} className={isSpam ? 'text-red-400' : 'text-pink-500'} />
                                <span className="line-clamp-1">{event.address || "No especificada"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100">
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Joiners</p>
                        <div className="flex items-center justify-center gap-1 mt-1 text-slate-700 font-bold text-sm">
                            <Users size={14} className="text-blue-500" />
                            {event.joiners_id?.length || 0}
                        </div>
                    </div>
                    <div className="text-center border-x border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Fecha</p>
                        <div className="flex items-center justify-center gap-1 mt-1 text-slate-700 font-bold text-sm">
                            <Calendar size={14} className="text-pink-500" />
                            {eventDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Estado</p>
                        <div className="mt-1 flex justify-center">
                            {isSpam ? (
                                <ShieldAlert size={18} className="text-red-600" />
                            ) : (
                                <div className="mt-1 flex justify-center gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onReport(); }}
                                        className="text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        <AlertTriangle size={18} />
                                    </button>
                                    {/* DELETE BUTTON */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(event.id);
                                        }}
                                        className="text-red-600 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                            )}
                        </div>
                    </div>
                </div>

                {isSpam ? (
                    <p className="text-red-600 text-sm italic mt-2">Este evento ha sido marcado como spam.</p>
                ) : (
                    <button
                        onClick={onOpenDetails}
                        className="w-full py-2 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-all"
                    >
                        Ver Detalles
                    </button>
                )}
            </div>
        </div>
    );
}

export default EventCard;