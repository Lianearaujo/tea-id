
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, Patient } from '../../types.ts';
import Header from '../dashboard/Header.tsx';
import Button from '../ui/Button.tsx';

const MOCK_ORG_PATIENTS: Patient[] = [
    {
        id: 'patient-01',
        name: 'Lucas Almeida',
        birthDate: '2018-05-15',
        diagnosis: 'Transtorno do Espectro Autista (TEA)',
        avatarUrl: `https://api.dicebear.com/8.x/adventurer/svg?seed=Lucas&backgroundColor=b6e3f4`,
        organizationId: 'org-01', 
        guardianId: 'guardian-01', 
        assignedProfessionalIds: ['prof-01']
    }
];
const MOCK_ORG_PROFESSIONALS: Partial<User>[] = [
    {
        id: 'prof-01',
        name: 'Dra. Ana Carolina',
        email: 'ana@clinica.com',
        documentId: '123.456.789-00'
    }
];

const OrganizationDashboard: React.FC = () => {
    const [tab, setTab] = useState<'patients' | 'professionals'>('patients');
    const [patients, setPatients] = useState<Patient[]>([]);
    const [professionals, setProfessionals] = useState<Partial<User>[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    // Simulação do usuário logado
    const mockUser: User = {
        id: 'org-01',
        name: 'Clínica Cuidar',
        email: 'contato@cuidar.com',
        profileType: 'organization',
        documentId: '12.345.678/0001-99',
        createdAt: new Date(),
    };

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setPatients(MOCK_ORG_PATIENTS);
            setProfessionals(MOCK_ORG_PROFESSIONALS);
            setLoading(false);
        }, 500);
    }, []);

    const handleSelectPatient = (patient: Patient) => {
        navigate(`/patient/${patient.id}`);
    };

    const handleInviteProfessional = () => {
        const cpf = prompt("Digite o CPF do profissional:");
        if (cpf) {
            alert(`Lógica de convite/vínculo para o CPF: ${cpf} seria executada aqui.`);
        }
    };
    
    const handleAddPatient = () => {
         alert('Abriria um formulário para adicionar um novo paciente.');
    };
    
    const handleAssignProfessional = (patientId: string) => {
        const profId = prompt("Digite o ID do profissional para vincular a este paciente:");
         alert(`Vincular profissional ${profId} ao paciente ${patientId}`);
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <Header />
            <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Painel da Organização</h1>
                
                <div className="border-b border-slate-200 mb-6">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setTab('patients')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                tab === 'patients' 
                                ? 'border-indigo-500 text-indigo-600' 
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            Pacientes ({patients.length})
                        </button>
                        <button
                            onClick={() => setTab('professionals')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                tab === 'professionals' 
                                ? 'border-indigo-500 text-indigo-600' 
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            Profissionais ({professionals.length})
                        </button>
                    </nav>
                </div>

                {loading ? <p>Carregando...</p> : (
                    <div>
                        {tab === 'patients' && (
                            <div className="space-y-4">
                                <Button onClick={handleAddPatient}>Adicionar Novo Paciente</Button>
                                {patients.map(patient => (
                                    <div key={patient.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <img src={patient.avatarUrl} alt={patient.name} className="h-12 w-12 rounded-full bg-slate-200" />
                                                <div>
                                                    <h2 className="font-bold text-slate-900">{patient.name}</h2>
                                                    <p className="text-sm text-slate-500">Profissionais: {patient.assignedProfessionalIds.length}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 flex-wrap">
                                                 <Button onClick={() => handleAssignProfessional(patient.id)}>
                                                    Vincular Profissional
                                                 </Button>
                                                <Button onClick={() => handleSelectPatient(patient)}>
                                                    Ver Detalhes
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {tab === 'professionals' && (
                            <div className="space-y-4">
                                <Button onClick={handleInviteProfessional}>Vincular Profissional (por CPF)</Button>
                                {professionals.map(prof => (
                                    <div key={prof.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                                        <h2 className="font-bold text-slate-900">{prof.name}</h2>
                                        <p className="text-sm text-slate-500">{prof.email} | CPF: {prof.documentId}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default OrganizationDashboard;
