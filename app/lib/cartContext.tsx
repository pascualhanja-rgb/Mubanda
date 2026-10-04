"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

/**
 * Carrinho global partilhado entre todas as telas (home, search, product, cart, checkout).
 * Persistido em localStorage para sobreviver a refresh e navegação.
 */

export interface CartItem {
  productId: number;
  name: string;
  subtitle: string;
  price: number; // por unidade, em Kwanzas
  quantity: number; // unidades (mapeado para KG no checkout: 1 un = stock_weight)
  image: string;
  stockWeight?: number; // kg por unidade — usado para calcular quantity em KG
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
}

const STORAGE_KEY = "mabunda_cart_v1";
const FREIGHT_FEE = 3000; // fixo, conforme CLIENT.md

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Carregar do localStorage no arranque
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* carrinho corrompido — ignora */
    }
    setHydrated(true);
  }, []);

  // Persistir em cada alteração
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    return {
      items,
      count: items.reduce((acc, i) => acc + i.quantity, 0),
      subtotal,
      deliveryFee: items.length > 0 ? FREIGHT_FEE : 0,
      total: subtotal + (items.length > 0 ? FREIGHT_FEE : 0),
      addItem: (item, qty = 1) =>
        setItems((prev) => {
          const existing = prev.find((i) => i.productId === item.productId);
          if (existing) {
            return prev.map((i) =>
              i.productId === item.productId ? { ...i, quantity: i.quantity + qty } : i
            );
          }
          return [...prev, { ...item, quantity: qty }];
        }),
      updateQuantity: (productId, delta) =>
        setItems((prev) =>
          prev.map((i) => {
            if (i.productId !== productId) return i;
            const q = Math.max(1, i.quantity + delta);
            return { ...i, quantity: q };
          })
        ),
      removeItem: (productId) => setItems((prev) => prev.filter((i) => i.productId !== productId)),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}

/** Quantidade em KG de um item no formato da API (quantity em kg) */
export function itemQuantityKg(item: CartItem): number {
  return item.stockWeight && item.stockWeight > 0
    ? item.quantity * item.stockWeight
    : item.quantity;
}
