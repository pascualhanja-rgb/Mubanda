'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Mic, ArrowRight, History, ShoppingBag, Anchor, Waves, MapPin } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function SearchExplore() {
  const recentSearches = [
    { title: 'Garoupa de Luanda', subtitle: 'Premium Wild Line-Caught', href: '/product' },
    { title: 'Lagosta Viva', subtitle: 'Cabo Ledo Artisanal Trap', href: '#' },
    { title: 'Polvo Fresco 1kg', subtitle: 'Tenderized Rock Reef Octopus', href: '#' },
    { title: 'Bacalhau Seco', subtitle: 'Tradicional Salt Cure Curated', href: '#' },
  ];

  const trendingCatches = [
    'Camarão Tigre •',
    'Robalo Selvagem',
    'Atum Rabilho',
    'Lulas Frescas',
    'Ostras da Baía',
    'Filete de Pescada',
    'Sardinha Fresca •',
  ];

  const docks = [
    {
      title: 'Mabunda Central Pier',
      description: 'Historic daily harbor landing. Handline garoupa, red snapper, and benthic...',
      rating: '4.8',
      reviews: '184',
      badge: 'DIRECT WHARF',
      time: 'Fleet Docked 5:15 AM',
      image: '/imagem do projecto/Background(1).png',
    },
    {
      title: 'Ilha Artisanal Beach',
      description: 'Small-boat line-caught landing. Direct beach access, zero-bycatch policy...',
      rating: '4.8',
      reviews: '92',
      badge: 'ECO-CERTIFIED',
      time: 'Chilled at 0°C',
      image: '/imagem do projecto/Background(2).png',
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-24 text-[#0A192F] flex justify-center">
      <div className="w-full max-w-md bg-[#F8FAFC] min-h-screen relative shadow-2xl flex flex-col">
        
        {/* Top Header com Logotipo e Perfil exatos */}
        <header className="px-4 pt-3 pb-3 flex items-center justify-between bg-white border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="relative w-12 h-9 flex items-center justify-center shrink-0">
              <Image 
                src="/imagem do projecto/LOGO.png" 
                alt="Mabunda Logo" 
                fill 
                className="object-contain"
                priority
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
                <span>Ilha de Luanda • Search</span>
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
                alt="Perfil de Cristiano" 
                fill 
                className="object-cover"
              />
            </Link>
          </div>
        </header>

        {/* Location Sub-header */}
        <div className="bg-white px-5 py-2.5 flex items-center justify-between border-b border-slate-100 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-500">Ilha de Luanda</span>
            <span className="font-semibold text-[#0A192F]">• Search Active</span>
          </div>
          <span className="text-[10px] text-slate-400">06:40 WAT</span>
        </div>

        {/* Search Bar & Fleet Notice */}
        <div className="px-5 pt-4">
          <div className="relative flex items-center mb-3">
            <Search size={18} className="absolute left-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search fish, prawns, artisanal vendors..." 
              className="w-full bg-slate-100 text-xs text-[#0A192F] pl-10 pr-10 py-3 rounded-xl border border-transparent focus:border-slate-300 focus:bg-white outline-none transition-all"
            />
            <Mic size={18} className="absolute right-3.5 text-slate-400 cursor-pointer hover:text-[#0A192F]" />
          </div>

          <div className="bg-slate-100 px-3 py-2 rounded-xl flex items-center space-x-2 text-[11px] text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0A192F]"></span>
            <span className="truncate">Porto de Luanda: Morning fleet docked & verified</span>
          </div>
        </div>

        {/* Recent Searches */}
        <div className="px-5 pt-5">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Recent Searches</span>
            <span className="text-[11px] font-medium text-slate-400 cursor-pointer hover:underline">Clear All</span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
            {recentSearches.map((item, index) => {
              const content = (
                <div className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer first:rounded-t-2xl last:rounded-b-2xl w-full">
                  <div className="flex items-center space-x-3">
                    <History size={16} className="text-slate-400" />
                    <div>
                      <h4 className="text-xs font-bold text-[#0A192F]">{item.title}</h4>
                      <p className="text-[10px] text-slate-400">{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-300" />
                </div>
              );

              return (
                <div key={index}>
                  {item.href ? (
                    <Link href={item.href} className="block">
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Trending Daily Catches */}
        <div className="px-5 pt-5">
          <div className="flex items-center space-x-1.5 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Trending Daily Catches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingCatches.map((catchItem, index) => (
              <span 
                key={index} 
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer"
              >
                {catchItem}
              </span>
            ))}
          </div>
        </div>

        {/* Artisanal Cooperative Docks */}
        <div className="px-5 pt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1.5">
              <Anchor size={16} className="text-[#0A192F]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Artisanal Cooperative Docks</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Verified Source</span>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {docks.map((dock, index) => (
              <div key={index} className="bg-white rounded-2xl p-2.5 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="relative w-full h-28 rounded-xl overflow-hidden mb-2.5">
                    <Image 
                      src={dock.image} 
                      alt={dock.title} 
                      fill 
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                      <span>★ {dock.rating}</span>
                      <span className="text-slate-300 font-normal">({dock.reviews})</span>
                    </div>
                    <span className="absolute bottom-2 left-2 bg-[#0A192F]/90 text-white text-[8px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      {dock.badge}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#0A192F] mb-1">{dock.title}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed mb-3">{dock.description}</p>
                </div>
                
                <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                  <span className="text-[9px] text-emerald-600 font-semibold">{dock.time}</span>
                  <div className="w-6 h-6 bg-slate-100 text-[#0A192F] rounded-full flex items-center justify-center hover:bg-[#0A192F] hover:text-white transition-colors">
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Browse by Water Depth */}
        <div className="px-5 pt-6 pb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Browse by Water Depth</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#0A192F]">Deep Oceanic</span>
                <Waves size={16} className="text-slate-400" />
              </div>
              <p className="text-[10px] text-slate-500 mb-3">Tuna, Swordfish, Grouper</p>
              <span className="text-[10px] font-bold text-[#0A192F]">18 Available</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#0A192F]">Coastal Reef</span>
                <Waves size={16} className="text-slate-400" />
              </div>
              <p className="text-[10px] text-slate-500 mb-3">Prawns, Octopus, Crab</p>
              <span className="text-[10px] font-bold text-[#0A192F]">24 Available</span>
            </div>
          </div>
        </div>

        {/* Navigation Bottom Bar */}
        <BottomNav />
      </div>
    </main>
  );
}