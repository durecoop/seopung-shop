'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/types';
import type { Product } from '@/lib/types';
import { addToCart } from '@/lib/cart';

export default function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;
  const coupangDiff = product.coupangPrice && product.coupangPrice > product.price
    ? product.coupangPrice - product.price
    : 0;
  const coupangSavePct = product.coupangPrice && product.coupangPrice > product.price
    ? Math.round((1 - product.price / product.coupangPrice) * 100)
    : 0;

  const handleAddCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const href = `/products/${product.categorySlug}/${product.slug}`;

  return (
    <Link href={href}
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-ocean-300 hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {product.images && product.images[0] ? (
          <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-ocean-50 to-warm-50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-12 w-12 text-ocean-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
            </svg>
            <span className="text-xs font-medium text-ocean-400">이미지 준비중</span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {discount > 0 && <span className="rounded-lg bg-coral-500 px-2.5 py-1 text-sm font-bold text-white shadow-sm">{discount}%</span>}
          {product.isNew && <span className="rounded-lg bg-fresh-500 px-2.5 py-1 text-sm font-bold text-white shadow-sm">NEW</span>}
          {product.tags.includes('인기') && <span className="rounded-lg bg-gold-500 px-2.5 py-1 text-sm font-bold text-white shadow-sm">인기</span>}
          {coupangSavePct > 0 && (
            <span className="rounded-lg bg-ocean-600 px-2.5 py-1 text-sm font-bold text-white shadow-sm">
              쿠팡보다 {coupangSavePct}%↓
            </span>
          )}
        </div>

        {/* Add to cart button overlay */}
        <button onClick={handleAddCart}
          className={`absolute bottom-3 left-3 right-3 z-10 rounded-xl py-3.5 text-base font-bold shadow-lg transition-all duration-300 ${
            added
              ? 'translate-y-0 bg-fresh-500 text-white opacity-100'
              : 'translate-y-2 bg-white/95 text-ocean-600 opacity-0 backdrop-blur-sm group-hover:translate-y-0 group-hover:opacity-100 hover:bg-ocean-500 hover:text-white'
          }`}>
          {added ? '✓ 담았습니다' : '장바구니 담기'}
        </button>
      </div>

      <div className="p-5">
        <p className="text-sm font-medium text-gray-500">{product.weight}</p>
        <h3 className="mt-1.5 text-lg font-semibold text-gray-900 line-clamp-2 transition-colors group-hover:text-ocean-600 md:text-xl">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-1 md:text-base">{product.description}</p>

        <div className="mt-3 space-y-1">
          {product.originalPrice && (
            <div className="flex items-baseline gap-2">
              <span className="font-montserrat text-sm text-gray-400 line-through md:text-base">
                {formatPrice(product.originalPrice)}원
              </span>
              {discount > 0 && (
                <span className="text-sm font-bold text-coral-500">{discount}% 할인</span>
              )}
            </div>
          )}
          <div className="flex items-baseline gap-2">
            <span className="font-montserrat text-2xl font-bold text-coral-500 md:text-3xl">
              {formatPrice(product.price)}
            </span>
            <span className="text-base font-semibold text-gray-600">원</span>
          </div>
          {product.coupangPrice && product.coupangPrice > 0 && (
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-ocean-50 px-3 py-1.5">
              <span className="font-montserrat text-xs font-bold text-ocean-600">쿠팡가</span>
              <span className="font-montserrat text-sm text-gray-500 line-through">
                {formatPrice(product.coupangPrice)}원
              </span>
              {coupangDiff > 0 && (
                <span className="ml-auto text-sm font-bold text-ocean-600">
                  {formatPrice(coupangDiff)}원 저렴
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.tags.filter(t => t !== '인기').slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full border border-gray-200 bg-warm-50 px-2.5 py-1 text-sm text-gray-600">{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
