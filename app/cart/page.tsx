'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, X, Trash2, Snowflake, ShieldCheck, ArrowRight, Info, CheckCircle2 } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartReview() {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Garoupa Vermelha',
      subtitle: '1.2 KG MÉDIO • ESCAMADO',
      price: 14500,
      quantity: 1,
      image: '/imagem do projecto/Margin.png',
    },
    {
      id: '2',
      name: 'Camarão Tigre Gigante',
      subtitle: '1.0 KG • CRU COM CASCA',
      price: 22000,
      quantity: 1,
      image: '/imagem do projecto/Margin(5).png',
    },
    {
      id: '3',
      name: 'Lagosta da Costa Viva',
      subtitle: '800 G • NAMIBE ARTESANAL',
      price: 35000,
      quantity: 1,
      image: '/imagem do projecto/Margin(11).png',
    },
  ]);

  const deliveryFee = 2500;

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalEstimado = subtotal + (items.length > 0 ? deliveryFee : 0);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-AO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    /* No telemóvel ocupa 100% da largura e altura; no PC fica centralizado como uma página web normal */
    <main className="min-h-screen bg-slate-950 flex justify-center items-center">
      <div className="w-full h-screen sm:h-[90vh] sm:max-w-[480px] sm:rounded-3xl bg-white shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* Handle Bar for Mobile Modal */}
        <div className="w-full flex justify-center pt-3 pb-1 bg-white sm:hidden">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
        </div>

        {/* Modal Header */}
        <div className="px-5 pb-3 pt-3 flex items-center justify-between border-b border-slate-100 bg-white">
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-black tracking-tight text-[#0A192F]">Cesto de Marés</h2>
            <span className="bg-slate-100 text-[#0A192F] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {items.reduce((acc, item) => acc + item.quantity, 0)} Itens
            </span>
          </div>
          <Link href="/home" className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
            <X size={16} />
          </Link>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1">
          
          {/* Cold Chain Certification Banner */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-start space-x-3">
            <div className="w-8 h-8 bg-[#0A192F] text-white rounded-xl flex items-center justify-center shrink-0 mt-0.5">
              <Snowflake size={16} />
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#0A192F]">Cadeia de Frio Certificada</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Caixa térmica selada com gelo seco e monitoramento ativo
              </p>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex items-center justify-between gap-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h5 className="text-xs font-bold text-[#0A192F] truncate">{item.name}</h5>
                    <button 
                      onClick={() => removeItem(item.id)} 
                      className="text-slate-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-2">{item.subtitle}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0A192F]">{formatCurrency(item.price)} AOA</span>
                    
                    {/* Stepper */}
                    <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200/60">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-white rounded font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-[11px] font-bold text-[#0A192F]">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-white rounded font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sustainability & Traceability Link */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors">
            <div className="flex items-center space-x-2.5">
              <ShieldCheck size={16} className="text-[#0A192F]" />
              <span className="text-xs font-bold text-[#0A192F]">Pesca Sustentável & Rastreabilidade</span>
            </div>
            <ArrowRight size={14} className="text-slate-400" />
          </div>

          {/* Cost Breakdown */}
          <div className="bg-slate-50/70 rounded-2xl p-4 space-y-2.5 border border-slate-100">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Subtotal dos Pescados</span>
              <span className="font-semibold text-[#0A192F]">{formatCurrency(subtotal)} AOA</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600 items-center">
              <span className="flex items-center space-x-1">
                <span>Entrega Frigorífica (Luanda)</span>
                <Info size={12} className="text-slate-400 cursor-pointer" />
              </span>
              <span className="font-semibold text-[#0A192F]">{formatCurrency(deliveryFee)} AOA</span>
            </div>
            
            <div className="pt-2.5 border-t border-slate-200/60 flex justify-between items-baseline">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Estimado</span>
                <span className="text-[9px] text-slate-400">Impostos de descarga inclusos</span>
              </div>
              <span className="text-lg font-black text-[#0A192F]">{formatCurrency(totalEstimado)} AOA</span>
            </div>
          </div>

        </div>

        {/* Footer / Checkout Button */}
        <div className="p-4 bg-white border-t border-slate-100">
          <Link href="/checkout" className="w-full bg-[#0A192F] hover:bg-[#132d4e] text-white py-4 px-5 rounded-2xl font-bold text-xs flex items-center justify-between shadow-lg transition-all cursor-pointer">
            <span className="tracking-wider uppercase">Prosseguir para Checkout</span>
            <div className="flex items-center space-x-2">
              <span className="font-black text-sm">{formatCurrency(totalEstimado)} AOA</span>
              <ArrowRight size={16} />
            </div>
          </Link>

          <div className="flex items-center justify-center space-x-4 mt-3 text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
            <span className="flex items-center space-x-1">
              <ShieldCheck size={12} className="text-emerald-600" />
              <span>Pagamento Blindado</span>
            </span>
            <span>•</span>
            <span>Entrega em até 3h</span>
          </div>
        </div>

      </div>
    </main>
  );
}