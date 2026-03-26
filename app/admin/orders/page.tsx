'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getOrders } from '@/lib/db';
import { ORDER_STATUS_LABELS, formatPrice } from '@/lib/types';
import type { Order } from '@/lib/types';

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const formatDateFull = (val: unknown): string => {
    if (!val) return '';
    if (typeof val === 'string') return val.split('T')[0];
    if (val && typeof val === 'object' && 'toDate' in val) {
      return (val as { toDate: () => Date }).toDate().toISOString().split('T')[0];
    }
    if (val && typeof val === 'object' && 'seconds' in val) {
      return new Date((val as { seconds: number }).seconds * 1000).toISOString().split('T')[0];
    }
    return '';
  };

  const downloadExcel = () => {
    if (orders.length === 0) { alert('다운로드할 주문이 없습니다.'); return; }

    const BOM = '\uFEFF';
    const headers = ['주문번호', '주문일자', '상태', '수령인', '연락처', '우편번호', '주소', '상세주소', '배송메모', '상품명', '수량', '금액', '배송비', '총결제금액', '입금자명', '택배사', '운송장번호'];

    const rows = orders.map(o => {
      const status = ORDER_STATUS_LABELS[o.status]?.label || o.status;
      const productNames = o.items?.map(i => i.productName).join(' / ') || '';
      const totalQty = o.items?.reduce((s, i) => s + i.quantity, 0) || 0;
      return [
        o.orderNumber,
        formatDateFull(o.createdAt),
        status,
        o.recipientName,
        o.recipientPhone,
        o.postalCode,
        o.address,
        o.addressDetail || '',
        o.deliveryMemo || '',
        productNames,
        totalQty,
        formatPrice(o.totalAmount - (o.shippingFee || 0)),
        formatPrice(o.shippingFee || 0),
        formatPrice(o.totalAmount),
        o.depositorName || '',
        o.trackingCarrier || '',
        o.trackingNumber || '',
      ];
    });

    const csv = BOM + [headers, ...rows].map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const statusLabel = tab === 'all' ? '전체' : (TABS.find(t => t.key === tab)?.label || tab);
    a.href = url;
    a.download = `서풍몰_주문목록_${statusLabel}_${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrders(tab === 'all' ? undefined : tab);
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
      // If composite index is missing, fetch all and filter client-side
      try {
        const all = await getOrders();
        setOrders(tab === 'all' ? all : all.filter(o => o.status === tab));
      } catch {
        setOrders([]);
      }
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const formatDate = (val: unknown): string => {
    if (!val) return '-';
    if (typeof val === 'string') return val.split('T')[0];
    if (val && typeof val === 'object' && 'toDate' in val) {
      return (val as { toDate: () => Date }).toDate().toISOString().split('T')[0];
    }
    return '-';
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">주문 관리</h1>
        <button onClick={downloadExcel} disabled={loading || orders.length === 0}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:border-emerald-300 hover:text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          엑셀 다운로드 ({orders.length}건)
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); setPage(1); }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${tab === t.key ? 'bg-ocean-500 text-white' : 'border border-gray-200 text-gray-500 hover:border-ocean-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">불러오는 중...</div>
      ) : (() => {
        const totalPages = Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE));
        const paginatedOrders = orders.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
        return (<>
        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
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
              {paginatedOrders.map((order) => {
                const status = ORDER_STATUS_LABELS[order.status] || { label: order.status, color: 'text-gray-600 bg-gray-100 border-gray-200' };
                return (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-[family-name:var(--font-montserrat)] text-sm font-semibold text-gray-800">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-800">{order.recipientName}</p>
                      <p className="text-xs text-gray-400">{order.recipientPhone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.items?.map(i => i.productName || (i as unknown as { name: string }).name).join(', ')}</td>
                    <td className="px-6 py-4 text-right font-[family-name:var(--font-montserrat)] text-sm font-semibold text-gray-800">{formatPrice(order.totalAmount)}원</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${status.color}`}>{status.label}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{formatDate(order.createdAt)}</td>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
              이전
            </button>
            <span className="text-sm text-gray-500">{page} / {totalPages} 페이지</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
              다음
            </button>
          </div>
        )}
        </>);
      })()}
    </div>
  );
}
