'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getOrderById, updateOrder } from '@/lib/db';
import { ORDER_STATUS_LABELS, formatPrice } from '@/lib/types';
import type { Order } from '@/lib/types';

const STATUS_FLOW = ['pending_payment', 'payment_confirmed', 'preparing', 'shipped', 'delivered'];

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id).then(o => {
      setOrder(o);
      if (o) { setStatus(o.status); setAdminNote(o.adminNote || ''); setTrackingNumber(o.trackingNumber || ''); }
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="py-20 text-center text-gray-400">로딩 중...</div>;
  if (!order) return <div className="py-20 text-center text-gray-400">주문을 찾을 수 없습니다.</div>;

  const currentIdx = STATUS_FLOW.indexOf(status);

  const handleStatusChange = async (newStatus: string) => {
    const updateData: Record<string, unknown> = { status: newStatus };
    if (newStatus === 'shipped' && trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }
    await updateOrder(order.id, updateData as Partial<Order>);
    setStatus(newStatus);
    alert(`상태가 "${ORDER_STATUS_LABELS[newStatus].label}"(으)로 변경되었습니다.`);
  };

  const handleSaveNote = async () => {
    await updateOrder(order.id, { adminNote } as Partial<Order>);
    alert('메모가 저장되었습니다.');
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/orders" className="text-gray-400 hover:text-gray-600">&larr;</Link>
        <h1 className="text-2xl font-bold text-gray-900">주문 상세</h1>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${ORDER_STATUS_LABELS[status]?.color || ''}`}>{ORDER_STATUS_LABELS[status]?.label || status}</span>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">주문 정보</h2>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div><span className="text-gray-400">주문번호</span><p className="mt-1 font-[family-name:var(--font-montserrat)] font-semibold text-gray-800">{order.orderNumber}</p></div>
              <div><span className="text-gray-400">수령인</span><p className="mt-1 text-gray-800">{order.recipientName}</p></div>
              <div><span className="text-gray-400">연락처</span><p className="mt-1 text-gray-800">{order.recipientPhone}</p></div>
              <div><span className="text-gray-400">입금자명</span><p className="mt-1 text-gray-800">{order.depositorName || '-'}</p></div>
              <div className="sm:col-span-2"><span className="text-gray-400">배송지</span><p className="mt-1 text-gray-800">{order.address} {order.addressDetail}</p></div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">주문 상품</h2>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <div><p className="text-sm font-medium text-gray-800">{item.productName}</p><p className="text-xs text-gray-400">{formatPrice(item.price)}원 x {item.quantity}</p></div>
                  <span className="font-[family-name:var(--font-montserrat)] text-sm font-semibold text-gray-800">{formatPrice(item.price * item.quantity)}원</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t border-gray-100 pt-4">
              <span className="font-semibold text-gray-800">총 결제금액</span>
              <span className="font-[family-name:var(--font-montserrat)] text-xl font-bold text-ocean-600">{formatPrice(order.totalAmount)}원</span>
            </div>
          </div>
          {(status === 'preparing' || status === 'shipped') && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">배송 정보</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1 block text-sm text-gray-500">택배사</label>
                  <select className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-ocean-400 focus:outline-none"><option>CJ대한통운</option><option>한진택배</option><option>롯데택배</option></select></div>
                <div><label className="mb-1 block text-sm text-gray-500">운송장 번호</label>
                  <input type="text" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-ocean-400 focus:outline-none" placeholder="운송장 번호" /></div>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">상태 변경</h2>
            <div className="space-y-2">
              {STATUS_FLOW.map((s, i) => {
                const st = ORDER_STATUS_LABELS[s];
                const isCurrent = s === status;
                const isPast = i < currentIdx;
                const isNext = i === currentIdx + 1;
                return (
                  <button key={s} onClick={() => isNext && handleStatusChange(s)} disabled={!isNext}
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isCurrent ? 'border-2 border-ocean-400 bg-ocean-50 text-ocean-600' : isPast ? 'bg-gray-50 text-gray-400' : isNext ? 'border border-gray-200 text-gray-700 hover:border-ocean-300 hover:bg-ocean-50 cursor-pointer' : 'border border-gray-100 text-gray-300 cursor-not-allowed'}`}>
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${isCurrent ? 'bg-ocean-500 text-white' : isPast ? 'bg-gray-300 text-white' : 'bg-gray-100 text-gray-400'}`}>{isPast ? '✓' : i + 1}</div>
                    {st.label}{isNext && <span className="ml-auto text-xs text-ocean-400">클릭</span>}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">관리자 메모</h2>
            <textarea rows={4} value={adminNote} onChange={e => setAdminNote(e.target.value)} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-ocean-400 focus:outline-none" placeholder="내부 메모" />
            <button onClick={handleSaveNote} className="mt-3 w-full rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200">메모 저장</button>
          </div>
        </div>
      </div>
    </div>
  );
}
