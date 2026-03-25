'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { addProduct, getCategories, uploadProductImage } from '@/lib/db';
import type { Category } from '@/lib/types';

export default function AdminProductNewPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', categorySlug: 'frozen', price: '', originalPrice: '', weight: '', unit: 'pack',
    stock: '', description: '', detail: '', tags: '', isFeatured: false, isNew: false,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { getCategories().then(setCategories); }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files]);
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = () => setImagePreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (idx: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const removeUrlImage = (idx: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== idx));
  };

  const inputCls = "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400/30";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.name.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-').replace(/-+/g, '-');

    // 이미지 업로드
    const uploadedUrls: string[] = [...imageUrls];
    if (imageFiles.length > 0) {
      setUploading(true);
      for (const file of imageFiles) {
        try {
          const url = await uploadProductImage(file, slug);
          uploadedUrls.push(url);
        } catch (err) {
          console.error('이미지 업로드 실패:', err);
        }
      }
      setUploading(false);
    }

    await addProduct({
      categorySlug: form.categorySlug,
      name: form.name,
      slug,
      description: form.description,
      detail: form.detail,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      unit: form.unit,
      weight: form.weight,
      stock: Number(form.stock),
      images: uploadedUrls,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      isFeatured: form.isFeatured,
      isNew: form.isNew,
      isActive: true,
      sortOrder: 0,
    });
    alert('상품이 등록되었습니다!');
    router.push('/admin/products');
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/products" className="text-gray-400 hover:text-gray-600">&larr;</Link>
        <h1 className="text-2xl font-bold text-gray-900">상품 등록</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">기본 정보</h2>
            <div className="space-y-4">
              <div><label className="mb-1 block text-sm text-gray-500">상품명 *</label>
                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputCls} placeholder="예: 고등어필렛 1kg" /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1 block text-sm text-gray-500">카테고리 *</label>
                  <select value={form.categorySlug} onChange={e => setForm({...form, categorySlug: e.target.value})} className={inputCls}>
                    {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select></div>
                <div><label className="mb-1 block text-sm text-gray-500">중량</label>
                  <input type="text" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} className={inputCls} placeholder="1kg" /></div>
              </div>
              <div><label className="mb-1 block text-sm text-gray-500">짧은 설명</label>
                <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={inputCls} placeholder="상품 한 줄 설명" /></div>
              <div><label className="mb-1 block text-sm text-gray-500">상세 정보</label>
                <textarea rows={5} value={form.detail} onChange={e => setForm({...form, detail: e.target.value})} className={inputCls} placeholder={"원산지: 국내산\n중량: 1kg\n보관: 냉동 -18°C 이하"} /></div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">상품 이미지</h2>
            <div className="space-y-4">
              {/* 기존 URL 이미지 입력 */}
              <div>
                <label className="mb-1 block text-sm text-gray-500">이미지 URL 직접 입력</label>
                <div className="flex gap-2">
                  <input type="text" id="urlInput" className={inputCls} placeholder="https://... 이미지 URL" />
                  <button type="button" onClick={() => {
                    const input = document.getElementById('urlInput') as HTMLInputElement;
                    if (input.value.trim()) { setImageUrls(prev => [...prev, input.value.trim()]); input.value = ''; }
                  }} className="shrink-0 rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 hover:bg-gray-200">추가</button>
                </div>
              </div>
              {/* 파일 업로드 */}
              <div>
                <label className="mb-1 block text-sm text-gray-500">파일 업로드 (여러 장 가능)</label>
                <input type="file" accept="image/*" multiple onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-ocean-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-ocean-600 hover:file:bg-ocean-100" />
              </div>
              {/* 미리보기 */}
              {(imagePreviews.length > 0 || imageUrls.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {imageUrls.map((url, i) => (
                    <div key={'url-' + i} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => removeUrlImage(i)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">✕</button>
                    </div>
                  ))}
                  {imagePreviews.map((src, i) => (
                    <div key={'file-' + i} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">✕</button>
                    </div>
                  ))}
                </div>
              )}
              {uploading && <p className="text-sm text-ocean-500">이미지 업로드 중...</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">가격·재고</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div><label className="mb-1 block text-sm text-gray-500">판매가 (원) *</label>
                <input type="number" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} className={inputCls} placeholder="15900" /></div>
              <div><label className="mb-1 block text-sm text-gray-500">할인 전 가격</label>
                <input type="number" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})} className={inputCls} placeholder="비워두면 할인 없음" /></div>
              <div><label className="mb-1 block text-sm text-gray-500">재고 *</label>
                <input type="number" required value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className={inputCls} placeholder="50" /></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">표시 설정</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between"><span className="text-sm text-gray-600">인기 상품</span>
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} className="h-5 w-5 rounded border-gray-300 text-ocean-500" /></label>
              <label className="flex items-center justify-between"><span className="text-sm text-gray-600">신상품 표시</span>
                <input type="checkbox" checked={form.isNew} onChange={e => setForm({...form, isNew: e.target.checked})} className="h-5 w-5 rounded border-gray-300 text-ocean-500" /></label>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">태그</h2>
            <input type="text" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className={inputCls} placeholder="HACCP, 인기, 프리미엄" />
          </div>
          <div className="space-y-3">
            <button type="submit" disabled={saving} className="w-full rounded-xl bg-ocean-500 py-3 font-semibold text-white hover:bg-ocean-600 disabled:bg-gray-300">
              {saving ? '등록 중...' : '상품 등록'}
            </button>
            <Link href="/admin/products" className="block w-full rounded-xl border border-gray-200 py-3 text-center text-sm font-medium text-gray-500 hover:bg-gray-50">취소</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
