
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext'; // Importa o hook do novo contexto
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import GuardianDashboard from './components/pages/GuardianDashboard';
import ProfessionalDashboard from './components/pages/ProfessionalDashboard';
import OrganizationDashboard from './components/pages/OrganizationDashboard';
import PatientViewPage from './components/pages/PatientViewPage';
import type { User } from './types';

// Tela de carregamento global
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-100">
    <p className="text-lg font-medium text-slate-600">Carregando...</p>
  </div>
);

// Componente para proteger rotas
// Redireciona para o login se não houver usuário
const ProtectedRoute: React.FC<{ user: User | null; children: JSX.Element }> = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Componente para rotas públicas (login/registro)
// Redireciona para o dashboard se o usuário já estiver logado
const PublicRoute: React.FC<{ user: User | null; children: JSX.Element }> = ({ user, children }) => {
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
};


// Componente que decide qual dashboard renderizar
const DashboardRedirect: React.FC<{ user: User }> = ({ user }) => {
  switch (user.profileType) {
    case 'organization':
      return <OrganizationDashboard />;
    case 'profissional':
      return <ProfessionalDashboard />;
    case 'responsavel':
      return <GuardianDashboard />;
    default:
      // Em caso de perfil desconhecido, volta para o login.
      return <Navigate to="/login" replace />;
  }
};

function App() {
  // O estado do usuário e o carregamento vêm agora do AuthProvider
  const { user, loading } = useAuth();

  // Mostra uma tela de carregamento enquanto o estado de autenticação é verificado
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
        path="/" 
        element={
          <ProtectedRoute user={user}>
            <DashboardRedirect user={user!} />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/patient/:patientId" 
        element={
          <ProtectedRoute user={user}>
            <PatientViewPage />
          </ProtectedRoute>
        }
      />

      {/* Rota Fallback: Redireciona qualquer outra URL para a raiz */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
