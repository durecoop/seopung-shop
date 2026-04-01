'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Sidebar from '@/components/admin/Sidebar';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '@/lib/db';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<'loading' | 'unauthorized' | 'authorized'>('loading');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAuthState('unauthorized');
        return;
      }
      try {
        const profile = await getUserProfile(user.uid);
        if (profile && profile.role === 'admin') {
          setAuthState('authorized');
        } else {
          setAuthState('unauthorized');
        }
      } catch {
        setAuthState('unauthorized');
      }
    });
    return () => unsubscribe();
  }, []);

  if (authState === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-ocean-500" />
          <p className="text-sm text-gray-500">권한을 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (authState === 'unauthorized') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mb-2 text-xl font-bold text-gray-900">접근 권한이 없습니다</h1>
          <p className="mb-6 text-sm text-gray-500">관리자 계정으로 로그인해주세요.</p>
          <Link href="/login" className="inline-block rounded-lg bg-ocean-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-ocean-600">
            로그인
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-[family-name:var(--font-pretendard)]">
      <Sidebar />
      <div className="pl-0 md:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-4 md:px-8 backdrop-blur-sm">
          <button type="button" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden" onClick={() => {
            const sidebar = document.querySelector('aside');
            if (sidebar) {
              sidebar.classList.toggle('hidden');
              sidebar.classList.toggle('flex');
            }
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">관리자</span>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-gray-200">
              <Image src="/images/logo.png" alt="서풍" width={32} height={32} className="h-full w-full object-cover" />
            </div>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
