// Cart utility — localStorage-based cart for seopung-shop

export interface CartItemData {
  productId: string;
  name: string;
  price: number;
  weight: string;
  image: string;
  qty: number;
}

const CART_KEY = 'seopung_cart';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getCart(): CartItemData[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItemData[];
  } catch {
    return [];
  }
}

function saveCart(items: CartItemData[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('cart-updated'));
}

export function addToCart(product: { id: string; name: string; price: number; weight: string; images?: string[] }, qty: number): void {
  const items = getCart();
  const idx = items.findIndex(i => i.productId === product.id);
  if (idx >= 0) {
    items[idx].qty += qty;
  } else {
    items.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      weight: product.weight,
      image: product.images?.[0] || '',
      qty,
    });
  }
  saveCart(items);
}

export function removeFromCart(productId: string): void {
  const items = getCart().filter(i => i.productId !== productId);
  saveCart(items);
}

export function updateCartQty(productId: string, qty: number): void {
  const items = getCart();
  const idx = items.findIndex(i => i.productId === productId);
  if (idx >= 0) {
    if (qty <= 0) {
      items.splice(idx, 1);
    } else {
      items[idx].qty = qty;
    }
  }
  saveCart(items);
}

export function clearCart(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event('cart-updated'));
}

export function getCartCount(): number {
  return getCart().length;
}
