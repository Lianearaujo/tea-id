
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, Patient } from '../../types.ts';
import Header from '../dashboard/Header.tsx';

const MOCK_PROFESSIONAL_PATIENTS: Patient[] = [
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

const ProfessionalDashboard: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    // Simulação do usuário logado
    const mockUser: User = {
        id: 'prof-01',
        name: 'Dr. Carlos',
        email: 'carlos@example.com',
        profileType: 'profissional',
        documentId: 'CRM123456',
        createdAt: new Date(),
    };

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const myPatients = MOCK_PROFESSIONAL_PATIENTS.filter(p => 
                p.assignedProfessionalIds.includes(mockUser.id)
            );
            setPatients(myPatients);
            setLoading(false);
        }, 500);
    }, [mockUser.id]);

    const handleSelectPatient = (patient: Patient) => {
        navigate(`/patient/${patient.id}`);
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <Header />
            <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Seus Pacientes</h1>
                
                {loading ? (
                    <p>Carregando...</p>
                ) : (
                    <div className="space-y-4">
                        {patients.length > 0 ? patients.map(patient => (
                            <button
                                key={patient.id}
                                onClick={() => handleSelectPatient(patient)}
                                className="w-full text-left bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <img src={patient.avatarUrl} alt={patient.name} className="h-16 w-16 rounded-full bg-slate-200" />
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">{patient.name}</h2>
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
