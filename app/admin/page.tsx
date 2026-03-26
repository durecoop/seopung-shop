'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProducts, getOrders, getAnalytics } from '@/lib/db';
import type { DailyStats } from '@/lib/db';
import { formatPrice, ORDER_STATUS_LABELS } from '@/lib/types';
import type { Product, Order } from '@/lib/types';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shopStats, setShopStats] = useState<{ daily: DailyStats[]; total: number; today: number }>({ daily: [], total: 0, today: 0 });
  const [webStats, setWebStats] = useState<{ daily: DailyStats[]; total: number; today: number }>({ daily: [], total: 0, today: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getOrders(), getAnalytics('shop', 30), getAnalytics('web', 30)]).then(([p, o, ss, ws]) => {
      setProducts(p);
      setOrders(o);
      setShopStats(ss);
      setWebStats(ws);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-ocean-500" />
        <p className="text-sm text-gray-400">대시보드 불러오는 중...</p>
      </div>
    </div>
  );

  const today = new Date().toISOString().slice(0, 10);
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(); monthAgo.setDate(monthAgo.getDate() - 30);

  const getOrderDate = (o: Order): Date => {
    if (!o.createdAt) return new Date(0);
    const ts = o.createdAt as any;
    if (ts.toDate) return ts.toDate();
    if (ts.seconds) return new Date(ts.seconds * 1000);
    if (typeof ts === 'string') return new Date(ts);
    return new Date(0);
  };

  const todayOrders = orders.filter(o => getOrderDate(o) >= todayStart);
  const weekOrders = orders.filter(o => getOrderDate(o) >= weekAgo);
  const monthOrders = orders.filter(o => getOrderDate(o) >= monthAgo);

  const todayRevenue = todayOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const weekRevenue = weekOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const monthRevenue = monthOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);

  // Order pipeline counts
  const pendingPayment = orders.filter(o => o.status === 'pending_payment').length;
  const paymentConfirmed = orders.filter(o => o.status === 'payment_confirmed').length;
  const preparing = orders.filter(o => o.status === 'preparing').length;
  const shipped = orders.filter(o => o.status === 'shipped').length;
  const urgentCount = pendingPayment + paymentConfirmed + preparing;

  const lowStock = products.filter(p => p.stock <= 5 && p.isActive);
  const outOfStock = products.filter(p => p.stock === 0 && p.isActive);

  const formatDate = (val: unknown): string => {
    if (!val) return '-';
    if (typeof val === 'string') return val.split('T')[0];
    const ts = val as any;
    if (ts.toDate) return ts.toDate().toISOString().split('T')[0];
    if (ts.seconds) return new Date(ts.seconds * 1000).toISOString().split('T')[0];
    return '-';
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="mt-1 text-sm text-gray-400">{today} 기준</p>
        </div>
        {urgentCount > 0 && (
          <Link href="/admin/orders" className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">{urgentCount}</span>
            처리 필요한 주문
          </Link>
        )}
      </div>

      {/* ── 1. 주문 처리 파이프라인 (가장 중요) ── */}
      <div className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">주문 현황</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link href="/admin/orders" className={`group rounded-2xl border p-5 transition-all hover:shadow-md ${pendingPayment > 0 ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-500">입금대기</span>
              {pendingPayment > 0 && <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />}
            </div>
            <p className={`mt-2 font-[family-name:var(--font-montserrat)] text-3xl font-bold ${pendingPayment > 0 ? 'text-amber-600' : 'text-gray-300'}`}>{pendingPayment}</p>
          </Link>
          <Link href="/admin/orders" className={`group rounded-2xl border p-5 transition-all hover:shadow-md ${paymentConfirmed > 0 ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-blue-500">입금확인</span>
              {paymentConfirmed > 0 && <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />}
            </div>
            <p className={`mt-2 font-[family-name:var(--font-montserrat)] text-3xl font-bold ${paymentConfirmed > 0 ? 'text-blue-600' : 'text-gray-300'}`}>{paymentConfirmed}</p>
          </Link>
          <Link href="/admin/orders" className={`group rounded-2xl border p-5 transition-all hover:shadow-md ${preparing > 0 ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-orange-500">상품준비</span>
              {preparing > 0 && <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />}
            </div>
            <p className={`mt-2 font-[family-name:var(--font-montserrat)] text-3xl font-bold ${preparing > 0 ? 'text-orange-600' : 'text-gray-300'}`}>{preparing}</p>
          </Link>
          <Link href="/admin/orders" className={`group rounded-2xl border p-5 transition-all hover:shadow-md ${shipped > 0 ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 bg-white'}`}>
            <span className="text-xs font-medium text-emerald-500">배송중</span>
            <p className={`mt-2 font-[family-name:var(--font-montserrat)] text-3xl font-bold ${shipped > 0 ? 'text-emerald-600' : 'text-gray-300'}`}>{shipped}</p>
          </Link>
        </div>
      </div>

      {/* ── 2. 매출 요약 ── */}
      <div className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">매출</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-xs font-medium text-gray-400">오늘</p>
            <p className="mt-1 font-[family-name:var(--font-montserrat)] text-2xl font-bold text-gray-900">{formatPrice(todayRevenue)}<span className="ml-1 text-sm font-normal text-gray-400">원</span></p>
            <p className="mt-1 text-xs text-gray-400">{todayOrders.length}건</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-xs font-medium text-gray-400">최근 7일</p>
            <p className="mt-1 font-[family-name:var(--font-montserrat)] text-2xl font-bold text-gray-900">{formatPrice(weekRevenue)}<span className="ml-1 text-sm font-normal text-gray-400">원</span></p>
            <p className="mt-1 text-xs text-gray-400">{weekOrders.length}건</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-xs font-medium text-gray-400">최근 30일</p>
            <p className="mt-1 font-[family-name:var(--font-montserrat)] text-2xl font-bold text-ocean-600">{formatPrice(monthRevenue)}<span className="ml-1 text-sm font-normal text-gray-400">원</span></p>
            <p className="mt-1 text-xs text-gray-400">{monthOrders.length}건 · 평균 {monthOrders.length > 0 ? formatPrice(Math.round(monthRevenue / monthOrders.length)) : 0}원</p>
          </div>
        </div>
      </div>

      {/* ── 3. 방문자 + 상품 요약 ── */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-400">쇼핑몰 오늘 방문</p>
          <p className="mt-1 font-[family-name:var(--font-montserrat)] text-2xl font-bold text-blue-600">{shopStats.today.toLocaleString()}</p>
          <p className="mt-1 text-xs text-gray-400">누적 {shopStats.total.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-400">홈페이지 오늘 방문</p>
          <p className="mt-1 font-[family-name:var(--font-montserrat)] text-2xl font-bold text-emerald-600">{webStats.today.toLocaleString()}</p>
          <p className="mt-1 text-xs text-gray-400">누적 {webStats.total.toLocaleString()}</p>
        </div>
        <Link href="/admin/products" className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-ocean-200 transition-colors">
          <p className="text-xs font-medium text-gray-400">전체 상품</p>
          <p className="mt-1 font-[family-name:var(--font-montserrat)] text-2xl font-bold text-gray-900">{products.filter(p => p.isActive).length}<span className="ml-1 text-sm font-normal text-gray-400">개</span></p>
          <p className="mt-1 text-xs text-gray-400">비활성 {products.filter(p => !p.isActive).length}개</p>
        </Link>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-400">쇼핑몰 최근 7일</p>
          <div className="mt-2 flex items-end gap-0.5" style={{ height: 36 }}>
            {(shopStats.daily.length > 0 ? shopStats.daily.slice(0, 7).reverse() : Array(7).fill({ views: 0 })).map((d, i) => {
              const max = Math.max(...shopStats.daily.map(x => x.views), 1);
              return <div key={i} className="flex-1 rounded-sm bg-blue-400/70" style={{ height: `${Math.max((d.views / max) * 100, 6)}%` }} title={`${d.date || ''}: ${d.views}회`} />;
            })}
          </div>
        </div>
      </div>

      {/* ── 4. 최근 주문 + 재고/품절 알림 ── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* 최근 주문 */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-bold text-gray-900">최근 주문</h2>
            <Link href="/admin/orders" className="text-sm text-ocean-500 hover:text-ocean-600">전체보기 &rarr;</Link>
          </div>
          {orders.length === 0 ? (
            <p className="py-12 text-center text-gray-400">아직 주문이 없습니다.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {orders.slice(0, 8).map((order) => {
                const st = ORDER_STATUS_LABELS[order.status] || { label: order.status, color: 'text-gray-600 bg-gray-100 border-gray-200' };
                return (
                  <Link href={`/admin/orders/${order.id}`} key={order.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-[family-name:var(--font-montserrat)] text-sm font-semibold text-gray-800">{order.orderNumber}</span>
                        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${st.color}`}>{st.label}</span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-gray-400">
                        {order.recipientName} · {order.items?.map(i => i.productName).join(', ')}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-gray-800">{formatPrice(order.totalAmount)}원</p>
                      <p className="text-[10px] text-gray-300">{formatDate(order.createdAt)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* 재고/품절 알림 */}
        <div className="space-y-4">
          {/* 품절 */}
          {outOfStock.length > 0 && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{outOfStock.length}</span>
                <h3 className="text-sm font-bold text-red-700">품절 상품</h3>
              </div>
              <div className="space-y-2">
                {outOfStock.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2">
                    <span className="text-sm text-gray-700 truncate">{p.name}</span>
                    <span className="shrink-0 text-xs font-bold text-red-500">품절</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 재고 부족 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">재고 부족 (5개 이하)</h3>
              <Link href="/admin/products" className="text-xs text-ocean-500 hover:text-ocean-600">상품관리 &rarr;</Link>
            </div>
            {lowStock.filter(p => p.stock > 0).length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-400">재고 부족 상품 없음</p>
            ) : (
              <div className="space-y-2">
                {lowStock.filter(p => p.stock > 0).slice(0, 8).map(p => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50/50 px-3 py-2">
                    <span className="text-sm text-gray-700 truncate">{p.name}</span>
                    <span className="shrink-0 font-[family-name:var(--font-montserrat)] text-xs font-bold text-amber-600">{p.stock}개</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 빠른 링크 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-gray-900">빠른 작업</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/admin/products/new" className="rounded-lg border border-gray-200 px-3 py-2.5 text-center text-sm text-gray-600 hover:border-ocean-300 hover:text-ocean-600 transition-colors">
                상품 등록
              </Link>
              <Link href="/admin/orders" className="rounded-lg border border-gray-200 px-3 py-2.5 text-center text-sm text-gray-600 hover:border-ocean-300 hover:text-ocean-600 transition-colors">
                주문 관리
              </Link>
              <Link href="/admin/settings" className="rounded-lg border border-gray-200 px-3 py-2.5 text-center text-sm text-gray-600 hover:border-ocean-300 hover:text-ocean-600 transition-colors">
                스토어 설정
              </Link>
              <Link href="/admin/categories" className="rounded-lg border border-gray-200 px-3 py-2.5 text-center text-sm text-gray-600 hover:border-ocean-300 hover:text-ocean-600 transition-colors">
                카테고리
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
