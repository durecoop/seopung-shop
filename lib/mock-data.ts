/* ── 프로토타입용 목업 데이터 ── */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Product {
  id: string;
  categorySlug: string;
  name: string;
  slug: string;
  description: string;
  detail: string;
  price: number;
  originalPrice?: number;
  unit: string;
  weight: string;
  stock: number;
  images: string[];
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending_payment' | 'payment_confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  items: { name: string; price: number; quantity: number }[];
  totalAmount: number;
  shippingFee: number;
  recipientName: string;
  recipientPhone: string;
  address: string;
  createdAt: string;
  trackingNumber?: string;
}

export const CATEGORIES: Category[] = [
  {
    id: '1', name: '냉동수산물', slug: 'frozen',
    description: '신선한 원료를 당일 가공, IQF 급속동결로 품질 유지',
    image: '/images/frozen.jpg', productCount: 8,
  },
  {
    id: '2', name: '밀키트·간편식', slug: 'mealkit',
    description: '대형 유통사 PB OEM 생산, 소비자 트렌드 반영',
    image: '/images/mealkit.jpg', productCount: 5,
  },
  {
    id: '3', name: '영광굴비', slug: 'gulbi',
    description: '여수 직송 참조기, 전통 아가미 섭간, 장인 수작업',
    image: '/images/gulbi.jpg', productCount: 4,
  },
  {
    id: '4', name: '선물세트', slug: 'gift',
    description: '명절·감사·기업 선물, 프리미엄 패키징',
    image: '/images/gift.jpg', productCount: 4,
  },
  {
    id: '5', name: 'ASC·MSC 인증', slug: 'sustainable',
    description: '지속가능한 어업 인증 원료, 글로벌 기준 충족',
    image: '/images/sustainable.jpg', productCount: 3,
  },
];

