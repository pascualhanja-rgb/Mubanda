'use client';

import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Anchor, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

import { useApiClient, getOrder, ApiRequestError, OrderStatus } from '../lib/api';

/** Estados que significam que a validação da lota terminou (ou falhou) */
const TERMINAL_OK: OrderStatus[] = [
  'READY_FOR_DISPATCH',
  'PREPARING',
  'ASSIGNED',
  'IN_TRANSIT',
  'DELIVERED',
];
const TERMINAL_FAIL: OrderStatus[] = ['EXPIRED', 'CANCELLED'];

function LotaConfirmationInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = Number(searchParams.get('order') ?? '0');
  const { apiFetch } = useApiClient();

  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const navigate = useRef(false);

  // Polling do estado do pedido a cada 5s
  const poll = useCallback(async () => {
    if (!orderId || navigate.current) return;
    try {
      const order = await getOrder(apiFetch, orderId);
      const current = order.status as OrderStatus;
      setStatus(current);

      if (TERMINAL_OK.includes(current)) {
        navigate.current = true;
        router.replace(`/acompanhar-pedido?order=${orderId}`);
      } else if (TERMINAL_FAIL.includes(current)) {
        navigate.current = true;
        setError(
          current === 'EXPIRED'
            ? 'O prazo de 15 minutos para pagamento expirou e o stock foi devolvido.'
            : 'O pagamento foi rejeitado pela administração da Mabunda.'
        );
      }
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 404) {
        setNotFound(true);
      }
    }
  }, [apiFetch, orderId, router]);

  useEffect(() => {
    if (!orderId) return;
    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Cronómetro de espera (tempo real desde a entrada nesta tela)
  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const failed = Boolean(error) || notFound || !orderId;

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
          {!failed && (
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
          )}

          {/* Title & Warning Badge */}
          {failed ? (
            <>
              <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center shadow-xl mb-8">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-xl font-black text-[#0A192F] tracking-tight mb-3">
                {notFound ? 'Pedido não encontrado.' : 'Pedido não avançou.'}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mb-6">
                {error ?? 'Nenhum pedido em curso. Comece pelo checkout na lota.'}
              </p>
              <button
                onClick={() => router.push('/pedidos')}
                className="w-full bg-[#0A192F] hover:bg-[#132d4e] text-white py-3.5 rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Ver os meus pedidos
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-black text-[#0A192F] tracking-tight mb-3">
                {status === 'PENDING_PAYMENT'
                  ? 'A aguardar o seu comprovativo.'
                  : 'Aguardando confirmação da Lota.'}
              </h2>

              <div className="inline-flex items-center space-x-1.5 bg-slate-100 px-3 py-1.5 rounded-full mb-6 border border-slate-200/60">
                <Loader2 size={13} className="text-slate-500 animate-spin" />
                <span className="text-[10px] font-bold text-slate-600 tracking-wider uppercase">
                  Por favor não saia.
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mb-8">
                {status === 'PENDING_PAYMENT'
                  ? 'Ainda não recebemos o comprovativo de transferência deste pedido.'
                  : 'O comprovativo foi submetido. A administração da Mabunda está a analisar o pagamento da sua encomenda.'}
              </p>

              {/* Details Card */}
              <div className="w-full bg-slate-50 border border-slate-200/70 rounded-2xl p-4 space-y-2.5 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Encomenda Ref:</span>
                  <span className="font-bold text-[#0A192F] tracking-wider text-xs">#{orderId}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200/60">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Estado atual:</span>
                  <span className="font-black text-[#0A192F]">
                    {status === 'PENDING_PAYMENT'
                      ? 'PAGAMENTO PENDENTE'
                      : status === 'PAYMENT_UNDER_REVIEW'
                        ? 'PAGAMENTO EM ANÁLISE'
                        : status ?? 'A VERIFICAR...'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200/60">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">A aguardar há:</span>
                  <span className="font-black text-[#0A192F]">{seconds}s</span>
                </div>
              </div>

              {status === 'PENDING_PAYMENT' && (
                <button
                  onClick={() => router.push(`/transferencia?order=${orderId}`)}
                  className="w-full mt-4 bg-[#0A192F] hover:bg-[#132d4e] text-white py-3.5 rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Enviar comprovativo agora
                </button>
              )}
            </>
          )}

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

export default function LotaConfirmation() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-900/60 flex items-center justify-center">
          <Loader2 size={22} className="animate-spin text-slate-400" />
        </main>
      }
    >
      <LotaConfirmationInner />
    </Suspense>
  );
}
