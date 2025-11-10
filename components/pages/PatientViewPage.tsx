
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { User, Patient, Session, TherapyType } from '../../types.ts';
import { useAuth } from '../../contexts/AuthContext'; // CORREÇÃO: Importa do novo contexto
import Header from '../dashboard/Header.tsx';
import PatientProfile from '../dashboard/PatientProfile.tsx';
import SessionLogger from '../dashboard/SessionLogger.tsx';
import SessionList from '../dashboard/SessionList.tsx';
import AnalysisRequester from '../dashboard/AnalysisRequester.tsx';

const MOCK_PATIENTS: Patient[] = [
    {
        id: 'patient-01',
        name: 'Lucas Almeida',
        birthDate: '2018-05-15',
        diagnosis: 'Transtorno do Espectro Autista (TEA)',
        avatarUrl: `https://api.dicebear.com/8.x/adventurer/svg?seed=Lucas&backgroundColor=b6e3f4`,
        organizationId: 'org-01',
        guardianId: 'guardian-01',
        assignedProfessionalIds: ['prof-01']
    },
    {
        id: 'patient-02',
        name: 'Mariana Silva',
        birthDate: '2019-02-10',
        diagnosis: 'Atraso de Fala',
        avatarUrl: `https://api.dicebear.com/8.x/adventurer/svg?seed=Mariana&backgroundColor=c0aede`,
        organizationId: 'org-02',
        guardianId: 'guardian-02',
        assignedProfessionalIds: ['prof-01']
    }
];

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
];

const PatientViewPage: React.FC = () => {
    const { patientId } = useParams<{ patientId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [patient, setPatient] = useState<Patient | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const foundPatient = MOCK_PATIENTS.find(p => p.id === patientId);
            if (foundPatient) {
                setPatient(foundPatient);
                const patientSessions = MOCK_SESSIONS.filter(s => s.patientId === patientId);
                setSessions(patientSessions);
            } else {
                navigate('/');
            }
            setLoading(false);
        }, 500);
    }, [patientId, navigate]);

    const handleSaveSession = (notes: string, therapyType: TherapyType, audioBlob?: Blob) => {
        if (!user || !patient) return;

        const newSession: Session = {
            id: `session-${Date.now()}`,
            date: new Date().toISOString(),
            therapistName: user.name,
            therapistId: user.id,
            patientId: patient.id,
            therapyType,
            notes,
            audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : undefined,
            aiFeedback: 'Análise pendente...'
        };
        
        console.log("Salvando sessão para o paciente " + patient.id, newSession);
        setSessions(prevSessions => [newSession, ...prevSessions]);
    };

    const handleRequestAnalysis = (query: string) => {
        if (!patient) return;
        console.log(`Requesting analysis for patient ${patient.name}:`, query);
        alert(`Pedido de análise enviado: "${query}".`);
    };

    if (loading || !patient || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <p className="text-lg font-medium text-slate-600">Carregando dados do paciente...</p>
            </div>
        );
    }

    const canLogSessions = user.profileType === 'profissional' && 
                           patient.assignedProfessionalIds.includes(user.id);

    return (
        <div className="min-h-screen bg-slate-100">
            <Header />
            <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="mb-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                    >
                        <span>&larr; Voltar</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-8">
                        <PatientProfile patient={patient} />
                        <AnalysisRequester onRequest={handleRequestAnalysis} />
                    </div>
                    <div className="lg:col-span-2 space-y-8">
                        {canLogSessions && <SessionLogger onSave={handleSaveSession} />}
                        <SessionList sessions={sessions} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PatientViewPage;
