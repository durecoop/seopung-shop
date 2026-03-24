export default function AdminQuotesPage() {
  const quotes = [
    { id: '1', company: '(주)해양식품', contact: '박민수', phone: '02-1234-5678', message: '고등어필렛 1kg x 500박스, 삼치필렛 1kg x 300박스 견적 요청', status: 'pending', date: '2026-03-24' },
    { id: '2', company: '쿠팡 신선식품팀', contact: '김지연', phone: '02-9876-5432', message: 'ASC 인증 새우살 500g x 1000박스, PB 브랜드 적용 가능 여부 문의', status: 'reviewed', date: '2026-03-22' },
  ];

  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: '대기', color: 'text-amber-600 bg-amber-50 border-amber-200' },
    reviewed: { label: '검토중', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    quoted: { label: '견적완료', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">B2B 견적 관리</h1>

      <div className="space-y-4">
        {quotes.map((q) => {
          const st = statusMap[q.status];
          return (
            <div key={q.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-800">{q.company}</h3>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${st.color}`}>{st.label}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{q.contact} · {q.phone}</p>
                </div>
                <span className="text-sm text-gray-400">{q.date}</span>
              </div>
              <p className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">{q.message}</p>
              <div className="mt-4 flex gap-2">
                <button className="rounded-lg bg-ocean-500 px-4 py-2 text-sm font-medium text-white hover:bg-ocean-600">회신하기</button>
                <select className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 focus:border-ocean-400 focus:outline-none">
                  <option>상태 변경</option>
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
