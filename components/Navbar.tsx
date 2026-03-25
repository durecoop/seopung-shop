'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
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
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

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
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('storage', handleCartUpdate);
      window.removeEventListener('cart-updated', handleCartUpdate);
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await signOut(auth);
    setUserMenuOpen(false);
  };

  const isExpanded = isHome && !scrolled;

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      isExpanded
        ? 'bg-white/0'
        : 'bg-white/95 backdrop-blur-md shadow-md'
    }`}>
      {/* Scroll progress bar */}
      <div
        className="absolute top-0 left-0 h-[2px] z-[60]"
        style={{
          width: `${scrollProgress}%`,
          background: 'linear-gradient(to right, var(--color-ocean-400), var(--color-ocean-500))',
          transition: 'width 50ms linear',
          opacity: scrollProgress > 0 ? 1 : 0,
        }}
      />

      <nav className={`mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8 transition-all duration-500 ${
        isExpanded ? 'py-5' : 'py-2.5'
      }`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[60] focus:rounded-lg focus:bg-ocean-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white">
          본문으로 건너뛰기
        </a>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className={`relative overflow-hidden rounded-full bg-white shadow-lg ring-1 ring-gray-200/50 transition-all duration-500 ${
            isExpanded ? 'h-14 w-14' : 'h-10 w-10'
          }`}>
            <Image src="/images/logo.png" alt="서풍 로고" fill className="scale-[1.6] object-contain" priority />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className={`font-bold text-gray-900 transition-all duration-500 ${
                isExpanded ? 'text-xl' : 'text-lg'
              }`}>서풍몰</span>
              <span className={`font-semibold text-ocean-500 transition-all duration-500 ${
                isExpanded ? 'text-xs' : 'text-[10px]'
              }`}>SHOP</span>
            </div>
            <span className={`text-gray-400 font-medium transition-all duration-500 overflow-hidden ${
              isExpanded ? 'text-[11px] max-h-5 opacity-100' : 'text-[0px] max-h-0 opacity-0'
            }`}>프리미엄 수산물 쇼핑</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-0.5 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}
              className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300
                after:absolute after:bottom-0.5 after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2
                after:bg-ocean-500 after:transition-all after:duration-300 hover:after:w-3/4
                ${pathname?.startsWith(item.href)
                  ? 'text-ocean-600 after:w-3/4'
                  : 'text-gray-500 hover:text-ocean-600'
                }`}>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2.5">
          <Link href="/order-tracking" className="hidden text-sm text-gray-400 transition-colors hover:text-ocean-600 sm:block">주문조회</Link>
          <a href="https://seopung.co.kr/" target="_blank" rel="noopener noreferrer"
            className="hidden rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500 transition-all hover:border-ocean-300 hover:text-ocean-600 sm:block">
            회사소개
          </a>

          {/* Cart */}
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

          {/* User menu / Login */}
          {user ? (
            <div className="relative hidden sm:block" ref={userMenuRef}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:border-ocean-300 hover:text-ocean-600">
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
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-ocean-600">주문 내역</Link>
                  <button onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-red-500">로그아웃</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden rounded-lg bg-ocean-500 px-3.5 py-1.5 text-sm font-medium text-white transition-all hover:bg-ocean-600 sm:block">
              로그인
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg md:hidden"
            aria-label="메뉴 열기"
          >
            <span className={`h-0.5 w-5 rounded bg-gray-600 transition-all duration-300 ${mobileOpen ? 'translate-y-2 rotate-45 !bg-white' : ''}`} />
            <span className={`h-0.5 w-5 rounded bg-gray-600 transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-5 rounded bg-gray-600 transition-all duration-300 ${mobileOpen ? '-translate-y-2 -rotate-45 !bg-white' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Bottom accent line */}
      <div className={`h-[1px] w-full transition-opacity duration-500 ${!isExpanded ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'linear-gradient(to right, transparent, var(--color-ocean-400), transparent)' }} />

      {/* Mobile menu overlay */}
      <div className={`fixed inset-0 z-40 bg-white/98 backdrop-blur-lg transition-all duration-500 md:hidden ${
        mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="flex h-full flex-col items-center justify-center gap-1">
          {NAV_ITEMS.map((item, i) => (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className={`py-3 text-xl font-medium transition-all duration-300 ${
                pathname?.startsWith(item.href) ? 'text-ocean-600' : 'text-gray-700 hover:text-ocean-500'
              }`}
              style={{
                transitionDelay: mobileOpen ? `${i * 50}ms` : '0ms',
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? 'translateY(0)' : 'translateY(16px)',
              }}>
              {item.label}
            </Link>
          ))}
          <hr className="my-3 w-16 border-gray-200" />
          <Link href="/order-tracking" onClick={() => setMobileOpen(false)}
            className="py-2 text-base text-gray-400 transition-all"
            style={{ transitionDelay: mobileOpen ? `${NAV_ITEMS.length * 50}ms` : '0ms', opacity: mobileOpen ? 1 : 0 }}>
            주문조회
          </Link>
          {user ? (
            <>
              <div className="py-1 text-sm text-gray-400"
                style={{ transitionDelay: mobileOpen ? `${(NAV_ITEMS.length + 1) * 50}ms` : '0ms', opacity: mobileOpen ? 1 : 0 }}>
                {user.displayName || user.email}
              </div>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="py-2 text-base text-red-400 transition-all"
                style={{ transitionDelay: mobileOpen ? `${(NAV_ITEMS.length + 2) * 50}ms` : '0ms', opacity: mobileOpen ? 1 : 0 }}>
                로그아웃
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-xl bg-ocean-500 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-ocean-600"
              style={{ transitionDelay: mobileOpen ? `${(NAV_ITEMS.length + 1) * 50}ms` : '0ms', opacity: mobileOpen ? 1 : 0 }}>
              로그인
            </Link>
          )}
          <a href="https://seopung.co.kr/" target="_blank" rel="noopener noreferrer"
            className="mt-2 text-sm text-ocean-400 transition-all"
            style={{ transitionDelay: mobileOpen ? `${(NAV_ITEMS.length + 3) * 50}ms` : '0ms', opacity: mobileOpen ? 1 : 0 }}>
            회사소개 홈페이지 &rarr;
          </a>
        </div>
      </div>
    </header>
  );
}
