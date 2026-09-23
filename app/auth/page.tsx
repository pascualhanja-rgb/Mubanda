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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative p-6 sm:p-8 animate-in fade-in zoom-in duration-200 text-[#0A192F]">
        
        {/* Close Button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X size={16} />
          </button>
        )}

        {/* Logo / Brand Header */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="mb-3">
            <span className="font-black text-xl tracking-tight text-[#0A192F]">Mabunda</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#0A192F] mb-1">
            Acesso Exclusivo
          </h2>
          <p className="text-xs text-slate-500 max-w-[260px] leading-relaxed">
            Pescado fresco de Luanda direto dos mestres artesanais
          </p>
        </div>

        {/* Tab Switcher: Entrar / Criar Conta */}
        <div className="bg-slate-100 p-1 rounded-2xl flex mb-6">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              authMode === 'login'
                ? 'bg-[#0A192F] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#0A192F]'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              authMode === 'register'
                ? 'bg-[#0A192F] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#0A192F]'
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={(e) => { e.preventDefault(); router.push('/home'); }} className="space-y-4">
          
          {/* Telemóvel Field */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Telemóvel
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400">
                <Phone size={16} />
              </span>
              <input 
                type="tel" 
                value={telemovel}
                onChange={(e) => setTelemovel(e.target.value)}
                placeholder="+244 923 000 000" 
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-10 py-3 text-xs text-[#0A192F] placeholder:text-slate-400 focus:bg-white focus:border-[#0A192F] outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Palavra-passe Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Palavra-passe
              </label>
              {authMode === 'login' && (
                <a href="#forgot" className="text-[10px] font-semibold text-[#0A192F] hover:underline">
                  Esqueceu a palavra-passe?
                </a>
              )}
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400">
                <Lock size={16} />
              </span>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••" 
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-10 py-3 text-xs text-[#0A192F] placeholder:text-slate-400 focus:bg-white focus:border-[#0A192F] outline-none transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Action Button */}
          <button 
            type="submit"
            className="w-full mt-2 bg-[#0A192F] hover:bg-[#132d4e] text-white py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
          >
            <span>{authMode === 'login' ? 'Entrar na Conta' : 'Criar Nova Conta'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Terms and Policies Footer */}
        <div className="mt-6 text-center">
          <p className="text-[10px] text-slate-400 leading-relaxed px-2">
            Ao entrar, concorda com os <a href="#terms" className="underline font-medium text-slate-600 hover:text-[#0A192F]">Termos de Serviço</a> e com a <a href="#policy" className="underline font-medium text-slate-600 hover:text-[#0A192F]">Política de Frescura Garantida Mabunda</a>.
          </p>
        </div>

      </div>
    </div>
  );
}