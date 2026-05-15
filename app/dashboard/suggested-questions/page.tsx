'use client';

import { db } from '@/lib/firebase';
import {
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    startAfter,
    endBefore,
} from 'firebase/firestore';
import { useEffect, useState, useRef } from "react";

interface QuestionSuggestion {
    question: string;
    interest: string;
    answers: string[];
}


const PAGE_SIZE = 5;

const SuggestedQuestionsPage = () => {
    const [questions, setQuestions] = useState<QuestionSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageCursors, setPageCursors] = useState<any[]>([]); // Array of last docs for each page
    const [currentPage, setCurrentPage] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);
    const lastVisibleRef = useRef<any>(null);
    const firstVisibleRef = useRef<any>(null);

    const fetchQuestions = async (direction: 'next' | 'prev' | 'initial' = 'initial') => {
        setLoading(true);
        try {
            const questionsRef = collection(db, "questions_suggestions");
            let q;
            let cursors = [...pageCursors];

            if (direction === 'next' && lastVisibleRef.current) {
                q = query(questionsRef, orderBy('question'), startAfter(lastVisibleRef.current), limit(PAGE_SIZE));
            } else if (direction === 'prev' && cursors.length > 1) {
                // Go back to previous page
                const prevCursor = cursors[cursors.length - 2];
                q = query(questionsRef, orderBy('question'), startAfter(prevCursor), limit(PAGE_SIZE));
            } else {
                // Initial load
                q = query(questionsRef, orderBy('question'), limit(PAGE_SIZE));
            }

            const snapshot = await getDocs(q);
            const fetchedQuestions: QuestionSuggestion[] = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data?.question && data?.interest && data?.answers) {
                    fetchedQuestions.push({
                        question: data.question,
                        interest: data.interest,
                        answers: data.answers,
                    });
                }
            });

            setQuestions(fetchedQuestions);
            setHasPrev(currentPage > 0);
            setHasNext(snapshot.size === PAGE_SIZE);

            if (!snapshot.empty) {
                lastVisibleRef.current = snapshot.docs[snapshot.docs.length - 1];
                firstVisibleRef.current = snapshot.docs[0];
                if (direction === 'next') {
                    setPageCursors([...cursors, lastVisibleRef.current]);
                    setCurrentPage((prev) => prev + 1);
                } else if (direction === 'prev') {
                    setCurrentPage((prev) => (prev > 0 ? prev - 1 : 0));
                    setPageCursors(cursors.slice(0, -1));
                } else {
                    setPageCursors([lastVisibleRef.current]);
                    setCurrentPage(0);
                }
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions('initial');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleNext = () => {
        if (hasNext) fetchQuestions('next');
    };

    const handlePrev = () => {
        if (hasPrev) fetchQuestions('prev');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-slate-500">Loading questions...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Preguntas Sugeridas</h1>
                <p className="text-slate-500">Preguntas impulsadas por la comunidad para nuestras próximas actualizaciones.</p>
            </div>

            <div>
                {questions.map((q) => (
                    <div key={`${q.question}-${q.interest}`} className="bg-white p-4 rounded-2xl mb-3">
                        <div className={`flex items-center gap-4 rounded-full w-fit ${q.interest === 'romantic' ? 'bg-pink-200 border border-pink-500' : 'bg-amber-300 border border-amber-500'}`}>
                            <p className={`font-semibold py-1 px-2 text-sm ${q.interest === 'romantic' ? 'text-pink-700' : 'text-amber-700'}`}>{q.interest}</p>
                        </div>

                        <p className="text-slate-800 font-semibold my-2">{q.question}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {q.answers.map((a, index) => (
                                <div key={index} className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl mt-2">
                                    <p className="text-slate-700 bg-slate-200 rounded-full px-4 py-2.5 font-semibold">{index + 1}</p>
                                    <p className="text-slate-700">{a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-4 mt-6">
                <button
                    className="px-4 py-2 rounded bg-slate-200 text-slate-700 disabled:opacity-50"
                    onClick={handlePrev}
                    disabled={!hasPrev}
                >
                    Anterior
                </button>
                <button
                    className="px-4 py-2 rounded bg-slate-200 text-slate-700 disabled:opacity-50"
                    onClick={handleNext}
                    disabled={!hasNext}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default SuggestedQuestionsPage;