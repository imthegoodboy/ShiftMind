import React from 'react';

interface NavbarProps {
  currentPage: 'home' | 'swaps' | 'about' | 'settings';
  onNavigate: (page: 'home' | 'swaps' | 'about' | 'settings') => void;
  account: string | null;
}

export default function Navbar({ currentPage, onNavigate, account }: NavbarProps) {
  const linkBase = 'px-3 py-2 rounded-md text-sm font-medium cursor-pointer';
  const active = 'bg-white/10 text-white';
  const inactive = 'text-gray-300 hover:bg-white/5 hover:text-white';

  return (
    <nav className="w-full mb-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">SM</span>
          </div>
          <h1 className="text-2xl font-bold text-white">ShiftMind</h1>
        </div>
        <div className="hidden md:flex gap-2">
          <button className={`${linkBase} ${currentPage === 'home' ? active : inactive}`} onClick={() => onNavigate('home')}>Home</button>
          <button className={`${linkBase} ${currentPage === 'swaps' ? active : inactive}`} onClick={() => onNavigate('swaps')}>Swaps</button>
          <button className={`${linkBase} ${currentPage === 'about' ? active : inactive}`} onClick={() => onNavigate('about')}>About</button>
          <button className={`${linkBase} ${currentPage === 'settings' ? active : inactive}`} onClick={() => onNavigate('settings')}>Settings</button>
        </div>
        <div className="text-sm text-gray-300">
          {account ? (
            <span className="font-mono">{account.slice(0, 6)}…{account.slice(-4)}</span>
          ) : (
            <span>Not connected</span>
          )}
        </div>
      </div>
    </nav>
  );
}


