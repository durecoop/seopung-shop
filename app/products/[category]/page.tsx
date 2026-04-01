'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getProducts, getCategories } from '@/lib/db';
import type { Product, Category } from '@/lib/types';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(category), getCategories()]).then(([p, c]) => {
      setProducts(p);
      setCategories(c);
      setLoading(false);
    });
  }, [category]);

  const cat = categories.find(c => c.slug === category);

  return (
    <main className="bg-white font-[family-name:var(--font-pretendard)]">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-20 lg:px-8">
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
          <Link href="/products" className="hover:text-gray-700">전체상품</Link><span>/</span>
          <span className="text-gray-700">{cat?.name || category}</span>
        </div>
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{cat?.name || category}</h1>
          {cat && <p className="mt-2 text-gray-500">{cat.description}</p>}
          <p className="mt-1 text-sm text-gray-400">{products.length}개의 상품</p>
        </div>
        <div className="mb-8 flex flex-wrap gap-2">
          <Link href="/products" className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-500 hover:border-ocean-400">전체</Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/products/${c.slug}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${c.slug === category ? 'bg-ocean-500 text-white' : 'border border-gray-200 text-gray-500 hover:border-ocean-400'}`}>{c.name}</Link>
          ))}
        </div>
        {loading ? (
          <div className="py-20 text-center text-gray-400">로딩 중...</div>
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
