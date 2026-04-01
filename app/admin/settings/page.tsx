'use client';

import { useState, useEffect } from 'react';
import { getStoreSettings, updateStoreSettings } from '@/lib/db';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({ bankName: '', bankAccount: '', accountHolder: '', shippingFee: 3000, freeShippingThreshold: 50000, paymentDeadlineHours: 24 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getStoreSettings().then(data => {
      if (data) setSettings(data as typeof settings);
      setLoading(false);
    });
  }, []);

  const inputCls = "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-ocean-400 focus:outline-none focus:ring-1 focus:ring-ocean-400/30";

  const handleSave = async () => {
    setSaving(true);
    await updateStoreSettings(settings);
    setSaving(false);
    alert('설정이 저장되었습니다!');
  };

  if (loading) return <div className="py-20 text-center text-gray-400">로딩 중...</div>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">매장 설정</h1>
      <div className="max-w-2xl space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">입금 계좌 정보</h2>
          <div className="space-y-4">
            <div><label className="mb-1 block text-sm text-gray-500">은행명</label>
              <input type="text" value={settings.bankName} onChange={e => setSettings({...settings, bankName: e.target.value})} className={inputCls} /></div>
            <div><label className="mb-1 block text-sm text-gray-500">계좌번호</label>
              <input type="text" value={settings.bankAccount} onChange={e => setSettings({...settings, bankAccount: e.target.value})} className={inputCls} /></div>
            <div><label className="mb-1 block text-sm text-gray-500">예금주</label>
              <input type="text" value={settings.accountHolder} onChange={e => setSettings({...settings, accountHolder: e.target.value})} className={inputCls} /></div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">배송 설정</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="mb-1 block text-sm text-gray-500">기본 배송비 (원)</label>
              <input type="number" value={settings.shippingFee} onChange={e => setSettings({...settings, shippingFee: Number(e.target.value)})} className={inputCls} /></div>
            <div><label className="mb-1 block text-sm text-gray-500">무료배송 기준 (원)</label>
              <input type="number" value={settings.freeShippingThreshold} onChange={e => setSettings({...settings, freeShippingThreshold: Number(e.target.value)})} className={inputCls} /></div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">결제 설정</h2>
          <div><label className="mb-1 block text-sm text-gray-500">입금 기한 (시간)</label>
            <input type="number" value={settings.paymentDeadlineHours} onChange={e => setSettings({...settings, paymentDeadlineHours: Number(e.target.value)})} className={inputCls} /></div>
        </div>
        <button onClick={handleSave} disabled={saving} className="w-full rounded-xl bg-ocean-500 py-3.5 font-semibold text-white hover:bg-ocean-600 disabled:bg-gray-300">
          {saving ? '저장 중...' : '설정 저장'}
        </button>
      </div>
    </div>
  );
}
