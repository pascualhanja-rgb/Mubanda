"use client";

import { useCallback, useEffect, useState } from "react";
import {
  useApiClient,
  fetchOrders,
  ApiRequestError,
  OrderSummary,
} from "./api";

// Re-exporta tipos úteis para as telas
export type { OrderStatus, OrderSummary } from "./api";
import type { OrderStatus } from "./api";

/** Estados com pedido "a caminho" (ainda não concluído) */
export const ACTIVE_STATUSES: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAYMENT_UNDER_REVIEW",
  "READY_FOR_DISPATCH",
  "PREPARING",
  "ASSIGNED",
  "IN_TRANSIT",
];

/** Estados de histórico (processo terminado) */
export const CLOSED_STATUSES: OrderStatus[] = ["DELIVERED", "CANCELLED", "EXPIRED"];

export function isActiveOrder(status: OrderStatus): boolean {
  return ACTIVE_STATUSES.includes(status);
}

/** Rótulo curto para chips/badges */
export function statusLabel(status: OrderStatus): string {
  switch (status) {
    case "PENDING_PAYMENT":
      return "Pagamento Pendente";
    case "PAYMENT_UNDER_REVIEW":
      return "Em Análise";
    case "READY_FOR_DISPATCH":
      return "Pago • Em Despacho";
    case "PREPARING":
      return "Em Preparação";
    case "ASSIGNED":
      return "Estafeta Atribuído";
    case "IN_TRANSIT":
      return "A Caminho";
    case "DELIVERED":
      return "Entregue";
    case "CANCELLED":
      return "Cancelado";
    case "EXPIRED":
      return "Expirado";
    default:
      return status;
  }
}

/** "18 Ago 2026, 12:45" a partir de ISO 8601 */
export function formatOrderDate(iso?: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return `${d.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}, ${d.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}`;
  } catch {
    return "";
  }
}

/** Extrai itens normalizados de um pedido (a listagem pode não trazer itens) */
export interface OrderItemView {
  product_id: number;
  name: string;
  quantity: number; // kg
  price?: number;
  image_url?: string;
}

export function orderItemsOf(order: OrderSummary): OrderItemView[] {
  const raw = (order.items ?? []) as Array<Record<string, unknown>>;
  return raw.map((item) => ({
    product_id: Number(item.product_id ?? 0),
    name: String(item.name ?? "Pescado"),
    quantity: Number(item.quantity ?? 0),
    price: typeof item.price === "number" ? item.price : undefined,
    image_url: typeof item.image_url === "string" ? item.image_url : undefined,
  }));
}

/**
 * Lista de pedidos do utilizador autenticado (GET /v1/orders).
 * Faz auto-refresh periódico para refletir o estado real da lota.
 */
export function useOrders(pollMs?: number) {
  const { apiFetch, isSignedIn } = useApiClient();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchOrders(apiFetch);
      setOrders(data);
      setError(null);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message || "Não foi possível carregar os pedidos.");
      } else {
        setError("Falha de ligação à API.");
      }
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }
    load();
    if (!pollMs) return;
    const interval = setInterval(load, pollMs);
    return () => clearInterval(interval);
  }, [isSignedIn, load, pollMs]);

  const active = orders.filter((o) => isActiveOrder(o.status as OrderStatus));
  const closed = orders.filter((o) => !isActiveOrder(o.status as OrderStatus));

  return { orders, active, closed, loading, error, reload: load };
}
