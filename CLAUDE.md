# 서풍몰 쇼핑몰 (seopung-shop)

영어조합법인 서풍의 공식 온라인 쇼핑몰. HACCP·ASC·MSC 인증 프리미엄 수산물 B2C 판매.

## 기술 스택

- **Framework**: Next.js 16.2.1 (App Router)
- **React**: 19.2.4
- **TypeScript**: 5
- **Styling**: Tailwind CSS 4 + PostCSS, 커스텀 테마(`globals.css` @theme inline)
- **Backend**: Firebase Firestore (상품/주문/사용자 데이터), Firebase Auth (회원/관리자), Firebase Storage (상품 이미지)
- **Font**: Pretendard Variable(한글), Montserrat(영문/숫자)
- **배포**: Vercel → `shop.seopung.co.kr`

## 프로젝트 구조

```
app/
├── page.tsx                        # 홈 (히어로, 카테고리, 인기상품, 신상품)
├── products/
│   ├── page.tsx                    # 전체 상품 목록
│   ├── [category]/page.tsx         # 카테고리별 상품
│   └── [category]/[slug]/page.tsx  # 상품 상세
├── cart/page.tsx                   # 장바구니
├── checkout/
│   ├── page.tsx                    # 주문서 작성 (다음 우편번호 연동)
│   └── complete/page.tsx           # 주문 완료
├── login/page.tsx                  # 로그인/회원가입
├── order-tracking/page.tsx         # 주문 조회
├── business/page.tsx               # B2B 기업거래 문의
├── privacy/page.tsx                # 개인정보처리방침
├── terms/page.tsx                  # 이용약관
├── admin/
│   ├── page.tsx                    # 관리자 대시보드
│   ├── layout.tsx                  # 관리자 레이아웃 (사이드바)
│   ├── products/page.tsx           # 상품 관리
│   ├── products/new/page.tsx       # 상품 등록
│   ├── products/[id]/edit/page.tsx # 상품 수정
│   ├── orders/page.tsx             # 주문 관리
│   ├── orders/[id]/page.tsx        # 주문 상세
│   ├── categories/page.tsx         # 카테고리 관리
│   ├── quotes/page.tsx             # 견적 문의 관리
│   ├── settings/page.tsx           # 스토어 설정
│   └── seed/page.tsx               # 시드 데이터
├── setup-admin/page.tsx            # 최초 관리자 설정
├── layout.tsx                      # 루트 레이아웃 (SEO, Schema.org)
├── globals.css                     # 글로벌 스타일 + 테마
├── error.tsx                       # 에러 페이지
├── not-found.tsx                   # 404 페이지
└── global-error.tsx                # 글로벌 에러

components/
├── Navbar.tsx          # 네비게이션 (스크롤 감지, 장바구니 뱃지, 유저 메뉴)
├── Footer.tsx          # 푸터 (회사정보, 링크)
├── ProductCard.tsx     # 상품 카드 (할인율, NEW 뱃지, 장바구니 추가)
├── PageViewTracker.tsx # 방문자 추적
└── admin/
    └── Sidebar.tsx     # 관리자 사이드바

lib/
├── firebase.ts    # Firebase 초기화 (projectId: seopung-website)
├── db.ts          # Firestore CRUD (상품, 카테고리, 주문, 견적, 설정, 분석)
├── cart.ts        # localStorage 장바구니 관리
├── types.ts       # TypeScript 타입 정의
└── mock-data.ts   # 목 데이터
```

## 컨벤션

### 파일 네이밍
- 페이지: `app/[route]/page.tsx`
- 컴포넌트: PascalCase (`ProductCard.tsx`)
- 라이브러리: camelCase (`db.ts`, `cart.ts`)

### 스타일링
- Tailwind CSS 유틸리티 클래스 사용 (인라인)
- 커스텀 색상은 `globals.css`의 `@theme inline` 블록에 정의
  - `ocean-*`: 주 브랜드 색상 (파란색 계열)
  - `gold-*`: 보조 색상 (프리미엄/굴비)
  - `warm-*`: 배경 톤
- 폰트: `font-[family-name:var(--font-pretendard)]`, `font-[family-name:var(--font-montserrat)]`

### 데이터 패턴
- Firestore CRUD: `lib/db.ts`에 집중, 컬렉션별 함수 export
- 장바구니: `lib/cart.ts` — localStorage 기반, `cart-updated` 커스텀 이벤트로 동기화
- 인증: Firebase Auth (이메일/비밀번호), `shop_users` 컬렉션에 프로필 저장
- 결제: 무통장입금 전용 (PG 미연동)

## Firebase 컬렉션 (Firestore)

