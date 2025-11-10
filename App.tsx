// src/App.tsx

import React, { useState, useEffect } from 'react'; // Importe o useEffect
import LoginPage from './components/pages/LoginPage.tsx';
import RegisterPage from './components/pages/RegisterPage.tsx';

// Importa os painéis
import GuardianDashboard from './components/pages/GuardianDashboard.tsx';
import ProfessionalDashboard from './components/pages/ProfessionalDashboard.tsx';
import OrganizationDashboard from './components/pages/OrganizationDashboard.tsx';
import PatientViewPage from './components/pages/PatientViewPage.tsx';

// **IMPORTS CRUCIAIS PARA SESSÃO**
import { useAuth, auth, db } from './hooks/useAuth.ts'; // Importa auth e db
import { onAuthStateChanged } from "firebase/auth"; // O "ouvinte"
import { doc, getDoc } from "firebase/firestore"; // Para buscar o perfil
import type { User, Patient } from './types.ts';

type AuthPage = 'login' | 'register';
type AppView = 'auth' | 'dashboard' | 'patient_view';

/** Um componente de loading simples */
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-100">
    <p className="text-lg font-medium text-slate-600">Carregando sessão...</p>
  </div>
);

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  
  const [view, setView] = useState<AppView>('auth');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  // Controla o carregamento inicial da autenticação
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  
  const { logout } = useAuth(); // Ações ainda vêm do hook

  // **ESTE É O CÓDIGO QUE RESOLVE O "RELOAD"**
  useEffect(() => {
    // onAuthStateChanged retorna uma função 'unsubscribe'
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Usuário está logado no Firebase Auth
        // Agora, buscamos o perfil dele no Firestore
        console.log("Sessão Auth encontrada, buscando perfil no Firestore...");
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const completeUser = { id: firebaseUser.uid, ...userDoc.data() } as User;
            setUser(completeUser);
            setView('dashboard');
          } else {
            // Raro: Usuário no Auth, mas sem perfil no Firestore
            console.error("Erro: Usuário autenticado sem perfil no Firestore.");
            await logout(); // Desloga o usuário problemático
            setUser(null);
            setView('auth');
          }
        } catch (error) {
           // **AQUI ESTÁ O SEU ERRO "OFFLINE"**
           // Se o getDoc() falhar (ex: offline, ou Firestore desabilitado)
           console.error("Falha ao buscar perfil do usuário (pode ser offline):", error);
           // Não podemos prosseguir, deslogamos
           await logout();
           setUser(null);
           setView('auth');
        }
      } else {
        // Usuário não está logado
        setUser(null);
        setView('auth');
      }
      // Terminamos de verificar a autenticação
      setIsLoadingAuth(false);
    });

    // Limpa o "ouvinte" quando o componente App for desmontado
    return () => unsubscribe();
  }, [logout]); // 'logout' é uma dependência do hook

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('dashboard'); 
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setView('auth');
    setAuthPage('login');
  };

  const navigateToRegister = () => setAuthPage('register');
  const navigateToLogin = () => setAuthPage('login');

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setView('patient_view');
  };

  const handleBackToDashboard = () => {
    setSelectedPatient(null);
    setView('dashboard');
  };

  // 1. Mostra "Carregando" enquanto verifica a sessão
  if (isLoadingAuth) {
    return <LoadingScreen />;
  }

  // 2. Roteamento de Autenticação (Usuário deslogado)
  if (!user || view === 'auth') {
    return (
      <main>
        {authPage === 'login' && <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToRegister={navigateToRegister} />}
        {authPage === 'register' && <RegisterPage onNavigateToLogin={navigateToLogin} />}
      </main>
    );
  }

  // 3. Roteamento para a Visão Detalhada do Paciente
  if (view === 'patient_view' && selectedPatient) {
    return (
      <PatientViewPage
        user={user}
        patient={selectedPatient}
        onLogout={handleLogout}
        onBack={handleBackToDashboard}
      />
    );
  }
  
  // 4. Roteamento para os Painéis Principais (Dashboard)
  if (view === 'dashboard') {
    switch (user.profileType) {
      case 'organization':
        return (
          <OrganizationDashboard
            user={user}
            onLogout={handleLogout}
            onSelectPatient={handleSelectPatient}
          />
        );
      case 'profissional':
        return (
          <ProfessionalDashboard
            user={user}
            onLogout={handleLogout}
            onSelectPatient={handleSelectPatient}
          />
        );
      case 'responsavel':
        return (
          <GuardianDashboard
            user={user}
            onLogout={handleLogout}
            onSelectPatient={handleSelectPatient}
          />
        );
      default:
        handleLogout();
        return null;
    }
  }

  // Fallback
  return <LoadingScreen />;
}

export default App;