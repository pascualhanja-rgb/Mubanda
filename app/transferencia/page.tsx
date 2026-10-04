'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Copy, Check, Upload, ArrowRight, ShieldCheck, MapPin, Loader2, AlertCircle } from 'lucide-react';

import {
  useApiClient,
  getOrder,
  getUploadUrl,
  uploadToR2,
  completeUpload,
  formatKz,
  ApiRequestError,
  OrderDetail,
} from '../lib/api';

/** Conta institucional da Mabunda (configuração de negócio — editar aqui se o IBAN mudar) */
const IBAN = "AO06 0040 0000 9821 4720 1015 8";

function BankTransferInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = Number(searchParams.get("order") ?? "0");
  const { apiFetch } = useApiClient();

  const [copied, setCopied] = useState(false);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrder = useCallback(async () => {
    if (!orderId) {
      setLoadingOrder(false);
      return;
    }
    try {
      const data = await getOrder(apiFetch, orderId);
      setOrder(data);
    } catch (err) {
      setError(
        err instanceof ApiRequestError && err.status === 404
          ? "Pedido não encontrado."
          : "Não foi possível carregar o pedido."
      );
    } finally {
      setLoadingOrder(false);
    }
  }, [apiFetch, orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleCopy = () => {
    navigator.clipboard.writeText(IBAN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    setError(null);
    if (!orderId) {
      setError('Nenhum pedido em curso. Comece pelo checkout.');
      return;
    }
    if (!file) {
      setError('Anexe a foto do comprovativo de transferência.');
      return;
    }
    if (order && order.status !== 'PENDING_PAYMENT') {
      setError('Este pedido já não espera comprovativo. Consulte os seus pedidos.');
      return;
    }

    setUploading(true);
    try {
      // Passo 1: URL pré-assinada do R2
      const { upload_url, object_key } = await getUploadUrl(apiFetch, orderId, {
        file_name: file.name,
        mime_type: file.type || 'application/octet-stream',
      });
      // Passo 1.5: upload direto dos bytes para o bucket (sem passar pela API)
      await uploadToR2(upload_url, file, file.type || 'application/octet-stream');
      // Passo 2: conclui → PAYMENT_UNDER_REVIEW + SSE para o Admin
      await completeUpload(apiFetch, orderId, object_key);

      router.push(`/loading-lota?order=${orderId}`);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.status === 400) {
          setError('O pedido já não aceita comprovativo (expirado ou em análise).');
        } else if (err.status === 403) {
          setError('Este pedido não lhe pertence.');
        } else if (err.status === 404) {
          setError('Pedido não encontrado.');
        } else {
          setError(err.message || 'Falha no upload do comprovativo. Tente novamente.');
        }
      } else {
        setError('Falha de ligação. Verifique a internet e tente novamente.');
      }
    } finally {
      setUploading(false);
    }
  };

  const grandTotal = order?.grand_total ?? 0;
  const address = (order?.delivery_address as string | undefined) ?? '';
  const instructions = (order?.delivery_instructions as string | undefined) ?? '';

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
                <ShieldCheck size={11} className="mr-1" /> Pedido #{orderId || '—'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">4.2 km da Doca</span>
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="w-7 h-7 bg-[#0A192F] text-white rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#0A192F] truncate">
                  {loadingOrder ? 'A carregar morada...' : address || 'Morada de entrega'}
                </p>
                {instructions && (
                  <p className="text-[10px] text-slate-500 truncate mt-0.5 bg-slate-200/50 px-2 py-1 rounded-lg">
                    Ref: {instructions}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-xs">
              <span className="text-slate-500 text-[11px]">Total da Encomenda:</span>
              <span className="font-black text-[#0A192F]">{formatKz(grandTotal)} AOA</span>
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
                {IBAN}
              </p>
            </div>

            <div className="flex justify-between items-end text-[10px] relative z-10 pt-1">
              <div>
                <span className="text-slate-400 block uppercase tracking-wider text-[8px]">Banco</span>
                <span className="font-semibold text-slate-200">Banco Angolano de Investimentos</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block uppercase tracking-wider text-[8px]">Valor Exato</span>
                <span className="font-black text-white text-xs">{formatKz(grandTotal)} AOA</span>
              </div>
            </div>
          </div>

          {/* Transfer Receipt Upload Section */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <h5 className="text-[10px] font-black uppercase tracking-wider text-[#0A192F]">Comprovativo de Transferência</h5>
            
            {/* Dashed Upload Box */}
            <label className="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer bg-white transition-all group">
              <div className="w-10 h-10 bg-slate-100 group-hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center mb-2 transition-colors">
                {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
              </div>
              <span className="text-xs font-bold text-[#0A192F]">
                {file ? file.name : 'Upload Transfer Receipt (PDF/Foto)'}
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5">Formatos aceites: JPG, PNG ou PDF (Máx. 10MB)</span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                disabled={uploading}
                onChange={(e) => {
                  setError(null);
                  const selected = e.target.files?.[0] ?? null;
                  if (selected && selected.size > 10 * 1024 * 1024) {
                    setError('O ficheiro excede 10MB. Reduza a imagem e tente novamente.');
                    e.target.value = '';
                    return;
                  }
                  setFile(selected);
                }}
                className="hidden"
              />
            </label>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-3 flex items-start space-x-2.5">
                <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-red-900">Atenção</p>
                  <p className="text-[10px] text-red-700">{error}</p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer Submit Button */}
        <div className="p-4 bg-white border-t border-slate-100">
          <button
            onClick={handleSubmit}
            disabled={uploading || !orderId}
            className="w-full bg-[#0A192F] hover:bg-[#132d4e] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 px-5 rounded-2xl font-bold text-xs flex items-center justify-between shadow-lg transition-all cursor-pointer"
          >
            <span className="tracking-wider uppercase flex items-center space-x-2">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              <span>{uploading ? 'A enviar comprovativo...' : 'Submeter e Iniciar Despacho'}</span>
            </span>
            <span className="font-black text-sm">{formatKz(grandTotal)} AOA</span>
          </button>

          <p className="text-center text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-2.5">
            Validação automática pelo protocolo de conferência EMIS / Mabunda.
          </p>
        </div>

      </div>
    </main>
  );
}

export default function BankTransfer() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-900/60 flex items-center justify-center">
          <Loader2 size={22} className="animate-spin text-slate-400" />
        </main>
      }
    >
      <BankTransferInner />
    </Suspense>
  );
}
