import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ocean-500 text-xs font-bold text-white">서</div>
              <span className="text-lg font-bold text-gray-900">서풍몰</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              HACCP·ASC·MSC 인증<br />프리미엄 수산물 전문 쇼핑몰
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-800">쇼핑 안내</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <Link href="/products" className="block hover:text-ocean-600">전체상품</Link>
              <Link href="/order-tracking" className="block hover:text-ocean-600">주문조회</Link>
              <Link href="/business" className="block hover:text-ocean-600">B2B 기업거래</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-800">고객센터</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <p>전화: 061-XXX-XXXX</p>
              <p>평일 09:00 ~ 18:00</p>
              <p>점심 12:00 ~ 13:00</p>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-800">회사정보</h4>
            <div className="space-y-1 text-xs text-gray-400">
              <p>영어조합법인 서풍 | 대표: 김태환</p>
              <p>사업자번호: 417-81-41979</p>
              <p>전라남도 여수시 석교로 121</p>
            </div>
            <a href="https://durecoop.github.io/seopung-web/" target="_blank" rel="noopener noreferrer"
              className="mt-3 inline-block text-xs text-ocean-500 hover:text-ocean-600">
              회사소개 홈페이지 &rarr;
            </a>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          &copy; 2026 영어조합법인 서풍. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
