'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Bell,
  Check,
  Phone,
  Navigation,
  RotateCcw,
  Home,
  Search,
  ShoppingBag,
  User,
  Truck,
  MapPin,
  Snowflake,
  AlertCircle,
  Anchor,
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useCart } from '../lib/cartContext';
import { formatKz, useApiClient, getOrder, OrderDetail } from '../lib/api';
import { useCatalog } from '../lib/useCatalog';
import {
  useOrders,
  isActiveOrder,
  statusLabel,
  formatOrderDate,
  orderItemsOf,
  OrderStatus,
} from '../lib/useOrders';

/** Etapa do stepper: 1 lota confirmada · 2 gelo/pago · 3 em trânsito · 4 entregue */
function stepOf(status: OrderStatus): number {
  if (status === 'PENDING_PAYMENT' || status === 'PAYMENT_UNDER_REVIEW') return 1;
  if (status === 'READY_FOR_DISPATCH' || status === 'PREPARING') return 2;
  if (status === 'ASSIGNED' || status === 'IN_TRANSIT') return 3;
  return 4;
}

export default function MeusPedidosPage() {
  const { active, closed, loading, error, reload } = useOrders(8000);
  const { apiFetch } = useApiClient();
  const { addItem } = useCart();
  const { resolve: resolveProduct } = useCatalog();

  const [tab, setTab] = useState<'em_curso' | 'historico'>('em_curso');
  const [activeDetail, setActiveDetail] = useState<OrderDetail | null>(null);

  // Detalhe (runner + PIN) do pedido em curso mais recente
  const firstActive = active[0];
  React.useEffect(() => {
    if (!firstActive) {
      setActiveDetail(null);
      return;
    }
    let alive = true;
    const load = () =>
      getOrder(apiFetch, firstActive.order_id)
        .then((d) => alive && setActiveDetail(d))
        .catch(() => {});
    load();
    const interval = setInterval(load, 8000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, [apiFetch, firstActive]);

  const repeatOrder = (orderId: number) => {
    const order = [...active, ...closed].find((o) => o.order_id === orderId);
    if (!order) return;
    for (const item of orderItemsOf(order)) {
      // Preço real vem do catálogo (a listagem pode omitir price)
      const product = resolveProduct(item.product_id);
      addItem(
        {
          productId: item.product_id,
          name: product?.name ?? item.name,
          subtitle: product?.stock_weight
            ? `${product.stock_weight} kg • Fresco`
            : `${item.quantity} kg • Fresco`,
          price: product?.price ?? item.price ?? 0,
          image:
            item.image_url && item.image_url.startsWith('/')
              ? item.image_url
              : '/imagem do projecto/Margin.png',
          stockWeight: product?.stock_weight,
        },
        1
      );
    }
  };

  const runner = activeDetail?.runner;
  const status = (activeDetail?.status ?? firstActive?.status) as OrderStatus | undefined;
  const step = status ? stepOf(status) : 1;

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen text-slate-800 pb-24 font-sans relative">
      {/* Header Superior */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <Image
            src="/imagem do projecto/LOGO.png"
            alt="Logo Mabunda"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
        <Link href="/notificacoes" className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition">
          <Bell className="w-5 h-5" />
        </Link>
      </header>

      {/* Conteúdo Principal */}
      <main className="px-4 py-4 space-y-5">
        {/* Subtítulo / Título do Serviço */}
        <div>
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            SERVIÇO DE LOTA PRIVADA
          </span>
          <h1 className="text-2xl font-serif font-bold text-slate-900 mt-0.5">
            Os Meus Pedidos
          </h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Acompanhe as suas encomendas da Lota de Luanda com rastreio de cadeia de frio em tempo real.
          </p>
        </div>

        {/* Tabs: Em Curso / Histórico */}
        <div className="bg-slate-200/70 p-1 rounded-lg flex text-xs font-semibold">
          <button
            onClick={() => setTab('em_curso')}
            className={`flex-1 py-2 rounded-md transition flex items-center justify-center gap-1.5 ${
              tab === 'em_curso'
                ? 'bg-[#0b192c] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Em Curso</span>
            <span className="bg-slate-700 text-white text-[10px] px-1.5 py-0.2 rounded-full">
              {active.length}
            </span>
          </button>
          <button
            onClick={() => setTab('historico')}
            className={`flex-1 py-2 rounded-md transition flex items-center justify-center gap-1.5 ${
              tab === 'historico'
                ? 'bg-[#0b192c] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Histórico</span>
            <span className="text-slate-500 text-[10px]">{closed.length}</span>
          </button>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start space-x-3">
            <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-red-900 mb-0.5">Erro ao carregar pedidos</h4>
              <p className="text-[11px] text-red-700 mb-2">{error}</p>
              <button
                onClick={reload}
                className="text-[11px] font-bold text-red-900 underline hover:no-underline"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
            <div className="h-4 w-1/3 bg-slate-100 rounded animate-pulse" />
            <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        )}

        {/* CARD DE PEDIDO EM CURSO */}
        {!loading && !error && tab === 'em_curso' && firstActive && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-4">
            {/* Status do Envio */}
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 bg-slate-200/70 text-slate-800 font-bold px-2.5 py-1 rounded-full text-[11px]">
                • {status ? statusLabel(status).toUpperCase() : 'EM CURSO'}
              </span>
              <Link
                href={`/acompanhar-pedido?order=${firstActive.order_id}`}
                className="text-slate-500 text-[11px] underline hover:text-slate-800"
              >
                Pedido #{firstActive.order_id}
              </Link>
            </div>

            {/* Linha de Progresso (Stepper) */}
            <div className="py-2">
              <div className="flex items-center justify-between relative">
                {/* Linha de Conexão */}
                <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-slate-300 -z-0" />

                {/* Etapa 1 */}
                <div className="flex flex-col items-center gap-1 z-10 bg-white px-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-[#0b192c] text-white' : 'bg-slate-200 text-slate-500'}`}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-bold text-center text-slate-800 leading-tight">
                    LOTA<br />CONFIRMADA
                  </span>
                </div>

                {/* Etapa 2 */}
                <div className="flex flex-col items-center gap-1 z-10 bg-white px-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-[#0b192c] text-white' : 'bg-slate-200 text-slate-500'}`}>
                    <Snowflake className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-bold text-center text-slate-800 leading-tight">
                    GELO 0°C
                  </span>
                </div>

                {/* Etapa 3 */}
                <div className="flex flex-col items-center gap-1 z-10 bg-white px-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-[#0b192c] text-white' : 'bg-slate-200 text-slate-500'}`}>
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-bold text-center text-slate-800 leading-tight">
                    EM TRÂNSITO
                  </span>
                </div>

                {/* Etapa 4 */}
                <div className="flex flex-col items-center gap-1 z-10 bg-white px-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${step >= 4 ? 'bg-[#0b192c] text-white' : 'bg-slate-200 text-slate-500'}`}>
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-[9px] font-bold text-center leading-tight ${step >= 4 ? 'text-slate-800' : 'text-slate-400'}`}>
                    ENTREGUE
                  </span>
                </div>
              </div>
            </div>

            {/* Dados do Estafeta */}
            {runner && (
              <div className="bg-slate-100/70 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-300 flex items-center justify-center text-slate-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{runner.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {runner.vehicle_plate} • {(activeDetail?.delivery_address as string | undefined) || 'Luanda'}
                    </p>
                  </div>
                </div>
                <a
                  href={`tel:${runner.phone}`}
                  className="p-2 bg-slate-200 hover:bg-slate-300 rounded-full text-slate-700 transition"
                  aria-label="Ligar ao estafeta"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            )}
            {!runner && (
              <div className="bg-slate-100/70 p-3 rounded-xl text-[11px] text-slate-500 font-medium">
                A atribuir estafeta pela lota — os dados aparecem aqui em tempo real.
              </div>
            )}

            {/* Lote da Captura - Itens do Pedido */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                  LOTE DA CAPTURA
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {orderItemsOf(firstActive).length} Espécies
                </span>
              </div>

              {orderItemsOf(firstActive).length === 0 ? (
                <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl">
                  Consulte o detalhe do pedido para ver as espécies do lote.
                </p>
              ) : (
                orderItemsOf(firstActive).map((item, index) => (
                  <div key={`${item.product_id}-${index}`} className="bg-slate-50 p-2.5 rounded-xl flex gap-3 items-center">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                      <Image
                        src={
                          item.image_url && item.image_url.startsWith('/')
                            ? item.image_url
                            : '/imagem do projecto/Margin.png'
                        }
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        {item.quantity} kg • Pescado fresco
                      </p>
                    </div>
                    {item.price !== undefined && (
                      <span className="text-xs font-bold text-slate-900 whitespace-nowrap">
                        {formatKz(item.price * item.quantity)} AOA
                      </span>
                    )}
                  </div>
                ))
              )}

              {/* Pagamento e Total */}
              <div className="flex items-center justify-between pt-2 px-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                  <Snowflake className="w-4 h-4 text-slate-700" />
                  <span>Cadeia de frio certificada</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Total</span>
                  <span className="text-sm font-extrabold text-slate-900">
                    {formatKz(firstActive.grand_total ?? 0)} AOA
                  </span>
                </div>
              </div>
            </div>

            {/* Botão Acompanhar Mapa GPS */}
            <Link
              href={`/acompanhar-pedido?order=${firstActive.order_id}`}
              className="w-full bg-[#0b192c] hover:bg-[#142843] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-md"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Acompanhar Estafeta no Mapa (GPS em Direto)</span>
            </Link>
          </div>
        )}

        {/* Estado vazio: nenhum pedido em curso */}
        {!loading && !error && tab === 'em_curso' && active.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
            <Anchor size={24} className="text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-900 mb-1">Nenhuma encomenda em curso</p>
            <p className="text-[11px] text-slate-500 mb-4">
              Confirme uma encomenda na lota para a acompanhar aqui.
            </p>
            <Link
              href="/home"
              className="inline-block bg-[#0b192c] text-white text-xs font-bold px-5 py-2.5 rounded-xl"
            >
              Ir à lota
            </Link>
          </div>
        )}

        {/* SEÇÃO HISTÓRICO */}
        {!loading && !error && tab === 'historico' && (
          <div className="pt-1 space-y-3">
            {closed.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
                <Anchor size={24} className="text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-900 mb-1">Sem histórico ainda</p>
                <p className="text-[11px] text-slate-500">As suas entregas concluídas aparecem aqui.</p>
              </div>
            ) : (
              closed.map((order) => {
                const st = order.status as OrderStatus;
                return (
                  <div key={order.order_id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 text-[11px]">
                        {formatOrderDate(order.created_at) || `Pedido #${order.order_id}`}
                      </span>
                      <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${st === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                        {statusLabel(st)}
                      </span>
                    </div>

                    <div className="flex justify-between items-start pt-1">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-700 font-medium leading-tight">
                          {orderItemsOf(order).length > 0
                            ? orderItemsOf(order)
                                .map((i) => `${i.quantity} kg ${i.name}`)
                                .join(', ')
                            : `Pedido #${order.order_id}`}
                        </p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {order.delivery_address || 'Luanda'}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-slate-900 whitespace-nowrap">
                        {formatKz(order.grand_total ?? 0)} AOA
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {st === 'DELIVERED' && (
                        <button
                          onClick={() => repeatOrder(order.order_id)}
                          className="flex-1 bg-[#0b192c] hover:bg-[#142843] text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Repetir Pedido (1 Toque)</span>
                        </button>
                      )}
                      <Link
                        href={`/acompanhar-pedido?order=${order.order_id}`}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        Ver Detalhe
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      {/* Navegação Inferior partilhada */}
      <BottomNav />
    </div>
  );
}
