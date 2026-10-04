"use client";

import { useCallback } from "react";
import { useAuth } from "@clerk/nextjs";

/**
 * Tipos da API Mabunda (backend Go Echo)
 * Fonte: CLIENT.md + AUTH.md — Base URL: https://mabunda-application.onrender.com
 */

/** Estados possíveis de um pedido */
export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAYMENT_UNDER_REVIEW"
  | "READY_FOR_DISPATCH"
  | "ASSIGNED"
  | "PREPARING"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED"
  | "EXPIRED";

/** Produto do catálogo (GET /v1/products) */
export interface ApiProduct {
  id: number;
  name: string;
  description?: string;
  price: number; // Kwanzas, float64 — NUNCA string formatada
  stock_weight?: number; // KG
  image_url?: string;
  is_available?: boolean;
  [key: string]: unknown; // campos extra tolerados
}

/** Item do pedido enviado no checkout */
export interface OrderItemInput {
  product_id: number;
  quantity: number; // em KG
}

/** Response de POST /v1/orders */
export interface CreateOrderResponse {
  order_id: number;
  status: OrderStatus;
  items_total: number;
  freight_fee: number;
  grand_total: number;
  expires_at: string;
}

/** Response de GET /v1/orders/:id */
export interface OrderDetail {
  order_id: number;
  status: OrderStatus;
  grand_total: number;
  delivery_address?: string;
  delivery_instructions?: string;
  runner?: {
    name: string;
    vehicle_plate: string;
    phone: string;
  };
  delivery_pin?: string; // só quando ASSIGNED e caller é o dono
  [key: string]: unknown;
}

/** Item de pedido na listagem GET /v1/orders */
export interface OrderSummary {
  order_id: number;
  status: OrderStatus;
  grand_total: number;
  created_at?: string;
  items?: Array<{
    product_id: number;
    name?: string;
    quantity: number;
    price?: number;
    image_url?: string;
  }>;
  delivery_address?: string;
  [key: string]: unknown;
}

/** Response de upload-url (passo 1 do comprovativo) */
export interface UploadUrlResponse {
  upload_url: string;
  object_key: string;
  expires_in_seconds: number;
}

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://mabunda-application.onrender.com";

/** Erro enriquecido com status HTTP para tratamento nas telas */
export class ApiRequestError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.body = body;
  }
}

/**
 * Hook que devolve uma função `apiFetch` já autenticada com o JWT do Clerk.
 * Usar em componentes client: const { apiFetch } = useApiClient();
 */
export function useApiClient() {
  const { getToken, isSignedIn } = useAuth();

  /**
   * useCallback estável: a identidade da função não muda entre renders,
   * logo os useEffect de polling das telas não re-disparam em loop.
   */
  const apiFetch = useCallback(
    async <T>(
      path: string,
      options: RequestInit & { skipAuth?: boolean } = {}
    ): Promise<T> => {
    const { skipAuth, headers, ...rest } = options;
    const authHeaders: Record<string, string> = {};

    if (!skipAuth) {
      if (!isSignedIn) {
        throw new ApiRequestError("Sessão expirada. Inicie sessão novamente.", 401);
      }
      const token = await getToken();
      if (!token) {
        throw new ApiRequestError("Sessão expirada. Inicie sessão novamente.", 401);
      }
      authHeaders.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: {
        ...authHeaders,
        ...(rest.body ? { "Content-Type": "application/json" } : {}),
        ...(headers as Record<string, string> | undefined),
      },
    });

    // 204 sem corpo
    if (res.status === 204) return undefined as T;

    const text = await res.text();
    let body: unknown = undefined;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }

    if (!res.ok) {
      const message =
        (body &&
          typeof body === "object" &&
          "message" in body &&
          typeof (body as Record<string, unknown>).message === "string" &&
          (body as Record<string, unknown>).message) ||
        `Erro ${res.status}`;
      throw new ApiRequestError(String(message), res.status, body);
    }

      return body as T;
    },
    [getToken, isSignedIn]
  );

  return { apiFetch, isSignedIn };
}

