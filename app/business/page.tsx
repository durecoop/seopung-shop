'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BusinessPage() {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };
  const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400/30";

  return (
    <main className="bg-white font-[family-name:var(--font-pretendard)]">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 pt-24 pb-20 lg:px-8">
        {/* Hero */}
        <div className="mb-16 text-center">
          <p className="mb-3 font-[family-name:var(--font-montserrat)] text-sm font-semibold uppercase tracking-[0.3em] text-ocean-500">B2B Partnership</p>
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">기업 거래 안내</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">10년간 134+ 품목을 개발한 OEM 전문 역량으로<br />귀사의 브랜드 가치를 높여드립니다.</p>
        </div>

        {/* Stats */}
        <div className="mb-16 grid gap-4 sm:grid-cols-4">
          {[
            { number: '10년+', label: '협력기간' },
            { number: '134+', label: '개발품목' },
            { number: '66개', label: '운영중' },
            { number: '400억', label: '매출목표' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
              <span className="font-[family-name:var(--font-montserrat)] text-3xl font-bold text-ocean-600">{stat.number}</span>
              <span className="mt-1 block text-sm text-gray-500">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Partners */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm text-gray-400">주요 파트너사</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-lg font-semibold text-gray-300">
            {['풀무원', '푸드머스', '홈플러스', '이마트', '쿠팡'].map(name => (
              <span key={name} className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-3">{name}</span>
            ))}
          </div>
        </div>

        {/* Quote Form */}
        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 md:p-12">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">견적 요청</h2>
          <p className="mb-8 text-gray-500">아래 양식을 작성해 주시면 영업팀에서 빠르게 회신 드립니다.</p>

          {submitted ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8 text-emerald-500"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">견적 요청이 접수되었습니다</h3>
              <p className="mt-2 text-gray-500">영업팀에서 1~2일 내 연락드리겠습니다.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1 block text-sm text-gray-500">회사명 *</label><input type="text" required className={inputCls} placeholder="회사명" /></div>
                <div><label className="mb-1 block text-sm text-gray-500">사업자번호</label><input type="text" className={inputCls} placeholder="000-00-00000" /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1 block text-sm text-gray-500">담당자명 *</label><input type="text" required className={inputCls} placeholder="담당자명" /></div>
                <div><label className="mb-1 block text-sm text-gray-500">연락처 *</label><input type="tel" required className={inputCls} placeholder="010-0000-0000" /></div>
              </div>
              <div><label className="mb-1 block text-sm text-gray-500">이메일 *</label><input type="email" required className={inputCls} placeholder="이메일" /></div>
              <div><label className="mb-1 block text-sm text-gray-500">관심 품목 / 수량 / 요청사항 *</label>
                <textarea required rows={5} className={inputCls} placeholder={"예: 고등어필렛 1kg x 500박스, 삼치필렛 1kg x 300박스\n납품 희망 시기, PB 브랜드 여부 등"} /></div>
              <button type="submit" className="w-full rounded-xl bg-ocean-500 py-3.5 font-semibold text-white transition-all hover:bg-ocean-600">견적 요청하기</button>
            </form>
          )}
        </div>

        <div className="mt-10 text-center">
          <a href="https://seopung.co.kr/" target="_blank" rel="noopener noreferrer" className="text-sm text-ocean-500 hover:text-ocean-600">회사소개 홈페이지에서 설비·인증 정보 보기 &rarr;</a>
        </div>
      </div>
      <Footer />
    </main>
  );
}
