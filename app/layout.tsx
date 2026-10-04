import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "./lib/cartContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jb",
});

export const metadata: Metadata = {
  title: "Mabunda Web | Plataforma Digital",
  description: "Aplicações modernas e de alto desempenho.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider signInUrl="/" signUpUrl="/auth">
      <html lang="pt" className={`${inter.variable} ${mono.variable} dark h-full scroll-smooth`}>
        <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
          {/* Efeito Visual de Fundo (Glow / Gradiente) */}
          <div className="fixed inset-0 -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-500/10 blur-[120px] rounded-full opacity-70" />
          </div>

          {/* Conteúdo Principal — molde centralizado tipo telemóvel (máx. 430px no PC; 100% no telemóvel) */}
          <main className="flex-1 flex flex-col items-center">
            <div className="w-full max-w-[430px] min-h-screen shadow-2xl">
              <CartProvider>{children}</CartProvider>
            </div>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
