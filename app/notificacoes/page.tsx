'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bell,
  ShoppingBag,
  Truck,
  Package,
  CheckCircle2,
  Repeat,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

import { useApiClient, fetchProducts, ApiProduct, formatKz } from '../lib/api';
import { useOrders, statusLabel, formatOrderDate, OrderStatus } from '../lib/useOrders';

interface NotificationItem {
  id: string;
  category: 'lota' | 'encomendas';
  typeBadge: string;
  timeAgo: string;
  title: string;
  description: string;
  code?: string;
  actionText?: string;
  actionHref?: string;
  unread?: boolean;
}

/** "Há 25 min" / "Há 3h" / "Ontem" a partir de ISO */
function timeAgo(iso?: string): string {
  if (!iso) return '';
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Agora mesmo';
    if (mins < 60) return `Há ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Há ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Ontem';
    return formatOrderDate(iso).split(',')[0] || 'Anteriormente';
  } catch {
    return '';
  }
}

export default function NotificacoesScreen() {
  const { apiFetch } = useApiClient();
  const { orders, loading: loadingOrders } = useOrders(0);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeTab, setActiveTab] = useState<'todas' | 'lota' | 'encomendas'>('todas');

  useEffect(() => {
    fetchProducts(apiFetch)
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
  }, [apiFetch]);

  const notifications = useMemo<NotificationItem[]>(() => {
    const list: NotificationItem[] = [];

    // 1) Novidades da lota — stock crítico/esgotado no catálogo real
    for (const p of products) {
      if (p.is_available === false) {
        list.push({
          id: `stock-${p.id}`,
          category: 'lota',
          typeBadge: 'ESGOTADO',
          timeAgo: 'Lota de hoje',
          title: `${p.name} esgotou na lota de hoje`,
          description: 'O produto foi marcado como indisponível. Volte amanhã à apanha da madrugada.',
          code: 'Stock 0 kg',
          actionText: 'Ver Alternativas',
          actionHref: '/home',
        });
      } else if (typeof p.stock_weight === 'number' && p.stock_weight > 0 && p.stock_weight <= 3) {
        list.push({
          id: `stock-${p.id}`,
          category: 'lota',
          typeBadge: 'ÚLTIMAS UNIDADES',
          timeAgo: 'Lota de hoje',
          title: `Restam apenas ${p.stock_weight} kg de ${p.name}`,
          description: `O item está a esgotar rapidamente na banca matinal — ${formatKz(p.price)} AOA.`,
          code: 'Stock crítico',
          actionText: 'Reservar Já',
          actionHref: `/product?id=${p.id}`,
          unread: true,
        });
      }
    }

    // 2) Encomendas — atualizações de estado dos pedidos reais
    for (const order of [...orders].reverse().slice(0, 8)) {
      const st = order.status as OrderStatus;
      const isClosed = st === 'DELIVERED' || st === 'CANCELLED' || st === 'EXPIRED';
      list.push({
        id: `order-${order.order_id}-${st}`,
        category: 'encomendas',
        typeBadge: st === 'IN_TRANSIT' ? 'A CAMINHO' : statusLabel(st).toUpperCase(),
        timeAgo: timeAgo(order.created_at),
        title:
          st === 'DELIVERED'
            ? `Encomenda #${order.order_id} entregue com sucesso`
            : st === 'IN_TRANSIT'
              ? `Estafeta em rota com a encomenda #${order.order_id}`
              : st === 'PAYMENT_UNDER_REVIEW'
                ? `Comprovativo do pedido #${order.order_id} em análise`
                : st === 'PENDING_PAYMENT'
                  ? `Encomenda #${order.order_id} à espera do comprovativo`
                  : `Pedido #${order.order_id}: ${statusLabel(st)}`,
        description: `${formatKz(order.grand_total ?? 0)} AOA • ${order.delivery_address || 'Luanda'}.`,
        code: `LOTA #${order.order_id}`,
        actionText: isClosed ? 'Repetir Encomenda' : 'Rastrear Encomenda',
        actionHref: isClosed ? '/historico' : `/acompanhar-pedido?order=${order.order_id}`,
        unread: !isClosed,
      });
    }

    return list;
  }, [orders, products]);

  const loading = loadingOrders || loadingProducts;
  const filtered = notifications.filter((item) => {
    if (activeTab === 'todas') return true;
    return item.category === activeTab;
  });

  const lotaCount = notifications.filter((n) => n.category === 'lota').length;
  const ordersCount = notifications.filter((n) => n.category === 'encomendas').length;

  const getIconForType = (badge: string) => {
    switch (badge) {
      case 'A CAMINHO':
        return <Truck className="w-4 h-4 text-slate-700" />;
      case 'ÚLTIMAS UNIDADES':
      case 'ESGOTADO':
        return <Package className="w-4 h-4 text-slate-700" />;
      case 'ENTREGUE':
        return <CheckCircle2 className="w-4 h-4 text-slate-700" />;
      case 'REPETIR ENCOMENDA':
        return <Repeat className="w-4 h-4 text-slate-700" />;
      default:
        if (badge.startsWith('LOTA')) return <ShoppingBag className="w-4 h-4 text-slate-700" />;
        return <Bell className="w-4 h-4 text-slate-700" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex justify-center p-0 md:py-6">
      <div className="w-full max-w-md bg-white shadow-xl flex flex-col min-h-screen md:min-h-[850px] md:rounded-3xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <header className="px-4 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <Link href="/home" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-800" />
          </Link>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">Notificações</h1>
          <div className="w-9 h-9 flex items-center justify-center">
            <span className="w-2 h-2 bg-slate-900 rounded-full"></span>
          </div>
        </header>

        {/* Tabs */}
        <div className="px-4 py-3 bg-white border-b border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('todas')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'todas'
                ? 'bg-slate-950 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('lota')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'lota'
                ? 'bg-slate-950 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Lota & Captura ({lotaCount})
          </button>
          <button
            onClick={() => setActiveTab('encomendas')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'encomendas'
                ? 'bg-slate-950 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Encomendas ({ordersCount})
          </button>
        </div>

        {/* Notifications List Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50/50">

          {/* Loading */}
          {loading && (
            <div className="space-y-3 pt-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-4 border border-slate-100">
                  <div className="h-3 w-24 bg-slate-100 rounded animate-pulse mb-2" />
                  <div className="h-3.5 w-3/4 bg-slate-100 rounded animate-pulse mb-2" />
                  <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {/* Vazio */}
          {!loading && filtered.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 mt-2">
              <AlertCircle size={24} className="text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-900 mb-1">Sem novidades por agora</p>
              <p className="text-[11px] text-slate-500">
                As atualizações da lota e das suas encomendas aparecem aqui.
              </p>
            </div>
          )}

          {/* Lista */}
          {!loading && filtered.length > 0 && (
            <>
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 tracking-wider px-1 pt-1">
                <span>RECENTES</span>
                <span>Luanda, AO</span>
              </div>

              {filtered.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm relative transition-all hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 relative">
                      {getIconForType(item.typeBadge)}
                      {item.unread && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-slate-900 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                          {item.typeBadge}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">{item.timeAgo}</span>
                      </div>
                      <h2 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                        {item.title}
                      </h2>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="text-[11px] font-semibold text-slate-500">
                          {item.code}
                        </span>
                        {item.actionText && item.actionHref && (
                          <Link
                            href={item.actionHref}
                            className="flex items-center gap-1.5 bg-slate-900 text-white text-xs font-semibold px-3.5 py-2 rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                          >
                            <span>{item.actionText}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
