// src/types.ts

/** O tipo de perfil do usuário no sistema */
export type ProfileType = 'responsavel' | 'profissional' | 'organization';

/** O tipo de terapia disponível */
export type TherapyType = 'Fonoaudiologia' | 'Psicologia (ABA)' | 'Terapia Ocupacional' | 'Psicopedagogia';

/**
 * Representa um usuário autenticado no sistema.
 * Contém os dados do Firestore.
 */
export interface User {
  id: string; // Firebase Auth UID
  name: string;
  email: string;
  profileType: ProfileType;
  documentId: string; // CPF para 'responsavel'/'profissional', CNPJ para 'organization'
  createdAt: any; // Firestore Timestamp
  
  // Específico para 'organization'
  professionalIds?: string[]; // UIDs dos profissionais ligados
  patientIds?: string[]; // UIDs dos pacientes ligados
  
  // Específico para 'profissional'
  organizationIds?: string[]; // UIDs das organizações onde atua
}

/**
 * Representa um paciente no sistema.
 */
export interface Patient {
  id: string;
  name: string;
  birthDate: string;
  diagnosis: string;
  avatarUrl?: string;
  organizationId: string; // UID da organização "dona" deste paciente
  guardianId: string; // UID do 'responsavel'
  assignedProfessionalIds: string[]; // UIDs dos profissionais que podem ver este paciente
}

/**
 * Representa uma sessão de terapia.
 */
export interface Session {
  id: string;
  date: string; // ISO 8601 string
  therapistName: string; // Nome do profissional
  therapistId: string; // UID do profissional
  patientId: string; // UID do paciente
  therapyType: TherapyType;
  notes: string;
  audioUrl?: string;
  aiFeedback?: string;
}