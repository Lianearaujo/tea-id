
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { 
  initializeFirestore,
  persistentLocalCache,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import type { User, ProfileType } from '../types';


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ATUALIZAÇÃO: Usando a nova API de persistência para eliminar o aviso.
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({})
});

interface AuthContextType {
  user: User | null;
  loading: boolean; // Para o carregamento inicial da autenticação
  actionLoading: boolean; // Para o carregamento de ações (login, registro)
  error: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string, profileType: ProfileType, documentId: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Carregamento inicial
  const [actionLoading, setActionLoading] = useState(false); // Carregamento de ações
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
        } else {
          await signOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false); // Finaliza o carregamento inicial
    });
    return () => unsubscribe();
  }, []);

  const getFriendlyErrorMessage = (err: any): string => {
    if (err.code) {
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          return 'E-mail ou senha inválidos.';
        case 'auth/email-already-in-use':
          return 'Este e-mail já está em uso.';
        case 'auth/invalid-email':
          return 'O formato do e-mail é inválido.';
        case 'auth/weak-password':
          return 'A senha é muito fraca. Use pelo menos 6 caracteres.';
        default:
          return `Ocorreu um erro (${err.code}). Tente novamente.`;
      }
    }
    return "Ocorreu um erro inesperado. Tente novamente.";
  };

  const login = async (email: string, password: string): Promise<User | null> => {
    setActionLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = { id: firebaseUser.uid, ...userDoc.data() } as User;
        setUser(userData);
        return userData;
      }
      throw new Error("Perfil de usuário não encontrado no banco de dados.");
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
      setUser(null);
      return null;
    } finally {
      setActionLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, profileType: ProfileType, documentId: string) => {
    setActionLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const userData: any = {
        name, email, profileType, documentId, createdAt: new Date(),
        ...(profileType === 'organization' && { professionalIds: [], patientIds: [] }),
        ...(profileType === 'responsavel' && { patientIds: [] }),
        ...(profileType === 'profissional' && { organizationIds: [] }),
      };
      await setDoc(doc(db, "users", firebaseUser.uid), userData);
      return true;
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setActionLoading(true);
    await signOut(auth);
    setUser(null);
    setActionLoading(false);
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
