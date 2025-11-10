
import React, { useState } from 'react';
import PaperAirplaneIcon from '../icons/PaperAirplaneIcon.tsx';

interface AnalysisRequesterProps {
    onRequest: (query: string) => void;
}

const AnalysisRequester: React.FC<AnalysisRequesterProps> = ({ onRequest }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        onRequest(query);
        setQuery('');
    };

    return (
        <section aria-labelledby="analysis-requester-heading" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 id="analysis-requester-heading" className="text-lg font-bold text-slate-800 mb-2">Análise Específica</h2>
            <p className="text-sm text-slate-600 mb-4">Peça ao Gemini para analisar dados específicos. Ex: "Compare a evolução da comunicação nos últimos 3 meses."</p>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Sua pergunta..."
                    className="flex-grow block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <button 
                    type="submit"
                    aria-label="Enviar pedido de análise"
                    className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                    disabled={!query.trim()}
                >
                    <PaperAirplaneIcon className="h-5 w-5" />
                </button>
            </form>
        </section>
    );
};

export default AnalysisRequester;
