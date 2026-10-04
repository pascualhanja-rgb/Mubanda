'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, X, Trash2, Snowflake, ShieldCheck, ArrowRight, Info, ShoppingBag } from 'lucide-react';
import { useCart } from '../lib/cartContext';
import { formatKz } from '../lib/api';

export default function CartReview() {
  const { items, count, subtotal, deliveryFee, total, updateQuantity, removeItem } = useCart();

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
            <Link href="/home" className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-[#0A192F] hover:bg-slate-200 transition-colors md:hidden">
              <ArrowLeft size={15} />
            </Link>
            <h2 className="text-base font-black tracking-tight text-[#0A192F]">Cesto de Marés</h2>
            <span className="bg-slate-100 text-[#0A192F] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {count} Itens
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

          {/* Estado: carrinho vazio */}
          {items.length === 0 && (
            <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag size={22} className="text-slate-400" />
              </div>
              <h4 className="text-sm font-bold text-[#0A192F] mb-1">O seu cesto está vazio</h4>
              <p className="text-xs text-slate-500 mb-4">
                Explore a lota de hoje e adicione pescado fresco da doca.
              </p>
              <Link
                href="/home"
                className="inline-block bg-[#0A192F] hover:bg-[#132d4e] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
              >
                Ver a Lota de Hoje
              </Link>
            </div>
          )}

          {/* Items List */}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex items-center justify-between gap-3">
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
                      onClick={() => removeItem(item.productId)} 
                      className="text-slate-300 hover:text-red-500 transition-colors p-1"
                      aria-label={`Remover ${item.name}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-2">{item.subtitle}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0A192F]">{formatKz(item.price)} AOA</span>
                    
                    {/* Stepper */}
                    <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200/60">
                      <button 
                        onClick={() => updateQuantity(item.productId, -1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-white rounded font-bold text-xs"
                        aria-label="Diminuir quantidade"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-[11px] font-bold text-[#0A192F]">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-white rounded font-bold text-xs"
                        aria-label="Aumentar quantidade"
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
          {items.length > 0 && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="flex items-center space-x-2.5">
                <ShieldCheck size={16} className="text-[#0A192F]" />
                <span className="text-xs font-bold text-[#0A192F]">Pesca Sustentável & Rastreabilidade</span>
              </div>
              <ArrowRight size={14} className="text-slate-400" />
            </div>
          )}

          {/* Cost Breakdown */}
          {items.length > 0 && (
            <div className="bg-slate-50/70 rounded-2xl p-4 space-y-2.5 border border-slate-100">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal dos Pescados</span>
                <span className="font-semibold text-[#0A192F]">{formatKz(subtotal)} AOA</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600 items-center">
                <span className="flex items-center space-x-1">
                  <span>Entrega Frigorífica (Luanda)</span>
                  <Info size={12} className="text-slate-400 cursor-pointer" />
                </span>
                <span className="font-semibold text-[#0A192F]">{formatKz(deliveryFee)} AOA</span>
              </div>
              
              <div className="pt-2.5 border-t border-slate-200/60 flex justify-between items-baseline">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Estimado</span>
                  <span className="text-[9px] text-slate-400">Impostos de descarga inclusos</span>
                </div>
                <span className="text-lg font-black text-[#0A192F]">{formatKz(total)} AOA</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer / Checkout Button */}
        {items.length > 0 && (
          <div className="p-4 bg-white border-t border-slate-100">
            <Link href="/checkout" className="w-full bg-[#0A192F] hover:bg-[#132d4e] text-white py-4 px-5 rounded-2xl font-bold text-xs flex items-center justify-between shadow-lg transition-all cursor-pointer">
              <span className="tracking-wider uppercase">Prosseguir para Checkout</span>
              <div className="flex items-center space-x-2">
                <span className="font-black text-sm">{formatKz(total)} AOA</span>
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
        )}

      </div>
    </main>
  );
}
