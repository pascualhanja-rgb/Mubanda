"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  ChevronLeft,
  ShoppingBag,
  Search,
  X,
  SlidersHorizontal,
  Heart,
  Plus,
  AlertCircle,
  Anchor,
} from "lucide-react";
import { useCart } from "../lib/cartContext";
import { useApiClient, fetchProducts, ApiProduct, formatKz } from "../lib/api";

const FALLBACK_IMAGES = [
  "/imagem do projecto/Margin.png",
  "/imagem do projecto/Margin(5).png",
  "/imagem do projecto/Margin(10).png",
  "/imagem do projecto/Margin(11).png",
  "/imagem do projecto/Margin(12).png",
  "/imagem do projecto/Margin(13).png",
];

function fallbackImage(id: number): string {
  return FALLBACK_IMAGES[id % FALLBACK_IMAGES.length];
}

function SearchResultsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTerm = searchParams.get("q") ?? "";
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const { addItem, count } = useCart();
  const { apiFetch } = useApiClient();

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchProducts(apiFetch)
      .then(setProducts)
      .catch(() => setError("Falha ao carregar resultados"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        (p.description ?? "").toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen text-gray-900 font-sans pb-10">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <button
          onClick={() => router.back()}
          className="p-1 rounded-full hover:bg-gray-100 transition"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>

        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative">
            <span className="p-2 bg-gray-100 rounded-full inline-flex">
              <ShoppingBag className="w-5 h-5 text-gray-800" />
            </span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <Link href="/conta" className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 relative">
            <Image
              src="/imagem do projecto/perfil.png"
              alt="Perfil"
              fill
              className="object-cover"
            />
          </Link>
        </div>
      </header>

      {/* Search Input */}
      <div className="px-4 mt-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-gray-100 rounded-2xl px-3 py-2.5">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent w-full focus:outline-none text-sm text-gray-800 font-medium"
              placeholder="Pesquisar peixe ou marisco..."
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")}>
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <button className="p-2.5 bg-gray-100 rounded-2xl hover:bg-gray-200 transition">
            <SlidersHorizontal className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Result Count */}
      <div className="px-4 mt-3 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1 font-medium">
          <span className="font-bold text-gray-900">{filtered.length} Resultados</span>
          {searchTerm && (
            <>
              <span>-</span>
              <span>&quot;{searchTerm}&quot;</span>
            </>
          )}
        </div>
        <div className="bg-gray-200/70 text-gray-700 px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1">
          <span>⚙ Lota Luanda 05:00</span>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div className="mx-4 mt-4 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start space-x-3">
          <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-red-900 mb-0.5">Erro ao pesquisar</h4>
            <p className="text-[11px] text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="px-4 mt-4 space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-3 border border-gray-100 flex gap-3">
              <div className="w-20 h-20 rounded-xl bg-slate-200 animate-pulse shrink-0" />
              <div className="flex-1 py-1">
                <div className="h-3.5 bg-slate-100 rounded animate-pulse mb-2" />
                <div className="h-3 w-2/3 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vazio */}
      {!loading && !error && filtered.length === 0 && (
        <div className="mx-4 mt-6 bg-white border border-gray-100 rounded-2xl p-6 text-center">
          <Anchor size={24} className="text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-gray-900 mb-1">Nenhum resultado</p>
          <p className="text-[11px] text-gray-500">
            Tente pesquisar por &quot;garoupa&quot;, &quot;camarão&quot; ou &quot;lagosta&quot;.
          </p>
        </div>
      )}

      {/* Lista de resultados */}
      {!loading && !error && (
        <div className="px-4 mt-4 space-y-3">
          {filtered.map((product) => {
            const image =
              product.image_url && product.image_url.startsWith("/")
                ? product.image_url
                : fallbackImage(product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex gap-3 items-center"
              >
                <Link href={`/product?id=${product.id}`} className="shrink-0">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-200">
                    <Image src={image} alt={product.name} fill className="object-cover" />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/product?id=${product.id}`}>
                    <h4 className="text-xs font-bold text-gray-900 truncate">{product.name}</h4>
                  </Link>
                  <p className="text-[10px] text-gray-500 truncate">
                    {product.stock_weight
                      ? `${product.stock_weight} kg • ${formatKz(product.price / product.stock_weight)} AOA/kg`
                      : product.description || "Pescado fresco do dia"}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-black text-gray-900">
                      {formatKz(product.price)} AOA
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
                        aria-label="Favoritar"
                      >
                        <Heart size={13} />
                      </button>
                      <button
                        onClick={() =>
                          addItem({
                            productId: product.id,
                            name: product.name,
                            subtitle:
                              product.stock_weight
                                ? `${product.stock_weight} kg • Fresco`
                                : "Pescado fresco",
                            price: product.price,
                            image,
                            stockWeight: product.stock_weight,
                          })
                        }
                        className="w-7 h-7 bg-[#0b192c] text-white rounded-full flex items-center justify-center hover:bg-slate-700 transition"
                        aria-label={`Adicionar ${product.name}`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SearchResultsScreen() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto min-h-screen flex items-center justify-center">
          <span className="text-xs text-slate-400">A carregar...</span>
        </div>
      }
    >
      <SearchResultsInner />
    </Suspense>
  );
}
