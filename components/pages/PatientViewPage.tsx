// src/components/pages/PatientViewPage.tsx

import React, { useState } from 'react';
import type { User, Patient, Session, TherapyType } from '../../types.ts';
import Header from '../dashboard/Header.tsx';
import PatientProfile from '../dashboard/PatientProfile.tsx';
import SessionLogger from '../dashboard/SessionLogger.tsx';
import SessionList from '../dashboard/SessionList.tsx';
import AnalysisRequester from '../dashboard/AnalysisRequester.tsx';
// (Você precisará de um ícone de "Voltar")
// import ArrowLeftIcon from '../icons/ArrowLeftIcon.tsx'; 

interface PatientViewPageProps {
  user: User;
  patient: Patient;
  onLogout: () => void;
  onBack: () => void; // Função para voltar ao dashboard
}

// MOCK_SESSIONS agora devem pertencer a um paciente específico
const MOCK_SESSIONS: Session[] = [
    {
        id: 'session-01',
        patientId: 'patient-01',
        date: '2024-07-22T10:00:00Z',
        therapistName: 'Dra. Ana Carolina',
        therapistId: 'prof-01',
        therapyType: 'Fonoaudiologia',
        notes: 'Sessão focada em fonemas bilabiais...',
        aiFeedback: 'Padrão de dificuldade de atenção identificado...'
    },
    // ... outras sessoes
];

const PatientViewPage: React.FC<PatientViewPageProps> = ({ user, patient, onLogout, onBack }) => {
    // Em um app real, você buscaria as sessões DESTE paciente
    // ex: const { sessions } = useData(patient.id);
    const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);

    const handleSaveSession = (notes: string, therapyType: TherapyType, audioBlob?: Blob) => {
        const newSession: Session = {
            id: `session-${Date.now()}`,
            date: new Date().toISOString(),
            therapistName: user.name,
            therapistId: user.id,
            patientId: patient.id,
            therapyType,
            notes,
            audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : undefined,
            aiFeedback: 'Análise pendente. O áudio/texto está sendo processado.'
        };
        
        // ** PONTO DE INTEGRAÇÃO REAL **
        // Aqui você salvaria a sessão no Firestore, ex:
        // await addDoc(collection(db, "patients", patient.id, "sessions"), newSession);
        console.log("Saving session for patient " + patient.id, newSession);

        setSessions(prevSessions => [newSession, ...prevSessions]);
    };

    const handleRequestAnalysis = (query: string) => {
        // ** PONTO DE INTEGRAÇÃO REAL **
        console.log(`Requesting analysis for patient ${patient.name}:`, query);
        alert(`Pedido de análise enviado: "${query}".`);
    };

    // Decide se o usuário pode registrar sessões (é um profissional?)
    const canLogSessions = user.profileType === 'profissional' && 
                           patient.assignedProfessionalIds.includes(user.id);

  return (
    <div className="min-h-screen bg-slate-100">
      <Header user={user} onLogout={onLogout} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        
        {/* Botão de Voltar */}
        <div className="mb-4">
            <button 
                onClick={onBack}
                className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
                {/* <ArrowLeftIcon className="h-4 w-4" /> */}
                <span>Voltar ao Painel</span>
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-8">
                <PatientProfile patient={patient} />
                <AnalysisRequester onRequest={handleRequestAnalysis} />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-8">
                {/* Só mostra o logger se for um profissional vinculado */}
                {canLogSessions && <SessionLogger onSave={handleSaveSession} />}
                <SessionList sessions={sessions} />
            </div>
        </div>
      </main>
    </div>
  );
};

export default PatientViewPage;