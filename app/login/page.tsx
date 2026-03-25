'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserProfile } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function LoginForm() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400/30";

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, { displayName: name });
        await createUserProfile(user.uid, {
          email,
          name,
          phone,
          role: 'customer',
        });
      }
      router.push(redirectTo);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      const messages: Record<string, string> = {
        'auth/invalid-email': '유효하지 않은 이메일입니다.',
        'auth/user-not-found': '등록되지 않은 이메일입니다.',
        'auth/wrong-password': '비밀번호가 올바르지 않습니다.',
        'auth/invalid-credential': '이메일 또는 비밀번호가 올바르지 않습니다.',
        'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
        'auth/weak-password': '비밀번호는 6자 이상이어야 합니다.',
      };
      setError(messages[code] || '오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white shadow-md ring-1 ring-gray-200">
          <Image src="/images/logo.png" alt="서풍 로고" width={56} height={56} className="h-full w-full object-cover" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">서풍몰</h1>
      </div>
      <div className="mt-8 flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
        <button onClick={() => { setTab('login'); setError(''); }} className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${tab === 'login' ? 'bg-ocean-500 text-white' : 'text-gray-400 hover:text-gray-700'}`}>로그인</button>
        <button onClick={() => { setTab('signup'); setError(''); }} className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${tab === 'signup' ? 'bg-ocean-500 text-white' : 'text-gray-400 hover:text-gray-700'}`}>회원가입</button>
      </div>
      <form className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
        <div className="space-y-4">
          {tab === 'signup' && <div><label className="mb-1 block text-sm text-gray-500">이름</label><input type="text" value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="이름" /></div>}
          <div><label className="mb-1 block text-sm text-gray-500">이메일</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} placeholder="이메일" /></div>
          <div><label className="mb-1 block text-sm text-gray-500">비밀번호</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className={inputCls} placeholder="비밀번호" /></div>
          {tab === 'signup' && <div><label className="mb-1 block text-sm text-gray-500">전화번호</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} placeholder="010-0000-0000" /></div>}
        </div>
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="mt-5 w-full rounded-xl bg-ocean-500 py-3 font-semibold text-white transition-all hover:bg-ocean-600 disabled:opacity-50">
          {loading ? '처리 중...' : tab === 'login' ? '로그인' : '회원가입'}
        </button>
        {tab === 'login' && <div className="mt-4 text-center"><Link href="/order-tracking" className="text-xs text-gray-400 hover:text-gray-600">비회원 주문조회</Link></div>}
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <main className="bg-gray-50 min-h-screen font-[family-name:var(--font-pretendard)]">
      <Navbar />
      <div className="mx-auto max-w-md px-4 pt-28 pb-20">
        <Suspense fallback={<div className="py-20 text-center text-gray-400">로딩 중...</div>}>
          <LoginForm />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
