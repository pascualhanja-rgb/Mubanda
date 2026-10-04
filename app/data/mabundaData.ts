/**
 * Filtros de categoria da lota (apenas UI — os produtos vêm sempre da API).
 * Fonte de verdade do catálogo: GET /v1/products (ver app/lib/api.ts).
 */
export const categories = [
  { id: 'all', name: 'All Catch', active: false },
  { id: 'fresh', name: 'Fresh Fish', active: true },
  { id: 'shellfish', name: 'Shellfish & Crustacean', active: false },
];
