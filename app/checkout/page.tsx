'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Navigation, Building2, CreditCard, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

// Importação dinâmica do mapa OpenStreetMap (Leaflet não suporta SSR)
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
const MapaOSM = dynamic(() => import('../components/MapaOSM'), { ssr: false });

import { useCart, itemQuantityKg } from '../lib/cartContext';
import {
  useApiClient,
  createOrder,
  generateIdempotencyKey,
  formatKz,
  ApiRequestError,
} from '../lib/api';
import { loadPrimaryAddress } from '../lib/addressStorage';

export default function GpsCheckout() {
  const router = useRouter();
  const { items, subtotal, deliveryFee, total, clear } = useCart();
  const { apiFetch, isSignedIn } = useApiClient();

  const [paymentMethod, setPaymentMethod] = useState<'multicaixa' | 'iban'>('multicaixa');
  const [isClient, setIsClient] = useState(false);

  // Idempotency key gerada 1× por visita à tela (protegida por ref) —
  // retries do mesmo pedido reutilizam a mesma key, conforme CLIENT.md
  const idempotencyKeyRef = useRef<string>('');
  if (!idempotencyKeyRef.current) {
    idempotencyKeyRef.current = generateIdempotencyKey();
  }

  // Morada e instruções reais (prefill da morada principal guardada)
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const saved = loadPrimaryAddress();
    if (saved) {
      setAddress(saved.address);
      setInstructions(saved.reference || '');
    }
  }, []);

  // Coordenadas aproximadas para a Ilha de Luanda / Baía de Luanda (-8.8383, 13.2344)
  const luandaPosition: [number, number] = [-8.8383, 13.2344];

  const handleConfirm = async () => {
    setError(null);

    if (items.length === 0) {
      setError('O seu cesto está vazio. Adicione pescado antes de confirmar.');
      return;
    }
    if (address.trim().length < 5) {
      setError('Indique uma morada de entrega válida (mínimo 5 caracteres).');
      return;
    }
    if (!isSignedIn) {
      setError('Sessão expirada. Inicie sessão novamente.');
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder(apiFetch, {
        idempotency_key: idempotencyKeyRef.current,
        delivery_address: address.trim(),
        delivery_instructions: instructions.trim() || undefined,
        items: items.map((item) => ({
          product_id: item.productId,
          quantity: itemQuantityKg(item),
        })),
      });

      // Carrinho consumido — segue para o comprovativo do pedido real.
      // Key consumida: próxima visita à tela gera nova (evita reutilizar para outro pedido)
      idempotencyKeyRef.current = generateIdempotencyKey();
      clear();
      router.push(`/transferencia?order=${order.order_id}`);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.status === 400) {
          setError(err.message || 'Mercado fechado. Funcionamos das 06:00 às 18:00 (Luanda).');
        } else if (err.status === 422) {
          setError('Stock insuficiente ou produto indisponível. Ajuste o cesto e tente novamente.');
        } else if (err.status === 409) {
          setError('Outro cliente reservou o mesmo lote. Tente confirmar novamente.');
        } else if (err.status === 401) {
          setError('Sessão expirada. Inicie sessão novamente.');
        } else {
          setError(err.message || 'Não foi possível criar o pedido.');
        }
      } else {
        setError('Falha de ligação à API. Verifique a internet e tente novamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-28 text-[#0A192F] flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl flex flex-col justify-between">
        
        <div>
          {/* Top Header */}
          <header className="px-5 pt-4 pb-3 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-30">
            <Link href="/cart" className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors">
              <ArrowLeft size={18} className="text-[#0A192F]" />
            </Link>
            <h1 className="text-sm font-bold tracking-tight text-[#0A192F]">Gps Checkout</h1>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-50 font-bold text-xs">
              M
            </div>
          </header>

          {/* Map View & Origin Overlay */}
          <div className="relative w-full h-48 bg-slate-200 z-10">
            {/* Origin Badge Floating on Map */}
            <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-100">
              <div className="flex items-center space-x-2 text-[11px] font-bold text-[#0A192F]">
                <Navigation size={14} className="text-[#0A192F]" />
                <span>ORIGEM: DOCA DA MABUNDA</span>
                <span className="text-slate-400 font-normal">• 4.2 km</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#0A192F] text-white flex items-center justify-center text-[10px] font-bold">
                M
              </div>
            </div>            {/* OpenStreetMap Leaflet Component */}
            {isClient ? (
              <MapaOSM
                center={luandaPosition}
                popupText="Destino: Ilha de Luanda, Marginal"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-xs text-slate-400">
                A carregar mapa de Luanda...
              </div>
            )}

            {/* Destination Floating Card */}
            <div className="absolute bottom-3 left-3 right-3 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-lg border border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2.5 truncate">
                <MapPin size={16} className="text-[#0A192F] shrink-0" />
                <div className="truncate">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Destino de Entrega</span>
                  <p className="text-xs font-bold text-[#0A192F] truncate">
                    {address.trim() || 'Preencha a morada abaixo'}
                  </p>
                </div>
              </div>
              <Link
                href="/conta"
                className="bg-slate-100 hover:bg-slate-200 text-[#0A192F] text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0 ml-2"
              >
                Ajustar
              </Link>
            </div>
          </div>

          {/* Delivery Details Section */}
          <div className="px-5 pt-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Logística Expressa</span>
                <h3 className="text-sm font-bold text-[#0A192F]">Detalhes da Entrega</h3>
              </div>
              <span className="bg-slate-100 text-[#0A192F] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Etapa 2 de 2
              </span>
            </div>

            {/* Bairro / Zona de Luanda */}
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Bairro / Zona de Luanda
                </label>
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex: Ilha de Luanda (Av. Murtala Mohamed)"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-xs text-[#0A192F] font-medium outline-none focus:bg-white focus:border-[#0A192F] transition-all pr-10"
                  />
                  <Navigation size={15} className="absolute right-3.5 text-slate-400" />
                </div>
              </div>

              {/* Ponto de Referência */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Ponto de Referência / Instruções
                </label>
                <textarea 
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Ex: Portão preto junto ao Clube Náutico, entregar com gelo em escama intacto."
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-[#0A192F] font-medium outline-none focus:bg-white focus:border-[#0A192F] resize-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="px-5 pt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Forma de Pagamento</h3>
              <span className="text-[10px] text-slate-400 font-semibold">Seguro & Auditado</span>
            </div>

            <div className="space-y-2.5">
              {/* Multicaixa Express Option */}
              <div 
                onClick={() => setPaymentMethod('multicaixa')}
                className={`border rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'multicaixa' 
                    ? 'bg-[#0A192F] text-white border-[#0A192F] shadow-md' 
                    : 'bg-white text-[#0A192F] border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${paymentMethod === 'multicaixa' ? 'bg-white/10 text-white' : 'bg-slate-100 text-[#0A192F]'}`}>
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-bold">Multicaixa Express</h4>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${paymentMethod === 'multicaixa' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                        Recomendado
                      </span>
                    </div>
                    <p className={`text-[10px] ${paymentMethod === 'multicaixa' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Comprovativo validado pela equipa Mabunda
                    </p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'multicaixa' ? 'border-white bg-white' : 'border-slate-300'}`}>
                  {paymentMethod === 'multicaixa' && <div className="w-2.5 h-2.5 rounded-full bg-[#0A192F]"></div>}
                </div>
              </div>

              {/* Pagamento por Iban Option */}
              <div 
                onClick={() => setPaymentMethod('iban')}
                className={`border rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'iban' 
                    ? 'bg-[#0A192F] text-white border-[#0A192F] shadow-md' 
                    : 'bg-white text-[#0A192F] border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${paymentMethod === 'iban' ? 'bg-white/10 text-white' : 'bg-slate-100 text-[#0A192F]'}`}>
                    <Building2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">Pagamento por Iban</h4>
                    <p className={`text-[10px] ${paymentMethod === 'iban' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Confirmação por meio do comprovante
                    </p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'iban' ? 'border-white bg-white' : 'border-slate-300'}`}>
                  {paymentMethod === 'iban' && <div className="w-2.5 h-2.5 rounded-full bg-[#0A192F]"></div>}
                </div>
              </div>
            </div>
          </div>

          {/* Order Financial Breakdown */}
          <div className="px-5 pt-6 pb-6">
            <div className="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-100">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Lote Pescado Artesanal ({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
                <span className="font-semibold text-[#0A192F]">{formatKz(subtotal)} AOA</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Entrega Frigorífica Express [Luanda]</span>
                <span className="font-semibold text-[#0A192F]">{formatKz(deliveryFee)} AOA</span>
              </div>

              <div className="pt-2.5 border-t border-slate-200/60 flex justify-between items-baseline">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0A192F]">Total a Liquidar</span>
                <span className="text-lg font-black text-[#0A192F]">{formatKz(total)} AOA</span>
              </div>
            </div>

            {items.length === 0 && (
              <div className="mt-3 bg-amber-50 border border-amber-100 rounded-2xl p-3 flex items-start space-x-2.5">
                <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-amber-900">Cesto vazio</p>
                  <p className="text-[10px] text-amber-700">
                    Volte à lota e adicione pescado antes de confirmar a encomenda.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-3 bg-red-50 border border-red-100 rounded-2xl p-3 flex items-start space-x-2.5">
                <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-red-900">Não foi possível confirmar</p>
                  <p className="text-[10px] text-red-700">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Confirmation Bar */}
        <div className="fixed bottom-0 w-full max-w-[430px] bg-white border-t border-slate-100 p-4 shadow-2xl z-30">
          <button
            onClick={handleConfirm}
            disabled={submitting || items.length === 0}
            className="w-full bg-[#0A192F] hover:bg-[#132d4e] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 px-5 rounded-2xl font-bold text-xs flex items-center justify-between shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
              <span className="tracking-wider uppercase">
                {submitting ? 'A reservar stock...' : 'Confirmar Encomenda'}
              </span>
            </div>
            <span className="font-black text-sm">{formatKz(total)} AOA</span>
          </button>

          <div className="text-center mt-2.5">
            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
              🔒 PROTOCOLO SEGURO MABUNDA PESCA SELVAGEM
            </span>
          </div>
        </div>

      </div>
    </main>
  );
}