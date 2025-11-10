import { useState } from 'react';
// Importa os novos tipos
import type { ProfileType, User } from '../types.ts'; 
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
} from "firebase/firestore";

import { initializeApp } from "firebase/app";

// Configuração do Firebase (sem alterações)

const app = initializeApp(firebaseConfig);

// **MUDANÇA AQUI**: Exportamos 'auth' e 'db'
export const auth = getAuth(app);
export const db = getFirestore(app);


export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Converte erros do Firebase Auth em mensagens amigáveis.
   * (Sem alterações)
   */
  const getFriendlyErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
      const message = err.message;
      if (message.includes("auth/email-already-in-use")) {
        return "Este e-mail já está em uso.";
      }
      if (message.includes("auth/invalid-email")) {
        return "O formato do e-mail é inválido.";
      }
      if (message.includes("auth/weak-password")) {
        return "A senha é muito fraca. Use pelo menos 6 caracteres.";
      }
      if (message.includes("auth/user-not-found") || message.includes("auth/wrong-password") || message.includes("auth/invalid-credential")) {
        return "E-mail ou senha incorretos.";
      }
    }
    return "Ocorreu um erro inesperado. Tente novamente.";
  };

  /**
   * **LOGIN MODIFICADO**
   * Removemos o 'profileType'. O login agora é universal.
   */
  const login = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    console.log(`Attempting to log in with email: ${email}`);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // **MUDANÇA PRINCIPAL:**
        // A verificação de 'profileType' foi REMOVIDA.
        // Se o usuário existe no Auth e no Firestore, o login é bem-sucedido.
        
        console.log("Login successful!");
        setLoading(false);
        return { id: firebaseUser.uid, ...userData } as User;
        
      } else {
        // Usuário autenticado, mas sem registro no Firestore
        await signOut(auth);
        throw new Error("Perfil de usuário não encontrado no banco de dados.");
      }

    } catch (err) {
      console.error("Login failed:", err);
      // Ajuste na mensagem de erro, já que não temos mais o erro de perfil
      const friendlyMessage = (err instanceof Error && err.message.includes("Perfil de usuário não encontrado"))
        ? "Perfil de usuário não encontrado no banco de dados."
        : getFriendlyErrorMessage(err);
      
      setError(friendlyMessage);
      setLoading(false);
      return null;
    }
  };

  /**
   * **REGISTER MODIFICADO**
   * Adiciona 'documentId' e inicializa campos de array.
   */
  const register = async (name: string, email: string, password: string, profileType: ProfileType, documentId: string) => {
    setLoading(true);
    setError(null);
    console.log(`Attempting to register ${name} as ${profileType}`);

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Prepara os dados do usuário para o Firestore
        const userData: any = {
          name: name,
          email: email,
          profileType: profileType,
          documentId: documentId, // Salva o CPF/CNPJ
          createdAt: new Date()
        };
        
        // **NOVA LÓGICA:**
        // Inicializa campos específicos para cada tipo de perfil
        if (profileType === 'organization') {
          userData.professionalIds = [];
          userData.patientIds = [];
        } else if (profileType === 'responsavel') {
          // Responsáveis também podem ter pacientes ligados diretamente
          userData.patientIds = []; 
        } else if (profileType === 'profissional') {
           // Profissionais são ligados a N organizações
          userData.organizationIds = [];
        }

        await setDoc(doc(db, "users", user.uid), userData);

        console.log("Registration successful!");
        setLoading(false);
        return true;

    } catch (err) {
        console.error("Registration failed:", err);
        const errorMessage = getFriendlyErrorMessage(err);
        setError(errorMessage);
        setLoading(false);
        return false;
    }
  };
  
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await signOut(auth);
      console.log("User logged out");
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Erro ao tentar sair.");
    } finally {
      setLoading(false);
    }
  };

  return { login, register, logout, loading, error };
}