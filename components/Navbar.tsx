'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { getCartCount } from '@/lib/cart';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';

const NAV_ITEMS = [
  { label: '전체상품', href: '/products' },
  { label: '냉동어류', href: '/products/frozen-fish' },
  { label: '어패·갑각류', href: '/products/seafood' },
  { label: '건어물', href: '/products/dried' },
  { label: '굴비·선물세트', href: '/products/gift-set' },
  { label: 'B2B 기업', href: '/business' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCartCount(getCartCount());

    const handleCartUpdate = () => setCartCount(getCartCount());
    window.addEventListener('storage', handleCartUpdate);
    window.addEventListener('cart-updated', handleCartUpdate);

    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));

    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('storage', handleCartUpdate);
      window.removeEventListener('cart-updated', handleCartUpdate);
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUserMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[60] focus:rounded-lg focus:bg-ocean-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white">
        본문으로 건너뛰기
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-gray-200">
            <Image src="/images/logo.png" alt="서풍 로고" width={36} height={36} className="h-full w-full object-cover" />
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900">서풍몰</span>
            <span className="ml-1.5 text-[10px] font-medium text-ocean-500">SHOP</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-ocean-600">
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link href="/order-tracking" className="hidden text-sm text-gray-400 hover:text-gray-700 sm:block">주문조회</Link>
          <a href="https://seopung.co.kr/" target="_blank" rel="noopener noreferrer"
            className="hidden rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:border-ocean-300 hover:text-ocean-600 sm:block">
            회사소개
          </a>
          <Link href="/cart" className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-ocean-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-ocean-500 font-montserrat text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="relative hidden sm:block" ref={userMenuRef}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-ocean-300 hover:text-ocean-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                {user.displayName || user.email?.split('@')[0] || '회원'}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                  <div className="border-b border-gray-100 px-4 py-2">
                    <p className="text-xs text-gray-400">로그인 계정</p>
                    <p className="truncate text-sm font-medium text-gray-700">{user.email}</p>
                  </div>
                  <Link href="/order-tracking" onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-ocean-600">주문조회</Link>
                  <button onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-red-500">로그아웃</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden rounded-lg bg-ocean-500 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-ocean-600 sm:block">
              로그인
            </Link>
          )}

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg p-3 text-gray-500 hover:bg-gray-100 md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-ocean-600">
                {item.label}
              </Link>
            ))}
            <hr className="border-gray-100" />
            <Link href="/order-tracking" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-gray-500">주문조회</Link>
            {user ? (
              <>
                <div className="px-3 py-2 text-xs text-gray-400">{user.displayName || user.email}</div>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-red-500">로그아웃</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-gray-500">로그인</Link>
            )}
            <a href="https://seopung.co.kr/" target="_blank" rel="noopener noreferrer"
              className="block rounded-lg px-3 py-2.5 text-sm text-ocean-500">회사소개 홈페이지 &rarr;</a>
          </div>
        </div>
      )}
    </nav>
  );
}
