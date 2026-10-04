/**
 * Moradas guardadas do cliente.
 *
 * A API Go (CLIENT.md/AUTH.md) não expõe endpoints de moradas — o pedido leva
 * apenas `delivery_address` (texto). Por isso a lista de moradas fica
 * persistida localmente no dispositivo e serve para pré-preencher o checkout.
 */

export interface SavedAddress {
  id: string;
  label: string;
  type: 'Casa' | 'Trabalho' | 'Outro';
  address: string;
  reference?: string;
  isPrimary: boolean;
}

const STORAGE_KEY = "mabunda_addresses_v1";

export function loadAddresses(): SavedAddress[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedAddress[]) : [];
  } catch {
    return [];
  }
}

export function saveAddresses(list: SavedAddress[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* storage indisponível — ignora */
  }
}

/** Morada principal (fallback: a primeira guardada) */
export function loadPrimaryAddress(): SavedAddress | null {
  const list = loadAddresses();
  if (list.length === 0) return null;
  return list.find((a) => a.isPrimary) ?? list[0];
}

/** Adiciona (ou substitui, se for definida como principal) uma morada */
export function addAddress(input: Omit<SavedAddress, "id">): SavedAddress {
  const list = loadAddresses();
  const address: SavedAddress = {
    ...input,
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now()),
  };
  const next = input.isPrimary
    ? [...list.map((a) => ({ ...a, isPrimary: false })), address]
    : [...list, address];
  saveAddresses(next);
  return address;
}
