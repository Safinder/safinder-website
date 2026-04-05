"use client";

import React, { useEffect, useState } from "react";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc,
  writeBatch 
} from "firebase/firestore";
import { AlertCircle, CheckCircle, Trash2, MessageSquare } from "lucide-react";
import { db } from "@/lib/firebase";

interface Report {
  id: string;
  eventId: string;
  ownerId: string;
  reason: string;
  status: "pending" | "appealed";
  appeal?: {
    statement: string;
    createdAt: any;
  };
  createdAt: any;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We fetch everything that isn't resolved yet
    const q = query(
      collection(db, "reports"), 
      where("status", "in", ["pending", "appealed"])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Report));
      // Sort: Appealed first, then by date
      docs.sort((a, b) => (a.status === "appealed" ? -1 : 1));
      setReports(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* ─────────── ACTIONS ─────────── */

  const handleRestore = async (report: Report) => {
    try {
      const batch = writeBatch(db);
      
      // 1. Remove isSpam flag from event
      batch.update(doc(db, "events", report.eventId), {
        isSpam: false,
        reported: false // Optional: clean up flag
      });

      // 2. Mark report as resolved/dismissed
      batch.update(doc(db, "reports", report.id), {
        status: "resolved_dismissed",
        resolvedAt: new Date()
      });

      await batch.commit();
      alert("Evento restaurado con éxito.");
    } catch (e) {
      console.error(e);
      alert("Error al restaurar.");
    }
  };

  const handleDeleteEvent = async (report: Report) => {
    const confirm = window.confirm("¿Estás seguro de que quieres eliminar este evento permanentemente?");
    if (!confirm) return;

    try {
      const batch = writeBatch(db);

      // 1. Delete the event document
      batch.delete(doc(db, "events", report.eventId));

      // 2. Mark report as confirmed spam
      batch.update(doc(db, "reports", report.id), {
        status: "resolved_deleted",
        resolvedAt: new Date()
      });

      await batch.commit();
      alert("Evento eliminado permanentemente.");
    } catch (e) {
      console.error(e);
      alert("Error al eliminar.");
    }
  };

  if (loading) return <div className="p-10 text-center">Cargando reportes...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Moderación</h1>
        <p className="text-gray-500">{reports.length} casos pendientes de revisión</p>
      </header>

      <div className="grid gap-6">
        {reports.length === 0 && (
          <div className="bg-white p-10 rounded-xl text-center border border-gray-200">
            <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
            <p className="text-xl font-semibold">¡Todo limpio!</p>
            <p className="text-gray-500">No hay grupos reportados actualmente.</p>
          </div>
        )}

        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className={`p-4 flex justify-between items-center ${report.status === 'appealed' ? 'bg-amber-50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2">
                {report.status === 'appealed' ? (
                  <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">APELADO</span>
                ) : (
                  <span className="bg-gray-400 text-white text-xs font-bold px-2 py-1 rounded">PENDIENTE</span>
                )}
                <span className="text-xs text-gray-500">ID Evento: {report.eventId}</span>
              </div>
              <span className="text-xs text-gray-400">{report.createdAt?.toDate().toLocaleString()}</span>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-8">
              {/* Left Column: The Report */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Motivo del Reporte</h3>
                <div className="flex gap-3 items-center ">
                  <AlertCircle className="text-red-500 shrink-0" size={20} />
                  <p className="text-gray-800 text-lg">{report.reason}</p>
                </div>
              </div>

              {/* Right Column: The Appeal */}
              <div className="border-l border-gray-100 pl-8">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Declaración de la admin</h3>
                {report.appeal ? (
                  <div className="flex gap-3 items-start">
                    <MessageSquare className="text-blue-500 shrink-0" size={20} />
                    <p className="italic text-gray-700 whitespace-pre-line break-words max-w-md">"{report.appeal.statement}"</p>
                  </div>
                ) : (
                  <p className="text-gray-400 italic">El usuario aún no ha enviado ninguna declaración.</p>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
              <button 
                onClick={() => handleRestore(report)}
                className="flex items-center gap-2 px-4 py-2 text-green-700 font-semibold hover:bg-green-100 rounded-lg transition-colors"
              >
                <CheckCircle size={18} />
                Restaurar Grupo
              </button>
              <button 
                onClick={() => handleDeleteEvent(report)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold hover:bg-red-600 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
                Eliminar Permanentemente
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}