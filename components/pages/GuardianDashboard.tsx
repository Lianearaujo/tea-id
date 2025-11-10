// src/components/pages/GuardianDashboard.tsx

import React, { useState, useEffect } from 'react';
import type { User, Patient } from '../../types.ts';
import Header from '../dashboard/Header.tsx';
// (Você precisará de um hook de dados, por enquanto usamos mock)
// import { useData } from '../../hooks/useData.ts'; 

// --- MOCK DATA ---
// (Em um app real, isso viria do hook useData)
const MOCK_GUARDIAN_PATIENTS: Patient[] = [
    {
        id: 'patient-01',
        name: 'Lucas Almeida',
        birthDate: '2018-05-15',
        diagnosis: 'Transtorno do Espectro Autista (TEA)',
        avatarUrl: `https://api.dicebear.com/8.x/adventurer/svg?seed=Lucas&backgroundColor=b6e3f4`,
        organizationId: 'org-01',
        guardianId: 'guardian-01', // ID do usuário Responsável
        assignedProfessionalIds: ['prof-01']
    }
];
// --- FIM MOCK DATA ---

interface GuardianDashboardProps {
  user: User;
  onLogout: () => void;
  onSelectPatient: (patient: Patient) => void;
}

const GuardianDashboard: React.FC<GuardianDashboardProps> = ({ user, onLogout, onSelectPatient }) => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ** PONTO DE INTEGRAÇÃO REAL **
        // const { data, loading } = useData().getPatientsForGuardian(user.id);
        // setPatients(data);
        // setLoading(loading);
        
        // Simulação:
        setLoading(true);
        setTimeout(() => {
            setPatients(MOCK_GUARDIAN_PATIENTS);
            setLoading(false);
        }, 500);
    }, [user.id]);

    return (
        <div className="min-h-screen bg-slate-100">
            <Header user={user} onLogout={onLogout} />
            <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Seus Dependentes</h1>
                {loading ? (
                    <p>Carregando...</p>
                ) : (
                    <div className="space-y-4">
                        {patients.length > 0 ? patients.map(patient => (
                            <button
                                key={patient.id}
                                onClick={() => onSelectPatient(patient)}
                                className="w-full text-left bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <img src={patient.avatarUrl} alt={patient.name} className="h-16 w-16 rounded-full bg-slate-200" />
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">{patient.name}</h2>
                                        <p className="text-sm text-slate-600">{patient.diagnosis}</p>
                                    </div>
                                    <span className="ml-auto text-sm font-medium text-indigo-600">Ver Progresso &rarr;</span>
                                </div>
                            </button>
                        )) : (
                            <p className="text-center text-slate-500">Nenhum dependente encontrado.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default GuardianDashboard;