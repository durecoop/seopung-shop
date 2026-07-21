'use client';

import { useEffect, useState } from 'react';
import { getAnalytics } from '@/lib/db';

export default function VisitorCounter({ className = '' }: { className?: string }) {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    getAnalytics('shop')
      .then((s) => setTotal(s.total))
      .catch(() => {});
  }, []);

  if (total === null) return null;

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`} title="쇼핑몰 오픈 이후 누적 방문 수">
      <svg className="h-3.5 w-3.5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      누적 방문 <span className="font-semibold">{total.toLocaleString()}</span>회
    </span>
  );
}
