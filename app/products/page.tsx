'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getProducts, getCategories } from '@/lib/db';
import type { Product, Category } from '@/lib/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()]).then(([p, c]) => {
      setProducts(p);
      setCategories(c);
      setLoading(false);
    });
  }, []);

  return (
    <main className="bg-white font-[family-name:var(--font-pretendard)]">
      <Navbar cartCount={0} />
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-20 lg:px-8">
        <div className="mb-10">
          <p className="mb-2 font-[family-name:var(--font-montserrat)] text-sm font-semibold uppercase tracking-[0.25em] text-ocean-500">All Products</p>
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">전체 상품</h1>
          <p className="mt-2 text-gray-500">{products.length}개의 상품</p>
        </div>
        <div className="mb-8 flex flex-wrap gap-2">
          <Link href="/products" className="rounded-full bg-ocean-500 px-4 py-1.5 text-sm font-medium text-white">전체</Link>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/products/${cat.slug}`}
              className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-500 hover:border-ocean-400 hover:text-ocean-600">{cat.name}</Link>
          ))}
        </div>
        {loading ? (
          <div className="py-20 text-center text-gray-400">상품 로딩 중...</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
