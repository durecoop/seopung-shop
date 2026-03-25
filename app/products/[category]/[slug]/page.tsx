'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getProductBySlug, getCategories, getStoreSettings } from '@/lib/db';
import { formatPrice } from '@/lib/types';
import type { Product, Category, StoreSettings } from '@/lib/types';
import { addToCart } from '@/lib/cart';

export default function ProductDetailPage() {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [cat, setCat] = useState<Category | null>(null);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  useEffect(() => {
    Promise.all([getProductBySlug(slug), getCategories(), getStoreSettings()]).then(([p, cats, s]) => {
      setProduct(p);
      setCat(cats.find(c => c.slug === category) || null);
      setSettings(s as StoreSettings);
      setLoading(false);
    });
  }, [category, slug]);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | 서풍몰`;
    }
  }, [product]);

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-white"><p className="text-gray-400">로딩 중...</p></main>;
  if (!product || !cat) return <main className="flex min-h-screen items-center justify-center bg-white"><p className="text-gray-400">상품을 찾을 수 없습니다.</p></main>;

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const totalPrice = product.price * qty;
  const freeShipping = settings ? totalPrice >= settings.freeShippingThreshold : false;

  const handleAddCart = () => {
    if (!product) return;
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="bg-white font-[family-name:var(--font-pretendard)]">
      {product && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.images?.[0],
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'KRW',
            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          },
        }) }} />
      )}
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-20 lg:px-8">
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
          <Link href="/products" className="hover:text-gray-700">전체상품</Link><span>/</span>
          <Link href={`/products/${category}`} className="hover:text-gray-700">{cat.name}</Link><span>/</span>
          <span className="text-gray-700">{product.name}</span>
        </div>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              {product.images && product.images.length > 0 ? (
                <Image src={product.images[selectedImg] || product.images[0]} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor" className="h-32 w-32 text-gray-200">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                  </svg>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(i)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${selectedImg === i ? 'border-ocean-500 ring-1 ring-ocean-300' : 'border-gray-200 hover:border-gray-400'}`}>
                    <Image src={img} alt={`${product.name} ${i + 1}`} width={80} height={80} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              {product.tags?.map((tag) => <span key={tag} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-500">{tag}</span>)}
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">{product.name}</h1>
            <p className="mt-3 leading-relaxed text-gray-500">{product.description}</p>
            <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex items-baseline gap-3">
                {discount > 0 && <span className="rounded-md bg-red-500 px-2 py-0.5 text-sm font-bold text-white">{discount}%</span>}
                {product.originalPrice && <span className="font-[family-name:var(--font-montserrat)] text-lg text-gray-300 line-through">{formatPrice(product.originalPrice)}</span>}
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-montserrat)] text-4xl font-bold text-ocean-600">{formatPrice(product.price)}</span>
                <span className="text-lg text-gray-400">원</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                {freeShipping ? '✓ 무료배송' : settings ? `배송비 ${formatPrice(settings.shippingFee)}원 (${formatPrice(settings.freeShippingThreshold)}원 이상 무료)` : ''}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm text-gray-500">수량</span>
              <div className="flex items-center rounded-lg border border-gray-200">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-gray-400 hover:text-gray-700">−</button>
                <span className="w-12 text-center font-[family-name:var(--font-montserrat)] font-semibold text-gray-800">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-2 text-gray-400 hover:text-gray-700">+</button>
              </div>
              <span className="text-sm text-gray-400">재고 {product.stock}개</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-sm text-gray-500">합계</span>
              <span className="font-[family-name:var(--font-montserrat)] text-2xl font-bold text-gray-900">{formatPrice(totalPrice)}</span>
              <span className="text-gray-400">원</span>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleAddCart} className={`flex-1 rounded-xl py-3.5 font-semibold transition-all ${added ? 'bg-emerald-500 text-white' : 'border border-ocean-400 text-ocean-600 hover:bg-ocean-50'}`}>
                {added ? '✓ 장바구니에 담았습니다' : '장바구니 담기'}
              </button>
              <Link href="/checkout" className="flex-1 rounded-xl bg-ocean-500 py-3.5 text-center font-semibold text-white hover:bg-ocean-600">바로 구매</Link>
            </div>
            <div className="mt-10 border-t border-gray-200 pt-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-700">상품 정보</h3>
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-500">{product.detail}</pre>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
