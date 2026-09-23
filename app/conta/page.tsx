'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bell, MapPin, Plus, Home, ChevronRight, ArrowRight, RotateCcw, Search, ShoppingBag, User, CheckCircle2, Pencil } from 'lucide-react';

export default function AccountProfile() {
  return (
    <main className="min-h-screen bg-slate-950 flex justify-center items-center">
      <div className="w-full h-screen sm:h-[90vh] sm:max-w-[480px] sm:rounded-3xl bg-white shadow-2xl overflow-hidden relative flex flex-col justify-between border border-slate-100">
        
        {/* Top Header */}
        <header className="px-5 pt-4 pb-4 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-30">
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-xl font-bold tracking-tight text-[#0A192F]">Mabunda</h1>
            <span className="text-slate-300 font-light text-lg">/</span>
            <span className="text-sm font-medium text-slate-700">Conta</span>
          </div>

          <div className="flex items-center space-x-3">
            <button className="text-slate-600 hover:text-[#0A192F] transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-600 rounded-full"></span>
            </button>
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 relative shrink-0">
              <Image 
                src="/imagem do projecto/perfil.png" 
                alt="Perfil" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="px-5 py-5 space-y-6 overflow-y-auto flex-1 pb-24">

          {/* User Profile Info */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md relative">
                <Image 
                  src="/imagem do projecto/perfil.png" 
                  alt="Dra. Ana Paula Fernandes" 
                  fill 
                  className="object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center border-2 border-white shadow hover:bg-slate-800 transition-colors">
                <Pencil size={14} />
              </button>
            </div>

            <div className="flex items-center space-x-1.5 mt-1">
              <h2 className="font-serif text-lg font-bold text-[#0A192F]">Dra. Ana Paula Fernandes</h2>
              <span className="text-slate-500">🛡️</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">+244 923 000 000</p>
          </div>

          {/* Moradas Guardadas Section */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin size={15} className="text-[#0A192F]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-[#0A192F]">Moradas Guardadas</h3>
              </div>
              <button className="text-[10px] font-bold text-[#0A192F] hover:underline uppercase tracking-wider">
                Gerir
              </button>
            </div>

            <div className="space-y-2">
              {/* Casa */}
              <div className="bg-white border border-slate-100 rounded-xl p-3 flex items-center justify-between shadow-xs">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center relative overflow-hidden shrink-0">
                    <Image 
                      src="/imagem do projecto/Margin(15).png" 
                      alt="Casa" 
                      fill 
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[#0A192F]">Casa</span>
                      {/* Etiqueta PRINCIPAL oval e verde escuro conforme a referência */}
                      <span className="bg-[#005C53] text-white text-[9px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                        PRINCIPAL
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Talatona, Ref: Portão Azul</p>
                  </div>
                </div>
                <ChevronRight size={15} className="text-slate-400" />
              </div>

              {/* Trabalho */}
              <div className="bg-white border border-slate-100 rounded-xl p-3 flex items-center justify-between shadow-xs">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center relative overflow-hidden shrink-0">
                    <Image 
                      src="/imagem do projecto/Margin(14).png" 
                      alt="Trabalho" 
                      fill 
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0A192F] block">Trabalho</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Mutamba, Edifício Kilamba, 4º Andar</p>
                  </div>
                </div>
                <ChevronRight size={15} className="text-slate-400" />
              </div>
            </div>

            <button className="w-full bg-[#0A192F] hover:bg-[#132d4e] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all cursor-pointer">
              <Plus size={14} />
              <span>Adicionar Nova Morada</span>
            </button>
          </div>

          {/* O Meu Histórico & Active Order */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0A192F]">O Meu Histórico</h3>
              <span className="text-[10px] text-slate-400 font-semibold">4 Pedidos registados</span>
            </div>

            {/* Active Order Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-sm mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>Em Andamento</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-bold">Lota nº #MB-8821</span>
              </div>

              <div>
                <h4 className="text-xs font-black text-[#0A192F]">3kg Garoupa Fresca da Ilha</h4>
                <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-0.5">
                  <span>Hoje, 14:30</span>
                  <span>•</span>
                  <span className="font-bold text-[#0A192F]">Previsão: 18 min</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#0A192F] h-full w-3/4 rounded-full"></div>
              </div>

              <p className="text-[10px] text-slate-500 leading-relaxed">
                Estafeta Francisco está a caminho com embalagem térmica climatizada.
              </p>

              <Link href="/acompanhar-pedido" className="w-full bg-[#0A192F] hover:bg-[#132d4e] text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-between shadow-md transition-all cursor-pointer">
                <span>Acompanhar Entrega em Tempo Real</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Previous Deliveries */}
            <div className="space-y-3">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block pt-1">
                Entregas Anteriores
              </span>

              {/* Item 1 */}
              <div className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[9px] text-slate-400 font-semibold">12 Ago 2026</span>
                  <h5 className="text-xs font-bold text-[#0A192F] mt-0.5">2kg Cacusso, 1kg Choco...</h5>
                  <span className="text-xs font-black text-[#0A192F] mt-1 block">22.500 Kz</span>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="bg-emerald-50 text-emerald-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1">
                    <CheckCircle2 size={10} /> <span>Entregue</span>
                  </span>
                  <button className="bg-slate-100 hover:bg-slate-200 text-[#0A192F] text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 transition-colors">
                    <RotateCcw size={11} /> <span>Repetir</span>
                  </button>
                </div>
              </div>

              {/* Item 2 */}
              <div className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[9px] text-slate-400 font-semibold">04 Ago 2026</span>
                  <h5 className="text-xs font-bold text-[#0A192F] mt-0.5">1.5kg Camarão Tigre, 2kg</h5>
                  <span className="text-xs font-black text-[#0A192F] mt-1 block">41.800 Kz</span>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="bg-emerald-50 text-emerald-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1">
                    <CheckCircle2 size={10} /> <span>Entregue</span>
                  </span>
                  <button className="bg-slate-100 hover:bg-slate-200 text-[#0A192F] text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 transition-colors">
                    <RotateCcw size={11} /> <span>Repetir</span>
                  </button>
                </div>
              </div>

              {/* Item 3 */}
              <div className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[9px] text-slate-400 font-semibold">28 Jul 2026</span>
                  <h5 className="text-xs font-bold text-[#0A192F] mt-0.5">1x Lagosta da Costa...</h5>
                  <span className="text-xs font-black text-[#0A192F] mt-1 block">46.200 Kz</span>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="bg-emerald-50 text-emerald-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1">
                    <CheckCircle2 size={10} /> <span>Entregue</span>
                  </span>
                  <button className="bg-slate-100 hover:bg-slate-200 text-[#0A192F] text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 transition-colors">
                    <RotateCcw size={11} /> <span>Repetir</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Links */}
          <div className="flex items-center justify-center space-x-4 pt-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <a href="#support" className="hover:text-[#0A192F]">Apoio ao Cliente VIP</a>
            <span>•</span>
            <a href="#preferences" className="hover:text-[#0A192F]">Preferências</a>
          </div>

        </div>

        {/* Fixed Bottom Navigation Bar */}
        <nav className="absolute bottom-0 w-full bg-white border-t border-slate-100 px-6 py-2.5 flex items-center justify-between z-30 shadow-lg">
          <Link href="/home" className="flex flex-col items-center text-slate-400 hover:text-[#0A192F] transition-colors">
            <Home size={18} />
            <span className="text-[9px] font-semibold mt-1">Início</span>
          </Link>
          <Link href="/search" className="flex flex-col items-center text-slate-400 hover:text-[#0A192F] transition-colors">
            <Search size={18} />
            <span className="text-[9px] font-semibold mt-1">Pesquisar</span>
          </Link>
          <Link href="/cart" className="flex flex-col items-center text-slate-400 hover:text-[#0A192F] transition-colors">
            <ShoppingBag size={18} />
            <span className="text-[9px] font-semibold mt-1">Carrinho</span>
          </Link>
          <Link href="/conta" className="flex flex-col items-center text-[#0A192F] transition-colors">
            <User size={18} className="stroke-[2.5]" />
            <span className="text-[9px] font-bold mt-1">Conta</span>
          </Link>
        </nav>

      </div>
    </main>
  );
}