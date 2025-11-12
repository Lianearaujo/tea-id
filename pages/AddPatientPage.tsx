
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import type { PatientCreate } from '../types';

const AddPatientPage: React.FC = () => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!user) {
      setError('Você precisa estar logado para adicionar um paciente.');
      return;
    }

    if (!name || !cpf || !birthDate || !diagnosis) {
        setError('Todos os campos são obrigatórios.');
        return;
    }

    setLoading(true);

    try {
      const patientData: PatientCreate = {
        name,
        cpf,
        birthDate,
        diagnosis,
        guardianId: user.id,
        // Campos que a API espera, mas que não são preenchidos neste formulário
        avatarUrl: null,
        organizationIds: [],
        assignedProfessionalIds: [],
        requestsFollowUpIds: [],
      };

      await api.post('/api/v1/patients/', patientData);
      
      // Se a criação for bem-sucedida, volta para o dashboard
      navigate('/dashboard');

    } catch (err) {
      console.error('Erro ao criar paciente:', err);
      setError('Não foi possível criar o paciente. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Adicionar Novo Paciente</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome Completo:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>CPF:</label>
          <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} />
        </div>
        <div>
          <label>Data de Nascimento:</label>
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        </div>
        <div>
          <label>Diagnóstico:</label>
          <textarea value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Adicionando...' : 'Adicionar Paciente'}
        </button>
      </form>
    </div>
  );
};

export default AddPatientPage;
