'use client';

import Link from 'next/link';
import { useState } from 'react';

const NAV_ITEMS = [
  { label: '?ÑÏ≤¥?ÅÌíà', href: '/products' },
  { label: '?âÎèô?òÏÇ∞Î¨?, href: '/products/frozen' },
  { label: 'Î∞Ä?§Ìä∏', href: '/products/mealkit' },
  { label: '?ÅÍ¥ëÍµ¥ÎπÑ', href: '/products/gulbi' },
  { label: '?†Î¨º?∏Ìä∏', href: '/products/gift' },
  { label: 'B2B Í∏∞ÏóÖ', href: '/business' },
];

export default function Navbar({ cartCount = 0 }: { cartCount?: number }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ocean-500 text-sm font-bold text-white">??/div>
          <div>
            <span className="text-lg font-bold text-gray-900">?úÌíçÎ™?/span>
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
          <Link href="/order-tracking" className="hidden text-sm text-gray-400 hover:text-gray-700 sm:block">Ï£ºÎ¨∏Ï°∞Ìöå</Link>
          <a href="https://seopung.co.kr/" target="_blank" rel="noopener noreferrer"
            className="hidden rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:border-ocean-300 hover:text-ocean-600 sm:block">
            ?åÏÇ¨?åÍ∞ú
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
          <Link href="/login" className="hidden rounded-lg bg-ocean-500 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-ocean-600 sm:block">
            Î°úÍ∑∏??
          </Link>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden">
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
            <Link href="/order-tracking" className="block rounded-lg px-3 py-2.5 text-sm text-gray-500">Ï£ºÎ¨∏Ï°∞Ìöå</Link>
            <Link href="/login" className="block rounded-lg px-3 py-2.5 text-sm text-gray-500">Î°úÍ∑∏??/Link>
            <a href="https://seopung.co.kr/" target="_blank" rel="noopener noreferrer"
              className="block rounded-lg px-3 py-2.5 text-sm text-ocean-500">?åÏÇ¨?åÍ∞ú ?àÌéò?¥Ï? &rarr;</a>
          </div>
        </div>
      )}
    </nav>
  );
}
