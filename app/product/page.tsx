"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ShoppingBag, Waves, Snowflake, UtensilsCrossed, Compass, Anchor } from "lucide-react";
import { useCart } from "../lib/cartContext";
import { useApiClient, fetchProducts, ApiProduct, formatKz } from "../lib/api";

/** Fallback de imagem local (a API pode não enviar image_url) */
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

function ProductDetailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = Number(searchParams.get("id") ?? "0");
  const { addItem } = useCart();
  const { apiFetch } = useApiClient();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    fetchProducts(apiFetch)
      .then((products) => {
        if (!active) return;
        const found = products.find((p) => p.id === productId) ?? null;
        setProduct(found);
      })
      .catch(() => setProduct(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrement = () => setQuantity(quantity + 1);

  const unitPrice = product?.price ?? 0;
  const totalPrice = formatKz(unitPrice * quantity);
  const image = product
    ? product.image_url && product.image_url.startsWith("/")
      ? product.image_url
      : fallbackImage(product.id)
    : fallbackImage(productId || 1);

  const handleAdd = () => {
    if (!product) return;
    addItem(
      {
        productId: product.id,
        name: product.name,
        subtitle:
          product.stock_weight
            ? `${product.stock_weight} kg • Fresco`
            : product.description || "Pescado fresco",
        price: product.price,
        image,
        stockWeight: product.stock_weight,
      },
      quantity
    );
    router.push("/cart");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-28 text-[#0A192F] flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl flex flex-col justify-between">
        <div>
          {/* Top Header */}
          <header className="px-5 pt-4 pb-3 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-20">
            <Link
              href="/home"
              className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft size={18} className="text-[#0A192F]" />
            </Link>
            <h1 className="text-sm font-bold tracking-tight text-[#0A192F]">Product Details</h1>
            <Link
              href="/cart"
              className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-50"
            >
              <ShoppingBag size={15} className="text-[#0A192F]" />
            </Link>
          </header>

          {/* Loading */}
          {loading && (
            <div className="px-5 pt-4">
              <div className="w-full h-64 rounded-2xl bg-slate-200 animate-pulse" />
              <div className="h-5 w-3/4 bg-slate-100 rounded animate-pulse mt-4" />
              <div className="h-4 w-1/2 bg-slate-100 rounded animate-pulse mt-2" />
            </div>
          )}

          {/* Não encontrado */}
          {!loading && !product && (
            <div className="px-5 pt-10 text-center">
              <Anchor size={28} className="text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-[#0A192F] mb-1">Produto não encontrado</p>
              <p className="text-xs text-slate-500 mb-4">
                O produto pode ter sido esgotado ou removido da lota.
              </p>
              <Link
                href="/home"
                className="inline-block bg-[#0A192F] text-white text-xs font-bold px-5 py-2.5 rounded-xl"
              >
                Voltar à lota
              </Link>
            </div>
          )}

          {/* Produto */}
          {!loading && product && (
            <>
              {/* Main Product Image Card */}
              <div className="px-5 pt-4">
                <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-md">
                  <Image src={image} alt={product.name} fill className="object-cover" priority />
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-[#0A192F] text-[10px] px-3 py-1.5 rounded-full font-bold flex items-center space-x-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#0A192F]"></span>
                    <span>CAPTURADO HOJE • DOCA DE LUANDA</span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#0A192F] text-white text-[10px] px-2.5 py-1 rounded-lg font-bold">
                    Lote #{product.id}
                  </div>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="px-5 pt-4">
                <h2 className="text-xl font-bold tracking-tight text-[#0A192F] mb-1">
                  {product.name}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Cooperativa dos Pescadores da Ilha • Pesca Sustentável por Linha
                </p>
              </div>

              {/* Pricing Info */}
              <div className="px-5 pt-4 flex items-baseline justify-between border-b border-slate-100 pb-4">
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-black text-[#0A192F]">
                    {formatKz(unitPrice)}
                  </span>
                  <span className="text-sm font-bold text-[#0A192F]">AOA</span>
                </div>
                <span className="text-xs text-slate-400">
                  {product.stock_weight
                    ? `/ aprox. ${product.stock_weight} kg (${formatKz(unitPrice / product.stock_weight)} AOA/kg)`
                    : "preço por unidade"}
                </span>
              </div>

              {/* Attributes Pills */}
              <div className="px-5 pt-4 flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                <div className="bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-full flex items-center space-x-1.5 whitespace-nowrap text-xs font-semibold text-[#0A192F]">
                  <Waves size={13} className="text-[#0A192F]" />
                  <span>100% Selvagem</span>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-full flex items-center space-x-1.5 whitespace-nowrap text-xs font-semibold text-[#0A192F]">
                  <Snowflake size={13} className="text-[#0A192F]" />
                  <span>Fresco 0°C a 2°C</span>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-full flex items-center space-x-1.5 whitespace-nowrap text-xs font-semibold text-[#0A192F]">
                  <UtensilsCrossed size={13} className="text-[#0A192F]" />
                  <span>Pronto a Cozinhar</span>
                </div>
              </div>

              {/* Notas do Mestre Pescador */}
              <div className="px-5 pt-4 pb-4">
                <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <Compass size={16} className="text-[#0A192F]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A192F]">
                      Notas do Mestre Pescador
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {product.description ||
                      "Capturada nas correntes frias da Fossa de Luanda antes do amanhecer. Carne branca, firme e aveludada com perfil adocicado e sutil sabor oceânico. Perfeita para caldeiradas, carvão de mangue ou assado ao sal marinho."}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Floating Action Bar */}
        {!loading && product && (
          <div
            className="fixed bottom-0 w-full max-w-[430px] bg-white border-t border-slate-100 px-5 py-3.5 flex items-center justify-between shadow-lg z-30"
            style={{ paddingBottom: "calc(0.875rem + env(safe-area-inset-bottom))" }}
          >
            {/* Quantity Selector */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200/60">
              <button
                onClick={handleDecrement}
                className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-white rounded-lg transition-colors font-bold text-sm"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-bold text-[#0A192F]">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-white rounded-lg transition-colors font-bold text-sm"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAdd}
              className="flex-1 ml-3 bg-[#0A192F] hover:bg-[#132d4e] text-white py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all"
            >
              <ShoppingBag size={16} />
              <span>Adicionar • {totalPrice} AOA</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ProductDetail() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-[#0A192F]">
          <span className="text-xs text-slate-400">A carregar produto...</span>
        </main>
      }
    >
      <ProductDetailInner />
    </Suspense>
  );
}
