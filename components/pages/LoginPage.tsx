
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import LogoIcon from '../icons/LogoIcon';
import AtSymbolIcon from '../icons/AtSymbolIcon';
import LockIcon from '../icons/LockIcon';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('admin');
  // ATUALIZAÇÃO: Usando actionLoading para o feedback do botão
  const { login, actionLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    // A lógica de navegação já é tratada pelo App.tsx
    await login(email, password);
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

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
            disabled={actionLoading} // Desabilita o input durante o carregamento
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
            disabled={actionLoading} // Desabilita o input durante o carregamento
          />

          <div className="text-right text-sm">
            <a href="#" className={`font-medium text-indigo-600 hover:text-indigo-500 ${actionLoading ? 'pointer-events-none' : ''}`}>
              Esqueceu sua senha?
            </a>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md text-sm" role="alert">
              <p>{error}</p>
            </div>
          )}

          {/* ATUALIZAÇÃO: Passando o actionLoading para o botão */}
          <Button type="submit" loading={actionLoading} fullWidth>
            Entrar
          </Button>

          <p className="mt-8 text-center text-sm text-slate-600">
            Não tem uma conta?{' '}
            <button 
              type="button" 
              onClick={navigateToRegister} 
              className={`font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none ${actionLoading ? 'pointer-events-none' : ''}`}
              disabled={actionLoading}
            >
              Cadastre-se
            </button>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
