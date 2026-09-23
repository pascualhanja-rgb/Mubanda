'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Check, Upload, Edit3, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export default function BankTransfer() {
  const [copied, setCopied] = useState(false);
  const ibanText = "AO06 0040 0000 9821 4720 1015 8";
  const [instruction, setInstruction] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(ibanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-900/60 backdrop-blur-md pb-12 text-[#0A192F] flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative flex flex-col justify-between border border-slate-100">
        
        {/* Top Header */}
        <header className="px-5 pt-4 pb-3 flex items-center justify-between bg-white border-b border-slate-100">
          <Link href="/checkout" className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors">
            <ArrowLeft size={16} className="text-[#0A192F]" />
          </Link>
          <div className="text-center">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block">Pagamento Auditado</span>
            <h1 className="text-xs font-black tracking-tight text-[#0A192F]">Transferência Bancária</h1>
          </div>
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full ml-0.5"></div>
            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full ml-0.5"></div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="px-5 py-4 space-y-4 overflow-y-auto max-h-[75vh]">

          {/* Destino Confirmado Card */}
          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1">
                <ShieldCheck size={11} className="mr-1" /> Destino Confirmado
              </span>
              <span className="text-[10px] text-slate-400 font-medium">4.2 km da Doca</span>
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="w-7 h-7 bg-[#0A192F] text-white rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#0A192F] truncate">Ilha de Luanda, Av. Murtala Mohamed</p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5 bg-slate-200/50 px-2 py-1 rounded-lg">
                  Ref: Portão preto junto ao Clube Náutico
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-xs">
              <span className="text-slate-500 text-[11px]">Total da Encomenda (3 itens):</span>
              <span className="font-black text-[#0A192F]">74.000 AOA</span>
            </div>
          </div>

          {/* Institutional Account Card (Dark Theme) */}
          <div className="bg-[#0A192F] text-white rounded-3xl p-5 relative overflow-hidden shadow-xl">
            {/* Background vector decoration effect */}
            <div className="absolute right-0 bottom-0 translate-x-6 translate-y-6 w-36 h-36 border border-white/10 rounded-full pointer-events-none"></div>

            <div className="flex justify-between items-center mb-3 relative z-10">
              <span className="text-[9px] font-bold uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-md text-slate-200">
                Conta Institucional
              </span>
              <span className="text-[9px] text-slate-400 font-semibold">Rede EMIS / BAI</span>
            </div>

            <div className="mb-4 relative z-10">
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block">Beneficiário</span>
              <h4 className="text-xs font-extrabold tracking-wide text-white mt-0.5">
                MABUNDA PESCA ARTESANAL & PURVEYORS LDA
              </h4>
            </div>

            {/* IBAN Box */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 mb-4 relative z-10">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Iban (Angola)</span>
                <button 
                  onClick={handleCopy}
                  className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1.5 transition-colors"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <p className="font-mono text-xs font-bold tracking-widest text-white mt-1">
                {ibanText}
              </p>
            </div>

            <div className="flex justify-between items-end text-[10px] relative z-10 pt-1">
              <div>
                <span className="text-slate-400 block uppercase tracking-wider text-[8px]">Banco</span>
                <span className="font-semibold text-slate-200">Banco Angolano de Investimentos</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block uppercase tracking-wider text-[8px]">Valor Exato</span>
                <span className="font-black text-white text-xs">74.000 AOA</span>
              </div>
            </div>
          </div>

          {/* Transfer Receipt Upload Section */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <h5 className="text-[10px] font-black uppercase tracking-wider text-[#0A192F]">Comprovativo de Transferência</h5>
            
            {/* Dashed Upload Box */}
            <label className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer bg-white transition-all group">
              <div className="w-10 h-10 bg-slate-100 group-hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center mb-2 transition-colors">
                <Upload size={18} />
              </div>
              <span className="text-xs font-bold text-[#0A192F]">Upload Transfer Receipt (PDF/Foto)</span>
              <span className="text-[9px] text-slate-400 mt-0.5">Formatos aceites: JPG, PNG ou PDF (Máx. 10MB)</span>
              <input type="file" accept=".jpg,.png,.pdf" className="hidden" />
            </label>

            {/* Instructions Input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Instruções para o Estafeta / Motorista
                </label>
                <span className="text-[9px] text-slate-400 font-semibold">[Opcional]</span>
              </div>
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="Ex: Tocar à campainha e entregar no 2º andar..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0A192F] outline-none focus:border-[#0A192F] transition-all pr-9 font-medium"
                />
                <Edit3 size={14} className="absolute right-3 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

        </div>

        {/* Footer Submit Button */}
        <div className="p-4 bg-white border-t border-slate-100">
          <Link href="/loading-lota" className="w-full bg-[#0A192F] hover:bg-[#132d4e] text-white py-4 px-5 rounded-2xl font-bold text-xs flex items-center justify-between shadow-lg transition-all cursor-pointer">
            <span className="tracking-wider uppercase">Submeter e Iniciar Despacho</span>
            <ArrowRight size={16} />
          </Link>

          <p className="text-center text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-2.5">
            Validação automática pelo protocolo de conferência EMIS / Mabunda.
          </p>
        </div>

      </div>
    </main>
  );
}