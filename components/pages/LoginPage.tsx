// src/components/pages/LoginPage.tsx

import React, { useState, FormEvent } from 'react';
// Importa o tipo User
import type { User } from '../../types.ts'; 
import { useAuth } from '../../hooks/useAuth.ts';
import Card from '../ui/Card.tsx';
import Input from '../ui/Input.tsx';
import Button from '../ui/Button.tsx';
import LogoIcon from '../icons/LogoIcon.tsx';
import AtSymbolIcon from '../icons/AtSymbolIcon.tsx';
import LockIcon from '../icons/LockIcon.tsx';

interface LoginPageProps {
  onNavigateToRegister: () => void;
  onLoginSuccess: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigateToRegister, onLoginSuccess }) => {
  // **REMOVIDO:** 'activeProfile' state não é mais necessário
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('admin');
  const { login, loading, error } = useAuth();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    // **MODIFICADO:** Chamada de login não passa mais 'activeProfile'
    const user = await login(email, password);
    if (user) {
      onLoginSuccess(user);
    }
  };

  // **REMOVIDO:** Componente 'ProfileSelector' foi removido.

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
      <Card>
        <div className="text-center mb-8">
          <LogoIcon className="mx-auto h-16 w-auto text-indigo-600" />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            Bem-vindo ao TEA ID
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Acesse sua conta para continuar
          </p>
        </div>

        {/* **REMOVIDO:** O <ProfileSelector /> não está mais aqui. */}

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            id="email"
            type="email"
            label="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            icon={<AtSymbolIcon />}
          />
          <Input
            id="password"
            type="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            icon={<LockIcon />}
          />

          <div className="text-right text-sm">
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Esqueceu sua senha?
            </a>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md text-sm" role="alert">
              <p>{error}</p>
            </div>
          )}

          <Button type="submit" loading={loading} fullWidth>
            Entrar
          </Button>

          <p className="mt-8 text-center text-sm text-slate-600">
            Não tem uma conta?{' '}
            <button type="button" onClick={onNavigateToRegister} className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none">
              Cadastre-se
            </button>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;