'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getProducts, getCategories } from '@/lib/db';
import type { Product, Category } from '@/lib/types';
import type { ReactNode } from 'react';

const CATEGORY_ICONS: Record<string, ReactNode> = {
  'frozen-fish': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>,
  'seafood': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7"><path strokeLinecap="round" strokeLinejoin="round" d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 0 1-1.383-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236c1.602.32 2.228-1.907.665-2.396-.2-.063-.42-.048-.608.07l-.026.016a.75.75 0 0 1-.788-.076 1.645 1.645 0 0 0-1.812-.098L4.5 8.5" /></svg>,
  'dried': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" /></svg>,
  'gift-set': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>,
};

const DEFAULT_ICON = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>;

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
    <main id="main-content" className="bg-white font-[family-name:var(--font-pretendard)]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative flex min-h-[600px] items-center overflow-hidden pt-16 bg-navy-950">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--color-ocean-600)_0%,_transparent_50%)] opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--color-gold-500)_0%,_transparent_40%)] opacity-10" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
              <span className="font-[family-name:var(--font-montserrat)] text-xs font-semibold tracking-wider text-gold-400">PREMIUM SEAFOOD</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              지속가능한 바다의 맛,<br /><span className="bg-gradient-to-r from-ocean-300 to-ocean-400 bg-clip-text text-transparent">서풍몰</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/60">
              HACCP·ASC·MSC 인증 프리미엄 수산물을<br className="hidden sm:block" />산지에서 식탁까지 직송합니다.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-ocean-500 px-8 py-3.5 font-semibold text-white transition-all hover:bg-ocean-400 hover:shadow-lg hover:shadow-ocean-500/20">
                전체상품 보기
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 transition-transform group-hover:translate-x-1"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </Link>
              <Link href="/products/gift-set" className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold-500/40 bg-gold-500/10 px-8 py-3.5 font-semibold text-gold-400 transition-all hover:border-gold-500/60 hover:bg-gold-500/20">
                영광굴비 선물세트
              </Link>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-16 flex flex-wrap gap-6 border-t border-white/10 pt-8">
            {[
              { label: 'HACCP 인증', sub: '식품안전관리' },
              { label: 'ASC·MSC', sub: '국제 수산 인증' },
              { label: '산지 직송', sub: '여수 당일 발송' },
              { label: '5만원 이상', sub: '무료 배송' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-ocean-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/90">{item.label}</p>
                  <p className="text-xs text-white/40">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-2 font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.3em] text-ocean-500">Categories</p>
            <h2 className="text-3xl font-bold text-gray-900">카테고리</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/products/${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-b from-white to-gray-50 p-6 text-center transition-all duration-500 hover:border-ocean-200 hover:shadow-xl hover:shadow-ocean-500/5 hover:-translate-y-1">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ocean-50 text-ocean-500 transition-all duration-500 group-hover:bg-ocean-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-ocean-500/20">
                  {CATEGORY_ICONS[cat.slug] || DEFAULT_ICON}
                </div>
                <h3 className="text-sm font-bold text-gray-800 group-hover:text-ocean-600">{cat.name}</h3>
                <p className="mt-1 text-xs text-gray-400">{cat.description || '상품 보기'}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      {!loading && featuredProducts.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50/50 py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="mb-2 font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.3em] text-ocean-500">Best Sellers</p>
                <h2 className="text-3xl font-bold text-gray-900">인기 상품</h2>
              </div>
              <Link href="/products" className="hidden items-center gap-1 text-sm font-medium text-ocean-500 transition-colors hover:text-ocean-600 sm:flex">
                전체보기
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Gulbi Premium Banner ── */}
      <section className="relative overflow-hidden bg-navy-950 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_var(--color-gold-500)_0%,_transparent_50%)] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-gold-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-3.5 w-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
                PREMIUM GIFT SET
              </span>
              <h2 className="mt-6 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                전통 장인이 만드는<br /><span className="text-gold-400">영광굴비 선물세트</span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/50">
                여수 직송 참조기를 전통 아가미 섭간으로 정성껏 숙성합니다.
                특별한 날, 소중한 분께 정성을 전하세요.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/products/gift-set" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-8 py-3.5 font-bold text-navy-950 transition-all hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/20">
                  굴비 보러가기
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4 transition-transform group-hover:translate-x-1"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                </Link>
              </div>
            </div>
            <div className="flex h-72 w-full items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm md:h-80 md:w-96">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-gold-500/10">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="h-10 w-10 text-gold-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
                </div>
                <p className="text-sm font-medium text-white/30">영광굴비 선물세트</p>
                <p className="mt-1 text-xs text-white/20">이미지 준비중</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── New Products ── */}
      {!loading && newProducts.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="mb-2 font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">New Arrivals</p>
                <h2 className="text-3xl font-bold text-gray-900">신상품</h2>
              </div>
              <Link href="/products" className="hidden items-center gap-1 text-sm font-medium text-ocean-500 transition-colors hover:text-ocean-600 sm:flex">
                전체보기
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {newProducts.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Value Propositions ── */}
      <section className="border-t border-gray-100 bg-gray-50/50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: '산지 직송', desc: '여수에서 당일 발송', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.079-.481 1.09-1.102.434-8.674-.655-15.648-15.648-15.648H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125H16.5" /></svg> },
              { title: '냉동 택배', desc: '신선도 유지 배송', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811Z" /></svg> },
              { title: 'HACCP 인증', desc: '안전한 가공 시설', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg> },
              { title: '5만원 이상 무료배송', desc: '합리적 구매 혜택', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg> },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 rounded-2xl bg-white p-5 ring-1 ring-gray-100 transition-all hover:shadow-md hover:ring-ocean-100">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ocean-50 text-ocean-500">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">{item.title}</h4>
                  <p className="mt-0.5 text-xs text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-navy-950 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">B2B 대량 구매 · OEM 납품 문의</h2>
          <p className="mt-3 text-white/50">대형마트, 외식 프랜차이즈, 밀키트 브랜드 등 다양한 파트너와 함께합니다.</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/business" className="inline-flex items-center gap-2 rounded-xl bg-ocean-500 px-8 py-3.5 font-semibold text-white transition-all hover:bg-ocean-400">기업 거래 문의</Link>
            <a href="https://seopung.co.kr" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-8 py-3.5 font-semibold text-white/80 transition-all hover:border-white/40 hover:text-white">회사소개 홈페이지</a>
          </div>
        </div>
      </section>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-ocean-500" />
            <p className="text-sm text-gray-400">상품 로딩 중...</p>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
