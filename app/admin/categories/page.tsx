'use client';

import { useState } from 'react';
import { CATEGORIES, PRODUCTS } from '@/lib/mock-data';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(CATEGORIES.map(c => ({
    ...c, productCount: PRODUCTS.filter(p => p.categorySlug === c.slug).length
  })));
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    alert(`"${newName}" 카테고리가 추가되었습니다. (Supabase 연동 후 실제 저장)`);
    setNewName('');
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">카테고리 관리</h1>

      {/* Add */}
      <div className="mb-6 flex gap-3">
        <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="새 카테고리명"
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-ocean-400 focus:outline-none" />
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
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-800">{cat.name}</td>
                <td className="px-6 py-4 font-[family-name:var(--font-montserrat)] text-sm text-gray-400">{cat.slug}</td>
                <td className="px-6 py-4 text-center font-[family-name:var(--font-montserrat)] text-sm text-gray-600">{cat.productCount}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button className="rounded p-1 text-gray-300 hover:bg-gray-100 hover:text-gray-600">▲</button>
                    <button className="rounded p-1 text-gray-300 hover:bg-gray-100 hover:text-gray-600">▼</button>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-sm text-gray-400 hover:text-red-500">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
