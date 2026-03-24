import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { formatPrice, STORE_SETTINGS } from '@/lib/mock-data';

export default function OrderCompletePage() {
  const orderNumber = 'SP-20260324-001';
  const total = 140700;

  return (
    <main className="bg-gray-50 min-h-screen font-[family-name:var(--font-pretendard)]">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 pt-24 pb-20 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-10 w-10 text-emerald-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">주문이 완료되었습니다</h1>
          <p className="mt-2 text-gray-500">아래 계좌로 입금해 주시면 확인 후 상품을 발송합니다.</p>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-gray-400">주문번호</p>
          <p className="mt-1 font-[family-name:var(--font-montserrat)] text-2xl font-bold tracking-wider text-ocean-600">{orderNumber}</p>
        </div>

        <div className="mt-6 rounded-2xl border-2 border-ocean-300 bg-ocean-50 p-6">
          <h2 className="mb-4 text-center text-lg font-bold text-ocean-600">입금 안내</h2>
          <div className="space-y-3">
            {[
              ['입금 은행', STORE_SETTINGS.bankName],
              ['계좌번호', STORE_SETTINGS.bankAccount],
              ['예금주', STORE_SETTINGS.accountHolder],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between rounded-lg bg-white px-4 py-3 border border-gray-100">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="font-semibold text-gray-800">{value}</span>
              </div>
            ))}
            <div className="flex justify-between rounded-lg bg-white px-4 py-3 border border-gray-100">
              <span className="text-sm text-gray-500">입금액</span>
              <span className="font-[family-name:var(--font-montserrat)] text-xl font-bold text-ocean-600">{formatPrice(total)}원</span>
            </div>
            <div className="flex justify-between rounded-lg bg-white px-4 py-3 border border-gray-100">
              <span className="text-sm text-gray-500">입금 기한</span>
              <span className="font-semibold text-amber-600">{STORE_SETTINGS.paymentDeadlineHours}시간 이내</span>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-gray-500">* 입금자명을 주문자명과 동일하게 해주세요</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/order-tracking" className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-center font-semibold text-gray-600 shadow-sm hover:border-ocean-300 hover:text-ocean-600">주문 조회</Link>
          <Link href="/products" className="flex-1 rounded-xl bg-ocean-500 py-3 text-center font-semibold text-white hover:bg-ocean-600">쇼핑 계속하기</Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
