"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ClipboardList, User } from "lucide-react";
import { useCart } from "../lib/cartContext";

/**
 * Navegação inferior global — liga todas as telas principais:
 * /home ↔ /search ↔ /pedidos ↔ /conta, com badge do carrinho em tempo real.
 */
export default function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();

  // Evita flash de hidratação no badge
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const items = [
    { href: "/home", label: "Início", icon: Home },
    { href: "/search", label: "Pesquisar", icon: Search },
    { href: "/pedidos", label: "Pedidos", icon: ClipboardList, badge: mounted ? count : 0 },
    { href: "/conta", label: "Conta", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 shadow-lg">
      {items.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`relative flex flex-col items-center transition-colors ${
              isActive ? "text-[#0A192F]" : "text-slate-400 hover:text-[#0A192F]"
            }`}
          >
            <span className="relative">
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-[#0A192F] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow">
                  {item.badge}
                </span>
              )}
            </span>
            <span className={`text-[10px] mt-1 ${isActive ? "font-bold" : "font-medium"}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
