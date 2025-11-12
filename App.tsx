
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Importando as páginas da nova estrutura
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GuardianDashboard from './pages/GuardianDashboard';
import AddPatientPage from './pages/AddPatientPage'; // Nova página

// Supondo que estes componentes ainda existam ou serão criados
// Se não existirem, precisaremos criá-los ou remover as referências
const ProfessionalDashboard = () => <div>Painel do Profissional (a ser implementado)</div>;
const OrganizationDashboard = () => <div>Painel da Organização (a ser implementado)</div>;

import type { User } from './types';

// Tela de carregamento global
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-100">
    <p className="text-lg font-medium text-slate-600">Carregando...</p>
  </div>
);

// Componente para proteger rotas que exigem autenticação
const ProtectedRoute: React.FC<{ user: User | null; children: JSX.Element }> = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Componente para rotas públicas (login/registro)
const PublicRoute: React.FC<{ user: User | null; children: JSX.Element }> = ({ user, children }) => {
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Componente que decide qual dashboard renderizar com base no perfil do usuário
const DashboardRedirect: React.FC<{ user: User }> = ({ user }) => {
  switch (user.profileType) {
    case 'organization':
      return <OrganizationDashboard />;
    case 'profissional':
      return <ProfessionalDashboard />;
    case 'responsavel':
      return <GuardianDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route 
        path="/login" 
        element={
          <PublicRoute user={user}>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute user={user}>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Rotas Protegidas */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute user={user}>
            <DashboardRedirect user={user!} />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/add-patient" 
        element={
          <ProtectedRoute user={user}>
            <AddPatientPage />
          </ProtectedRoute>
        }
      />

      {/* Rota Fallback: Redireciona qualquer outra URL para a raiz da rota logada ou login */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default App;
