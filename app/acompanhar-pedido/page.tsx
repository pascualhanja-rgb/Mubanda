'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Navigation, Phone, ShieldCheck, Clock } from 'lucide-react';

export default function TrackOrder() {
  return (
    <main className="min-h-screen bg-slate-900/60 backdrop-blur-md text-[#0A192F] flex justify-center items-center">
      <div className="w-full h-screen sm:h-[90vh] sm:max-w-md sm:rounded-3xl bg-white shadow-2xl overflow-hidden relative flex flex-col justify-between border border-slate-100">
        
        {/* Top Header */}
        <header className="px-5 pt-4 pb-3 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-30">
          <Link href="/transferencia" className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors">
            <ArrowLeft size={16} className="text-[#0A192F]" />
          </Link>
          <div className="text-center">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block">Rastreamento em Tempo Real</span>
            <h1 className="text-xs font-black tracking-tight text-[#0A192F]">Acompanhar Pedido</h1>
          </div>
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full ml-0.5"></div>
            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full ml-0.5"></div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="px-5 py-4 space-y-4 overflow-y-auto flex-1 pb-24">

          {/* Delivery Status Banner */}
          <div className="bg-slate-50 border border-slate-200/70 rounded-3xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-[#0A192F] bg-slate-200/70 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0A192F] animate-pulse"></span>
                <span>Em Rota de Entrega</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono font-bold">#MAB-8924-LU</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Previsão de Entrega</span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-xl font-black text-[#0A192F]">11:45</span>
                  <span className="text-[10px] font-bold text-slate-500">WAT</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Tempo Restante</span>
                <span className="text-sm font-black text-[#0A192F]">18 minutos</span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-200/60 flex justify-between items-center text-[10px] text-slate-500 font-medium">
              <span className="truncate">Origem: Doca da Mabunda</span>
              <span className="mx-1">•</span>
              <span className="truncate">Destino: Ilha de Luanda</span>
            </div>
          </div>

          {/* Estado do Pescado (Timeline) */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-4 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-[#0A192F]">Estado do Pescado</h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              
              {/* Step 1: Completed */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-6 h-6 rounded-full bg-[#0A192F] text-white flex items-center justify-center shadow-md">
                  <Check size={12} className="stroke-[3]" />
                </div>
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className="text-xs font-bold text-[#0A192F]">1. Preparation</h4>
                  <span className="text-[9px] font-semibold text-slate-400">10:30 WAT</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Pescado escamado, eviscerado e embalado em caixa isotérmica lacrada a 0°C na Doca da Mabunda.
                </p>
              </div>

              {/* Step 2: Current (On the Way) */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-6 h-6 rounded-full bg-[#0A192F] text-white flex items-center justify-center shadow-md ring-4 ring-slate-100">
                  <Navigation size={12} className="stroke-[2.5]" />
                </div>
                <div className="flex justify-between items-start mb-0.5">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-[#0A192F]">2. On the Way</h4>
                    <span className="bg-[#0A192F] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Atual
                    </span>
                  </div>
                  <span className="text-[9px] font-semibold text-slate-400">11:16 WAT</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Estafeta em trânsito com mala térmica refrigerada. A passar pela Marginal de Luanda.
                </p>
              </div>

              {/* Step 3: Pending (Delivered) */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-6 h-6 rounded-full bg-white border-2 border-slate-300 text-slate-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                </div>
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className="text-xs font-bold text-slate-400">3. Delivered</h4>
                  <span className="text-[9px] font-semibold text-slate-400">Prev. 11:45</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Entrega em mãos no Clube Náutico (Ilha de Luanda) com verificação da cadeia de frio.
                </p>
              </div>

            </div>
          </div>

          {/* Estafeta Dedicado Mabunda Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#0A192F] text-white rounded-xl flex items-center justify-center font-bold text-xs tracking-wider shrink-0">
                AM
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#0A192F]">António Manuel</h5>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="bg-slate-200/80 text-[#0A192F] font-mono text-[9px] font-bold px-1.5 py-0.5 rounded">
                    LD-48-92-EP
                  </span>
                  <span className="text-[9px] text-slate-500">Moto Térmica #04</span>
                </div>
              </div>
            </div>

            <a 
              href="tel:+244900000000"
              className="w-9 h-9 bg-[#0A192F] hover:bg-[#132d4e] text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
            >
              <Phone size={15} />
            </a>
          </div>

        </div>

        {/* Footer Cancel Action */}
        <div className="absolute bottom-0 w-full p-4 bg-white border-t border-slate-100 text-center z-30 shadow-lg">
          <button className="text-[11px] font-bold text-slate-400 hover:text-red-500 underline transition-colors cursor-pointer">
            Cancel Order
          </button>
          <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-wider">
            Cancelamentos só permitidos antes da saída do estafeta da doca.
          </p>
        </div>

      </div>
    </main>
  );
}