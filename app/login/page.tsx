'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400/30";

  return (
    <main className="bg-gray-50 min-h-screen font-[family-name:var(--font-pretendard)]">
      <Navbar />
      <div className="mx-auto max-w-md px-4 pt-28 pb-20">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ocean-500 text-lg font-bold text-white">서</div>
          <h1 className="text-2xl font-bold text-gray-900">서풍몰</h1>
        </div>
        <div className="mt-8 flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
          <button onClick={() => setTab('login')} className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${tab === 'login' ? 'bg-ocean-500 text-white' : 'text-gray-400 hover:text-gray-700'}`}>로그인</button>
          <button onClick={() => setTab('signup')} className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${tab === 'signup' ? 'bg-ocean-500 text-white' : 'text-gray-400 hover:text-gray-700'}`}>회원가입</button>
        </div>
        <form className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            {tab === 'signup' && <div><label className="mb-1 block text-sm text-gray-500">이름</label><input type="text" className={inputCls} placeholder="이름" /></div>}
            <div><label className="mb-1 block text-sm text-gray-500">이메일</label><input type="email" className={inputCls} placeholder="이메일" /></div>
            <div><label className="mb-1 block text-sm text-gray-500">비밀번호</label><input type="password" className={inputCls} placeholder="비밀번호" /></div>
            {tab === 'signup' && <div><label className="mb-1 block text-sm text-gray-500">전화번호</label><input type="tel" className={inputCls} placeholder="010-0000-0000" /></div>}
          </div>
          <button type="button" className="mt-5 w-full rounded-xl bg-ocean-500 py-3 font-semibold text-white transition-all hover:bg-ocean-600">
            {tab === 'login' ? '로그인' : '회원가입'}
          </button>
          {tab === 'login' && <div className="mt-4 text-center"><Link href="/order-tracking" className="text-xs text-gray-400 hover:text-gray-600">비회원 주문조회</Link></div>}
        </form>
      </div>
      <Footer />
    </main>
  );
}
