'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getProducts, getCategories } from '@/lib/db';
import { formatPrice } from '@/lib/types';
import type { Product, Category } from '@/lib/types';

export default function ShopHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()]).then(([p, c]) => {
      setProducts(p);
      setCategories(c);
      setLoading(false);
    });
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured);
  const newProducts = products.filter(p => p.isNew);

  return (
    <main className="bg-white font-[family-name:var(--font-pretendard)]">
      <Navbar cartCount={0} />

      {/* Hero */}
      <section className="relative flex h-[55vh] min-h-[400px] items-center justify-center overflow-hidden pt-16 bg-gradient-to-b from-ocean-50 via-white to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-ocean-300)_0%,_transparent_60%)] opacity-10" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 font-[family-name:var(--font-montserrat)] text-sm font-semibold uppercase tracking-[0.3em] text-ocean-500">Premium Seafood Shop</p>
          <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
            지속가능한 바다의 맛,<br /><span className="text-ocean-500">서풍몰</span>에서 만나세요
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-500">HACCP·ASC·MSC 인증 프리미엄 수산물을 산지 직송으로 배송합니다</p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/products" className="inline-flex items-center gap-2 rounded-xl bg-ocean-500 px-8 py-3.5 font-semibold text-white transition-all hover:bg-ocean-600 hover:shadow-lg">전체상품 보기 &rarr;</Link>
            <Link href="/products/gulbi" className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-8 py-3.5 font-semibold text-gray-700 transition-all hover:border-ocean-400 hover:text-ocean-600">영광굴비 선물세트</Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400">
            {['HACCP 인증', 'ASC·MSC 인증', '산지 직송', '5만원 이상 무료배송'].map(t => (
              <span key={t} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-10 text-center">
            <p className="mb-2 font-[family-name:var(--font-montserrat)] text-sm font-semibold uppercase tracking-[0.25em] text-ocean-500">Categories</p>
            <h2 className="text-3xl font-bold text-gray-900">카테고리</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/products/${cat.slug}`}
                className="group rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:border-ocean-300 hover:shadow-md">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-ocean-50 text-ocean-500 group-hover:bg-ocean-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="h-7 w-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-800">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      {!loading && featuredProducts.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-2 font-[family-name:var(--font-montserrat)] text-sm font-semibold uppercase tracking-[0.25em] text-ocean-500">Best</p>
                <h2 className="text-3xl font-bold text-gray-900">인기 상품</h2>
              </div>
              <Link href="/products" className="text-sm text-ocean-500 hover:text-ocean-600">전체보기 &rarr;</Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Gulbi Banner */}
      <section className="py-20 bg-gradient-to-r from-navy-900 to-navy-800">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="p-8 md:flex md:items-center md:gap-10 md:p-12">
            <div className="flex-1">
              <span className="inline-block rounded-full bg-gold-500/20 px-4 py-1 text-sm font-medium text-gold-400">프리미엄 영광굴비</span>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">전통 장인이 만드는<br />영광굴비 선물세트</h2>
              <p className="mt-4 text-white/70">여수 직송 참조기를 전통 아가미 섭간으로 정성껏 숙성합니다.</p>
              <Link href="/products/gulbi" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-6 py-3 font-semibold text-navy-950 hover:bg-gold-400">굴비 보러가기 &rarr;</Link>
            </div>
            <div className="mt-8 flex h-56 w-full items-center justify-center rounded-2xl bg-white/10 md:mt-0 md:h-64 md:w-80">
              <span className="text-sm text-white/30">굴비 이미지</span>
            </div>
          </div>
        </div>
      </section>

      {/* New Products */}
      {!loading && newProducts.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-10">
              <p className="mb-2 font-[family-name:var(--font-montserrat)] text-sm font-semibold uppercase tracking-[0.25em] text-emerald-500">New</p>
              <h2 className="text-3xl font-bold text-gray-900">신상품</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {newProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Info */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '🚛', title: '산지 직송', desc: '여수에서 당일 발송' },
              { icon: '❄️', title: '냉동 택배', desc: '신선도 유지 배송' },
              { icon: '✅', title: 'HACCP 인증', desc: '안전한 가공 시설' },
              { icon: '💰', title: '5만원 이상', desc: '무료 배송' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <span className="text-2xl">{item.icon}</span>
                <div><h4 className="text-sm font-semibold text-gray-800">{item.title}</h4><p className="text-xs text-gray-400">{item.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {loading && <div className="py-10 text-center text-gray-400">상품 로딩 중...</div>}

      <Footer />
    </main>
  );
}
