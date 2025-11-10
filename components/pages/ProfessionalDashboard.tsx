// src/components/pages/ProfessionalDashboard.tsx

import React, { useState, useEffect } from 'react';
import type { User, Patient } from '../../types.ts';
import Header from '../dashboard/Header.tsx';
// import { useData } from '../../hooks/useData.ts'; 

// --- MOCK DATA ---
const MOCK_PROFESSIONAL_PATIENTS: Patient[] = [
    {
        id: 'patient-01',
        name: 'Lucas Almeida',
        birthDate: '2018-05-15',
        diagnosis: 'Transtorno do Espectro Autista (TEA)',
        avatarUrl: `https://api.dicebear.com/8.x/adventurer/svg?seed=Lucas&backgroundColor=b6e3f4`,
        organizationId: 'org-01', // (Em um app real, você usaria isso para buscar o nome da Org)
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
// --- FIM MOCK DATA ---

interface ProfessionalDashboardProps {
  user: User;
  onLogout: () => void;
  onSelectPatient: (patient: Patient) => void;
}

const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ user, onLogout, onSelectPatient }) => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ** PONTO DE INTEGRAÇÃO REAL **
        // const { data, loading } = useData().getPatientsForProfessional(user.id);
        
        // Simulação:
        setLoading(true);
        setTimeout(() => {
            // Filtra o mock para simular a query
            const myPatients = MOCK_PROFESSIONAL_PATIENTS.filter(p => 
                p.assignedProfessionalIds.includes('prof-01') // 'prof-01' seria user.id
            );
            setPatients(myPatients);
            setLoading(false);
        }, 500);
    }, [user.id]);

    return (
        <div className="min-h-screen bg-slate-100">
            <Header user={user} onLogout={onLogout} />
            <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Seus Pacientes</h1>
                
                {/* (Aqui você poderia adicionar um seletor para filtrar por organização) */}
                
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
                                        {/* (Você buscaria o nome da org pelo patient.organizationId) */}
                                        <p className="text-sm text-slate-600">Organização ID: {patient.organizationId}</p>
                                    </div>
                                    <span className="ml-auto text-sm font-medium text-indigo-600">Registrar Sessão &rarr;</span>
                                </div>
                            </button>
                        )) : (
                            <p className="text-center text-slate-500">Nenhum paciente atribuído a você no momento.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProfessionalDashboard;