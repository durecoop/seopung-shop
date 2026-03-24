'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SAMPLE_ORDERS, ORDER_STATUS_LABELS, formatPrice } from '@/lib/mock-data';

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<typeof SAMPLE_ORDERS[0] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setSearched(true); setResult(SAMPLE_ORDERS.find(o => o.orderNumber === orderNumber) || null); };
  const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400/30";

  return (
    <main className="bg-gray-50 min-h-screen font-[family-name:var(--font-pretendard)]">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 pt-24 pb-20 lg:px-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">주문 조회</h1>
        <p className="mb-8 text-gray-500">주문번호와 전화번호로 배송 상태를 확인하세요.</p>

        <form onSubmit={handleSearch} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div><label className="mb-1 block text-sm text-gray-500">주문번호</label><input type="text" value={orderNumber} onChange={e => setOrderNumber(e.target.value)} required className={inputCls} placeholder="SP-20260324-001" /></div>
            <div><label className="mb-1 block text-sm text-gray-500">전화번호</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className={inputCls} placeholder="010-0000-0000" /></div>
          </div>
          <button type="submit" className="mt-5 w-full rounded-xl bg-ocean-500 py-3 font-semibold text-white transition-all hover:bg-ocean-600">조회하기</button>
        </form>

        {searched && result && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-gray-400">{result.createdAt.split('T')[0]}</p><p className="font-[family-name:var(--font-montserrat)] text-lg font-bold text-gray-900">{result.orderNumber}</p></div>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${ORDER_STATUS_LABELS[result.status].color}`}>{ORDER_STATUS_LABELS[result.status].label}</span>
            </div>
            <hr className="my-4 border-gray-100" />
            <div className="space-y-2">{result.items.map((item, i) => (<div key={i} className="flex justify-between text-sm"><span className="text-gray-500">{item.name} x {item.quantity}</span><span className="font-[family-name:var(--font-montserrat)]">{formatPrice(item.price * item.quantity)}원</span></div>))}</div>
            <hr className="my-4 border-gray-100" />
            <div className="flex justify-between"><span className="font-semibold text-gray-800">결제금액</span><span className="font-[family-name:var(--font-montserrat)] text-xl font-bold text-ocean-600">{formatPrice(result.totalAmount)}원</span></div>
            <div className="mt-4 text-sm text-gray-400"><p>수령인: {result.recipientName}</p><p>배송지: {result.address}</p></div>
          </div>
        )}
        {searched && !result && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">주문 정보를 찾을 수 없습니다.</p>
            <p className="mt-1 text-sm text-gray-300">주문번호와 전화번호를 확인해 주세요.</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
