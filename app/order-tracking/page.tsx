'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getOrderByNumber, getOrdersByUserId } from '@/lib/db';
import { ORDER_STATUS_LABELS, formatPrice } from '@/lib/types';
import type { Order } from '@/lib/types';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthLoading(false);
      if (u) {
        setOrdersLoading(true);
        try {
          const orders = await getOrdersByUserId(u.uid);
          setMyOrders(orders);
        } catch (err) {
          console.error('Failed to load orders:', err);
        }
        setOrdersLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const order = await getOrderByNumber(orderNumber.trim());
      if (order && order.guestPhone === phone.trim()) {
        setResult(order);
      } else {
        setResult(null);
      }
    } catch (err) {
      console.error('Order search failed:', err);
      setResult(null);
    }
    setSearched(true);
    setLoading(false);
  };

  const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400/30";

  const getCreatedDate = (order: Order): string => {
    if (!order.createdAt) return '';
    if (typeof order.createdAt === 'string') return order.createdAt.split('T')[0];
    const ts = order.createdAt as { toDate?: () => Date; seconds?: number };
    if (ts.toDate) return ts.toDate().toISOString().split('T')[0];
    if (ts.seconds) return new Date(ts.seconds * 1000).toISOString().split('T')[0];
    return '';
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">{getCreatedDate(order)}</p>
          <p className="font-[family-name:var(--font-montserrat)] text-lg font-bold text-gray-900">{order.orderNumber}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${ORDER_STATUS_LABELS[order.status]?.color || ''}`}>
          {ORDER_STATUS_LABELS[order.status]?.label || order.status}
        </span>
      </div>
      <hr className="my-4 border-gray-100" />
      <div className="space-y-2">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-500">{item.productName} x {item.quantity}</span>
            <span className="font-[family-name:var(--font-montserrat)]">{formatPrice(item.price * item.quantity)}원</span>
          </div>
        ))}
      </div>
      <hr className="my-4 border-gray-100" />
      <div className="flex justify-between">
        <span className="font-semibold text-gray-800">결제금액</span>
        <span className="font-[family-name:var(--font-montserrat)] text-xl font-bold text-ocean-600">{formatPrice(order.totalAmount)}원</span>
      </div>
      <div className="mt-4 text-sm text-gray-400">
        <p>수령인: {order.recipientName}</p>
        <p>배송지: {order.address}{order.addressDetail ? ` ${order.addressDetail}` : ''}</p>
        {order.trackingNumber && (
          <p className="mt-1 text-ocean-500">운송장: {order.trackingCarrier || ''} {order.trackingNumber}</p>
        )}
      </div>
    </div>
  );

  return (
    <main className="bg-gray-50 min-h-screen font-[family-name:var(--font-pretendard)]">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 pt-24 pb-20 lg:px-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">주문 조회</h1>

        {/* 로그인 사용자: 내 주문 내역 */}
        {!authLoading && user && (
          <div className="mb-10">
            <p className="mb-6 text-gray-500">
              <span className="font-medium text-gray-700">{user.displayName || user.email}</span>님의 주문 내역
            </p>

            {ordersLoading ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-ocean-500" />
                <p className="text-sm text-gray-400">주문 내역을 불러오는 중...</p>
              </div>
            ) : myOrders.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto mb-3 h-10 w-10 text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <p className="text-gray-500">아직 주문 내역이 없습니다.</p>
                <Link href="/products" className="mt-4 inline-block text-sm text-ocean-500 hover:text-ocean-600">상품 보러가기 &rarr;</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 비로그인 또는 추가 단건 조회 */}
        <div className={user ? 'border-t border-gray-200 pt-8' : ''}>
          {user && <h2 className="mb-2 text-lg font-bold text-gray-900">주문번호로 조회</h2>}
          {!user && <p className="mb-8 text-gray-500">주문번호와 전화번호로 배송 상태를 확인하세요.</p>}
          {!user && !authLoading && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-ocean-100 bg-ocean-50 p-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 shrink-0 text-ocean-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              <p className="text-sm text-ocean-700">
                <Link href="/login?redirect=/order-tracking" className="font-semibold underline">로그인</Link>하시면 전체 주문 내역을 확인할 수 있습니다.
              </p>
            </div>
          )}

          <form onSubmit={handleSearch} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div><label className="mb-1 block text-sm text-gray-500">주문번호</label><input type="text" value={orderNumber} onChange={e => setOrderNumber(e.target.value)} required className={inputCls} placeholder="SP-20260324-001" /></div>
              <div><label className="mb-1 block text-sm text-gray-500">전화번호</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className={inputCls} placeholder="010-0000-0000" /></div>
            </div>
            <button type="submit" disabled={loading} className="mt-5 w-full rounded-xl bg-ocean-500 py-3 font-semibold text-white transition-all hover:bg-ocean-600 disabled:opacity-50">
              {loading ? '조회 중...' : '조회하기'}
            </button>
          </form>

          {searched && result && (
            <div className="mt-6">
              <OrderCard order={result} />
            </div>
          )}
          {searched && !result && (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <p className="text-gray-500">주문 정보를 찾을 수 없습니다.</p>
              <p className="mt-1 text-sm text-gray-300">주문번호와 전화번호를 확인해 주세요.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
