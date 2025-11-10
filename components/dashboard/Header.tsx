
import React from 'react';
import type { User } from '../../types.ts';
import LogoIcon from '../icons/LogoIcon.tsx';
import LogoutIcon from '../icons/LogoutIcon.tsx';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <LogoIcon className="h-10 w-auto text-indigo-600" />
            <span className="hidden sm:block font-bold text-xl text-slate-800">TEA ID</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
                <p className="text-sm font-medium text-slate-800">
                    Olá, {user.name || user.email}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                    Perfil {user.profileType}
                </p>
            </div>
            <button
              onClick={onLogout}
              aria-label="Sair da conta"
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <LogoutIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
