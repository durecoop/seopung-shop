'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCart, type CartItemData } from '@/lib/cart';
import { generateOrderNumber, createOrder, getStoreSettings, getUserProfile } from '@/lib/db';
import { formatPrice } from '@/lib/types';
import type { StoreSettings } from '@/lib/types';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function CheckoutPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', email: '', postalCode: '', address: '', addressDetail: '', deliveryMemo: '', depositorName: '' });
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authChecking, setAuthChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const searchAddress = () => {
    if (typeof window === 'undefined') return;

    const openPostcode = () => {
      new (window as any).daum.Postcode({
        oncomplete: (data: any) => {
          setForm(prev => ({
            ...prev,
            postalCode: data.zonecode,
            address: data.roadAddress || data.jibunAddress,
          }));
          setErrors(prev => {
            const next = { ...prev };
            delete next.postalCode;
            delete next.address;
            return next;
          });
        },
      }).open();
    };

    if ((window as any).daum?.Postcode) {
      openPostcode();
      return;
    }

    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.onload = () => openPostcode();
    document.head.appendChild(script);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = '수령인을 입력해주세요';
    if (!/^01[016789]-?\d{3,4}-?\d{4}$/.test(form.phone.replace(/-/g, ''))) newErrors.phone = '올바른 연락처를 입력해주세요';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = '올바른 이메일을 입력해주세요';
    if (!form.postalCode.trim()) newErrors.postalCode = '주소를 검색해주세요';
    if (!form.address.trim()) newErrors.address = '주소를 입력해주세요';
    if (!form.depositorName.trim()) newErrors.depositorName = '입금자명을 입력해주세요';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    setCartItems(getCart());
    getStoreSettings().then(s => setSettings(s as StoreSettings));

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        try {
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setForm(prev => ({
              ...prev,
              name: prev.name || profile.name || user.displayName || '',
              phone: prev.phone || profile.phone || '',
              email: prev.email || profile.email || user.email || '',
            }));
          } else {
            setForm(prev => ({
              ...prev,
              name: prev.name || user.displayName || '',
              email: prev.email || user.email || '',
            }));
          }
        } catch {
          setForm(prev => ({
            ...prev,
            name: prev.name || user.displayName || '',
            email: prev.email || user.email || '',
          }));
        }
      }
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  const shippingFee = settings ? settings.shippingFee : 3000;
  const freeShippingThreshold = settings ? settings.freeShippingThreshold : 50000;
  const bankName = settings?.bankName || '농협';
  const bankAccount = settings?.bankAccount || '';
  const accountHolder = settings?.accountHolder || '';

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingFee;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (submitting || cartItems.length === 0) return;
    setSubmitting(true);
    try {
      const orderNumber = await generateOrderNumber();
      const currentUser = auth.currentUser;
      await createOrder({
        orderNumber,
        status: 'pending_payment',
        userId: currentUser?.uid || '',
        guestName: form.name,
        guestPhone: form.phone,
        guestEmail: form.email,
        items: cartItems.map(i => ({
          productId: i.productId,
          productName: i.name,
          price: i.price,
          quantity: i.qty,
        })),
        totalAmount: total,
        shippingFee: shipping,
        recipientName: form.name,
        recipientPhone: form.phone,
        address: form.address,
        addressDetail: form.addressDetail,
        postalCode: form.postalCode,
        deliveryMemo: form.deliveryMemo,
        depositorName: form.depositorName,
      });
      router.push(`/checkout/complete?orderNumber=${encodeURIComponent(orderNumber)}&total=${total}`);
    } catch (err) {
      console.error('Order creation failed:', err);
      alert('주문 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setSubmitting(false);
    }
  };

  const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400/30";

  if (authChecking) {
    return (
      <main className="bg-gray-50 min-h-screen font-[family-name:var(--font-pretendard)]">
        <Navbar />
        <div className="flex items-center justify-center pt-40 pb-20">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-ocean-500" />
            <p className="text-sm text-gray-500">로딩 중...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="bg-gray-50 min-h-screen font-[family-name:var(--font-pretendard)]">
        <Navbar />
        <div className="mx-auto max-w-md px-4 pt-32 pb-20 text-center">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto mb-4 h-12 w-12 text-gray-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900">로그인이 필요합니다</h2>
            <p className="mt-2 text-sm text-gray-500">주문하시려면 먼저 로그인해 주세요.</p>
            <Link href="/login" className="mt-6 inline-block w-full rounded-xl bg-ocean-500 py-3 font-semibold text-white transition-colors hover:bg-ocean-600">
              로그인 / 회원가입
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen font-[family-name:var(--font-pretendard)]">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 pt-24 pb-20 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">주문서</h1>
        {cartItems.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-400">주문할 상품이 없습니다</p>
            <a href="/products" className="mt-4 inline-block text-ocean-500 hover:text-ocean-600">상품 보러가기 &rarr;</a>
          </div>
        ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              {/* Delivery */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-bold text-gray-900">배송 정보</h2>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div><label className="mb-1 block text-sm text-gray-500">수령인 *</label><input type="text" required value={form.name} onChange={e => { setForm({...form, name: e.target.value}); if (errors.name) setErrors(prev => { const n = {...prev}; delete n.name; return n; }); }} className={inputCls} placeholder="이름" />{errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}</div>
                    <div><label className="mb-1 block text-sm text-gray-500">연락처 *</label><input type="tel" required value={form.phone} onChange={e => { setForm({...form, phone: e.target.value}); if (errors.phone) setErrors(prev => { const n = {...prev}; delete n.phone; return n; }); }} className={inputCls} placeholder="010-0000-0000" />{errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}</div>
                  </div>
                  <div><label className="mb-1 block text-sm text-gray-500">이메일</label><input type="email" value={form.email} onChange={e => { setForm({...form, email: e.target.value}); if (errors.email) setErrors(prev => { const n = {...prev}; delete n.email; return n; }); }} className={inputCls} placeholder="주문 확인 이메일" />{errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}</div>
                  <div className="flex items-end gap-3">
                    <div className="flex-1"><label className="mb-1 block text-sm text-gray-500">우편번호 *</label><input type="text" required readOnly value={form.postalCode} className={inputCls + ' cursor-pointer bg-gray-50'} placeholder="우편번호" onClick={searchAddress} />{errors.postalCode && <p className="mt-1 text-xs text-red-500">{errors.postalCode}</p>}</div>
                    <button type="button" onClick={searchAddress} className="shrink-0 rounded-lg border border-ocean-400 px-4 py-2.5 text-sm text-ocean-500 hover:bg-ocean-50">주소 검색</button>
                  </div>
                  <div><label className="mb-1 block text-sm text-gray-500">주소 *</label><input type="text" required readOnly value={form.address} className={inputCls + ' bg-gray-50'} placeholder="기본 주소" onClick={searchAddress} />{errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}</div>
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
                    <p className="text-gray-500">은행: <span className="font-semibold text-gray-800">{bankName}</span></p>
                    <p className="text-gray-500">계좌: <span className="font-semibold text-gray-800">{bankAccount}</span></p>
                    <p className="text-gray-500">예금주: <span className="font-semibold text-gray-800">{accountHolder}</span></p>
                  </div>
                </div>
                <div className="mt-4"><label className="mb-1 block text-sm text-gray-500">입금자명 *</label><input type="text" required value={form.depositorName} onChange={e => { setForm({...form, depositorName: e.target.value}); if (errors.depositorName) setErrors(prev => { const n = {...prev}; delete n.depositorName; return n; }); }} className={inputCls} placeholder="입금자명" />{errors.depositorName && <p className="mt-1 text-xs text-red-500">{errors.depositorName}</p>}</div>
              </div>
            </div>
            {/* Summary */}
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-gray-900">주문 상품</h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm"><span className="text-gray-500">{item.name} x {item.qty}</span><span className="font-[family-name:var(--font-montserrat)] text-gray-800">{formatPrice(item.price * item.qty)}</span></div>
                  ))}
                </div>
                <hr className="my-4 border-gray-100" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">상품금액</span><span className="font-[family-name:var(--font-montserrat)]">{formatPrice(subtotal)}원</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">배송비</span><span className="font-[family-name:var(--font-montserrat)] text-emerald-500">{shipping === 0 ? '무료' : `${formatPrice(shipping)}원`}</span></div>
                  <hr className="border-gray-100" />
                  <div className="flex items-baseline justify-between"><span className="font-semibold text-gray-900">결제금액</span><span className="font-[family-name:var(--font-montserrat)] text-2xl font-bold text-ocean-600">{formatPrice(total)}원</span></div>
                </div>
                <button type="submit" disabled={submitting} className="mt-6 w-full rounded-xl bg-ocean-500 py-3.5 font-semibold text-white transition-all hover:bg-ocean-600 disabled:opacity-50">
                  {submitting ? '주문 처리 중...' : `${formatPrice(total)}원 주문하기`}
                </button>
              </div>
            </div>
          </div>
        </form>
        )}
      </div>
      <Footer />
    </main>
  );
}
