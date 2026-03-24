'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SAMPLE_ORDERS, ORDER_STATUS_LABELS, formatPrice } from '@/lib/mock-data';

const TABS = [
  { key: 'all', label: '전체' },
  { key: 'pending_payment', label: '입금대기' },
  { key: 'payment_confirmed', label: '입금확인' },
  { key: 'preparing', label: '준비중' },
  { key: 'shipped', label: '발송완료' },
  { key: 'delivered', label: '배송완료' },
];

export default function AdminOrdersPage() {
  const [tab, setTab] = useState('all');
  const orders = tab === 'all' ? SAMPLE_ORDERS : SAMPLE_ORDERS.filter(o => o.status === tab);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">주문 관리</h1>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${tab === t.key ? 'bg-ocean-500 text-white' : 'border border-gray-200 text-gray-500 hover:border-ocean-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
              <th className="px-6 py-3">주문번호</th>
              <th className="px-6 py-3">주문자</th>
              <th className="px-6 py-3">상품</th>
              <th className="px-6 py-3 text-right">금액</th>
              <th className="px-6 py-3 text-center">상태</th>
              <th className="px-6 py-3">날짜</th>
              <th className="px-6 py-3 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const status = ORDER_STATUS_LABELS[order.status];
              return (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-[family-name:var(--font-montserrat)] text-sm font-semibold text-gray-800">{order.orderNumber}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">{order.recipientName}</p>
                    <p className="text-xs text-gray-400">{order.recipientPhone}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.items.map(i => i.name).join(', ')}</td>
                  <td className="px-6 py-4 text-right font-[family-name:var(--font-montserrat)] text-sm font-semibold text-gray-800">{formatPrice(order.totalAmount)}원</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${status.color}`}>{status.label}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{order.createdAt.split('T')[0]}</td>
                  <td className="px-6 py-4 text-center">
                    <Link href={`/admin/orders/${order.id}`} className="text-sm text-ocean-500 hover:text-ocean-600">상세</Link>
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">해당 상태의 주문이 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
