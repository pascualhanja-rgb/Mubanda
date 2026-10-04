"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SignUp, useAuth } from "@clerk/nextjs";

/**
 * Página de registo — cria conta real no Clerk.
 * O webhook do Clerk sincroniza o utilizador na API (users.role = CLIENT).
 */
export default function RegisterPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/home");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <span className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
            Mabunda Purveyors
          </span>
          <span className="text-[9px] tracking-wider text-slate-400 uppercase mt-0.5">
            Luanda • Lota Exclusiva
          </span>
          <div className="my-4 relative w-24 h-14 flex items-center justify-center">
            <Image
              src="/imagem do projecto/LOGO.png"
              alt="Mabunda Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Criar Nova Conta</h1>
          <p className="text-xs text-slate-500 mt-2 max-w-[280px] leading-relaxed">
            Junte-se ao círculo exclusivo de apreciadores de pescado fresco de Luanda direto da
            Lota.
          </p>
        </div>

        {/* Card do SignUp Clerk */}
        <div className="w-full flex justify-center [&>div]:w-full">
          <SignUp
            fallbackRedirectUrl="/home"
            signInUrl="/"
            appearance={{
              variables: {
                colorPrimary: "#0A192F",
                colorBackground: "#ffffff",
                borderRadius: "1rem",
              },
            }}
          />
        </div>

        <p className="mt-6 text-[11px] text-slate-400 text-center leading-relaxed px-4">
          Ao criar conta, concorda com os Termos de Serviço e com a Política de Privacidade e
          Frescura da Mabunda.
        </p>
      </div>
    </div>
  );
}
