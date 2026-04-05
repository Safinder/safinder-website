"use client";
import { useState, useEffect } from 'react';
import { rtdb } from '@/lib/firebase';
import { ref, get, set } from 'firebase/database';
import { Trash2, Plus, MessageCircle, Heart, Save, Loader2, Edit2 } from 'lucide-react';

export default function QuestionsManager() {
    const [category, setCategory] = useState<'questions_friendship' | 'questions_romantic'>('questions_friendship');
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Estado para controlar si estamos editando y qué índice
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    
    const initialQuestionState = {
        question: '',
        weight: 1,
        options: [
            { key: 'A', label: '' },
            { key: 'B', label: '' },
            { key: 'C', label: '' }
        ]
    };

    const [newQ, setNewQ] = useState(initialQuestionState);

    useEffect(() => {
        loadQuestions();
    }, [category]);

    const loadQuestions = async () => {
        setLoading(true);
        const snapshot = await get(ref(rtdb, category));
        if (snapshot.exists()) {
            setQuestions(snapshot.val());
        } else {
            setQuestions([]);
        }
        setLoading(false);
    };

    // Función para abrir el modal en modo edición
    const handleEditOpen = (q: any, index: number) => {
        setEditIndex(index);
        setNewQ(q);
        setShowForm(true);
    };

    // Función para cerrar y resetear
    const handleCloseForm = () => {
        setShowForm(false);
        setEditIndex(null);
        setNewQ(initialQuestionState);
    };

    const handleAddQuestion = async () => {
        let updatedQuestions = [...questions];

        if (editIndex !== null) {
            // Lógica de Edición
            updatedQuestions[editIndex] = { ...newQ, weight: Number(newQ.weight) };
        } else {
            // Lógica de Creación
            updatedQuestions.push({ ...newQ, id: questions.length + 1, weight: Number(newQ.weight) });
        }

        await set(ref(rtdb, category), updatedQuestions);
        setQuestions(updatedQuestions);
        handleCloseForm();
    };

    const deleteQuestion = async (index: number) => {
        if (!confirm("¿Seguro que quieres borrar esta pregunta?")) return;
        const updated = questions.filter((_, i) => i !== index)
            .map((q, i) => ({ ...q, id: i + 1 })); 
        await set(ref(rtdb, category), updated);
        setQuestions(updated);
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold">Gestión de Compatibilidad</h1>
                    <p className="text-slate-500 text-sm">Configura las preguntas del algoritmo de Safinder.</p>
                    <div className='bg-red-100 border border-red-400 rounded-lg py-3 px-4 mt-2'>
                        <p className='text-red-500 text-sm'>Han de haber mínimo 10 preguntas por categoría.</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-pink-700 transition-all"
                >
                    <Plus size={18} /> Nueva Pregunta
                </button>
            </div>

            {/* Selector de Categoría */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setCategory('questions_friendship')}
                    className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${category === 'questions_friendship' ? 'bg-white shadow-sm text-pink-600' : 'text-slate-500'}`}
                >
                    <MessageCircle size={18} /> Amistad
                </button>
                <button
                    onClick={() => setCategory('questions_romantic')}
                    className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${category === 'questions_romantic' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500'}`}
                >
                    <Heart size={18} /> Romántico
                </button>
            </div>

            {/* Listado de Preguntas */}
            <div className="grid gap-4">
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-pink-500" /></div>
                ) : (
                    questions.map((q, index) => (
                        <div key={index} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-pink-200 transition-colors group">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded uppercase">Pregunta {q.id}</span>
                                <div className="flex gap-2">
                                    {/* BOTÓN EDITAR */}
                                    <button onClick={() => handleEditOpen(q, index)} className="text-slate-300 hover:text-blue-500 transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => deleteQuestion(index)} className="text-slate-300 hover:text-red-500 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-bold text-slate-800 mb-4">{q.question}</h3>
                            <div className="grid gap-2">
                                {q.options.map((opt: any) => (
                                    <div key={opt.key} className="text-xs bg-slate-50 p-2 rounded-md border border-slate-100 flex gap-2">
                                        <span className="font-black text-pink-500">{opt.key}:</span>
                                        <span className="text-slate-600">{opt.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal para añadir/editar pregunta */}
            {showForm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-3xl rounded-3xl p-8 shadow-2xl space-y-6">
                        <h2 className="text-xl font-bold">
                            {editIndex !== null ? 'Editar pregunta' : `Añadir nueva pregunta a ${category === 'questions_friendship' ? 'Amistad' : 'Amor'}`}
                        </h2>

                        <div className="space-y-4">
                            <input
                                placeholder="Escribe la pregunta aquí..."
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-pink-500"
                                value={newQ.question}
                                onChange={e => setNewQ({ ...newQ, question: e.target.value })}
                            />

                            {newQ.options.map((opt, i) => (
                                <div key={opt.key} className="flex gap-3 items-center">
                                    <span className="font-bold text-pink-500">{opt.key}</span>
                                    <input
                                        placeholder={`Respuesta para opción ${opt.key}`}
                                        className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                                        value={opt.label}
                                        onChange={e => {
                                            const newOptions = [...newQ.options];
                                            newOptions[i].label = e.target.value;
                                            setNewQ({ ...newQ, options: newOptions });
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Peso de la pregunta (Algoritmo)</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="1"
                                    max="3"
                                    step="1"
                                    className="flex-1 accent-pink-600"
                                    value={newQ.weight}
                                    onChange={e => setNewQ({ ...newQ, weight: parseInt(e.target.value) })}
                                />
                                <span className="bg-pink-100 text-pink-700 font-bold px-3 py-1 rounded-lg w-12 text-center">
                                    x{newQ.weight}
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-400 italic">
                                *El peso define cuánto influye esta respuesta en el porcentaje de compatibilidad.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={handleCloseForm} className="flex-1 py-3 font-bold text-slate-500">Cancelar</button>
                            <button onClick={handleAddQuestion} className="flex-1 py-3 bg-pink-600 text-white rounded-xl font-bold shadow-lg shadow-pink-200">
                                {editIndex !== null ? 'Guardar cambios' : 'Publicar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}