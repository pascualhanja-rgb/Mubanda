'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Anchor, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LotaConfirmation() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(45);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Quando a validação termina, segue para o acompanhamento do pedido
  useEffect(() => {
    if (seconds === 0) {
      const t = setTimeout(() => router.push('/acompanhar-pedido'), 800);
      return () => clearTimeout(t);
    }
  }, [seconds, router]);

  return (
    <main className="min-h-screen bg-slate-900/60 backdrop-blur-md pb-10 text-[#0A192F] flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative flex flex-col min-h-[620px] justify-between border border-slate-100">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-white">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#0A192F] animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]">
              DOCA DE LUANDA • LOTA CENTRAL
            </span>
          </div>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
          </div>
        </div>

        {/* Central Content */}
        <div className="px-6 py-8 flex flex-col items-center justify-center text-center flex-1">
          
          {/* Pulsating Ripple / Radar Effect Container */}
          <div className="relative w-44 h-44 flex items-center justify-center mb-8">
            {/* Outer Ripple 2 */}
            <div className="absolute inset-0 rounded-full border border-slate-200/60 animate-ping opacity-20 duration-1000"></div>
            {/* Outer Ripple 1 */}
            <div className="absolute inset-3 rounded-full border border-slate-300/80 animate-pulse"></div>
            {/* Inner Ring */}
            <div className="absolute inset-8 rounded-full border border-slate-200"></div>
            
            {/* Center Anchor Icon Circle */}
            <div className="relative z-10 w-20 h-20 bg-[#0A192F] text-white rounded-full flex items-center justify-center shadow-xl shadow-slate-900/10">
              <Anchor size={32} className="stroke-[2.2]" />
            </div>
          </div>

          {/* Title & Warning Badge */}
          <h2 className="text-xl font-black text-[#0A192F] tracking-tight mb-3">
            Aguardando confirmação da Lota.
          </h2>

          <div className="inline-flex items-center space-x-1.5 bg-slate-100 px-3 py-1.5 rounded-full mb-6 border border-slate-200/60">
            <AlertCircle size={13} className="text-slate-500" />
            <span className="text-[10px] font-bold text-slate-600 tracking-wider uppercase">
              Por favor não saia.
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mb-8">
            Os nossos mestres peixeiros na doca estão a inspecionar os lotes frescos e a confirmar a disponibilidade imediata na câmara de gelo.
          </p>

          {/* Details Card */}
          <div className="w-full bg-slate-50 border border-slate-200/70 rounded-2xl p-4 space-y-2.5 text-left">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Encomenda Ref:</span>
              <span className="font-bold text-[#0A192F] tracking-wider text-xs">#MAB-8924-LU</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200/60">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Estimativa de Validação:</span>
              <span className="font-black text-[#0A192F]">~{seconds} segundos</span>
            </div>
          </div>

        </div>

        {/* Footer Crypted Connection */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center space-x-2 text-slate-400">
          <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
          <span className="text-[9px] font-bold uppercase tracking-wider">
            Conexão Criptografada Direta com a Lota de Luanda
          </span>
        </div>

      </div>
    </main>
  );
}