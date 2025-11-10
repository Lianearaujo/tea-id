
import React from 'react';
import type { Patient } from '../../types.ts';

interface PatientProfileProps {
  patient: Patient;
}

const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

const PatientProfile: React.FC<PatientProfileProps> = ({ patient }) => {
  const age = calculateAge(patient.birthDate);

  return (
    <section aria-labelledby="patient-profile-heading" className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center space-x-4">
        <img src={patient.avatarUrl} alt={`Foto de ${patient.name}`} className="h-20 w-20 rounded-full bg-slate-200" />
        <div>
            <h2 id="patient-profile-heading" className="text-xl font-bold text-slate-800">{patient.name}</h2>
            <p className="text-sm text-slate-600">{age} anos</p>
            <p className="mt-1 text-xs inline-flex items-center px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-medium">
                {patient.diagnosis}
            </p>
        </div>
      </div>
    </section>
  );
};

export default PatientProfile;
