"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useApiClient, fetchProducts, ApiProduct } from "./api";

/**
 * Cache global do catálogo em memória (partilhada entre todas as telas
 * que usam o hook enquanto a sessão do browser viver).
 */
let cache: ApiProduct[] | null = null;
let inflight: Promise<ApiProduct[]> | null = null;

async function loadCatalog(
  apiFetch: <T>(path: string, options?: RequestInit) => Promise<T>
): Promise<ApiProduct[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = fetchProducts(apiFetch)
      .then((products) => {
        cache = products;
        return products;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/** Limpa a cache (ex: depois de um pedido consumir stock) */
export function invalidateCatalogCache(): void {
  cache = null;
}

/**
 * Catálogo da lota com cache partilhada entre telas.
 * Usado para resolver dados reais de produtos (preço/kg/imagem) quando
 * outras respostas da API (ex: listagem de pedidos) não os trazem.
 */
export function useCatalog() {
  const { apiFetch } = useApiClient();
  const apiFetchRef = useRef(apiFetch);
  apiFetchRef.current = apiFetch;

  const [products, setProducts] = useState<ApiProduct[]>(cache ?? []);
  const [loading, setLoading] = useState(!cache);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    loadCatalog(apiFetchRef.current)
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const resolve = useCallback(
    (productId: number): ApiProduct | undefined =>
      cache?.find((p) => p.id === productId),
    []
  );

  return { products, loading, resolve };
}
