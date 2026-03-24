'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProducts, getCategories, updateProduct, deleteProduct } from '@/lib/db';
import { formatPrice } from '@/lib/types';
import type { Product, Category } from '@/lib/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()]).then(([p, c]) => {
      setProducts(p);
      setCategories(c);
      setLoading(false);
    });
  }, []);

  const filtered = products
    .filter(p => filter === 'all' || p.categorySlug === filter)
    .filter(p => p.name.includes(search) || p.description.includes(search));

  const toggleFeatured = async (p: Product) => {
    await updateProduct(p.id, { isFeatured: !p.isFeatured });
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, isFeatured: !x.isFeatured } : x));
  };

  const handleDelete = async (p: Product) => {
    if (!confirm(`"${p.name}" 상품을 삭제하시겠습니까?`)) return;
    await deleteProduct(p.id);
    setProducts(prev => prev.filter(x => x.id !== p.id));
  };

  if (loading) return <div className="py-20 text-center text-gray-400">로딩 중...</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">상품 관리</h1>
        <Link href="/admin/products/new" className="rounded-lg bg-ocean-500 px-4 py-2 text-sm font-semibold text-white hover:bg-ocean-600">+ 상품 등록</Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="상품 검색..."
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 focus:border-ocean-400 focus:outline-none" />
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 focus:border-ocean-400 focus:outline-none">
          <option value="all">전체 카테고리</option>
          {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <span className="text-sm text-gray-400">{filtered.length}개 상품</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
              <th className="px-6 py-3">상품</th>
              <th className="px-6 py-3">카테고리</th>
              <th className="px-6 py-3 text-right">가격</th>
              <th className="px-6 py-3 text-center">재고</th>
              <th className="px-6 py-3 text-center">인기</th>
              <th className="px-6 py-3 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const cat = categories.find(c => c.slug === p.categorySlug);
              return (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.weight}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cat?.name}</td>
                  <td className="px-6 py-4 text-right font-[family-name:var(--font-montserrat)] text-sm font-semibold text-gray-800">
                    {formatPrice(p.price)}원
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-[family-name:var(--font-montserrat)] text-sm font-semibold ${p.stock <= 5 ? 'text-red-500' : 'text-gray-700'}`}>{p.stock}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => toggleFeatured(p)} className={`rounded px-2 py-0.5 text-xs font-medium ${p.isFeatured ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-400'}`}>
                      {p.isFeatured ? '★ 인기' : '☆'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center space-x-3">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-sm text-ocean-500 hover:text-ocean-600">수정</Link>
                    <button onClick={() => handleDelete(p)} className="text-sm text-red-400 hover:text-red-600">삭제</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
