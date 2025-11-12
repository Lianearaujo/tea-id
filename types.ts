
// As "definições de tipo" para toda a aplicação.

/** O tipo de perfil do usuário no sistema */
export type ProfileType = 'responsavel' | 'profissional' | 'organization';

/** O tipo de terapia disponível */
export type TherapyType = 'Fonoaudiologia' | 'Psicologia (ABA)' | 'Terapia Ocupacional' | 'Psicopedagogia';

/**
 * Representa um usuário no sistema, conforme definido pela API.
 */
export interface User {
  id: string;
  cpf: string;
  name: string;
  email: string;
  profileType: ProfileType;
  documentId: string; 
  createdAt: string; // ISO 8601 string
  updateAt: string; // ISO 8601 string
  professionalIds: string[] | null;
  patientIds: string[] | null;
  organizationIds: string[] | null;
}

/**
 * Representa um paciente no sistema, conforme definido pela API.
 */
export interface Patient {
  id: string;
  cpf: string;
  name: string;
  birthDate: string;
  diagnosis: string;
  avatarUrl: string | null;
  guardianId: string;
  organizationIds: string[];
  assignedProfessionalIds: string[];
  requestsFollowUpIds: string[];
  createdAt: string; // ISO 8601 string
  updateAt: string; // ISO 8601 string
}

/**
 * Representa uma sessão de terapia, conforme definido pela API.
 */
export interface Session {
  id: string;
  date: string; // ISO 8601 string
  therapistName: string;
  therapistId: string;
  patientId: string;
  therapyType: TherapyType;
  notes: string;
  audioUrl: string | null;
  aiFeedback: string | null;
}

// --- Tipos para Criação de Dados ---

/**
 * Dados necessários para criar um novo usuário via API.
 */
export type UserCreate = Omit<User, 'id' | 'createdAt' | 'updateAt'> & { password?: string };

/**
 * Dados necessários para criar um novo paciente via API.
 */
export type PatientCreate = Omit<Patient, 'id' | 'createdAt' | 'updateAt'>;

/**
 * Dados necessários para criar uma nova sessão via API.
 */
export type SessionCreate = Omit<Session, 'id'>;

