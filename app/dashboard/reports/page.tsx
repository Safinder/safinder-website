"use client";

import React, { useEffect, useState } from "react";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc,
  getDoc,
  writeBatch 
} from "firebase/firestore";
import { AlertCircle, CheckCircle, Trash2, MessageSquare } from "lucide-react";
import { db } from "@/lib/firebase";

interface Report {
  id: string;
  eventId?: string;        // Present if it's an event or group
  reportedUserId?: string; // Present if it's a user
  ownerId: string;
  reason: string;
  status: "pending" | "appealed";
  appeal?: {
    statement: string;
    createdAt: any;
  };
  createdAt: any;
}

// Helper interface to keep track of where the item was found and its name
interface TargetDetails {
  name: string;
  collection: "events" | "groups" | "users";
  id: string;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  // Store resolved names and their verified collection type
  const [targetDetails, setTargetDetails] = useState<Record<string, TargetDetails>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "reports"), 
      where("status", "in", ["pending", "appealed"])
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Report));
      docs.sort((a, b) => (a.status === "appealed" ? -1 : 1));
      setReports(docs);

      const detailsMap: Record<string, TargetDetails> = { ...targetDetails };
      
      const fetchPromises = docs.map(async (report) => {
        const targetId = report.reportedUserId || report.eventId;
        if (!targetId || detailsMap[targetId]) return; // Skip if missing or already fetched

        try {
          // Case 1: It's a User report
          if (report.reportedUserId) {
            const userSnap = await getDoc(doc(db, "users", report.reportedUserId));
            detailsMap[targetId] = {
              id: targetId,
              collection: "users",
              name: userSnap.exists() ? (userSnap.data().displayName || userSnap.data().name || "Usuario") : "Usuario no encontrado"
            };
          } 
          // Case 2: It's an Event or Group report (sharing eventId field)
          else if (report.eventId) {
            // First, try checking the events collection
            const eventSnap = await getDoc(doc(db, "events", report.eventId));
            if (eventSnap.exists()) {
              detailsMap[targetId] = {
                id: targetId,
                collection: "events",
                name: eventSnap.data().title || "Evento sin nombre"
              };
            } else {
              // If not found in events, look into groups
              const groupSnap = await getDoc(doc(db, "groups", report.eventId));
              detailsMap[targetId] = {
                id: targetId,
                collection: "groups",
                name: groupSnap.exists() ? (groupSnap.data().name || "Grupo sin nombre") : "Elemento no encontrado (Eliminado)"
              };
            }
          }
        } catch (error) {
          console.error(`Error loading target info for ID ${targetId}:`, error);
          detailsMap[targetId] = { id: targetId, collection: "events", name: "Error al cargar info" };
        }
      });

      await Promise.all(fetchPromises);
      setTargetDetails(detailsMap);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* ─────────── ACTIONS ─────────── */

  const handleRestore = async (report: Report) => {
    const targetId = report.reportedUserId || report.eventId;
    const details = targetDetails[targetId!];
    
    if (!details) return alert("Cargando detalles, intenta de nuevo.");

    try {
      const batch = writeBatch(db);
      
      // 1. Remove penalty flags dynamically from the discovered collection
      batch.update(doc(db, details.collection, details.id), {
        isSpam: false,
        reported: false
      });

      // 2. Resolve the report
      batch.update(doc(db, "reports", report.id), {
        status: "resolved_dismissed",
        resolvedAt: new Date()
      });

      await batch.commit();
      alert("Elemento restaurado con éxito.");
    } catch (e) {
      console.error(e);
      alert("Error al restaurar.");
    }
  };

  const handleDeleteEntity = async (report: Report) => {
    const targetId = report.reportedUserId || report.eventId;
    const details = targetDetails[targetId!];
    
    if (!details) return alert("Cargando detalles, intenta de nuevo.");

    const translation = { events: "evento", groups: "grupo", users: "usuario" };
    const label = translation[details.collection];

    const confirm = window.confirm(`¿Estás seguro de que quieres eliminar este ${label} permanentemente?`);
    if (!confirm) return;

    try {
      const batch = writeBatch(db);

      // 1. Delete target document from its source collection
      batch.delete(doc(db, details.collection, details.id));

      // 2. Confirm report state
      batch.update(doc(db, "reports", report.id), {
        status: "resolved_deleted",
        resolvedAt: new Date()
      });

      await batch.commit();
      alert(`El ${label} ha sido eliminado permanentemente.`);
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
            <p className="text-gray-500">No hay reportes pendientes.</p>
          </div>
        )}

        {reports.map((report) => {
          const targetId = report.reportedUserId || report.eventId;
          const info = targetDetails[targetId || ""];

          return (
            <div key={report.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className={`p-4 flex justify-between items-center ${report.status === 'appealed' ? 'bg-amber-50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2">
                  {report.status === 'appealed' ? (
                    <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">APELADO</span>
                  ) : (
                    <span className="bg-gray-400 text-white text-xs font-bold px-2 py-1 rounded">PENDIENTE</span>
                  )}
                  {info && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded uppercase">
                      {info.collection === "events" ? "Evento" : info.collection === "groups" ? "Grupo" : "Usuario"}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">ID: {targetId}</span>
                </div>  
                <span className="text-xs text-gray-400">{report.createdAt?.toDate().toLocaleString()}</span>
              </div>

              <div className="p-6 grid md:grid-cols-2 gap-8">
                {/* Left Column: Discovered Target Name & Reason */}
                <div>
                  <div className="mb-4">
                    <p className="text-xl font-bold text-gray-900">
                      {info ? info.name : "Cargando..."}
                    </p>
                  </div>

                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Motivo del Reporte</h3>
                  <div className="flex gap-3 items-center ">
                    <AlertCircle className="text-red-500 shrink-0" size={20} />
                    <p className="text-gray-800 text-lg">{report.reason}</p>
                  </div>
                </div>

                {/* Right Column: The Appeal */}
                <div className="border-l border-gray-100 pl-8">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Declaración del afectado</h3>
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
                  Restaurar Elemento
                </button>
                <button 
                  onClick={() => handleDeleteEntity(report)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold hover:bg-red-600 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                  Eliminar Permanentemente
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}