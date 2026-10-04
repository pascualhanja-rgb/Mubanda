'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Bell,
  Search,
  CheckCircle2,
  MapPin,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  Anchor,
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useCart } from '../lib/cartContext';
import { formatKz } from '../lib/api';
import { useCatalog } from '../lib/useCatalog';
import {
  useOrders,
  statusLabel,
  formatOrderDate,
  orderItemsOf,
  OrderStatus,
} from '../lib/useOrders';

export default function HistoricoPedidosPage() {
  const { closed, loading, error, reload } = useOrders(0);
  const { addItem } = useCart();
  const { resolve: resolveProduct } = useCatalog();
  const [filter, setFilter] = useState('todos');
  const [term, setTerm] = useState('');

  const delivered = closed.filter((o) => (o.status as OrderStatus) === 'DELIVERED');
  const cancelled = closed.filter((o) => (o.status as OrderStatus) !== 'DELIVERED');

  // Chips de mês gerados a partir das datas reais dos pedidos
  const monthChips = useMemo(() => {
    const counts = new Map<string, number>();
    for (const order of delivered) {
      const date = formatOrderDate(order.created_at);
      const label = date ? date.split(',')[0] : '';
      if (!label) continue;
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([label, count]) => ({
      key: label,
      label,
      count,
    }));
  }, [delivered]);

  const filtered = useMemo(() => {
    let list = [...delivered, ...cancelled];
    if (filter !== 'todos') {
      list = list.filter((o) => {
        const date = formatOrderDate(o.created_at);
        return date.startsWith(filter);
      });
    }
    const t = term.trim().toLowerCase();
    if (t) {
      list = list.filter(
        (o) =>
          String(o.order_id).includes(t) ||
          (o.delivery_address ?? '').toLowerCase().includes(t) ||
          orderItemsOf(o).some((i) => i.name.toLowerCase().includes(t))
      );
    }
    return list;
  }, [delivered, cancelled, filter, term]);

  const repeatOrder = (orderId: number) => {
    const order = closed.find((o) => o.order_id === orderId);
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
      <main className="px-4 py-4 space-y-4">
        {/* Título & Descrição */}
        <div>
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            • SERVIÇO DE LOTA PRIVADA
          </span>
          <h1 className="text-2xl font-serif font-bold text-slate-900 mt-0.5">
            Os Meus Pedidos
          </h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Consulte o registo completo de compras da Lota de Luanda, faturas fiscais e repita os seus pedidos favoritos.
          </p>
        </div>

        {/* Barra de Pesquisa */}
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Pesquisar por peixe, lote ou data..."
              className="w-full bg-white pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-slate-400"
            />
          </div>
        </div>

        {/* Filtros em Chips (meses com pedidos reais) */}
        {monthChips.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              onClick={() => setFilter('todos')}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition ${
                filter === 'todos' ? 'bg-[#0b192c] text-white' : 'bg-slate-200/60 text-slate-600'
              }`}
            >
              Todos <span className="text-[10px] opacity-80">{delivered.length}</span>
            </button>
            {monthChips.map((chip) => (
              <button
                key={chip.key}
                onClick={() => setFilter(chip.key)}
                className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition ${
                  filter === chip.key ? 'bg-[#0b192c] text-white' : 'bg-slate-200/60 text-slate-600'
                }`}
              >
                {chip.label} <span className="text-[10px] opacity-80">({chip.count})</span>
              </button>
            ))}
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start space-x-3">
            <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-red-900 mb-0.5">Erro ao carregar histórico</h4>
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
            <div className="h-16 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        )}

        {/* LISTA DE PEDIDOS DO HISTÓRICO */}
        {!loading && !error && filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
            <Anchor size={24} className="text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-900 mb-1">Sem registos</p>
            <p className="text-[11px] text-slate-500">
              As suas entregas concluídas e faturas aparecem aqui.
            </p>
          </div>
        )}

        {!loading && !error && filtered.map((order) => {
          const st = order.status as OrderStatus;
          const items = orderItemsOf(order);
          return (
            <div key={order.order_id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${st === 'DELIVERED' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {statusLabel(st)}{order.created_at ? ` • ${formatOrderDate(order.created_at)}` : ''}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  LOTA #{order.order_id}
                </span>
              </div>

              <div className="flex justify-between items-start pt-1">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    {st === 'DELIVERED' ? 'TOTAL LIQUIDADO' : 'TOTAL'}
                  </span>
                  <span className="text-xl font-serif font-bold text-slate-900">
                    {formatKz(order.grand_total ?? 0)} <span className="text-xs font-sans font-normal text-slate-500">AOA</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 block flex items-center justify-end gap-0.5 uppercase">
                    <MapPin className="w-3 h-3" /> Destino
                  </span>
                  <p className="text-xs font-semibold text-slate-800">
                    {order.delivery_address || 'Luanda'}
                  </p>
                </div>
              </div>

              {/* Lote Desembarcado - Itens */}
              {items.length > 0 && (
                <div className="bg-slate-50 p-3 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      LOTE DESEMBARCADO ({items.length} {items.length === 1 ? 'ITEM' : 'ITENS'})
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Pesca Artesanal Ilha
                    </span>
                  </div>

                  {items.map((item, index) => (
                    <div key={`${item.product_id}-${index}`} className="flex gap-3 items-center">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
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
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {item.name}
                          </h4>
                          <span className="text-[11px] font-bold text-slate-700">
                            {item.quantity} kg
                          </span>
                        </div>
                        {item.price !== undefined && (
                          <p className="text-[10px] text-slate-500">
                            {formatKz(item.price)} AOA/kg
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Ações */}
              {st === 'DELIVERED' && (
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => repeatOrder(order.order_id)}
                    className="flex-1 bg-[#0b192c] hover:bg-[#142843] text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Repetir Pedido (1 Toque)</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Garantia & Arquivo Fiscal */}
        <div className="bg-slate-100 p-3.5 rounded-2xl flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0b192c] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-[11px] text-slate-600 leading-relaxed">
            <h5 className="font-bold text-slate-900 mb-0.5 font-serif">
              Garantia de Qualidade & Arquivo Fiscal
            </h5>
            Todas as compras na Mabunda incluem fatura certificada pela AGT de Angola e certificado de rastreabilidade do mestre pescador.
          </div>
        </div>
      </main>

      {/* Navegação Inferior partilhada */}
      <BottomNav />
    </div>
  );
}
