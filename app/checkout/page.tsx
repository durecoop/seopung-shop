'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { formatPrice, STORE_SETTINGS } from '@/lib/mock-data';

export default function CheckoutPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', email: '', postalCode: '', address: '', addressDetail: '', deliveryMemo: '', depositorName: '' });

  const orderItems = [
    { name: '고등어필렛 1kg', price: 15900, qty: 2 },
    { name: '참조기 굴비세트 10미', price: 89000, qty: 1 },
    { name: '해물탕 밀키트 2인분', price: 19900, qty: 1 },
  ];
  const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingFee = subtotal >= STORE_SETTINGS.freeShippingThreshold ? 0 : STORE_SETTINGS.shippingFee;
  const total = subtotal + shippingFee;

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); router.push('/checkout/complete?order=SP-20260324-001'); };

  const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400/30";

  return (
    <main className="bg-gray-50 min-h-screen font-[family-name:var(--font-pretendard)]">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 pt-24 pb-20 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">주문서</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              {/* Delivery */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-bold text-gray-900">배송 정보</h2>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className="mb-1 block text-sm text-gray-500">수령인 *</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputCls} placeholder="이름" /></div>
                    <div><label className="mb-1 block text-sm text-gray-500">연락처 *</label><input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={inputCls} placeholder="010-0000-0000" /></div>
                  </div>
                  <div><label className="mb-1 block text-sm text-gray-500">이메일</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={inputCls} placeholder="주문 확인 이메일" /></div>
                  <div className="flex gap-3">
                    <div className="flex-1"><label className="mb-1 block text-sm text-gray-500">우편번호 *</label><input type="text" required value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})} className={inputCls} placeholder="우편번호" /></div>
                    <button type="button" className="mt-6 shrink-0 rounded-lg border border-ocean-400 px-4 py-2.5 text-sm text-ocean-500 hover:bg-ocean-50">주소 검색</button>
                  </div>
                  <div><label className="mb-1 block text-sm text-gray-500">주소 *</label><input type="text" required value={form.address} onChange={e => setForm({...form, address: e.target.value})} className={inputCls} placeholder="기본 주소" /></div>
                  <div><input type="text" value={form.addressDetail} onChange={e => setForm({...form, addressDetail: e.target.value})} className={inputCls} placeholder="상세 주소" /></div>
                  <div><label className="mb-1 block text-sm text-gray-500">배송 메모</label>
                    <select value={form.deliveryMemo} onChange={e => setForm({...form, deliveryMemo: e.target.value})} className={inputCls}>
                      <option value="">선택해주세요</option>
                      <option>부재 시 문 앞에 놓아주세요</option>
                      <option>경비실에 맡겨주세요</option>
                      <option>배송 전 연락 바랍니다</option>
                    </select>
                  </div>
                </div>
              </div>
              {/* Payment */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-bold text-gray-900">결제 수단</h2>
                <div className="rounded-xl border-2 border-ocean-400 bg-ocean-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-ocean-500"><div className="h-2.5 w-2.5 rounded-full bg-ocean-500" /></div>
                    <span className="font-semibold text-gray-800">무통장 입금</span>
                  </div>
                  <div className="mt-3 space-y-1 rounded-lg bg-white p-3 text-sm border border-gray-100">
                    <p className="text-gray-500">은행: <span className="font-semibold text-gray-800">{STORE_SETTINGS.bankName}</span></p>
                    <p className="text-gray-500">계좌: <span className="font-semibold text-gray-800">{STORE_SETTINGS.bankAccount}</span></p>
                    <p className="text-gray-500">예금주: <span className="font-semibold text-gray-800">{STORE_SETTINGS.accountHolder}</span></p>
                  </div>
                </div>
                <div className="mt-4"><label className="mb-1 block text-sm text-gray-500">입금자명 *</label><input type="text" required value={form.depositorName} onChange={e => setForm({...form, depositorName: e.target.value})} className={inputCls} placeholder="입금자명" /></div>
              </div>
            </div>
            {/* Summary */}
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-gray-900">주문 상품</h3>
                <div className="space-y-3">
                  {orderItems.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm"><span className="text-gray-500">{item.name} x {item.qty}</span><span className="font-[family-name:var(--font-montserrat)] text-gray-800">{formatPrice(item.price * item.qty)}</span></div>
                  ))}
                </div>
                <hr className="my-4 border-gray-100" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">상품금액</span><span className="font-[family-name:var(--font-montserrat)]">{formatPrice(subtotal)}원</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">배송비</span><span className="font-[family-name:var(--font-montserrat)] text-emerald-500">{shippingFee === 0 ? '무료' : `${formatPrice(shippingFee)}원`}</span></div>
                  <hr className="border-gray-100" />
                  <div className="flex items-baseline justify-between"><span className="font-semibold text-gray-900">결제금액</span><span className="font-[family-name:var(--font-montserrat)] text-2xl font-bold text-ocean-600">{formatPrice(total)}원</span></div>
                </div>
                <button type="submit" className="mt-6 w-full rounded-xl bg-ocean-500 py-3.5 font-semibold text-white transition-all hover:bg-ocean-600">{formatPrice(total)}원 주문하기</button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </main>
  );
}
