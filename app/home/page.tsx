"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, ChevronDown, ShieldCheck, Anchor, Plus, ShoppingBag, MapPin, AlertCircle, RefreshCw } from "lucide-react";
import { categories } from "../data/mabundaData";
import BottomNav from "../components/BottomNav";
import { useCart } from "../lib/cartContext";
import { loadPrimaryAddress } from "../lib/addressStorage";
import { useApiClient, fetchProducts, ApiProduct, formatKz, ApiRequestError } from "../lib/api";

/** Mapeia imagens locais por palavra-chave do produto (fallback quando a API não manda imagem) */
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

export default function HomeDiscovery() {
  const { apiFetch } = useApiClient();
  const { addItem, count } = useCart();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [deliveryLabel, setDeliveryLabel] = useState("Ilha de Luanda, Margin...");

  // Morada principal guardada na conta pré-preenche o "Delivering to"
  useEffect(() => {
    const saved = loadPrimaryAddress();
    if (saved?.address) setDeliveryLabel(saved.address);
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts(apiFetch);
      setProducts(data);
    } catch (err) {
      const msg = err instanceof ApiRequestError ? err.message : "Falha ao carregar o catálogo";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return products;
    if (activeCategory === "fresh") {
      return products.filter((p) => {
        const name = (p.name ?? "").toLowerCase();
        return !name.includes("camarão") && !name.includes("lagosta") && !name.includes("lagosta");
      });
    }
    return products;
  }, [products, activeCategory]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-24 text-[#0A192F] flex justify-center">
      <div className="w-full max-w-md bg-[#F8FAFC] min-h-screen relative shadow-2xl flex flex-col">
        {/* Top Header */}
        <header className="px-4 pt-3 pb-3 flex items-center justify-between bg-white border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="relative w-12 h-9 flex items-center justify-center shrink-0">
              <Image
                src="/imagem do projecto/LOGO.png"
                alt="Mabunda Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-base tracking-tight text-[#0A192F]">Mabunda</span>
                <span className="bg-slate-100 text-[#0A192F] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  LUANDA
                </span>
              </div>
              <div className="flex items-center space-x-1 text-[10px] text-slate-500 font-medium mt-0.5">
                <MapPin size={10} className="text-[#0A192F]" />
                <span>Ilha de Luanda • Home</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <Link
              href="/notificacoes"
              className="relative w-9 h-9 bg-slate-50 border border-slate-200/70 rounded-full flex items-center justify-center text-[#0A192F] hover:bg-slate-100 transition-colors"
            >
              <Bell size={16} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full" />
            </Link>

            <Link
              href="/cart"
              className="relative w-9 h-9 bg-slate-50 border border-slate-200/70 rounded-full flex items-center justify-center text-[#0A192F] hover:bg-slate-100 transition-colors"
            >
              <ShoppingBag size={16} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#0A192F] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow">
                  {count}
                </span>
              )}
            </Link>

            <Link href="/conta" className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 relative shrink-0">
              <Image
                src="/imagem do projecto/perfil.png"
                alt="Perfil"
                fill
                className="object-cover"
              />
            </Link>
          </div>
        </header>

        {/* Location & Tides Bar */}
        <div className="bg-white px-4 py-2.5 flex items-center justify-between border-b border-slate-100 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-600 truncate mr-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="text-slate-500 shrink-0">Delivering to</span>
            <span className="font-semibold text-[#0A192F] truncate">{deliveryLabel}</span>
            <ChevronDown size={14} className="text-slate-400 shrink-0" />
          </div>
          <div className="bg-slate-100 px-2.5 py-1 rounded-full flex items-center space-x-1 text-[11px] font-medium text-slate-700 shrink-0">
            <span>🌊 Tides: Calm</span>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="px-5 pt-4">
          <div className="bg-[#0A192F] text-white rounded-2xl p-5 relative overflow-hidden shadow-md">
            <div className="flex items-center space-x-1.5 text-[10px] uppercase tracking-wider text-slate-300 mb-2">
              <Anchor size={12} />
              <span>Mabunda Direct Port Pier</span>
            </div>
            <h1 className="text-lg sm:text-xl font-serif italic font-normal leading-snug mb-2">
              Catch of the Day, <span className="not-italic font-sans font-bold">Port to</span> Plate
            </h1>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Hand-inspected at dawn by master fishmongers. Prepared, iced, and dispatched in
              cold-chain boxes.
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="px-5 pt-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Categories
            </span>
            <Link href="/search" className="text-[11px] font-medium text-[#0A192F] cursor-pointer hover:underline">
              View Almanac
            </Link>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-[#0A192F] text-white shadow-sm"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Morning Port Harvest */}
        <div className="px-5 pt-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-bold text-[#0A192F]">Morning Port Harvest</h2>
            <button
              onClick={loadProducts}
              className="p-1.5 text-slate-500 hover:text-[#0A192F] transition-colors"
              aria-label="Recarregar catálogo"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mb-4">
            Sourced at 05:00 AM from Luanda Bay Artisanal Fleet
          </p>

          {/* Estado: erro */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start space-x-3 mb-4">
              <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-red-900 mb-0.5">Não foi possível carregar</h4>
                <p className="text-[11px] text-red-700 mb-2">{error}</p>
                <button
                  onClick={loadProducts}
                  className="text-[11px] font-bold text-red-900 underline hover:no-underline"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          )}

          {/* Estado: loading */}
          {loading && (
            <div className="grid grid-cols-2 gap-3.5">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-2.5 border border-slate-100 shadow-sm">
                  <div className="w-full h-28 rounded-xl bg-slate-200 animate-pulse mb-2.5" />
                  <div className="h-3 bg-slate-100 rounded animate-pulse mb-1.5" />
                  <div className="h-3 w-2/3 bg-slate-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {/* Estado: vazio */}
          {!loading && !error && filtered.length === 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center mb-4">
              <Anchor size={24} className="text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-[#0A192F] mb-1">Lota vazia por agora</p>
              <p className="text-[11px] text-slate-500">
                A apanha da madrugada ainda não foi descarregada. Volte em breve.
              </p>
            </div>
          )}

          {/* Estado: produtos */}
          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-2 gap-3.5">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-2.5 border border-slate-100 shadow-sm flex flex-col justify-between"
                >
                  <Link href={`/product?id=${product.id}`}>
                    <div className="relative w-full h-28 rounded-xl overflow-hidden mb-2.5">
                      <Image
                        src={
                          product.image_url && product.image_url.startsWith("/")
                            ? product.image_url
                            : fallbackImage(product.id)
                        }
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {product.is_available === false && (
                        <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-wider">
                          Esgotado
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-tight block mb-0.5">
                      Coop. Pescadores Ilha
                    </span>
                    <h3 className="text-xs font-bold text-[#0A192F] truncate">{product.name}</h3>
                    <p className="text-[10px] text-slate-500 mb-3 truncate">
                      {product.stock_weight
                        ? `${product.stock_weight} kg • ${formatKz(product.price / product.stock_weight)} AOA/kg`
                        : product.description || "Pescado fresco"}
                    </p>
                  </Link>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-extrabold text-[#0A192F]">
                      {formatKz(product.price)} AOA
                    </span>
                    <button
                      disabled={product.is_available === false}
                      onClick={() =>
                        addItem({
                          productId: product.id,
                          name: product.name,
                          subtitle:
                            product.stock_weight
                              ? `${product.stock_weight} kg • Fresco`
                              : "Pescado fresco",
                          price: product.price,
                          image:
                            product.image_url && product.image_url.startsWith("/")
                              ? product.image_url
                              : fallbackImage(product.id),
                          stockWeight: product.stock_weight,
                        })
                      }
                      className="w-7 h-7 bg-[#0A192F] text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label={`Adicionar ${product.name}`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Traceability Banner */}
        <div className="px-5 pt-6 pb-6">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-start space-x-3">
            <div className="bg-slate-100 p-2.5 rounded-full text-[#0A192F] mt-0.5 shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0A192F] mb-1">
                Guaranteed Luanda Traceability
              </h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Each catch includes digital provenance verifying the vessel captain, harvest...
              </p>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </main>
  );
}
