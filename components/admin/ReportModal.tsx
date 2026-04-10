import { ShieldAlert } from "lucide-react";
import { useState } from "react";

function ReportModal({ event, onClose, onConfirm }: any) {
    const [reason, setReason] = useState("Spam / Bot");
    const reasons = ["Spam / Bot", "Contenido inapropiado", "Evento falso", "Lenguaje ofensivo", "Otro"];

    return (
        <div className="fixed inset-0 z-[60] !mt-0 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
                <div className="flex items-center gap-3 text-red-600">
                    <ShieldAlert size={24} />
                    <h2 className="text-xl font-bold">Reportar Evento</h2>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed">
                    Estás marcando <span className="font-bold text-slate-800">"{event.title}"</span> para revisión administrativa.
                </p>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Motivo del reporte</label>
                    <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    >
                        {reasons.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>

                <div className="flex gap-3 pt-2">
                    <button onClick={onClose} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                        Cancelar
                    </button>
                    <button
                        onClick={() => onConfirm(event.id, event.ownerId, reason)}
                        className="flex-1 py-3 font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-lg shadow-red-100 transition-all"
                    >
                        Reportar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReportModal;