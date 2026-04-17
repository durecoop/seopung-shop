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
    name: '', categorySlug: 'frozen', price: '', originalPrice: '', coupangPrice: '', coupangUrl: '',
    weight: '', unit: 'pack',
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

  const inputCls = "w-full rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder:text-gray-300 focus:border-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-400/40";
  const labelCls = "mb-1.5 block text-sm font-semibold text-gray-700";
  const reqCls = "ml-1 text-coral-500";
  const hintCls = "mt-1.5 text-xs text-gray-500";

  // 가격 자동 계산
  const priceNum = Number(form.price) || 0;
  const originalNum = Number(form.originalPrice) || 0;
  const coupangNum = Number(form.coupangPrice) || 0;
  const originalDiscount = originalNum > priceNum && priceNum > 0 ? Math.round((1 - priceNum / originalNum) * 100) : 0;
  const coupangSave = coupangNum > priceNum && priceNum > 0 ? coupangNum - priceNum : 0;
  const coupangSavePct = coupangNum > priceNum && priceNum > 0 ? Math.round((1 - priceNum / coupangNum) * 100) : 0;

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
      coupangPrice: form.coupangPrice ? Number(form.coupangPrice) : undefined,
      coupangUrl: form.coupangUrl || undefined,
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
        <Link href="/admin/products" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800">&larr;</Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">상품 등록</h1>
          <p className="mt-0.5 text-sm text-gray-500">* 표시는 필수 입력 항목입니다</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ocean-100 text-sm font-bold text-ocean-600">1</span>
              <h2 className="text-lg font-bold text-gray-900">기본 정보</h2>
            </div>
            <div className="space-y-4">
              <div><label className={labelCls}>상품명<span className={reqCls}>*</span></label>
                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputCls} placeholder="예: 고등어필렛 1kg" />
                <p className={hintCls}>고객에게 보이는 상품 이름입니다. 중량·개수를 함께 표기하면 좋아요.</p></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={labelCls}>카테고리<span className={reqCls}>*</span></label>
                  <select value={form.categorySlug} onChange={e => setForm({...form, categorySlug: e.target.value})} className={inputCls}>
                    {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select></div>
                <div><label className={labelCls}>중량·규격</label>
                  <input type="text" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} className={inputCls} placeholder="예: 1kg, 500g×2팩" /></div>
              </div>
              <div><label className={labelCls}>짧은 설명</label>
                <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={inputCls} placeholder="목록에 노출되는 한 줄 설명" /></div>
              <div><label className={labelCls}>상세 정보</label>
                <textarea rows={5} value={form.detail} onChange={e => setForm({...form, detail: e.target.value})} className={inputCls} placeholder={"원산지: 국내산\n중량: 1kg\n보관: 냉동 -18°C 이하"} />
                <p className={hintCls}>한 줄에 하나씩 <code className="rounded bg-gray-100 px-1">항목: 값</code> 형식으로 입력하세요.</p></div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ocean-100 text-sm font-bold text-ocean-600">2</span>
              <h2 className="text-lg font-bold text-gray-900">상품 이미지</h2>
            </div>
            <div className="mb-4 rounded-lg border border-gold-200 bg-gold-50/60 p-3 text-sm text-gold-700">
              <p className="font-semibold">깔끔한 이미지가 매출을 결정합니다</p>
              <p className="mt-0.5 text-gold-600">정사각형(1:1), 흰색·밝은 배경, 최소 1000×1000px 권장. 첫 번째 이미지가 대표 이미지입니다.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>이미지 URL 직접 입력</label>
                <div className="flex gap-2">
                  <input type="text" id="urlInput" className={inputCls} placeholder="https://... 이미지 URL" />
                  <button type="button" onClick={() => {
                    const input = document.getElementById('urlInput') as HTMLInputElement;
                    if (input.value.trim()) { setImageUrls(prev => [...prev, input.value.trim()]); input.value = ''; }
                  }} className="shrink-0 rounded-lg bg-ocean-500 px-5 text-sm font-semibold text-white hover:bg-ocean-600">추가</button>
                </div>
              </div>
              <div>
                <label className={labelCls}>파일 업로드 (여러 장 가능)</label>
                <input type="file" accept="image/*" multiple onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-ocean-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-ocean-600 hover:file:bg-ocean-100" />
              </div>
              {/* 미리보기 */}
              {(imagePreviews.length > 0 || imageUrls.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {imageUrls.map((url, i) => (
                    <div key={'url-' + i} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
                      <img src={url} alt="상품 이미지 미리보기" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => removeUrlImage(i)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">✕</button>
                    </div>
                  ))}
                  {imagePreviews.map((src, i) => (
                    <div key={'file-' + i} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
                      <img src={src} alt="상품 이미지 미리보기" className="h-full w-full object-cover" />
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
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ocean-100 text-sm font-bold text-ocean-600">3</span>
              <h2 className="text-lg font-bold text-gray-900">가격 · 재고</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div><label className={labelCls}>판매가 (원)<span className={reqCls}>*</span></label>
                <input type="number" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} className={inputCls} placeholder="15900" />
                <p className={hintCls}>실제 고객이 결제하는 금액</p></div>
              <div><label className={labelCls}>할인 전 가격</label>
                <input type="number" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: e.target.value})} className={inputCls} placeholder="비워두면 할인 없음" />
                {originalDiscount > 0 && <p className="mt-1.5 text-xs font-bold text-coral-500">→ {originalDiscount}% 할인 표시</p>}</div>
              <div><label className={labelCls}>재고<span className={reqCls}>*</span></label>
                <input type="number" required value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className={inputCls} placeholder="50" /></div>
            </div>

            {/* 쿠팡 가격 매칭 블록 — 고객 핵심 요구 */}
            <div className="mt-6 rounded-xl border-2 border-ocean-200 bg-ocean-50/50 p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-md bg-ocean-600 px-2 py-0.5 text-xs font-bold text-white">쿠팡 매칭</span>
                <h3 className="text-base font-bold text-gray-900">쿠팡 가격 비교</h3>
              </div>
              <p className="mb-4 text-sm text-gray-600">쿠팡에서 같은 상품의 판매 가격을 입력하면, 상품 카드에 자동으로 <b>&ldquo;쿠팡보다 N% 저렴&rdquo;</b> 뱃지가 노출됩니다.</p>
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

        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-gray-900">표시 설정</h2>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50">
                <div>
                  <span className="block text-sm font-semibold text-gray-800">인기 상품</span>
                  <span className="block text-xs text-gray-500">홈 &ldquo;인기 상품&rdquo;에 노출</span>
                </div>
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} className="h-5 w-5 rounded border-gray-300 text-ocean-500" />
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50">
                <div>
                  <span className="block text-sm font-semibold text-gray-800">신상품</span>
                  <span className="block text-xs text-gray-500">NEW 뱃지 표시</span>
                </div>
                <input type="checkbox" checked={form.isNew} onChange={e => setForm({...form, isNew: e.target.checked})} className="h-5 w-5 rounded border-gray-300 text-ocean-500" />
              </label>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-base font-bold text-gray-900">태그</h2>
            <input type="text" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className={inputCls} placeholder="HACCP, 인기, 프리미엄" />
            <p className={hintCls}>쉼표(,)로 구분해 여러 개 입력. 상품 카드에 칩으로 노출됩니다.</p>
          </div>
          <div className="space-y-3">
            <button type="submit" disabled={saving || uploading} className="w-full rounded-xl bg-ocean-500 py-4 text-base font-bold text-white shadow-lg shadow-ocean-500/20 transition-all hover:bg-ocean-600 disabled:bg-gray-300">
              {saving ? '등록 중...' : uploading ? '이미지 업로드 중...' : '상품 등록'}
            </button>
            <Link href="/admin/products" className="block w-full rounded-xl border border-gray-200 py-3 text-center text-sm font-semibold text-gray-600 hover:bg-gray-50">취소</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
