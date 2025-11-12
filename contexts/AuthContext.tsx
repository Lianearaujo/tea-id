
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import type { User, ProfileType, UserCreate } from '../types';
import api from '../services/api';

// Importa a configuração do Firebase do arquivo JSON
import firebaseConfig from '../firebase-config.json';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

interface AuthContextType {
  user: User | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>; // Retorna void, a UI reage ao estado
  register: (name: string, cpf: string, email: string, password: string, profileType: ProfileType, documentId: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listener para o estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Se temos um usuário no Firebase e um email, tentamos buscar os dados da nossa API
      // Esta requisição será autenticada pelo cookie de sessão httpOnly
      if (firebaseUser && firebaseUser.email) {
        try {
          const { data: apiUser } = await api.get<User>(`/api/v1/users/${firebaseUser.email}`);
          setUser(apiUser);
        } catch (err) {
          console.error("Sessão não encontrada no backend. Deslogando...", err);
          // Se a sessão no backend falhar, deslogamos do Firebase para manter a consistência
          await signOut(auth);
          setUser(null);
        }
      } else {
        // Se não há usuário no Firebase, o estado local é limpo
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getFriendlyErrorMessage = (err: any): string => {
    // Lógica simples para mensagens de erro
    if (err.response && err.response.data && err.response.data.error) {
        return err.response.data.error;
    }
    if (err.code) {
        switch (err.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                return "E-mail ou senha inválidos.";
            case 'auth/invalid-email':
                return "O formato do e-mail é inválido.";
            default:
                return "Ocorreu um erro de autenticação.";
        }
    }
    return "Ocorreu um erro inesperado. Tente novamente.";
  };

  const login = async (email: string, password: string): Promise<void> => {
    setActionLoading(true);
    setError(null);
    try {
      // 1. Autentica no Firebase para obter o idToken
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // 2. Envia o idToken para o backend para criar o cookie de sessão
      await api.post('/sessionLogin', { idToken });

      // 3. O listener onAuthStateChanged cuidará de buscar os dados do usuário e atualizar o estado

    } catch (err: any) {
      console.error("Falha no processo de login:", err);
      setError(getFriendlyErrorMessage(err));
      // Garante que o usuário seja deslogado do Firebase se a criação da sessão no backend falhar
      if (auth.currentUser) {
        await signOut(auth);
      }
      throw err; // Lança o erro para a UI poder reagir se necessário
    } finally {
      setActionLoading(false);
    }
  };

  const register = async (name: string, cpf: string, email: string, password: string, profileType: ProfileType, documentId: string) => {
    // A lógica de registro permanece a mesma
    setActionLoading(true);
    setError(null);
    try {
      const userCreateData: UserCreate = { name, cpf, email, password, profileType, documentId, professionalIds: [], patientIds: [], organizationIds: [] };
      await api.post('/api/v1/users/', userCreateData);
      return true;
    } catch (err) {
      console.error("Registration error:", err);
      setError(getFriendlyErrorMessage(err));
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setActionLoading(true);
    setError(null);
    try {
      // 1. Informa ao backend para limpar o cookie de sessão
      await api.post('/sessionLogout');
    } catch (err) {
      console.error("Erro ao limpar a sessão no backend:", err);
      // Mesmo com erro no backend, prosseguimos com o logout no cliente
    } finally {
      // 2. Desloga do Firebase no cliente
      await signOut(auth);
      // O listener onAuthStateChanged cuidará de limpar o estado `user`
      setActionLoading(false);
    }
  };

  const value = { user, loading, actionLoading, error, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
