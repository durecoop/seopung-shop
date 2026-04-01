'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCart, removeFromCart, updateCartQty, type CartItemData } from '@/lib/cart';
import { getStoreSettings } from '@/lib/db';
import { formatPrice } from '@/lib/types';
import type { StoreSettings } from '@/lib/types';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.title = '장바구니 | 서풍몰';
    setCartItems(getCart());
    setLoaded(true);
    getStoreSettings().then(s => setSettings(s as StoreSettings));
  }, []);

  const shippingFee = settings ? settings.shippingFee : 3000;
  const freeShippingThreshold = settings ? settings.freeShippingThreshold : 50000;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingFee;
  const total = subtotal + shipping;

  const handleUpdateQty = (productId: string, delta: number) => {
    const item = cartItems.find(i => i.productId === productId);
    if (!item) return;
    const newQty = Math.max(1, item.qty + delta);
    updateCartQty(productId, newQty);
    setCartItems(getCart());
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    setCartItems(getCart());
  };

  if (!loaded) return null;

  return (
    <main className="bg-gray-50 min-h-screen font-[family-name:var(--font-pretendard)]">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 pt-24 pb-20 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">장바구니</h1>
        {cartItems.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-400">장바구니가 비어있습니다</p>
            <Link href="/products" className="mt-4 inline-block text-ocean-500 hover:text-ocean-600">상품 보러가기 &rarr;</Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-100 sm:h-24 sm:w-24">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} width={96} height={96} className="h-full w-full rounded-xl object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor" className="h-10 w-10 text-gray-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-sm font-semibold text-gray-800">{item.name}</span>
                        <p className="text-xs text-gray-400">{item.weight}</p>
                      </div>
                      <button onClick={() => handleRemove(item.productId)} className="text-xs text-gray-300 hover:text-red-500">삭제</button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-gray-200">
                        <button onClick={() => handleUpdateQty(item.productId, -1)} className="px-2.5 py-1.5 text-sm text-gray-400 hover:text-gray-700">−</button>
                        <span className="w-8 text-center font-[family-name:var(--font-montserrat)] text-sm font-semibold text-gray-800">{item.qty}</span>
                        <button onClick={() => handleUpdateQty(item.productId, 1)} className="px-2.5 py-1.5 text-sm text-gray-400 hover:text-gray-700">+</button>
                      </div>
                      <span className="font-[family-name:var(--font-montserrat)] font-bold text-ocean-600">{formatPrice(item.price * item.qty)}원</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-gray-900">주문 요약</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">상품금액</span><span className="font-[family-name:var(--font-montserrat)] text-gray-800">{formatPrice(subtotal)}원</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">배송비</span><span className={`font-[family-name:var(--font-montserrat)] ${shipping === 0 ? 'text-emerald-500' : 'text-gray-800'}`}>{shipping === 0 ? '무료' : `${formatPrice(shipping)}원`}</span></div>
                  <hr className="border-gray-100" />
                  <div className="flex items-baseline justify-between"><span className="font-semibold text-gray-900">총 결제금액</span><span className="font-[family-name:var(--font-montserrat)] text-2xl font-bold text-ocean-600">{formatPrice(total)}원</span></div>
                </div>
                <Link href="/checkout" className="mt-6 block w-full rounded-xl bg-ocean-500 py-3.5 text-center font-semibold text-white transition-all hover:bg-ocean-600">주문하기</Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
