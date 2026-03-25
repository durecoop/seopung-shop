'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProductById, updateProduct, deleteProduct, getCategories, uploadProductImage } from '@/lib/db';
import type { Product, Category } from '@/lib/types';

export default function AdminProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', categorySlug: '', price: '', originalPrice: '', weight: '', unit: 'pack', stock: '', description: '', detail: '', tags: '', isFeatured: false, isNew: false });
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [productSlug, setProductSlug] = useState('');

  useEffect(() => {
    Promise.all([getProductById(id), getCategories()]).then(([p, c]) => {
      setCategories(c);
      if (p) {
        setForm({
          name: p.name, categorySlug: p.categorySlug, price: String(p.price),
          originalPrice: p.originalPrice ? String(p.originalPrice) : '', weight: p.weight,
          unit: p.unit || 'pack', stock: String(p.stock), description: p.description, detail: p.detail,
          tags: p.tags?.join(', ') || '', isFeatured: p.isFeatured, isNew: p.isNew,
        });
        setExistingImages(p.images?.filter(img => img && img !== '') || []);
        setProductSlug(p.slug);
      }
      setLoading(false);
    });
  }, [id]);

  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewFiles(prev => [...prev, ...files]);
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = () => setNewPreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeExisting = async (idx: number) => {
    const updated = existingImages.filter((_, i) => i !== idx);
    setExistingImages(updated);
    // 즉시 DB에 반영
    await updateProduct(id, { images: updated });
  };
  const removeNew = (idx: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== idx));
    setNewPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const removeUrlImage = (idx: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== idx));
  };

  const inputCls = "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:border-ocean-400 focus:outline-none";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // 새 이미지 업로드
    const uploadedUrls: string[] = [...existingImages, ...imageUrls];
    if (newFiles.length > 0) {
      setUploading(true);
      for (const file of newFiles) {
        try {
          const url = await uploadProductImage(file, productSlug || id);
          uploadedUrls.push(url);
        } catch (err) {
          console.error('이미지 업로드 실패:', err);
        }
      }
      setUploading(false);
    }

    await updateProduct(id, {
      name: form.name, categorySlug: form.categorySlug, price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      weight: form.weight, unit: form.unit, stock: Number(form.stock), description: form.description,
      detail: form.detail, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      isFeatured: form.isFeatured, isNew: form.isNew, images: uploadedUrls,
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
            <h2 className="mb-4 text-lg font-semibold text-gray-800">상품 이미지</h2>
            <div className="space-y-4">
              {/* 기존 이미지 */}
              {existingImages.length > 0 && (
                <div>
                  <p className="mb-2 text-sm text-gray-500">등록된 이미지 ({existingImages.length}장) — 클릭하여 삭제</p>
                  <div className="flex flex-wrap gap-3">
                    {existingImages.map((url, i) => (
                      <div key={i} className="group relative">
                        <div className="h-28 w-28 overflow-hidden rounded-xl border-2 border-gray-200 transition-all group-hover:border-red-400">
                          <img src={url} alt="" className="h-full w-full object-cover" />
                        </div>
                        <button type="button" onClick={() => { if (confirm('이 이미지를 삭제하시겠습니까?')) removeExisting(i); }}
                          className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-md transition-transform hover:scale-110">
                          ✕
                        </button>
                        {i === 0 && <span className="absolute bottom-1 left-1 rounded bg-ocean-500 px-1.5 py-0.5 text-[10px] font-medium text-white">대표</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {existingImages.length > 1 && (
                <button type="button" onClick={async () => {
                  if (!confirm('모든 이미지를 삭제하시겠습니까?')) return;
                  setExistingImages([]);
                  await updateProduct(id, { images: [] });
                }}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                  전체 이미지 삭제
                </button>
              )}
              {/* URL 이미지 입력 */}
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
              {imageUrls.length > 0 && (
                <div>
                  <p className="mb-2 text-sm text-gray-500">URL 이미지 ({imageUrls.length}장)</p>
                  <div className="flex flex-wrap gap-2">
                    {imageUrls.map((url, i) => (
                      <div key={'url-' + i} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
                        <img src={url} alt="" className="h-full w-full object-cover" />
                        <button type="button" onClick={() => removeUrlImage(i)}
                          className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* 새 이미지 추가 */}
              <div>
                <label className="mb-1 block text-sm text-gray-500">파일 업로드 (여러 장 가능)</label>
                <input type="file" accept="image/*" multiple onChange={handleNewImages}
                  className="w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-ocean-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-ocean-600 hover:file:bg-ocean-100" />
              </div>
              {newPreviews.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {newPreviews.map((src, i) => (
                    <div key={i} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-ocean-300">
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => removeNew(i)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">✕</button>
                      <span className="absolute bottom-0 left-0 right-0 bg-ocean-500 py-0.5 text-center text-[10px] text-white">NEW</span>
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
            <button type="submit" disabled={saving} className="w-full rounded-xl bg-ocean-500 py-3 font-semibold text-white hover:bg-ocean-600 disabled:bg-gray-300">{saving ? '수정 중...' : '상품 수정'}</button>
            <button type="button" onClick={handleDelete} className="w-full rounded-xl border border-red-200 py-3 text-sm font-medium text-red-500 hover:bg-red-50">상품 삭제</button>
          </div>
        </div>
      </form>
    </div>
  );
}
