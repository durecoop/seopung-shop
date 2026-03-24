'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProductById, updateProduct, deleteProduct, getCategories } from '@/lib/db';
import type { Product, Category } from '@/lib/types';

export default function AdminProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', categorySlug: '', price: '', originalPrice: '', weight: '', stock: '', description: '', detail: '', tags: '', isFeatured: false, isNew: false });

  useEffect(() => {
    Promise.all([getProductById(id), getCategories()]).then(([p, c]) => {
      setCategories(c);
      if (p) setForm({
        name: p.name, categorySlug: p.categorySlug, price: String(p.price),
        originalPrice: p.originalPrice ? String(p.originalPrice) : '', weight: p.weight,
        stock: String(p.stock), description: p.description, detail: p.detail,
        tags: p.tags?.join(', ') || '', isFeatured: p.isFeatured, isNew: p.isNew,
      });
      setLoading(false);
    });
  }, [id]);

  const inputCls = "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:border-ocean-400 focus:outline-none";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProduct(id, {
      name: form.name, categorySlug: form.categorySlug, price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      weight: form.weight, stock: Number(form.stock), description: form.description,
      detail: form.detail, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      isFeatured: form.isFeatured, isNew: form.isNew,
    });
    alert('상품이 수정되었습니다!');
    router.push('/admin/products');
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await deleteProduct(id);
    router.push('/admin/products');
  };

  if (loading) return <div className="py-20 text-center text-gray-400">로딩 중...</div>;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/products" className="text-gray-400 hover:text-gray-600">&larr;</Link>
        <h1 className="text-2xl font-bold text-gray-900">상품 수정</h1>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">기본 정보</h2>
            <div className="space-y-4">
              <div><label className="mb-1 block text-sm text-gray-500">상품명</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputCls} /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1 block text-sm text-gray-500">카테고리</label>
                  <select value={form.categorySlug} onChange={e => setForm({...form, categorySlug: e.target.value})} className={inputCls}>
                    {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select></div>
                <div><label className="mb-1 block text-sm text-gray-500">중량</label><input type="text" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} className={inputCls} /></div>
              </div>
              <div><label className="mb-1 block text-sm text-gray-500">짧은 설명</label><input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={inputCls} /></div>
              <div><label className="mb-1 block text-sm text-gray-500">상세 정보</label><textarea rows={5} value={form.detail} onChange={e => setForm({...form, detail: e.target.value})} className={inputCls} /></div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">가격·재고</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div><label className="mb-1 block text-sm text-gray-500">판매가</label><input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className={inputCls} /></div>
              <div><label className="mb-1 block text-sm text-gray-500">할인 전 가격</label><input type="number" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})} className={inputCls} /></div>
              <div><label className="mb-1 block text-sm text-gray-500">재고</label><input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className={inputCls} /></div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">표시 설정</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between"><span className="text-sm text-gray-600">인기 상품</span><input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} className="h-5 w-5 rounded border-gray-300 text-ocean-500" /></label>
              <label className="flex items-center justify-between"><span className="text-sm text-gray-600">신상품</span><input type="checkbox" checked={form.isNew} onChange={e => setForm({...form, isNew: e.target.checked})} className="h-5 w-5 rounded border-gray-300 text-ocean-500" /></label>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">태그</h2>
            <input type="text" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className={inputCls} />
          </div>
          <div className="space-y-3">
            <button type="submit" disabled={saving} className="w-full rounded-xl bg-ocean-500 py-3 font-semibold text-white hover:bg-ocean-600 disabled:bg-gray-300">{saving ? '저장 중...' : '변경사항 저장'}</button>
            <button type="button" onClick={handleDelete} className="w-full rounded-xl border border-red-200 py-3 text-sm font-medium text-red-500 hover:bg-red-50">상품 삭제</button>
          </div>
        </div>
      </form>
    </div>
  );
}
