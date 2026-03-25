'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { addQuote } from '@/lib/db';

export default function BusinessPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    businessNumber: '',
    contactName: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await addQuote({
        companyName: formData.companyName,
        businessNumber: formData.businessNumber,
        contactName: formData.contactName,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Quote submission failed:', err);
      alert('견적 요청 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
    setSubmitting(false);
  };

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
        <div className="mb-16">
          <p className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-gray-400">주요 납품 파트너사</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {[
              { name: '풀무원', sub: 'Pulmuone', color: 'text-emerald-600' },
              { name: 'CJ프레시웨이', sub: 'CJ Freshway', color: 'text-orange-500' },
              { name: '두레생협', sub: 'Dure Coop', color: 'text-green-600' },
              { name: '홈플러스', sub: 'Homeplus', color: 'text-red-500' },
              { name: '쿠팡', sub: 'Coupang', color: 'text-amber-500' },
            ].map((partner) => (
              <div key={partner.name} className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-ocean-300 hover:shadow-md">
                <span className={`font-[family-name:var(--font-montserrat)] text-[10px] font-semibold uppercase tracking-wider ${partner.color}`}>{partner.sub}</span>
                <span className="text-base font-bold text-gray-800">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 회사소개서 배너 */}
        <div className="mb-16 overflow-hidden rounded-3xl bg-gradient-to-r from-navy-900 to-navy-800 p-8 md:flex md:items-center md:gap-8 md:p-12">
          <div className="flex-1">
            <span className="inline-block rounded-full bg-ocean-500/20 px-4 py-1 text-sm font-medium text-ocean-300">Company Profile</span>
            <h3 className="mt-4 text-2xl font-bold text-white md:text-3xl">서풍 회사소개서</h3>
            <p className="mt-3 text-white/70">50년 수산 가공 노하우, AI 스마트 팩토리,<br />HACCP·ASC·MSC 인증 역량을 한눈에 확인하세요.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="https://durecoop.github.io/seopung-expo/?lang=ko" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-ocean-500 px-6 py-3 font-semibold text-white hover:bg-ocean-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
                </svg>
                회사소개서 보기 (전체 화면)
              </a>
              <a href="https://seopung.co.kr/" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-semibold text-white/90 hover:bg-white/10">
                홈페이지 방문 &rarr;
              </a>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-2 md:mt-0">
            {['HACCP 인증', 'ASC·MSC 인증', 'AI X-ray 검사', '134+ OEM 품목'].map(item => (
              <span key={item} className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm text-white/80">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 text-ocean-400"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                {item}
              </span>
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
                <div><label className="mb-1 block text-sm text-gray-500">회사명 *</label><input type="text" required className={inputCls} placeholder="회사명" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} /></div>
                <div><label className="mb-1 block text-sm text-gray-500">사업자번호</label><input type="text" className={inputCls} placeholder="000-00-00000" value={formData.businessNumber} onChange={e => setFormData({...formData, businessNumber: e.target.value})} /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1 block text-sm text-gray-500">담당자명 *</label><input type="text" required className={inputCls} placeholder="담당자명" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} /></div>
                <div><label className="mb-1 block text-sm text-gray-500">연락처 *</label><input type="tel" required className={inputCls} placeholder="010-0000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
              </div>
              <div><label className="mb-1 block text-sm text-gray-500">이메일 *</label><input type="email" required className={inputCls} placeholder="이메일" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
              <div><label className="mb-1 block text-sm text-gray-500">관심 품목 / 수량 / 요청사항 *</label>
                <textarea required rows={5} className={inputCls} placeholder={"예: 고등어필렛 1kg x 500박스, 삼치필렛 1kg x 300박스\n납품 희망 시기, PB 브랜드 여부 등"} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} /></div>
              <button type="submit" disabled={submitting} className="w-full rounded-xl bg-ocean-500 py-3.5 font-semibold text-white transition-all hover:bg-ocean-600 disabled:opacity-50">
                {submitting ? '요청 처리 중...' : '견적 요청하기'}
              </button>
            </form>
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="https://seopung.co.kr/" target="_blank" rel="noopener noreferrer" className="text-sm text-ocean-500 hover:text-ocean-600">홈페이지 &rarr;</a>
          <span className="text-gray-300">|</span>
          <a href="https://durecoop.github.io/seopung-expo/?lang=ko" target="_blank" rel="noopener noreferrer" className="text-sm text-ocean-500 hover:text-ocean-600">회사소개서 (슬라이드) &rarr;</a>
        </div>
      </div>
      <Footer />
    </main>
  );
}
