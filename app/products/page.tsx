'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getProducts, getCategories } from '@/lib/db';
import type { Product, Category } from '@/lib/types';

function ProductsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(queryParam);

  useEffect(() => {
    document.title = queryParam ? `"${queryParam}" 검색 결과 | 서풍몰` : '전체상품 | 서풍몰';
    Promise.all([getProducts(), getCategories()]).then(([p, c]) => {
      setProducts(p);
      setCategories(c);
      setLoading(false);
    });
  }, [queryParam]);

  // URL의 q가 바뀌면 input도 동기화
  useEffect(() => { setSearch(queryParam); }, [queryParam]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(p => {
      const hay = [
        p.name,
        p.description,
        p.detail,
        p.categorySlug,
        ...(p.tags || []),
      ].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [products, search]);

  // 카테고리별 그룹화 (검색어 없을 때만 섹션으로 묶어 보여줌)
  const grouped = useMemo(() => {
    const byCat = new Map<string, Product[]>();
    for (const p of filtered) {
      const key = p.categorySlug || '__uncategorized__';
      if (!byCat.has(key)) byCat.set(key, []);
      byCat.get(key)!.push(p);
    }
    // categories의 sortOrder 를 따라 정렬, 카테고리 없는 상품은 마지막
    const ordered: { slug: string; name: string; items: Product[] }[] = [];
    for (const cat of categories) {
      const items = byCat.get(cat.slug);
      if (items && items.length > 0) {
        ordered.push({ slug: cat.slug, name: cat.name, items });
        byCat.delete(cat.slug);
      }
    }
    for (const [slug, items] of byCat) {
      ordered.push({ slug, name: slug === '__uncategorized__' ? '기타' : slug, items });
    }
    return ordered;
  }, [filtered, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = search.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set('q', trimmed);
    router.replace(`/products${params.toString() ? '?' + params.toString() : ''}`);
  };

  const handleClear = () => {
    setSearch('');
    router.replace('/products');
  };

  return (
    <main className="bg-white font-[family-name:var(--font-pretendard)]">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-20 lg:px-8">
        <div className="mb-6">
          <p className="mb-2 font-[family-name:var(--font-montserrat)] text-sm font-semibold uppercase tracking-[0.25em] text-ocean-500">
            {queryParam ? 'Search Results' : 'All Products'}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            {queryParam ? <>&ldquo;{queryParam}&rdquo; 검색 결과</> : '전체 상품'}
          </h1>
          <p className="mt-2 text-gray-500">{filtered.length}개의 상품{queryParam && products.length !== filtered.length ? ` (전체 ${products.length}개 중)` : ''}</p>
        </div>

        {/* 검색 박스 */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="상품명, 분류, 태그로 검색 (예: 굴비, 오징어, 냉동)"
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-24 text-base text-gray-800 placeholder:text-gray-300 focus:border-ocean-400 focus:outline-none focus:ring-2 focus:ring-ocean-400/20"
            />
            {search && (
              <button type="button" onClick={handleClear}
                className="absolute right-20 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="검색어 지우기">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-ocean-500 px-4 py-2 text-sm font-semibold text-white hover:bg-ocean-600">
              검색
            </button>
          </div>
        </form>

        <div className="mb-8 flex flex-wrap gap-2">
          <Link href="/products" className={`rounded-full px-4 py-1.5 text-sm font-medium ${!queryParam ? 'bg-ocean-500 text-white' : 'border border-gray-200 text-gray-500 hover:border-ocean-400'}`}>전체</Link>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/products/${cat.slug}`}
              className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-500 hover:border-ocean-400 hover:text-ocean-600">{cat.name}</Link>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400">상품 로딩 중...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="mx-auto mb-4 h-16 w-16 text-gray-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <p className="text-base text-gray-500">&ldquo;{search}&rdquo;에 해당하는 상품이 없습니다.</p>
            <button onClick={handleClear} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-ocean-500 hover:text-ocean-600">
              전체 상품 보기 →
            </button>
          </div>
        ) : queryParam ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="space-y-12">
            {grouped.map((group) => (
              <section key={group.slug} id={`cat-${group.slug}`}>
                <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-gray-100 pb-3">
                  <h2 className="text-xl font-bold text-gray-900 md:text-2xl">{group.name}</h2>
                  <Link href={`/products/${group.slug}`} className="text-sm font-medium text-ocean-500 hover:text-ocean-600">
                    {group.name} 더보기 →
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                  {group.items.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-white"><p className="text-gray-400">로딩 중...</p></div>}>
      <ProductsPageInner />
    </Suspense>
  );
}
