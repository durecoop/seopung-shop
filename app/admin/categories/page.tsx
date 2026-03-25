'use client';

import { useState, useEffect } from 'react';
import { getCategories, addCategory, updateCategory, deleteCategory, getProducts } from '@/lib/db';
import type { Category, Product } from '@/lib/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<(Category & { productCount: number })[]>([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
      setCategories(cats.map(c => ({
        ...c,
        productCount: prods.filter((p: Product) => p.categorySlug === c.slug).length,
      })));
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const slug = newName.trim().toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/(^-|-$)/g, '');
    const maxSort = categories.reduce((m, c) => Math.max(m, c.sortOrder ?? 0), 0);
    await addCategory({
      name: newName.trim(),
      slug,
      description: '',
      imageUrl: '',
      sortOrder: maxSort + 1,
      isActive: true,
    });
    setNewName('');
    await fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await deleteCategory(id);
    await fetchData();
  };

  const handleSort = async (index: number, direction: 'up' | 'down') => {
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= categories.length) return;
    const a = categories[index];
    const b = categories[swapIndex];
    await Promise.all([
      updateCategory(a.id, { sortOrder: b.sortOrder }),
      updateCategory(b.id, { sortOrder: a.sortOrder }),
    ]);
    await fetchData();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-gray-400">불러오는 중...</div>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">카테고리 관리</h1>

      {/* Add */}
      <div className="mb-6 flex gap-3">
        <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="새 카테고리명"
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-ocean-400 focus:outline-none"
          onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }} />
        <button onClick={handleAdd} className="rounded-lg bg-ocean-500 px-4 py-2 text-sm font-semibold text-white hover:bg-ocean-600">추가</button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
              <th className="px-6 py-3">카테고리명</th>
              <th className="px-6 py-3">슬러그</th>
              <th className="px-6 py-3 text-center">상품 수</th>
              <th className="px-6 py-3 text-center">정렬</th>
              <th className="px-6 py-3 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, idx) => (
              <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-800">{cat.name}</td>
                <td className="px-6 py-4 font-[family-name:var(--font-montserrat)] text-sm text-gray-400">{cat.slug}</td>
                <td className="px-6 py-4 text-center font-[family-name:var(--font-montserrat)] text-sm text-gray-600">{cat.productCount}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => handleSort(idx, 'up')} className="rounded p-1 text-gray-300 hover:bg-gray-100 hover:text-gray-600">&#9650;</button>
                    <button onClick={() => handleSort(idx, 'down')} className="rounded p-1 text-gray-300 hover:bg-gray-100 hover:text-gray-600">&#9660;</button>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => handleDelete(cat.id)} className="text-sm text-gray-400 hover:text-red-500">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
