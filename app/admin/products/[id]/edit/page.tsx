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
  const [form, setForm] = useState({ name: '', categorySlug: '', price: '', originalPrice: '', coupangPrice: '', coupangUrl: '', weight: '', unit: 'pack', stock: '', description: '', detail: '', tags: '', isFeatured: false, isNew: false });
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
          originalPrice: p.originalPrice ? String(p.originalPrice) : '',
          coupangPrice: p.coupangPrice ? String(p.coupangPrice) : '',
          coupangUrl: p.coupangUrl || '',
          weight: p.weight,
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

  const inputCls = "w-full rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder:text-gray-300 focus:border-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-400/40";
  const labelCls = "mb-1.5 block text-sm font-semibold text-gray-700";

  const priceNum = Number(form.price) || 0;
  const coupangNum = Number(form.coupangPrice) || 0;
  const coupangSave = coupangNum > priceNum && priceNum > 0 ? coupangNum - priceNum : 0;
  const coupangSavePct = coupangNum > priceNum && priceNum > 0 ? Math.round((1 - priceNum / coupangNum) * 100) : 0;

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
      coupangPrice: form.coupangPrice ? Number(form.coupangPrice) : undefined,
      coupangUrl: form.coupangUrl || undefined,
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
                          <img src={url} alt="상품 이미지 미리보기" className="h-full w-full object-cover" />
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
                        <img src={url} alt="상품 이미지 미리보기" className="h-full w-full object-cover" />
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
                      <img src={src} alt="상품 이미지 미리보기" className="h-full w-full object-cover" />
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
            <h2 className="mb-4 text-lg font-bold text-gray-900">가격 · 재고</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div><label className={labelCls}>판매가 (원)</label><input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className={inputCls} /></div>
              <div><label className={labelCls}>할인 전 가격</label><input type="number" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})} className={inputCls} /></div>
              <div><label className={labelCls}>재고</label><input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className={inputCls} /></div>
            </div>

            <div className="mt-6 rounded-xl border-2 border-ocean-200 bg-ocean-50/50 p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-md bg-ocean-600 px-2 py-0.5 text-xs font-bold text-white">쿠팡 매칭</span>
                <h3 className="text-base font-bold text-gray-900">쿠팡 가격 비교</h3>
              </div>
              <p className="mb-4 text-sm text-gray-600">쿠팡에서 같은 상품의 판매 가격을 입력하면, 상품 카드에 자동으로 &ldquo;쿠팡보다 N% 저렴&rdquo; 뱃지가 노출됩니다.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={labelCls}>쿠팡 판매가 (원)</label>
                  <input type="number" value={form.coupangPrice} onChange={e => setForm({...form, coupangPrice: e.target.value})} className={inputCls} placeholder="예: 19900" />
                </div>
                <div><label className={labelCls}>쿠팡 상품 URL (선택)</label>
                  <input type="url" value={form.coupangUrl} onChange={e => setForm({...form, coupangUrl: e.target.value})} className={inputCls} placeholder="https://www.coupang.com/vp/..." />
                </div>
              </div>
              {coupangSave > 0 && (
                <div className="mt-4 flex items-center justify-between rounded-lg bg-white p-4 ring-1 ring-ocean-200">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ocean-600">자동 계산 결과</p>
                    <p className="mt-0.5 text-sm text-gray-700">상품 카드에 표시될 절약 금액</p>
                  </div>
                  <div className="text-right">
                    <p className="font-montserrat text-2xl font-bold text-ocean-600">{coupangSave.toLocaleString()}원</p>
                    <p className="text-sm font-bold text-coral-500">쿠팡보다 {coupangSavePct}% 저렴</p>
                  </div>
                </div>
              )}
              {coupangNum > 0 && coupangNum <= priceNum && (
                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">⚠ 쿠팡가가 판매가보다 낮거나 같습니다. 가격을 재확인해주세요.</p>
              )}
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
