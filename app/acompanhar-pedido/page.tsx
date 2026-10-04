'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Check, Navigation, Phone, ShieldCheck, AlertCircle, KeyRound, Loader2 } from 'lucide-react';

import { useApiClient, getOrder, formatKz, ApiRequestError, OrderDetail, OrderStatus } from '../lib/api';

/** Rótulo legível de cada estado da API */
const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Pagamento Pendente',
  PAYMENT_UNDER_REVIEW: 'Pagamento em Análise',
  READY_FOR_DISPATCH: 'Pronto p/ Despacho',
  PREPARING: 'Em Preparação',
  ASSIGNED: 'Estafeta Atribuído',
  IN_TRANSIT: 'Em Rota de Entrega',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
  EXPIRED: 'Expirado',
};

function TrackOrderInner() {
  const searchParams = useSearchParams();
  const orderId = Number(searchParams.get('order') ?? '0');
  const { apiFetch } = useApiClient();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancelNote, setCancelNote] = useState(false);

  const poll = useCallback(async () => {
    if (!orderId) return;
    try {
      const data = await getOrder(apiFetch, orderId);
      setOrder(data);
      setError(null);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(
          err.status === 404
            ? 'Pedido não encontrado.'
            : err.status === 403
              ? 'Este pedido pertence a outra conta.'
              : err.message || 'Não foi possível carregar o pedido.'
        );
      } else {
        setError('Falha de ligação à API.');
      }
    }
  }, [apiFetch, orderId]);

  useEffect(() => {
    if (!orderId) return;
    poll();
    const interval = setInterval(poll, 6000);
    return () => clearInterval(interval);
  }, [poll, orderId]);

  if (!orderId) {
    return (
      <main className="min-h-screen bg-slate-900/60 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full">
          <AlertCircle size={28} className="text-slate-400 mx-auto mb-3" />
          <h1 className="text-sm font-bold text-[#0A192F] mb-1">Nenhum pedido em curso</h1>
          <p className="text-xs text-slate-500 mb-4">Confirme uma encomenda para acompanhar a entrega.</p>
          <Link
            href="/pedidos"
            className="inline-block bg-[#0A192F] text-white text-xs font-bold px-5 py-2.5 rounded-xl"
          >
            Ver os meus pedidos
          </Link>
        </div>
      </main>
    );
  }

  if (error && !order) {
    return (
      <main className="min-h-screen bg-slate-900/60 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full">
          <AlertCircle size={28} className="text-red-500 mx-auto mb-3" />
          <h1 className="text-sm font-bold text-[#0A192F] mb-1">Não foi possível acompanhar</h1>
          <p className="text-xs text-slate-500 mb-4">{error}</p>
          <Link
            href="/pedidos"
            className="inline-block bg-[#0A192F] text-white text-xs font-bold px-5 py-2.5 rounded-xl"
          >
            Ver os meus pedidos
          </Link>
        </div>
      </main>
    );
  }

  const status = (order?.status as OrderStatus | undefined) ?? null;
  const grandTotal = order?.grand_total ?? 0;
  const runner = order?.runner;
  const deliveryPin = order?.delivery_pin as string | undefined;
  const address = (order?.delivery_address as string | undefined) ?? '';

  // Etapa atual da timeline (1 preparação · 2 em rota · 3 entregue)
  const step = status === 'DELIVERED' ? 3 : status === 'IN_TRANSIT' ? 2 : 1;
  const paymentProblem = status === 'PENDING_PAYMENT' || status === 'EXPIRED' || status === 'CANCELLED';

  return (
    <main className="min-h-screen bg-slate-900/60 backdrop-blur-md text-[#0A192F] flex justify-center items-center">
      <div className="w-full h-screen sm:h-[90vh] sm:max-w-md sm:rounded-3xl bg-white shadow-2xl overflow-hidden relative flex flex-col justify-between border border-slate-100">
        
        {/* Top Header */}
        <header className="px-5 pt-4 pb-3 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-30">
          <Link href="/pedidos" className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors">
            <ArrowLeft size={16} className="text-[#0A192F]" />
          </Link>
          <div className="text-center">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block">Rastreamento em Tempo Real</span>
            <h1 className="text-xs font-black tracking-tight text-[#0A192F]">Acompanhar Pedido #{orderId}</h1>
          </div>
          <div className="w-6 h-6 flex items-center justify-center">
            <Loader2 size={14} className="animate-spin text-slate-400" />
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="px-5 py-4 space-y-4 overflow-y-auto flex-1 pb-24">

          {/* Delivery Status Banner */}
          <div className="bg-slate-50 border border-slate-200/70 rounded-3xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-[#0A192F] bg-slate-200/70 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0A192F] animate-pulse"></span>
                <span>{status ? STATUS_LABELS[status] : 'A carregar...'}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono font-bold">
                {formatKz(grandTotal)} AOA
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Entregar em</span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-sm font-black text-[#0A192F] truncate">{address || '—'}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Instruções</span>
                <span className="text-[11px] font-bold text-[#0A192F]">
                  {(order?.delivery_instructions as string | undefined) || 'Sem instruções'}
                </span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-200/60 flex justify-between items-center text-[10px] text-slate-500 font-medium">
              <span className="truncate">Origem: Doca da Mabunda</span>
              <span className="mx-1">•</span>
              <span className="truncate">{address || 'Destino a confirmar'}</span>
            </div>
          </div>

          {/* PIN de Entrega (só quando ASSIGNED, devolvido pela API ao dono) */}
          {deliveryPin && (
            <div className="bg-[#0A192F] text-white rounded-3xl p-5 flex items-center justify-between shadow-xl">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 block mb-1">
                  PIN de Entrega
                </span>
                <p className="text-2xl font-black tracking-[0.3em]">{deliveryPin}</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Mostre este código ao estafeta no momento da entrega.
                </p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                <KeyRound size={22} />
              </div>
            </div>
          )}

          {/* Aviso de pagamento pendente */}
          {paymentProblem && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 flex items-start space-x-2.5">
              <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-amber-900">
                  {status === 'PENDING_PAYMENT' ? 'Comprovativo pendente' : status === 'EXPIRED' ? 'Pedido expirado' : 'Pedido cancelado'}
                </p>
                <p className="text-[10px] text-amber-700">
                  {status === 'PENDING_PAYMENT'
                    ? 'Envie o comprovativo de transferência para o pedido avançar na lota.'
                    : status === 'EXPIRED'
                      ? 'O prazo de pagamento de 15 minutos terminou. O stock foi devolvido à lota.'
                      : 'O pagamento foi rejeitado pela administração. Contacte o apoio ao cliente.'}
                </p>
                {status === 'PENDING_PAYMENT' && (
                  <Link
                    href={`/transferencia?order=${orderId}`}
                    className="text-[10px] font-bold text-amber-900 underline mt-1 inline-block"
                  >
                    Enviar comprovativo
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Estado do Pescado (Timeline) */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-4 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-[#0A192F]">Estado do Pescado</h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              
              {/* Step 1: Preparation */}
              <div className="relative">
                <div className={`absolute -left-6 top-0 w-6 h-6 rounded-full text-white flex items-center justify-center shadow-md ${step >= 1 ? 'bg-[#0A192F]' : 'bg-white border-2 border-slate-300 text-slate-400'}`}>
                  <Check size={12} className="stroke-[3]" />
                </div>
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className={`text-xs font-bold ${step >= 1 ? 'text-[#0A192F]' : 'text-slate-400'}`}>1. Preparation</h4>
                  {step === 1 && status && (
                    <span className="bg-[#0A192F] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Atual
                    </span>
                  )}
                </div>
                <p className={`text-[10px] leading-relaxed ${step >= 1 ? 'text-slate-500' : 'text-slate-400'}`}>
                  Pescado escamado, eviscerado e embalado em caixa isotérmica lacrada a 0°C na Doca da Mabunda.
                </p>
              </div>

              {/* Step 2: On the Way */}
              <div className="relative">
                <div className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center shadow-md ${step >= 2 ? 'bg-[#0A192F] text-white' : 'bg-white border-2 border-slate-300 text-slate-400'} ${step === 2 ? 'ring-4 ring-slate-100' : ''}`}>
                  <Navigation size={12} className="stroke-[2.5]" />
                </div>
                <div className="flex justify-between items-start mb-0.5">
                  <div className="flex items-center space-x-2">
                    <h4 className={`text-xs font-bold ${step >= 2 ? 'text-[#0A192F]' : 'text-slate-400'}`}>2. On the Way</h4>
                    {step === 2 && (
                      <span className="bg-[#0A192F] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                        Atual
                      </span>
                    )}
                  </div>
                </div>
                <p className={`text-[10px] leading-relaxed ${step >= 2 ? 'text-slate-500' : 'text-slate-400'}`}>
                  Estafeta em trânsito com mala térmica refrigerada até à sua morada em Luanda.
                </p>
              </div>

              {/* Step 3: Delivered */}
              <div className="relative">
                <div className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-[#0A192F] text-white shadow-md' : 'bg-white border-2 border-slate-300 text-slate-400'}`}>
                  {step >= 3 ? <Check size={12} className="stroke-[3]" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>}
                </div>
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className={`text-xs font-bold ${step >= 3 ? 'text-[#0A192F]' : 'text-slate-400'}`}>3. Delivered</h4>
                  {step === 3 && (
                    <span className="bg-emerald-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Concluído
                    </span>
                  )}
                </div>
                <p className={`text-[10px] leading-relaxed ${step >= 3 ? 'text-slate-500' : 'text-slate-400'}`}>
                  Entrega em mãos com verificação do PIN e da cadeia de frio.
                </p>
              </div>

            </div>
          </div>

          {/* Estafeta Dedicado Mabunda Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between">
            {runner ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#0A192F] text-white rounded-xl flex items-center justify-center font-bold text-xs tracking-wider shrink-0">
                    {runner.name
                      .split(' ')
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#0A192F]">{runner.name}</h5>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="bg-slate-200/80 text-[#0A192F] font-mono text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {runner.vehicle_plate}
                      </span>
                    </div>
                  </div>
                </div>

                <a 
                  href={`tel:${runner.phone}`}
                  className="w-9 h-9 bg-[#0A192F] hover:bg-[#132d4e] text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
                >
                  <Phone size={15} />
                </a>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-200 text-slate-500 rounded-xl flex items-center justify-center shrink-0">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#0A192F]">A atribuir estafeta</h5>
                    <p className="text-[10px] text-slate-500">
                      {step === 3 ? 'Entrega concluída.' : 'Assim que um estafeta aceitar, os dados aparecem aqui.'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

        {/* Footer Cancel Action */}
        <div className="absolute bottom-0 w-full p-4 bg-white border-t border-slate-100 text-center z-30 shadow-lg">
          <button 
            onClick={() => setCancelNote(true)}
            className="text-[11px] font-bold text-slate-400 hover:text-red-500 underline transition-colors cursor-pointer"
          >
            Cancel Order
          </button>
          {cancelNote ? (
            <p className="text-[9px] text-red-500 mt-1 uppercase tracking-wider font-bold">
              O cancelamento é processado pelo apoio ao cliente da Mabunda.
            </p>
          ) : (
            <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-wider">
              Cancelamentos só permitidos antes da saída do estafeta da doca.
            </p>
          )}
        </div>

      </div>
    </main>
  );
}

export default function TrackOrder() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-900/60 flex items-center justify-center">
          <Loader2 size={22} className="animate-spin text-slate-400" />
        </main>
      }
    >
      <TrackOrderInner />
    </Suspense>
  );
}
