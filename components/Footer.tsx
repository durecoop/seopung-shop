import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-gray-200">
                <Image src="/images/logo.png" alt="서풍 로고" width={36} height={36} className="h-full w-full object-cover" />
              </div>
              <span className="text-lg font-bold text-gray-900">서풍몰</span>
            </div>
            <p className="mt-3 text-base leading-relaxed text-gray-500">
              HACCP·ASC·MSC 인증<br />프리미엄 수산물 전문 쇼핑몰
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-base font-semibold text-gray-800">쇼핑 안내</h4>
            <div className="space-y-2.5 text-base text-gray-500">
              <Link href="/products" className="block hover:text-gold-500">전체상품</Link>
              <Link href="/order-tracking" className="block hover:text-gold-500">주문조회</Link>
              <Link href="/business" className="block hover:text-gold-500">B2B 기업거래</Link>
              <Link href="/privacy" className="block hover:text-gold-500">개인정보처리방침</Link>
              <Link href="/terms" className="block hover:text-gold-500">이용약관</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-base font-semibold text-gray-800">고객센터</h4>
            <div className="space-y-2.5 text-base text-gray-500">
              <p>전화: 061-686-0508</p>
              <p>평일 09:00 ~ 18:00</p>
              <p>점심 12:00 ~ 13:00</p>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-base font-semibold text-gray-800">회사정보</h4>
            <div className="space-y-1.5 text-sm text-gray-500">
              <p>영어조합법인 서풍 | 대표: 김태환</p>
              <p>사업자번호: 417-81-41979</p>
              <p>전라남도 여수시 석교로 121</p>
            </div>
            <div className="mt-4 space-y-2">
              <a href="https://seopung.co.kr/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-ocean-500 hover:text-ocean-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582" />
                </svg>
                회사소개 홈페이지
              </a>
              <a href="https://seopung.co.kr/admin" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                홈페이지 관리자
              </a>
              <Link href="/admin"
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                </svg>
                쇼핑몰 관리자
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          &copy; 2026 영어조합법인 서풍. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
