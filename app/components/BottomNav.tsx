'use client';

import React from 'react';
import { Home, Search, FileText, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { href: '/home', label: 'Home', icon: Home, match: '/home' },
    { href: '/search', label: 'Search', icon: Search, match: '/search' },
    { href: '/conta', label: 'Orders', icon: FileText, match: '/conta' },
    { href: '/conta', label: 'Profile', icon: User, match: '/conta' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 shadow-lg">
      {items.map((item) => {
        const isActive = item.match === '/' ? pathname === '/' : pathname.startsWith(item.match);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center transition-colors ${
              isActive ? 'text-[#0A192F]' : 'text-slate-400 hover:text-[#0A192F]'
            }`}
          >
            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}