/* ────────────────────────────  Health  ──────────────────────────── */

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/health`, { cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

/* ────────────────────────────  Catálogo  ──────────────────────────── */

/** GET /v1/products — exige JWT */
export async function fetchProducts(
  apiFetch: <T>(path: string, options?: RequestInit) => Promise<T>
): Promise<ApiProduct[]> {
  const data = await apiFetch<unknown>("/v1/products");
  if (Array.isArray(data)) return data as ApiProduct[];
  if (data && typeof data === "object") {
    // tolera wrappers { products: [...] } / { data: [...] }
    const obj = data as Record<string, unknown>;
    for (const key of ["products", "data", "items", "catalog"]) {
      const val = obj[key];
      if (Array.isArray(val)) return val as ApiProduct[];
    }
  }
  return [];
}

/* ────────────────────────────  Pedidos  ──────────────────────────── */

/** POST /v1/orders — cria pedido e reserva stock (idempotente por key) */
export function createOrder(
  apiFetch: <T>(path: string, options?: RequestInit) => Promise<T>,
  payload: {
    idempotency_key: string;
    delivery_address: string;
    delivery_instructions?: string;
    items: OrderItemInput[];
  }
) {
  return apiFetch<CreateOrderResponse>("/v1/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** GET /v1/orders/:id — consulta estado do pedido (polling) */
export function getOrder(apiFetch: <T>(path: string, options?: RequestInit) => Promise<T>, id: number) {
  return apiFetch<OrderDetail>(`/v1/orders/${id}`);
}

/** GET /v1/orders — listagem dos pedidos do utilizador */
export async function fetchOrders(
  apiFetch: <T>(path: string, options?: RequestInit) => Promise<T>
): Promise<OrderSummary[]> {
  const data = await apiFetch<unknown>("/v1/orders");
  if (Array.isArray(data)) return data as OrderSummary[];
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of ["orders", "data", "items"]) {
      const val = obj[key];
      if (Array.isArray(val)) return val as OrderSummary[];
    }
  }
  return [];
}

/* ──────────────────  Comprovativo de pagamento (R2)  ────────────────── */

/** Passo 1: pedir URL pré-assinada do R2 */
export function getUploadUrl(
  apiFetch: <T>(path: string, options?: RequestInit) => Promise<T>,
  orderId: number,
  file: { file_name: string; mime_type: string }
) {
  return apiFetch<UploadUrlResponse>(`/v1/orders/${orderId}/payment-proof/upload-url`, {
    method: "POST",
    body: JSON.stringify(file),
  });
}

/** Passo 1.5: upload direto dos bytes para o R2 (PUT na URL assinada) */
export async function uploadToR2(uploadUrl: string, file: File, mimeType: string): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": mimeType },
    body: file,
  });
  if (!res.ok) {
    throw new ApiRequestError(`Falha no upload do comprovativo (${res.status})`, res.status);
  }
}

/** Passo 2: concluir upload → pedido passa a PAYMENT_UNDER_REVIEW */
export function completeUpload(
  apiFetch: <T>(path: string, options?: RequestInit) => Promise<T>,
  orderId: number,
  objectKey: string
) {
  return apiFetch<{ order_id: number; status: OrderStatus }>(
    `/v1/orders/${orderId}/payment-proof/complete`,
    {
      method: "POST",
      body: JSON.stringify({ object_key: objectKey }),
    }
  );
}

/* ────────────────────────────  Utilitários  ──────────────────────────── */

/** Gera UUID v4 (para idempotency_key) com fallback para ambientes sem crypto.randomUUID */
export function generateIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Formata valor em Kwanzas: 14500 → "14.500" */
export function formatKz(value: number): string {
  return value.toLocaleString("pt-AO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/** Preço por kg legível para o subtítulo do produto */
export function pricePerKgLabel(product: ApiProduct): string {
  if (!product.stock_weight || product.stock_weight <= 0) return `${formatKz(product.price)} AOA`;
  return `${formatKz(product.price)} AOA • ${formatKz(product.price / product.stock_weight)} AOA/kg`;
}
