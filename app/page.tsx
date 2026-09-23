'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AuthModal({ isOpen = true, onClose }: AuthModalProps) {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [telemovel, setTelemovel] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm sm:p-4">
      <div className="w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-lg bg-white sm:rounded-3xl shadow-2xl overflow-y-auto relative p-6 sm:p-10 animate-in fade-in zoom-in duration-200 text-[#0A192F] flex flex-col justify-between sm:justify-start">
        
        <div className="w-full max-w-sm mx-auto flex flex-col items-center">
          {/* Close Button */}
          {onClose && (
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors z-10 shadow-sm"
            >
              <X size={20} />
            </button>
          )}

          {/* Logo / Brand Header */}
          <div className="flex flex-col items-center text-center mt-6 sm:mt-2 mb-8 w-full">
            <div className="relative w-28 h-16 flex items-center justify-center mb-4">
              <Image 
                src="/imagem do projecto/LOGO.png" 
                alt="Mabunda Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-[#0A192F] mb-2">
              Acesso Exclusivo
            </h2>
            <p className="text-sm text-slate-500 max-w-[300px] leading-relaxed">
              Pescado fresco de Luanda direto dos mestres artesanais
            </p>
          </div>

          {/* Tab Switcher: Entrar / Criar Conta */}
          <div className="bg-slate-100 p-1.5 rounded-2xl flex w-full mb-8 shadow-inner">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                authMode === 'login'
                  ? 'bg-[#0A192F] text-white shadow-md'
                  : 'text-slate-600 hover:text-[#0A192F]'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                authMode === 'register'
                  ? 'bg-[#0A192F] text-white shadow-md'
                  : 'text-slate-600 hover:text-[#0A192F]'
              }`}
            >
              Criar Conta
            </button>
          </div>

          {/* Form Inputs */}
          <form onSubmit={(e) => { e.preventDefault(); router.push('/home'); }} className="space-y-5 w-full">
            
            {/* Telemóvel Field */}
            <div className="w-full text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Telemóvel
              </label>
              <div className="relative flex items-center w-full">
                <span className="absolute left-4 text-slate-400">
                  <Phone size={20} />
                </span>
                <input 
                  type="tel" 
                  value={telemovel}
                  onChange={(e) => setTelemovel(e.target.value)}
                  placeholder="+244 923 000 000" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm text-[#0A192F] placeholder:text-slate-400 focus:bg-white focus:border-[#0A192F] outline-none transition-all font-semibold shadow-xs"
                />
              </div>
            </div>

            {/* Palavra-passe Field */}
            <div className="w-full text-left">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Palavra-passe
                </label>
                {authMode === 'login' && (
                  <a href="#forgot" className="text-xs font-bold text-[#0A192F] hover:underline">
                    Esqueceu a palavra-passe?
                  </a>
                )}
              </div>
              <div className="relative flex items-center w-full">
                <span className="absolute left-4 text-slate-400">
                  <Lock size={20} />
                </span>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-12 py-4 text-sm text-[#0A192F] placeholder:text-slate-400 focus:bg-white focus:border-[#0A192F] outline-none transition-all font-semibold shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Action Button */}
            <button 
              type="submit"
              className="w-full mt-4 bg-[#0A192F] hover:bg-[#132d4e] text-white py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer"
            >
              <span>{authMode === 'login' ? 'Entrar na Conta' : 'Criar Nova Conta'}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        {/* Terms and Policies Footer */}
        <div className="mt-10 sm:mt-8 text-center pb-6 sm:pb-0 w-full max-w-sm mx-auto">
          <p className="text-xs text-slate-500 leading-relaxed px-2">
            Ao entrar, concorda com os <a href="#terms" className="underline font-bold text-slate-700 hover:text-[#0A192F]">Termos de Serviço</a> e com a <a href="#policy" className="underline font-bold text-slate-700 hover:text-[#0A192F]">Política de Frescura Garantida Mabunda</a>.
          </p>
        </div>

      </div>
    </div>
  );
}