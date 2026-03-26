'use client';

import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { createUserProfile } from '@/lib/db';
import Link from 'next/link';

export default function AdminSetupPage() {
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('관리자');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = '관리자 초기 설정 | 서풍몰';
    // Check if any admin user exists
    const checkAdmin = async () => {
      try {
        const q = query(collection(db, 'shop_users'), where('role', '==', 'admin'));
        const snap = await getDocs(q);
        setHasAdmin(!snap.empty);
      } catch {
        setHasAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');

    try {
      // Try to create new account
      let uid: string;
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, { displayName: name });
        uid = user.uid;
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          // Account exists, sign in instead
          const { user } = await signInWithEmailAndPassword(auth, email, password);
          uid = user.uid;
        } else {
          throw err;
        }
      }

      // Create/update user profile with admin role
      await createUserProfile(uid, {
        email,
        name,
        phone: '',
        role: 'admin',
      });

      setDone(true);
    } catch (err: any) {
      const messages: Record<string, string> = {
        'auth/invalid-email': '유효하지 않은 이메일입니다.',
        'auth/weak-password': '비밀번호는 6자 이상이어야 합니다.',
        'auth/wrong-password': '비밀번호가 올바르지 않습니다.',
        'auth/invalid-credential': '이메일 또는 비밀번호가 올바르지 않습니다.',
      };
      setError(messages[err.code] || `오류: ${err.message}`);
    }
    setLoading(false);
  };

  const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400/30";

  if (hasAdmin === null) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-gray-400">확인 중...</p></div>;
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8 text-emerald-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">관리자 설정 완료</h1>
          <p className="mt-2 text-sm text-gray-500">아래 계정으로 관리자 페이지에 로그인하세요.</p>
          <div className="mt-4 rounded-xl bg-gray-50 p-4 text-left text-sm">
            <p className="text-gray-500">이메일: <span className="font-semibold text-gray-800">{email}</span></p>
            <p className="mt-1 text-gray-500">비밀번호: <span className="font-semibold text-gray-800">설정하신 비밀번호</span></p>
          </div>
          <p className="mt-4 text-xs text-gray-400">이 계정은 홈페이지(seopung.co.kr/admin)와<br/>쇼핑몰(shop.seopung.co.kr/admin) 모두 사용 가능합니다.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/admin" className="flex-1 rounded-xl bg-ocean-500 py-3 text-center text-sm font-semibold text-white hover:bg-ocean-600">
              관리자 페이지로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">관리자 초기 설정</h1>
          <p className="mt-2 text-sm text-gray-500">
            {hasAdmin
              ? '관리자 계정을 추가합니다. 기존 계정이 있으면 권한을 부여합니다.'
              : '첫 관리자 계정을 생성합니다.'}
          </p>
        </div>

        <form onSubmit={handleSetup} className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-500">관리자 이름</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="관리자" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-500">이메일 *</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputCls} placeholder="admin@seopung.co.kr" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-500">비밀번호 * (6자 이상)</label>
              <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className={inputCls} placeholder="비밀번호" />
            </div>
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="mt-5 w-full rounded-xl bg-ocean-500 py-3 font-semibold text-white transition-all hover:bg-ocean-600 disabled:opacity-50">
            {loading ? '설정 중...' : hasAdmin ? '관리자 추가' : '관리자 생성'}
          </button>

          <div className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
            <p className="font-semibold">이 계정으로 두 곳 모두 로그인할 수 있습니다:</p>
            <p className="mt-1">- 홈페이지 관리자: seopung.co.kr/admin</p>
            <p>- 쇼핑몰 관리자: shop.seopung.co.kr/admin</p>
          </div>
        </form>
      </div>
    </div>
  );
}
