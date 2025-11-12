
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProfileType } from '../types'; 
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import LogoIcon from '../components/icons/LogoIcon';
import UserIcon from '../components/icons/UserIcon';
import AtSymbolIcon from '../components/icons/AtSymbolIcon';
import LockIcon from '../components/icons/LockIcon';
import DocumentIcon from '../components/icons/LockIcon';

const RegisterPage: React.FC = () => {
  const [activeProfile, setActiveProfile] = useState<ProfileType>('responsavel');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [documentId, setDocumentId] = useState(''); 
  
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { register, actionLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (password !== confirmPassword) {
      setPasswordError("As senhas não coincidem.");
      return;
    }
    const success = await register(name, cpf, email, password, activeProfile, documentId);
    
    if (success) {
      navigate('/login'); 
    }
  };
  
  const navigateToLogin = () => {
    navigate('/login');
  };

  const ProfileSelector: React.FC = () => (
    <div className="grid grid-cols-2 gap-2 mb-6 bg-slate-100 p-1 rounded-lg">
      <button
        type="button"
        onClick={() => setActiveProfile('responsavel')}
        aria-pressed={activeProfile === 'responsavel'}
        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          activeProfile === 'responsavel'
            ? 'bg-white text-indigo-600 shadow-sm'
            : 'bg-transparent text-slate-600 hover:bg-slate-200'
        }`}
        disabled={actionLoading}
      >
        Sou Responsável
      </button>
      <button
        type="button"
        onClick={() => setActiveProfile('organization')}
        aria-pressed={activeProfile === 'organization'}
        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          activeProfile === 'organization'
            ? 'bg-white text-indigo-600 shadow-sm'
            : 'bg-transparent text-slate-600 hover:bg-slate-200'
        }`}
        disabled={actionLoading}
      >
        Sou Organização
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
      <Card>
        <div className="text-center mb-8">
          <LogoIcon className="mx-auto h-16 w-auto text-indigo-600" />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            Crie sua Conta
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Junte-se à nossa comunidade de cuidado e colaboração.
          </p>
        </div>

        <ProfileSelector />

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            id="name"
            type="text"
            label={activeProfile === 'responsavel' ? 'Nome Completo' : 'Nome da Organização'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            icon={<UserIcon />}
            disabled={actionLoading}
          />
          <Input
            id="documentId"
            type="text"
            label={activeProfile === 'responsavel' ? 'CPF' : 'CNPJ'}
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            required
            autoComplete="off"
            icon={<DocumentIcon />}
            disabled={actionLoading}
          />
          <Input
            id="email-register"
            type="email"
            label="E-mail de Contato"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            icon={<AtSymbolIcon />}
            disabled={actionLoading}
          />
          <Input
            id="password-register"
            type="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            icon={<LockIcon />}
            disabled={actionLoading}
          />
          <Input
            id="confirm-password"
            type="password"
            label="Confirmar Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            icon={<LockIcon />}
            disabled={actionLoading}
          />

          {(error || passwordError) && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md text-sm" role="alert">
              <p>{error || passwordError}</p>
            </div>
          )}

          <div className="pt-2">
            <Button type="submit" loading={actionLoading} fullWidth>
              Cadastrar
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            Já tem uma conta?{' '}
            <button 
              type="button" 
              onClick={navigateToLogin} 
              className={`font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none ${actionLoading ? 'pointer-events-none' : ''}`}
              disabled={actionLoading}
            >
              Faça o login
            </button>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