export const PRODUCTS: Product[] = [
  // ── 냉동수산물 ──
  {
    id: 'p1', categorySlug: 'frozen', name: '고등어필렛 1kg', slug: 'mackerel-fillet-1kg',
    description: '국내산 고등어를 당일 가공하여 급속동결. 뼈 제거 완료.',
    detail: '원산지: 국내산(여수)\n중량: 1kg (약 8~10조각)\n보관: 냉동 -18°C 이하\n유통기한: 제조일로부터 12개월',
    price: 15900, originalPrice: 19900, unit: 'pack', weight: '1kg', stock: 50,
    images: ['/images/products/mackerel-1.jpg', '/images/products/mackerel-2.jpg'],
    tags: ['인기', 'HACCP'], isFeatured: true, isNew: false,
  },
  {
    id: 'p2', categorySlug: 'frozen', name: '삼치필렛 1kg', slug: 'spanish-mackerel-1kg',
    description: '부드러운 살결의 삼치를 필렛으로 손질. 구이·조림 만능.',
    detail: '원산지: 국내산\n중량: 1kg\n보관: 냉동 -18°C 이하',
    price: 18900, unit: 'pack', weight: '1kg', stock: 35,
    images: ['/images/products/spanish-mackerel-1.jpg'],
    tags: ['HACCP'], isFeatured: false, isNew: false,
  },
  {
    id: 'p3', categorySlug: 'frozen', name: '갈치손질 800g', slug: 'hairtail-800g',
    description: '제주산 은갈치를 깨끗이 손질. 토막으로 간편 조리.',
    detail: '원산지: 국내산(제주)\n중량: 800g\n보관: 냉동 -18°C 이하',
    price: 22900, originalPrice: 27900, unit: 'pack', weight: '800g', stock: 25,
    images: ['/images/products/hairtail-1.jpg'],
    tags: ['인기', 'HACCP'], isFeatured: true, isNew: false,
  },
  {
    id: 'p4', categorySlug: 'frozen', name: '오징어손질 1kg', slug: 'squid-1kg',
    description: '국내산 오징어 내장 제거 후 급속동결. 볶음·찌개용.',
    detail: '원산지: 국내산\n중량: 1kg\n보관: 냉동 -18°C 이하',
    price: 16900, unit: 'pack', weight: '1kg', stock: 40,
    images: ['/images/products/squid-1.jpg'],
    tags: ['HACCP'], isFeatured: false, isNew: true,
  },
  {
    id: 'p5', categorySlug: 'frozen', name: '아귀손질 1.5kg', slug: 'monkfish-1.5kg',
    description: '살이 통통한 아귀를 부위별 손질. 찜·탕 전용.',
    detail: '원산지: 국내산(여수)\n중량: 1.5kg\n보관: 냉동 -18°C 이하',
    price: 32900, unit: 'pack', weight: '1.5kg', stock: 15,
    images: ['/images/products/monkfish-1.jpg'],
    tags: ['HACCP'], isFeatured: false, isNew: false,
  },
  // ── 밀키트 ──
  {
    id: 'p6', categorySlug: 'mealkit', name: '해물탕 밀키트 2인분', slug: 'seafood-stew-kit',
    description: '싱싱한 해물과 야채가 한 팩에. 10분이면 완성.',
    detail: '구성: 해물모듬, 야채, 양념장, 당면\n중량: 850g\n인분: 2인분',
    price: 19900, unit: 'kit', weight: '850g', stock: 30,
    images: ['/images/products/seafood-stew-1.jpg'],
    tags: ['인기', '간편식'], isFeatured: true, isNew: true,
  },
  {
    id: 'p7', categorySlug: 'mealkit', name: '매운 오징어볶음 밀키트', slug: 'spicy-squid-kit',
    description: '칼칼한 양념의 오징어볶음. 야채 손질 완료.',
    detail: '구성: 오징어, 양념장, 야채\n중량: 600g\n인분: 2인분',
    price: 15900, unit: 'kit', weight: '600g', stock: 25,
    images: ['/images/products/spicy-squid-1.jpg'],
    tags: ['간편식'], isFeatured: false, isNew: true,
  },
  {
    id: 'p8', categorySlug: 'mealkit', name: '고등어 양념구이 세트', slug: 'mackerel-grilled-set',
    description: '특제 양념에 재운 고등어. 에어프라이어 10분.',
    detail: '구성: 양념 고등어 4조각\n중량: 500g\n조리법: 에어프라이어 180°C 10분',
    price: 13900, unit: 'set', weight: '500g', stock: 40,
    images: ['/images/products/grilled-mackerel-1.jpg'],
    tags: ['간편식', 'HACCP'], isFeatured: false, isNew: false,
  },
  // ── 영광굴비 ──
  {
    id: 'p9', categorySlug: 'gulbi', name: '참조기 굴비세트 10미', slug: 'gulbi-set-10',
    description: '여수 직송 참조기, 전통 아가미 섭간으로 숙성. 장인 수작업.',
    detail: '원산지: 국내산(여수→영광)\n마리수: 10미\n크기: 중(28~30cm)\n보관: 냉동',
    price: 89000, originalPrice: 110000, unit: 'set', weight: '약 2kg', stock: 20,
    images: ['/images/products/gulbi-10-1.jpg', '/images/products/gulbi-10-2.jpg'],
    tags: ['인기', '선물', '프리미엄'], isFeatured: true, isNew: false,
  },
  {
    id: 'p10', categorySlug: 'gulbi', name: '참조기 굴비세트 20미', slug: 'gulbi-set-20',
    description: '대용량 굴비세트. 가족 모임, 명절 선물에 적합.',
    detail: '원산지: 국내산\n마리수: 20미\n크기: 중(28~30cm)',
    price: 159000, originalPrice: 199000, unit: 'set', weight: '약 4kg', stock: 10,
    images: ['/images/products/gulbi-20-1.jpg'],
    tags: ['선물', '프리미엄'], isFeatured: false, isNew: false,
  },
  {
    id: 'p11', categorySlug: 'gulbi', name: '보리굴비 10미', slug: 'bori-gulbi-10',
    description: '보리와 함께 숙성시킨 전통 보리굴비. 깊은 감칠맛.',
    detail: '원산지: 국내산\n마리수: 10미\n숙성: 보리 숙성',
    price: 69000, unit: 'set', weight: '약 1.8kg', stock: 15,
    images: ['/images/products/bori-gulbi-1.jpg'],
    tags: ['전통'], isFeatured: false, isNew: false,
  },
  // ── 선물세트 ──
  {
    id: 'p12', categorySlug: 'gift', name: '프리미엄 명절 선물세트 A', slug: 'premium-gift-a',
    description: '참조기 굴비 + 고등어필렛 + 삼치필렛 구성. 고급 박스 포장.',
    detail: '구성: 참조기굴비 10미 + 고등어필렛 1kg + 삼치필렛 1kg\n포장: 고급 선물 박스',
    price: 129000, originalPrice: 159000, unit: 'set', weight: '약 4kg', stock: 10,
    images: ['/images/products/gift-a-1.jpg'],
    tags: ['명절', '프리미엄', '인기'], isFeatured: true, isNew: false,
  },
  {
    id: 'p13', categorySlug: 'gift', name: '감사 선물세트', slug: 'thanks-gift',
    description: '감사의 마음을 담은 실속 선물세트. 냉동수산물 베스트 구성.',
    detail: '구성: 고등어필렛 500g + 갈치손질 500g + 오징어 500g\n포장: 감사 리본 박스',
    price: 59000, unit: 'set', weight: '약 1.5kg', stock: 20,
    images: ['/images/products/gift-thanks-1.jpg'],
    tags: ['선물'], isFeatured: false, isNew: true,
  },
  // ── ASC·MSC ──
  {
    id: 'p14', categorySlug: 'sustainable', name: 'ASC 인증 흰다리새우살 500g', slug: 'asc-shrimp-500g',
    description: 'ASC 인증 지속가능 양식 새우. 껍질 제거 완료.',
    detail: '원산지: 수입산(ASC 인증)\n중량: 500g\n인증: ASC',
    price: 14900, unit: 'pack', weight: '500g', stock: 30,
    images: ['/images/products/asc-shrimp-1.jpg'],
    tags: ['ASC', '지속가능'], isFeatured: true, isNew: false,
  },
  {
    id: 'p15', categorySlug: 'sustainable', name: 'MSC 인증 명태필렛 1kg', slug: 'msc-pollock-1kg',
    description: 'MSC 인증 자연산 명태. 지속가능한 어업으로 포획.',
    detail: '원산지: 수입산(MSC 인증)\n중량: 1kg\n인증: MSC',
    price: 17900, unit: 'pack', weight: '1kg', stock: 20,
    images: ['/images/products/msc-pollock-1.jpg'],
    tags: ['MSC', '지속가능'], isFeatured: false, isNew: false,
  },
];

export const STORE_SETTINGS = {
  bankName: '농협',
  bankAccount: '301-0000-0000-00',
  accountHolder: '영어조합법인 서풍',
  shippingFee: 3000,
  freeShippingThreshold: 50000,
  paymentDeadlineHours: 24,
};

export const ORDER_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending_payment: { label: '입금대기', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  payment_confirmed: { label: '입금확인', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  preparing: { label: '상품준비', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  shipped: { label: '발송완료', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  delivered: { label: '배송완료', color: 'text-gray-600 bg-gray-100 border-gray-200' },
  cancelled: { label: '주문취소', color: 'text-red-600 bg-red-50 border-red-200' },
};

export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'o1', orderNumber: 'SP-20260324-001', status: 'pending_payment',
    items: [
      { name: '고등어필렛 1kg', price: 15900, quantity: 2 },
      { name: '참조기 굴비세트 10미', price: 89000, quantity: 1 },
    ],
    totalAmount: 120800, shippingFee: 0,
    recipientName: '김철수', recipientPhone: '010-1234-5678',
    address: '서울시 강남구 테헤란로 123 아파트 101동 1001호',
    createdAt: '2026-03-24T09:30:00',
  },
];

export function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR');
}
