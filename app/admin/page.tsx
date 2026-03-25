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
    Promise.all([getProducts(), getOrders(), getAnalytics('shop', 7), getAnalytics('web', 7)]).then(([p, o, ss, ws]) => {
      setProducts(p);
      setOrders(o);
      setShopStats(ss);
      setWebStats(ws);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="py-20 text-center text-gray-400">로딩 중...</div>;

  const pendingPayments = orders.filter(o => o.status === 'pending_payment').length;
  const monthRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const lowStock = products.filter(p => p.stock <= 5);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">대시보드</h1>

      {/* 방문자 통계 */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
          <p className="text-xs font-medium text-blue-400">쇼핑몰 오늘 방문</p>
          <p className="mt-1 font-[family-name:var(--font-montserrat)] text-3xl font-bold text-blue-600">{shopStats.today.toLocaleString()}</p>
          <p className="mt-1 text-xs text-gray-400">누적 {shopStats.total.toLocaleString()}회</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
          <p className="text-xs font-medium text-emerald-400">홈페이지 오늘 방문</p>
          <p className="mt-1 font-[family-name:var(--font-montserrat)] text-3xl font-bold text-emerald-600">{webStats.today.toLocaleString()}</p>
          <p className="mt-1 text-xs text-gray-400">누적 {webStats.total.toLocaleString()}회</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-400">쇼핑몰 최근 7일</p>
          <div className="mt-2 flex items-end gap-1" style={{ height: 40 }}>
            {(shopStats.daily.length > 0 ? shopStats.daily.slice(0, 7).reverse() : Array(7).fill({ views: 0 })).map((d, i) => {
              const max = Math.max(...shopStats.daily.map(x => x.views), 1);
              return <div key={i} className="flex-1 rounded-sm bg-blue-400" style={{ height: `${Math.max((d.views / max) * 100, 4)}%` }} title={`${d.date || ''}: ${d.views}회`} />;
            })}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-400">홈페이지 최근 7일</p>
          <div className="mt-2 flex items-end gap-1" style={{ height: 40 }}>
            {(webStats.daily.length > 0 ? webStats.daily.slice(0, 7).reverse() : Array(7).fill({ views: 0 })).map((d, i) => {
              const max = Math.max(...webStats.daily.map(x => x.views), 1);
              return <div key={i} className="flex-1 rounded-sm bg-emerald-400" style={{ height: `${Math.max((d.views / max) * 100, 4)}%` }} title={`${d.date || ''}: ${d.views}회`} />;
            })}
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: '전체 주문', value: `${orders.length}건`, color: 'text-ocean-600', link: '/admin/orders' },
          { label: '입금 대기', value: `${pendingPayments}건`, color: 'text-amber-600', link: '/admin/orders' },
          { label: '총 매출', value: `${formatPrice(monthRevenue)}원`, color: 'text-emerald-600', link: '/admin/orders' },
          { label: '전체 상품', value: `${products.length}개`, color: 'text-purple-600', link: '/admin/products' },
        ].map((stat) => (
          <Link key={stat.label} href={stat.link} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-ocean-200">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`mt-2 font-[family-name:var(--font-montserrat)] text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">최근 주문</h2>
            <Link href="/admin/orders" className="text-sm text-ocean-500 hover:text-ocean-600">전체보기 &rarr;</Link>
          </div>
          {orders.length === 0 ? (
            <p className="py-8 text-center text-gray-400">아직 주문이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <Link href={`/admin/orders/${order.id}`} key={order.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50">
                  <div>
                    <p className="font-[family-name:var(--font-montserrat)] text-sm font-semibold text-gray-800">{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">{order.recipientName} · {order.items?.length || 0}개 상품</p>
                  </div>
                  <div className="text-right">
                    <p className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-gray-800">{formatPrice(order.totalAmount || 0)}원</p>
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${ORDER_STATUS_LABELS[order.status]?.color || ''}`}>
                      {ORDER_STATUS_LABELS[order.status]?.label || order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">재고 부족 알림</h2>
          {lowStock.length === 0 ? (
            <p className="py-8 text-center text-gray-400">재고 부족 상품이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50/50 p-3">
                  <div><p className="text-sm font-semibold text-gray-800">{p.name}</p><p className="text-xs text-gray-400">{formatPrice(p.price)}원</p></div>
                  <span className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-red-500">재고 {p.stock}개</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
