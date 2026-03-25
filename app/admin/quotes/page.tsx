'use client';

import { useState, useEffect } from 'react';
import { getQuotes, updateQuote } from '@/lib/db';

interface QuoteData {
  id: string;
  companyName?: string;
  company?: string;
  contactName?: string;
  contact?: string;
  phone?: string;
  email?: string;
  message?: string;
  status: string;
  adminNote?: string;
  createdAt?: unknown;
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: '대기', color: 'text-amber-600 bg-amber-50 border-amber-200' },
    reviewed: { label: '검토중', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    quoted: { label: '견적완료', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  };

  const fetchQuotes = async () => {
    try {
      const data = await getQuotes();
      setQuotes(data as QuoteData[]);
      const noteMap: Record<string, string> = {};
      for (const q of data as QuoteData[]) {
        noteMap[q.id] = q.adminNote || '';
      }
      setNotes(noteMap);
    } catch (err) {
      console.error('Failed to load quotes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuotes(); }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!newStatus) return;
    await updateQuote(id, { status: newStatus });
    await fetchQuotes();
  };

  const handleSaveNote = async (id: string) => {
    await updateQuote(id, { adminNote: notes[id] || '' });
    alert('메모가 저장되었습니다.');
  };

  const formatDate = (val: unknown): string => {
    if (!val) return '-';
    if (typeof val === 'string') return val.split('T')[0];
    if (val && typeof val === 'object' && 'toDate' in val) {
      return (val as { toDate: () => Date }).toDate().toISOString().split('T')[0];
    }
    return '-';
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-gray-400">불러오는 중...</div>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">B2B 견적 관리</h1>

      {quotes.length === 0 && (
        <div className="py-12 text-center text-gray-400">견적 요청이 없습니다.</div>
      )}

      <div className="space-y-4">
        {quotes.map((q) => {
          const st = statusMap[q.status] || statusMap.pending;
          const company = q.companyName || q.company || '-';
          const contact = q.contactName || q.contact || '-';
          return (
            <div key={q.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-800">{company}</h3>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${st.color}`}>{st.label}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{contact} · {q.phone || '-'}</p>
                </div>
                <span className="text-sm text-gray-400">{formatDate(q.createdAt)}</span>
              </div>
              <p className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">{q.message || '-'}</p>

              {/* Admin note */}
              <div className="mt-4">
                <label className="mb-1 block text-xs font-medium text-gray-500">관리자 메모</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={notes[q.id] || ''}
                    onChange={e => setNotes(prev => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder="내부 메모 입력"
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-ocean-400 focus:outline-none"
                  />
                  <button onClick={() => handleSaveNote(q.id)} className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200">저장</button>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="rounded-lg bg-ocean-500 px-4 py-2 text-sm font-medium text-white hover:bg-ocean-600">회신하기</button>
                <select
                  value={q.status}
                  onChange={e => handleStatusChange(q.id, e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 focus:border-ocean-400 focus:outline-none"
                >
                  <option value="pending">대기</option>
                  <option value="reviewed">검토중</option>
                  <option value="quoted">견적완료</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
