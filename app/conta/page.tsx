'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser, SignOutButton, UserProfile } from '@clerk/nextjs';
import {
  Bell,
  MapPin,
  Plus,
  ChevronRight,
  ArrowRight,
  RotateCcw,
  User,
  CheckCircle2,
  Pencil,
  X,
  ChevronDown,
  Navigation,
  Check,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useCart } from '../lib/cartContext';
import { formatKz } from '../lib/api';
import {
  useOrders,
  statusLabel,
  formatOrderDate,
  orderItemsOf,
  OrderStatus,
} from '../lib/useOrders';
import {
  loadAddresses,
  addAddress,
  SavedAddress,
} from '../lib/addressStorage';
import { useCatalog } from '../lib/useCatalog';

type AddressType = 'Casa' | 'Trabalho' | 'Outro';

export default function AccountProfile() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { addItem } = useCart();
  const { active, closed, loading, error } = useOrders(10000);
  const { resolve: resolveProduct } = useCatalog();

  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Formulário do modal de morada
  const [addressType, setAddressType] = useState<AddressType>('Casa');
  const [label, setLabel] = useState('');
  const [bairro, setBairro] = useState('Ilha de Luanda (Cabo Island)');
  const [street, setStreet] = useState('');
  const [reference, setReference] = useState('');
  const [isPrimary, setIsPrimary] = useState(true);
  const [savedNote, setSavedNote] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Preenche a rua com as coordenadas reais do dispositivo (GPS)
  const handleUseGps = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setStreet(
          `Coordenadas GPS: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`
        );
        setGpsLoading(false);
      },
      () => setGpsLoading(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  useEffect(() => {
    setAddresses(loadAddresses());
  }, []);

  const firstName = user?.firstName ?? '';
  const lastName = user?.lastName ?? '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Cliente Mabunda';
  const phone =
    user?.phoneNumbers?.find((p) => p.id === user.primaryPhoneNumberId)?.phoneNumber ??
    user?.phoneNumbers?.[0]?.phoneNumber ??
    '';
  const avatarUrl = user?.imageUrl;

  const firstActive = active[0];
  const recentClosed = useMemo(() => closed.filter((o) => (o.status as OrderStatus) === 'DELIVERED').slice(0, 3), [closed]);

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
    router.push('/cart');
  };

  const handleSaveAddress = () => {
    if (street.trim().length < 3) return;
    addAddress({
      label: label.trim() || addressType,
      type: addressType,
      address: `${bairro}, ${street.trim()}`,
      reference: reference.trim() || undefined,
      isPrimary,
    });
    setAddresses(loadAddresses());
    setIsAddAddressOpen(false);
    setSavedNote(true);
    setTimeout(() => setSavedNote(false), 2500);
    setLabel('');
    setStreet('');
    setReference('');
  };

  return (
    <main className="min-h-screen bg-slate-950 flex justify-center items-center">
      <div className="w-full h-screen sm:h-[90vh] sm:max-w-[480px] sm:rounded-3xl bg-white shadow-2xl overflow-hidden relative flex flex-col justify-between border border-slate-100">
        
        {/* Top Header */}
        <header className="px-5 pt-4 pb-4 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-xl font-bold tracking-tight text-[#0A192F]">Mabunda</h1>
            <span className="text-slate-300 font-light text-lg">/</span>
            <span className="text-sm font-medium text-slate-700">Conta</span>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/notificacoes" className="text-slate-600 hover:text-[#0A192F] transition-colors relative">
              <Bell size={20} />
            </Link>
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 relative shrink-0 bg-slate-100">
              {avatarUrl ? (
                // Avatar real da conta Clerk
                <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <Image 
                  src="/imagem do projecto/perfil.png" 
                  alt="Perfil" 
                  fill 
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="px-5 py-5 space-y-6 overflow-y-auto flex-1 pb-24">

          {/* User Profile Info (dados reais do Clerk) */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md relative bg-slate-100">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  <Image 
                    src="/imagem do projecto/perfil.png" 
                    alt={fullName} 
                    fill 
                    className="object-cover"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsProfileOpen(true)}
                aria-label="Editar perfil"
                className="absolute bottom-0 right-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center border-2 border-white shadow hover:bg-slate-800 transition-colors"
              >
                <Pencil size={14} />
              </button>
            </div>

            <div className="flex items-center space-x-1.5 mt-1">
              <h2 className="font-serif text-lg font-bold text-[#0A192F]">{fullName}</h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{phone || 'Sem telefone associado'}</p>
          </div>

          {/* Moradas Guardadas (persistidas no dispositivo, usadas no checkout) */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin size={15} className="text-[#0A192F]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-[#0A192F]">Moradas Guardadas</h3>
              </div>
              {savedNote && (
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  Guardada!
                </span>
              )}
            </div>

            <div className="space-y-2">
              {addresses.length === 0 ? (
                <p className="text-[11px] text-slate-500 bg-white border border-slate-100 rounded-xl p-3">
                  Ainda não tem moradas guardadas. Adicione a primeira para pré-preencher o checkout.
                </p>
              ) : (
                addresses.map((addr) => (
                  <div key={addr.id} className="bg-white border border-slate-100 rounded-xl p-3 flex items-center justify-between shadow-xs">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                        <MapPin size={13} className="text-[#0A192F]" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-[#0A192F]">{addr.label}</span>
                          {addr.isPrimary && (
                            <span className="bg-[#005C53] text-white text-[9px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                              PRINCIPAL
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[220px]">
                          {addr.address}{addr.reference ? ` • Ref: ${addr.reference}` : ''}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={15} className="text-slate-400" />
                  </div>
                ))
              )}
            </div>

            <button 
              onClick={() => setIsAddAddressOpen(true)}
              className="w-full bg-[#0A192F] hover:bg-[#132d4e] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Adicionar Nova Morada</span>
            </button>
          </div>

          {/* O Meu Histórico & Active Order (dados reais da API) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0A192F]">O Meu Histórico</h3>
              <span className="text-[10px] text-slate-400 font-semibold">
                {loading ? 'A carregar...' : `${active.length + closed.length} Pedidos registados`}
              </span>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-3 flex items-start space-x-2.5 mb-4">
                <AlertCircle size={15} className="text-red-600 mt-0.5 shrink-0" />
                <p className="text-[10px] text-red-700">{error}</p>
              </div>
            )}

            {/* Active Order Card */}
            {!loading && firstActive && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-sm mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span>{statusLabel(firstActive.status as OrderStatus)}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">Lota nº #{firstActive.order_id}</span>
                </div>

                <div>
                  <h4 className="text-xs font-black text-[#0A192F]">
                    {orderItemsOf(firstActive).length > 0
                      ? orderItemsOf(firstActive).map((i) => `${i.quantity} kg ${i.name}`).join(', ')
                      : `Pedido #${firstActive.order_id}`}
                  </h4>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-0.5">
                    <span>{formatOrderDate(firstActive.created_at) || 'Hoje'}</span>
                    <span>•</span>
                    <span className="font-bold text-[#0A192F]">{formatKz(firstActive.grand_total ?? 0)} AOA</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 leading-relaxed">
                  {firstActive.delivery_address || 'Morada de entrega em Luanda'} • Acompanhe o estado em tempo real.
                </p>

                <Link href={`/acompanhar-pedido?order=${firstActive.order_id}`} className="w-full bg-[#0A192F] hover:bg-[#132d4e] text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-between shadow-md transition-all cursor-pointer">
                  <span>Acompanhar Entrega em Tempo Real</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {/* Previous Deliveries */}
            <div className="space-y-3">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block pt-1">
                Entregas Anteriores
              </span>

              {!loading && recentClosed.length === 0 && (
                <p className="text-[11px] text-slate-500 bg-white border border-slate-100 rounded-xl p-3">
                  Ainda não tem entregas concluídas.
                </p>
              )}

              {recentClosed.map((order) => (
                <div key={order.order_id} className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 font-semibold">
                      {formatOrderDate(order.created_at) || `Pedido #${order.order_id}`}
                    </span>
                    <h5 className="text-xs font-bold text-[#0A192F] mt-0.5">
                      {orderItemsOf(order).length > 0
                        ? orderItemsOf(order).map((i) => `${i.quantity} kg ${i.name}`).join(', ')
                        : `Pedido #${order.order_id}`}
                    </h5>
                    <span className="text-xs font-black text-[#0A192F] mt-1 block">
                      {formatKz(order.grand_total ?? 0)} Kz
                    </span>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className="bg-emerald-50 text-emerald-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1">
                      <CheckCircle2 size={10} /> <span>Entregue</span>
                    </span>
                    <button
                      onClick={() => repeatOrder(order.order_id)}
                      className="bg-slate-100 hover:bg-slate-200 text-[#0A192F] text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 transition-colors"
                    >
                      <RotateCcw size={11} /> <span>Repetir</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sessão & Segurança */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0A192F] flex items-center space-x-2">
              <User size={14} />
              <span>Sessão & Segurança</span>
            </h3>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Autenticado via Clerk com token JWT em todas as chamadas à API da Mabunda.
            </p>
            <SignOutButton redirectUrl="/">
              <button className="w-full bg-white hover:bg-red-50 border border-red-100 text-red-600 py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer">
                <LogOut size={14} />
                <span>Terminar Sessão</span>
              </button>
            </SignOutButton>
          </div>

          {/* Bottom Links */}
          <div className="flex items-center justify-center space-x-4 pt-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <Link href="/pedidos" className="hover:text-[#0A192F]">Apoio ao Cliente VIP</Link>
            <span>•</span>
            <Link href="/historico" className="hover:text-[#0A192F]">Arquivo de Pedidos</Link>
          </div>

        </div>

        {/* Navegação Inferior partilhada */}
        <BottomNav />

        {/* MODAL: Perfil Clerk (avatar, email, telefone, sessões) */}
        {isProfileOpen && <UserProfile routing="hash" />}

        {/* MODAL / BOTTOM SHEET: ADICIONAR NOVA MORADA */}
        {isAddAddressOpen && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            {/* Backdrop escurecido */}
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] transition-opacity"
              onClick={() => setIsAddAddressOpen(false)}
            />

            {/* Modal Body */}
            <div className="relative bg-white rounded-t-[32px] px-5 pt-3 pb-6 shadow-2xl space-y-4 max-h-[90%] overflow-y-auto animate-in slide-in-from-bottom duration-300">
              
              {/* Handle Bar */}
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto my-1"></div>

              {/* Header do Modal */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0A192F] leading-snug">
                    Adicionar Nova Morada
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
                    Defina a localização exata em Luanda para entregas climatizadas de peixe fresco da Lota.
                  </p>
                </div>
                <button 
                  onClick={() => setIsAddAddressOpen(false)}
                  className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 transition-colors shrink-0 ml-2"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Form Content */}
              <div className="space-y-3.5">
                
                {/* Tipo de Morada */}
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">
                    Tipo de Morada
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Casa', 'Trabalho', 'Outro'] as AddressType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setAddressType(type)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${
                          addressType === type
                            ? 'bg-black text-white shadow-sm'
                            : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nome / Identificador da Morada */}
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                    Nome / Identificador da Morada
                  </label>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Ex: Casa da Ilha"
                    className="w-full bg-slate-100/70 border-0 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#0A192F] focus:ring-2 focus:ring-[#0A192F] outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Bairro / Zona de Luanda */}
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                    Bairro / Zona de Luanda
                  </label>
                  <div className="relative">
                    <select
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      className="w-full bg-slate-100/70 border-0 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#0A192F] appearance-none focus:ring-2 focus:ring-[#0A192F] outline-none transition-all pr-8 cursor-pointer"
                    >
                      <option value="Ilha de Luanda (Cabo Island)">Ilha de Luanda (Cabo Island)</option>
                      <option value="Talatona">Talatona</option>
                      <option value="Mutamba">Mutamba</option>
                      <option value="Maianga">Maianga</option>
                      <option value="Miramar">Miramar</option>
                      <option value="Kilamba">Kilamba</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                {/* Rua e Número / Condomínio */}
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                    Rua e Número / Condomínio
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Ex: Av. Murtala Mohamed, Edifício Atlântico, Apt 3A"
                    className="w-full bg-slate-100/70 border-0 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#0A192F] focus:ring-2 focus:ring-[#0A192F] outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Ponto de Referência */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      Ponto de Referência
                    </label>
                    <span className="text-[9px] font-bold text-emerald-600">
                      Essencial p/ Estafeta
                    </span>
                  </div>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Ex: Junto ao Clube Náutico, portão cinzento à direita"
                    className="w-full bg-slate-100/70 border-0 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#0A192F] focus:ring-2 focus:ring-[#0A192F] outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Definir como Morada Principal Switch */}
                <div className="bg-slate-50/90 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#0A192F] block">
                      Definir como Morada Principal
                    </span>
                    <p className="text-[9px] text-slate-400 font-medium">
                      Selecionar automaticamente nos próximos pedidos
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPrimary(!isPrimary)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                      isPrimary ? 'bg-black' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        isPrimary ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Usar Localização GPS Atual Button */}
                <button 
                  type="button"
                  onClick={handleUseGps}
                  disabled={gpsLoading}
                  className="w-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer disabled:opacity-60"
                >
                  <Navigation size={13} className="text-[#0A192F] fill-[#0A192F]" />
                  <span>{gpsLoading ? 'A obter localização...' : 'Usar Localização GPS Atual'}</span>
                </button>

                {/* Guardar Morada Button */}
                <button 
                  type="button"
                  onClick={handleSaveAddress}
                  disabled={street.trim().length < 3}
                  className="w-full bg-[#0B1728] hover:bg-[#132845] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md transition-all cursor-pointer mt-1"
                >
                  <Check size={14} />
                  <span>Guardar Morada</span>
                </button>

              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
