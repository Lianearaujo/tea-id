
import React from 'react';
import type { Session } from '../../types.ts';
import SparklesIcon from '../icons/SparklesIcon.tsx';

interface SessionListProps {
  sessions: Session[];
}

const SessionItem: React.FC<{ session: Session }> = ({ session }) => {
    const formattedDate = new Date(session.date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <li className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-bold text-slate-800">{session.therapyType}</p>
                    <p className="text-xs text-slate-500">com {session.therapistName}</p>
                </div>
                <p className="text-xs text-slate-500">{formattedDate}</p>
            </div>
            <p className="mt-3 text-sm text-slate-700 whitespace-pre-wrap">{session.notes}</p>
            {session.audioUrl && (
                <div className="mt-3">
                    <audio controls src={session.audioUrl} className="w-full h-10">
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}
            {session.aiFeedback && (
                <div className="mt-4 bg-indigo-50 p-3 rounded-md border-l-4 border-indigo-400">
                    <div className="flex items-center gap-2">
                        <SparklesIcon className="h-5 w-5 text-indigo-600" />
                        <h4 className="text-sm font-semibold text-indigo-800">Feedback do Gemini</h4>
                    </div>
                    <p className="mt-1 text-sm text-indigo-700">{session.aiFeedback}</p>
                </div>
            )}
        </li>
    );
};

const SessionList: React.FC<SessionListProps> = ({ sessions }) => {
  return (
    <section aria-labelledby="session-list-heading">
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 id="session-list-heading" className="text-lg font-bold text-slate-800 mb-4">Histórico de Sessões</h2>
            {sessions.length > 0 ? (
                <ul className="space-y-4">
                    {sessions.map(session => <SessionItem key={session.id} session={session} />)}
                </ul>
            ) : (
                <p className="text-center text-sm text-slate-500 py-8">Nenhuma sessão registrada ainda.</p>
            )}
        </div>
    </section>
  );
};

export default SessionList;
