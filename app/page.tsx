"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SignIn, useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

/**
 * Página raiz — Autenticação real via Clerk.
 * Utilizadores já autenticados são enviados diretamente para /home.
 */
export default function AuthEntryPage() {
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
          <div className="relative w-32 h-20 flex items-center justify-center mb-4">
            <Image
              src="/imagem do projecto/LOGO.png"
              alt="Mabunda Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#0A192F] mb-2">
            Pescado Fresco de Luanda
          </h1>
          <p className="text-sm text-slate-500 max-w-[300px] leading-relaxed">
            Entre na sua conta para aceder à lota exclusiva — direto da doca para a sua mesa.
          </p>
        </div>

        {/* Card do SignIn Clerk */}
        <div className="w-full flex justify-center [&>div]:w-full">
          <SignIn
            fallbackRedirectUrl="/home"
            signUpUrl="/auth"
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
          Ao entrar, concorda com os Termos de Serviço e com a Política de Frescura Garantida
          Mabunda.
        </p>
      </div>
    </div>
  );
}
