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
          <div className="flex h-full items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor" className="h-16 w-16 text-gray-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
            </svg>
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {discount > 0 && <span className="rounded-lg bg-coral-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">{discount}%</span>}
          {product.isNew && <span className="rounded-lg bg-fresh-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">NEW</span>}
          {product.tags.includes('인기') && <span className="rounded-lg bg-gold-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">인기</span>}
        </div>

        {/* Add to cart button overlay */}
        <button onClick={handleAddCart}
          className={`absolute bottom-3 left-3 right-3 z-10 rounded-xl py-3 text-base font-semibold transition-all duration-300 ${
            added
              ? 'translate-y-0 bg-fresh-500 text-white opacity-100'
              : 'translate-y-2 bg-white/90 text-ocean-600 opacity-0 shadow-lg backdrop-blur-sm group-hover:translate-y-0 group-hover:opacity-100 hover:bg-ocean-500 hover:text-white'
          }`}>
          {added ? '담았습니다' : '장바구니 담기'}
        </button>
      </div>

      <div className="p-5">
        <p className="text-sm text-gray-500">{product.weight}</p>
        <h3 className="mt-1.5 text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-ocean-600 transition-colors md:text-lg">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-1">{product.description}</p>

        <div className="mt-3 flex items-baseline gap-2">
          {product.originalPrice && (
            <span className="font-montserrat text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
          )}
          <span className="font-montserrat text-xl font-bold text-coral-500">{formatPrice(product.price)}</span>
          <span className="text-sm text-gray-500">원</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.tags.filter(t => t !== '인기').slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full border border-gray-200 bg-warm-50 px-2.5 py-0.5 text-xs text-gray-600">{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