| 컬렉션 | 용도 |
|--------|------|
| `shop_products` | 상품 데이터 |
| `shop_categories` | 카테고리 |
| `shop_orders` | 주문 |
| `shop_users` | 회원 프로필 |
| `shop_quotes` | B2B 견적 문의 |
| `shop_settings` | 스토어 설정 (계좌, 배송비, 입금기한) |
| `shop_addresses` | 배송지 주소록 |
| `analytics_daily` | 일별 방문자 (홈페이지와 공유) |

## 핵심 타입 (lib/types.ts)

- `Product`: id, name, slug, categorySlug, price, originalPrice, images[], tags[], isFeatured, isNew, stock
- `Order`: orderNumber, status(6단계), items[], 배송정보, depositorName
- `Category`: slug, name, sortOrder
- `StoreSettings`: bankName, bankAccount, shippingFee, freeShippingThreshold
- `ORDER_STATUS_LABELS`: 상태별 라벨 + 색상 매핑

## 빌드 & 배포

```bash
npm run dev      # 개발 서버
npm run build    # 빌드
npm run lint     # ESLint
```

- Vercel에 자동 배포 (main 브랜치 push 시)
- 원격 이미지 허용: `dureimg.ecoop.or.kr`, `firebasestorage.googleapis.com`

## 작업 시 주의사항

- 모든 페이지 `'use client'` — 클라이언트 컴포넌트 기반
- 장바구니 변경 시 `window.dispatchEvent(new Event('cart-updated'))` 호출 필요
- 주문번호 형식: `SP-YYYYMMDD-NNN` (예: SP-20260401-001)
- 배송비: `freeShippingThreshold`(기본 50,000원) 이상 무료, 미만 시 `shippingFee`(기본 3,000원)
- Firestore 인덱스 미생성 시 클라이언트 필터링 폴백 패턴 사용 중 (try-catch)
- 상품 상세의 `detail` 필드: `"항목:값"` 형식 문자열, `:` 구분자로 파싱

## 고객 피드백 (미팅 요약, 2026-04)

> 아래는 고객 미팅에서 나온 요구사항. 작업 시 항상 이 방향성을 반영할 것.

### 상품 이미지 & 디자인
- **상품 이미지 품질 개선** — 고품질 스튜디오 촬영 이미지 사용, 현장 사진 지양
- **깔끔하고 밝은 디자인** 선호
- **글자 크기 개선** — 가독성 확보

### 상품 & 가격 전략
- **쿠팡 판매 상품과 가격 매칭** — 쿠팡 가격 대비 경쟁력 있는 가격 설정
- **직원이 상품 정보를 직접 업데이트** 할 수 있도록 관리자 UI 사용성 중요

### SEO & 마케팅
- **네이버·구글 검색 최적화** 적극 진행

## 완성도 개선 우선순위

### P0 (필수 — 실운영 전 필수)
- [ ] 상품 검색 기능 (키워드 검색)
- [ ] 상품 정렬 (가격순, 최신순, 인기순)
- [ ] 마이페이지 (주문내역, 배송지 관리, 회원정보 수정)
- [ ] 주문 조회 페이지 완성 (비회원 주문번호+전화번호 조회)
- [ ] 관리자 주문 상세 페이지 완성 (상태변경, 운송장 입력)
- [ ] 상품 이미지 품질 개선 — 고품질 이미지 업로드 가이드, 이미지 크롭/리사이즈 지원
- [ ] 관리자 상품 관리 UI 사용성 개선 (직원이 쉽게 수정 가능하도록)

### P1 (높음)
- [ ] 쿠팡 가격 매칭용 가격 비교 필드 추가 (originalPrice 활용)
- [ ] 상품 필터링 (가격대, 태그)
- [ ] 관련 상품 추천 (같은 카테고리)
- [ ] 상품 리뷰/평점 시스템
- [ ] 주문 상태 변경 시 알림 (이메일 또는 문자)
- [ ] 프론트엔드 상품 목록 페이지네이션
- [ ] 네이버·구글 검색 최적화 (서치어드바이저, Search Console)
- [ ] 글자 크기·가시성 전반 개선

### P2 (중간)
- [ ] PG 결제 연동 (토스페이먼츠/카카오페이)
- [ ] 쿠폰/할인코드 시스템
- [ ] 위시리스트(찜) 기능
- [ ] 상품 옵션(무게, 수량 단위) 선택
- [ ] 관리자 대량 작업 (일괄 상태변경, CSV 상품 등록)

### P3 (향후)
- [ ] 카카오 알림톡 연동
- [ ] 재입고 알림
- [ ] 소셜 로그인 (카카오, 네이버)
- [ ] 상품 비교 기능
- [ ] 블로그/콘텐츠 섹션
