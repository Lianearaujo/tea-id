
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import type { Patient } from '../types';

const GuardianDashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await api.get<Patient[]>(`/api/v1/patients/by-guardian/${user.id}`);
        setPatients(response.data);
      } catch (err) {
        console.error("Erro ao buscar pacientes:", err);
        setError('Não foi possível carregar a lista de pacientes.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [user]);

  return (
    <div>
      <h2>Seus Pacientes</h2>
      
      <Link to="/add-patient">
        <button>Adicionar Novo Paciente</button>
      </Link>

      {loading && <p>Carregando pacientes...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <ul>
          {patients.length > 0 ? (
            patients.map(patient => (
              <li key={patient.id}>
                <strong>{patient.name}</strong> - {patient.diagnosis}
              </li>
            ))
          ) : (
            <p>Você ainda não tem pacientes cadastrados.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default GuardianDashboard;
