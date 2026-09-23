import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ShieldCheck, Anchor, Plus, ShoppingBag, MapPin } from 'lucide-react';
import { categories, products } from '../data/mabundaData';
import BottomNav from '../components/BottomNav';

export default function HomeDiscovery() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-24 text-[#0A192F] flex justify-center">
      {/* Container principal simulando formato mobile/card centralizado */}
      <div className="w-full max-w-md bg-[#F8FAFC] min-h-screen relative shadow-2xl flex flex-col">
        
        {/* Top Header com Logotipo e Perfil exatos */}
        <header className="px-4 pt-3 pb-3 flex items-center justify-between bg-white border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            {/* Logotipo da Empresa corrigido para mostrar o LOGO.png inteiro */}
            <div className="relative w-12 h-9 flex items-center justify-center shrink-0">
              <Image 
                src="/imagem do projecto/LOGO.png" 
                alt="Mabunda Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-base tracking-tight text-[#0A192F]">Mabunda</span>
                <span className="bg-slate-100 text-[#0A192F] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  LUANDA
                </span>
              </div>
              <div className="flex items-center space-x-1 text-[10px] text-slate-500 font-medium mt-0.5">
                <MapPin size={10} className="text-[#0A192F]" />
                <span>Ilha de Luanda • Home</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <Link href="/cart" className="relative w-9 h-9 bg-slate-50 border border-slate-200/70 rounded-full flex items-center justify-center text-[#0A192F] hover:bg-slate-100 transition-colors">
              <ShoppingBag size={16} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#0A192F] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow">
                3
              </span>
            </Link>

            <Link href="/conta" className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 relative shrink-0">
              <Image 
                src="/imagem do projecto/perfil.png" 
                alt="Perfil" 
                fill 
                className="object-cover"
              />
            </Link>
          </div>
        </header>

        {/* Location & Tides Bar */}
        <div className="bg-white px-4 py-2.5 flex items-center justify-between border-b border-slate-100 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-600 truncate mr-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="text-slate-500 shrink-0">Delivering to</span>
            <span className="font-semibold text-[#0A192F] truncate">Ilha de Luanda, Margin...</span>
            <ChevronDown size={14} className="text-slate-400 shrink-0" />
          </div>
          <div className="bg-slate-100 px-2.5 py-1 rounded-full flex items-center space-x-1 text-[11px] font-medium text-slate-700 shrink-0">
            <span>🌊 Tides: Calm</span>
          </div>
        </div>

        {/* Hero Banner ("Catch of the Day, Port to Plate") - Ajustado o tamanho e espaçamento */}
        <div className="px-5 pt-4">
          <div className="bg-[#0A192F] text-white rounded-2xl p-5 relative overflow-hidden shadow-md">
            <div className="flex items-center space-x-1.5 text-[10px] uppercase tracking-wider text-slate-300 mb-2">
              <Anchor size={12} />
              <span>Mabunda Direct Port Pier</span>
            </div>
            <h1 className="text-lg sm:text-xl font-serif italic font-normal leading-snug mb-2">
              Catch of the Day, <span className="not-italic font-sans font-bold">Port to</span> Plate
            </h1>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Hand-inspected at dawn by master fishmongers. Prepared, iced, and dispatched in cold-chain boxes.
            </p>
          </div>
        </div>

        {/* Categories Section */}
        <div className="px-5 pt-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Categories</span>
            <span className="text-[11px] font-medium text-[#0A192F] cursor-pointer hover:underline">View Almanac</span>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  cat.active 
                    ? 'bg-[#0A192F] text-white shadow-sm' 
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Morning Port Harvest Section */}
        <div className="px-5 pt-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-bold text-[#0A192F]">Morning Port Harvest</h2>
            <ShieldCheck size={18} className="text-slate-500" />
          </div>
          <p className="text-[11px] text-slate-500 mb-4">Sourced at 05:00 AM from Luanda Bay Artisanal Fleet</p>

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl p-2.5 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="relative w-full h-28 rounded-xl overflow-hidden mb-2.5">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill 
                      className="object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-[#0A192F]/80 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded-full font-medium">
                      {product.tag}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-tight block mb-0.5">
                    Coop. Pescadores Ilha
                  </span>
                  <h3 className="text-xs font-bold text-[#0A192F] truncate">{product.name}</h3>
                  <p className="text-[10px] text-slate-500 mb-3">{product.subtitle}</p>
                </div>
                
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-extrabold text-[#0A192F]">{product.price}</span>
                  <button className="w-7 h-7 bg-[#0A192F] text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors shadow-sm">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traceability Banner */}
        <div className="px-5 pt-6 pb-6">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-start space-x-3">
            <div className="bg-slate-100 p-2.5 rounded-full text-[#0A192F] mt-0.5 shrink-0">
              <Anchor size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0A192F] mb-1">Guaranteed Luanda Traceability</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Each catch includes digital provenance verifying the vessel captain, harvest...
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Bottom Bar */}
        <BottomNav />
      </div>
    </main>
  );
}