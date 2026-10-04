# Mabunda Web

PWA do Client App da Mabunda — lota exclusiva de pescado fresco de Luanda.

## Stack

- **Next.js (App Router) + TypeScript + Tailwind CSS**
- **Clerk** — autenticação e sessões (JWT enviado em todas as chamadas à API)
- **API Go Echo** — backend em `https://mabunda-application.onrender.com`

## Configuração

Criar `.env.local` com as chaves do Clerk:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_API_URL=https://mabunda-application.onrender.com
```

## Arrancar

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Fluxo de pedido

1. `POST /v1/orders` — checkout reserva stock (TTL 15 min para pagamento)
2. `POST /v1/orders/:id/payment-proof/upload-url` + PUT direto no R2 + `.../complete` — comprovativo
3. Polling em `GET /v1/orders/:id` até aprovação, despacho e entrega via PIN

Documentação de referência: `CLIENT.md` e `AUTH.md` do repositório do backend.
