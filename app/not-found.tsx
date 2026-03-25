import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <span className="text-8xl font-bold text-ocean-500">404</span>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">페이지를 찾을 수 없습니다</h1>
      <p className="mt-3 text-gray-500">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="rounded-xl bg-ocean-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ocean-600">홈으로</Link>
        <Link href="/products" className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100">상품 보기</Link>
      </div>
    </div>
  );
}
