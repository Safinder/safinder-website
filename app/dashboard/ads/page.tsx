"use client";

import { useState, useEffect } from "react";
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    Timestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

interface Ad {
    id?: string;
    title: string;
    description: string;
    linkedEvent: string;
    active: boolean;
    startDate: any;
    endDate: any;
    logoUrl?: string; // New Optional field
}

interface EventItem {
    id: string;
    title: string;
    date: any;
}

export default function AdsDashboard() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [eventSearch, setEventSearch] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    // Visibility state for the Form Panel/Modal
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        id: "",
        title: "",
        description: "",
        linkedEvent: "",
        active: true,
        startDate: "",
        endDate: "",
        logoUrl: ""
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const eventsRef = collection(db, "events");
            const eventsSnapshot = await getDocs(eventsRef);

            const eventsList = eventsSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.title,
                    dateObject: data.date ? new Date(data.date) : null
                };
            })
                .filter(event => event.dateObject && event.dateObject >= today)
                .map(event => ({
                    id: event.id,
                    title: event.title,
                    date: event.dateObject
                }));

            setEvents(eventsList);

            const adsSnapshot = await getDocs(collection(db, "ads"));
            const adsList = adsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Ad[];
            setAds(adsList);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLogoFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploadingLogo(true);

        try {
            let finalLogoUrl = formData.logoUrl;

            // Handle uploading new file to Firebase Storage if selected
            if (logoFile) {
                const storageRef = ref(storage, `logos/${Date.now()}_${logoFile.name}`);
                const uploadSnapshot = await uploadBytes(storageRef, logoFile);
                finalLogoUrl = await getDownloadURL(uploadSnapshot.ref);
            }

            const adData = {
                title: formData.title,
                description: formData.description,
                linkedEvent: formData.linkedEvent || "",
                active: formData.active,
                startDate: Timestamp.fromDate(new Date(formData.startDate)),
                endDate: Timestamp.fromDate(new Date(formData.endDate)),
                logoUrl: finalLogoUrl
            };

            if (isEditing && formData.id) {
                await updateDoc(doc(db, "ads", formData.id), adData);
            } else {
                await addDoc(collection(db, "ads"), adData);
            }

            resetForm();
            fetchData();
        } catch (error) {
            console.error("Error saving ad:", error);
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleEditClick = (ad: Ad) => {
        setIsEditing(true);
        setIsFormOpen(true); // Open panel automatically for editing
        setFormData({
            id: ad.id || "",
            title: ad.title,
            description: ad.description,
            linkedEvent: ad.linkedEvent,
            active: ad.active,
            startDate: ad.startDate?.toDate().toISOString().split("T")[0] || "",
            endDate: ad.endDate?.toDate().toISOString().split("T")[0] || "",
            logoUrl: ad.logoUrl || ""
        });
    };

    const resetForm = () => {
        setIsEditing(false);
        setIsFormOpen(false);
        setEventSearch("");
        setIsDropdownOpen(false);
        setLogoFile(null);
        setFormData({
            id: "",
            title: "",
            description: "",
            linkedEvent: "",
            active: true,
            startDate: "",
            endDate: "",
            logoUrl: ""
        });
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500 font-medium">Cargando el panel de gestión de anuncios...</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen relative">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Anuncios</h1>
                    <p className="text-sm text-gray-500 mt-1">Crear, ver y vincular anuncios a eventos próximos.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsFormOpen(true); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg text-sm transition-colors shadow-sm self-start sm:self-center"
                >
                    + Crear Anuncio
                </button>
            </header>

            {/* Overlay Form Modal / Section */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex justify-end transition-opacity animate-fadeIn">
                    <div className="bg-white w-full max-w-md h-full p-6 shadow-2xl overflow-y-auto z-50 flex flex-col justify-between border-l border-gray-200">
                        <div>
                            <div className="flex items-center justify-between mb-6 border-b pb-4">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {isEditing ? "Editar Anuncio" : "Nuevo Anuncio"}
                                </h2>
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
                            </div>
                            
                            <form onSubmit={handleSubmit} id="adForm" className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                    <textarea
                                        required
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo de la Empresa</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                        onChange={handleFileChange}
                                    />
                                    {formData.logoUrl && !logoFile && (
                                        <p className="text-xs text-gray-400 mt-1">Ya cuenta con un logo guardado.</p>
                                    )}
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Linked Event (Optional)
                                    </label>

                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded-lg p-2 pr-10 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                                            placeholder="Search and select an event..."
                                            value={
                                                isDropdownOpen
                                                    ? eventSearch
                                                    : events.find(e => e.id === formData.linkedEvent)?.title || ""
                                            }
                                            onFocus={() => setIsDropdownOpen(true)}
                                            onChange={(e) => {
                                                setIsDropdownOpen(true);
                                                setEventSearch(e.target.value);
                                            }}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                            ▼
                                        </div>
                                    </div>

                                    {isDropdownOpen && (
                                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            <ul className="py-1 text-sm text-gray-700">
                                                <li
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-400 italic border-b border-gray-100"
                                                    onClick={() => {
                                                        setFormData({ ...formData, linkedEvent: "" });
                                                        setEventSearch("");
                                                        setIsDropdownOpen(false);
                                                    }}
                                                >
                                                    -- No Linked Event --
                                                </li>

                                                {events
                                                    .filter(event =>
                                                        event.title.toLowerCase().includes(eventSearch.toLowerCase())
                                                    )
                                                    .map(event => (
                                                        <li
                                                            key={event.id}
                                                            className={`px-4 py-2 hover:bg-blue-600 hover:text-white cursor-pointer ${formData.linkedEvent === event.id ? "bg-blue-50 font-semibold text-blue-600" : ""
                                                                }`}
                                                            onClick={() => {
                                                                setFormData({ ...formData, linkedEvent: event.id });
                                                                setEventSearch("");
                                                                setIsDropdownOpen(false);
                                                            }}
                                                        >
                                                            {event.title}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={formData.startDate}
                                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de finalización</label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={formData.endDate}
                                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 pt-2">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        checked={formData.active}
                                        onChange={e => setFormData({ ...formData, active: e.target.checked })}
                                    />
                                    <label htmlFor="active" className="text-sm font-medium text-gray-700">Establecer anuncio como activo</label>
                                </div>
                            </form>
                        </div>

                        <div className="flex space-x-2 border-t pt-4 bg-white mt-auto">
                            <button
                                type="submit"
                                form="adForm"
                                disabled={uploadingLogo}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                            >
                                {uploadingLogo ? "Guardando..." : isEditing ? "Actualizar Anuncio" : "Publicar Anuncio"}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                    {/* Dark backing overlay area allows closure */}
                    <div className="absolute inset-0 -z-10" onClick={resetForm} />
                </div>
            )}

            {/* Ads List Table Column takes up full space now */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Anuncios Actuales</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <th className="px-6 py-3">Logo</th>
                                <th className="px-6 py-3">Información del Anuncio</th>
                                <th className="px-6 py-3">ID del Evento Vinculado</th>
                                <th className="px-6 py-3">Duración</th>
                                <th className="px-6 py-3">Estado</th>
                                <th className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm">
                            {ads.map(ad => (
                                <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        {ad.logoUrl ? (
                                            <img src={ad.logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded border bg-gray-50" />
                                        ) : (
                                            <div className="w-10 h-10 rounded border bg-gray-100 flex items-center justify-center text-xs text-gray-400">N/A</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{ad.title}</div>
                                        <div className="text-gray-500 text-xs line-clamp-2 max-w-xs">{ad.description}</div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-mono text-gray-600">
                                        {ad.linkedEvent ? (
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 block truncate max-w-[120px]">
                                                {ad.linkedEvent}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 italic">Ninguno</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-600">
                                        <div><span className="font-medium">Inicio:</span> {ad.startDate?.toDate().toLocaleDateString()}</div>
                                        <div><span className="font-medium">Fin:</span> {ad.endDate?.toDate().toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ad.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                            {ad.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleEditClick(ad)}
                                            className="text-blue-600 hover:text-blue-900 font-medium text-xs bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors"
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {ads.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-400 italic">
                                        No se encontraron anuncios. ¡Crea uno arriba!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}