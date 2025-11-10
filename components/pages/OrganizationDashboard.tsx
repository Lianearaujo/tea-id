import React, { useState, useEffect } from 'react';
import type { User, Patient } from '../../types.ts';
import Header from '../dashboard/Header.tsx';
import Button from '../ui/Button.tsx'; 
// import { useData } from '../../hooks/useData.ts'; 

// --- MOCK DATA ---
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
// --- FIM MOCK DATA ---

interface OrganizationDashboardProps {
  user: User;
  onLogout: () => void;
  onSelectPatient: (patient: Patient) => void;
}

const OrganizationDashboard: React.FC<OrganizationDashboardProps> = ({ user, onLogout, onSelectPatient }) => {
    const [tab, setTab] = useState<'patients' | 'professionals'>('patients');
    const [patients, setPatients] = useState<Patient[]>([]);
    const [professionals, setProfessionals] = useState<Partial<User>[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ** PONTO DE INTEGRAÇÃO REAL **
        // const { data: patientData } = useData().getPatientsForOrganization(user.id);
        // const { data: profData } = useData().getProfessionalsForOrganization(user.id);
        
        // Simulação:
        setLoading(true);
        setTimeout(() => {
            setPatients(MOCK_ORG_PATIENTS);
            setProfessionals(MOCK_ORG_PROFESSIONALS);
            setLoading(false);
        }, 500);
    }, [user.id]);

    const handleInviteProfessional = () => {
        const cpf = prompt("Digite o CPF do profissional:");
        if (cpf) {
            // ** LÓGICA DE BACKEND (Firebase Function) **
            alert(`Lógica de convite/vínculo para o CPF: ${cpf} seria executada aqui.`);
        }
    };
    
    const handleAddPatient = () => {
         // (Abriria um modal com um formulário para criar um novo Paciente)
         alert('Abriria um formulário para adicionar um novo paciente.');
    };
    
    const handleAssignProfessional = (patientId: string) => {
        const profId = prompt("Digite o ID do profissional para vincular a este paciente:");
         // ** LÓGICA DE BACKEND **
         alert(`Vincular profissional ${profId} ao paciente ${patientId}`);
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <Header user={user} onLogout={onLogout} />
            <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Painel da Organização</h1>
                
                {/* Abas de Navegação */}
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
                        {/* Conteúdo da Aba Pacientes */}
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
                                            {/* **FIX AQUI** - Removidas as props 'variant' e 'size' */}
                                            {/* Para estilizar, teríamos que:
                                                1. Modificar o componente Button.tsx para aceitar 'variant' e 'size', ou
                                                2. Aplicar classes CSS/Tailwind diretamente aqui.
                                                
                                                Por enquanto, a remoção simples corrige o erro.
                                            */}
                                            <div className="flex gap-2 flex-wrap">
                                                 <Button onClick={() => handleAssignProfessional(patient.id)}>
                                                    Vincular Profissional
                                                 </Button>
                                                <Button onClick={() => onSelectPatient(patient)}>
                                                    Ver Detalhes
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Conteúdo da Aba Profissionais */}
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