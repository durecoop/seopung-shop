'use client';

import { useState } from 'react';
import { collection, setDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const SEED_CATEGORIES = [
  { id: 'frozen', name: '냉동수산물', slug: 'frozen', description: '신선한 원료를 당일 가공, IQF 급속동결로 품질 유지', imageUrl: '', sortOrder: 1, isActive: true },
  { id: 'mealkit', name: '밀키트·간편식', slug: 'mealkit', description: '대형 유통사 PB OEM 생산, 소비자 트렌드 반영', imageUrl: '', sortOrder: 2, isActive: true },
  { id: 'gulbi', name: '영광굴비', slug: 'gulbi', description: '여수 직송 참조기, 전통 아가미 섭간, 장인 수작업', imageUrl: '', sortOrder: 3, isActive: true },
  { id: 'gift', name: '선물세트', slug: 'gift', description: '명절·감사·기업 선물, 프리미엄 패키징', imageUrl: '', sortOrder: 4, isActive: true },
  { id: 'sustainable', name: 'ASC·MSC 인증', slug: 'sustainable', description: '지속가능한 어업 인증 원료, 글로벌 기준 충족', imageUrl: '', sortOrder: 5, isActive: true },
];

const SEED_PRODUCTS = [
  { id: 'p1', categorySlug: 'frozen', name: '고등어필렛 1kg', slug: 'mackerel-fillet-1kg', description: '국내산 고등어를 당일 가공하여 급속동결. 뼈 제거 완료.', detail: '원산지: 국내산(여수)\n중량: 1kg (약 8~10조각)\n보관: 냉동 -18°C 이하\n유통기한: 제조일로부터 12개월', price: 15900, originalPrice: 19900, unit: 'pack', weight: '1kg', stock: 50, images: [], tags: ['인기', 'HACCP'], isFeatured: true, isNew: false, isActive: true, sortOrder: 1 },
  { id: 'p2', categorySlug: 'frozen', name: '삼치필렛 1kg', slug: 'spanish-mackerel-1kg', description: '부드러운 살결의 삼치를 필렛으로 손질.', detail: '원산지: 국내산\n중량: 1kg\n보관: 냉동 -18°C 이하', price: 18900, unit: 'pack', weight: '1kg', stock: 35, images: [], tags: ['HACCP'], isFeatured: false, isNew: false, isActive: true, sortOrder: 2 },
  { id: 'p3', categorySlug: 'frozen', name: '갈치손질 800g', slug: 'hairtail-800g', description: '제주산 은갈치를 깨끗이 손질. 토막으로 간편 조리.', detail: '원산지: 국내산(제주)\n중량: 800g', price: 22900, originalPrice: 27900, unit: 'pack', weight: '800g', stock: 25, images: [], tags: ['인기', 'HACCP'], isFeatured: true, isNew: false, isActive: true, sortOrder: 3 },
  { id: 'p4', categorySlug: 'frozen', name: '오징어손질 1kg', slug: 'squid-1kg', description: '국내산 오징어 내장 제거 후 급속동결.', detail: '원산지: 국내산\n중량: 1kg', price: 16900, unit: 'pack', weight: '1kg', stock: 40, images: [], tags: ['HACCP'], isFeatured: false, isNew: true, isActive: true, sortOrder: 4 },
  { id: 'p5', categorySlug: 'frozen', name: '아귀손질 1.5kg', slug: 'monkfish-1.5kg', description: '살이 통통한 아귀를 부위별 손질.', detail: '원산지: 국내산(여수)\n중량: 1.5kg', price: 32900, unit: 'pack', weight: '1.5kg', stock: 15, images: [], tags: ['HACCP'], isFeatured: false, isNew: false, isActive: true, sortOrder: 5 },
  { id: 'p6', categorySlug: 'mealkit', name: '해물탕 밀키트 2인분', slug: 'seafood-stew-kit', description: '싱싱한 해물과 야채가 한 팩에. 10분이면 완성.', detail: '구성: 해물모듬, 야채, 양념장, 당면\n중량: 850g', price: 19900, unit: 'kit', weight: '850g', stock: 30, images: [], tags: ['인기', '간편식'], isFeatured: true, isNew: true, isActive: true, sortOrder: 1 },
  { id: 'p7', categorySlug: 'mealkit', name: '매운 오징어볶음 밀키트', slug: 'spicy-squid-kit', description: '칼칼한 양념의 오징어볶음.', detail: '구성: 오징어, 양념장, 야채\n중량: 600g', price: 15900, unit: 'kit', weight: '600g', stock: 25, images: [], tags: ['간편식'], isFeatured: false, isNew: true, isActive: true, sortOrder: 2 },
  { id: 'p8', categorySlug: 'mealkit', name: '고등어 양념구이 세트', slug: 'mackerel-grilled-set', description: '특제 양념에 재운 고등어. 에어프라이어 10분.', detail: '구성: 양념 고등어 4조각\n중량: 500g', price: 13900, unit: 'set', weight: '500g', stock: 40, images: [], tags: ['간편식', 'HACCP'], isFeatured: false, isNew: false, isActive: true, sortOrder: 3 },
  { id: 'p9', categorySlug: 'gulbi', name: '참조기 굴비세트 10미', slug: 'gulbi-set-10', description: '여수 직송 참조기, 전통 아가미 섭간으로 숙성.', detail: '원산지: 국내산(여수→영광)\n마리수: 10미\n크기: 중(28~30cm)', price: 89000, originalPrice: 110000, unit: 'set', weight: '약 2kg', stock: 20, images: [], tags: ['인기', '선물', '프리미엄'], isFeatured: true, isNew: false, isActive: true, sortOrder: 1 },
  { id: 'p10', categorySlug: 'gulbi', name: '참조기 굴비세트 20미', slug: 'gulbi-set-20', description: '대용량 굴비세트.', detail: '마리수: 20미\n크기: 중(28~30cm)', price: 159000, originalPrice: 199000, unit: 'set', weight: '약 4kg', stock: 10, images: [], tags: ['선물', '프리미엄'], isFeatured: false, isNew: false, isActive: true, sortOrder: 2 },
  { id: 'p11', categorySlug: 'gulbi', name: '보리굴비 10미', slug: 'bori-gulbi-10', description: '보리와 함께 숙성시킨 전통 보리굴비.', detail: '마리수: 10미', price: 69000, unit: 'set', weight: '약 1.8kg', stock: 15, images: [], tags: ['전통'], isFeatured: false, isNew: false, isActive: true, sortOrder: 3 },
  { id: 'p12', categorySlug: 'gift', name: '프리미엄 명절 선물세트 A', slug: 'premium-gift-a', description: '참조기 굴비 + 고등어필렛 + 삼치필렛 구성.', detail: '구성: 굴비 10미 + 고등어 1kg + 삼치 1kg', price: 129000, originalPrice: 159000, unit: 'set', weight: '약 4kg', stock: 10, images: [], tags: ['명절', '프리미엄', '인기'], isFeatured: true, isNew: false, isActive: true, sortOrder: 1 },
  { id: 'p13', categorySlug: 'gift', name: '감사 선물세트', slug: 'thanks-gift', description: '감사의 마음을 담은 실속 선물세트.', detail: '구성: 고등어 500g + 갈치 500g + 오징어 500g', price: 59000, unit: 'set', weight: '약 1.5kg', stock: 20, images: [], tags: ['선물'], isFeatured: false, isNew: true, isActive: true, sortOrder: 2 },
  { id: 'p14', categorySlug: 'sustainable', name: 'ASC 인증 흰다리새우살 500g', slug: 'asc-shrimp-500g', description: 'ASC 인증 지속가능 양식 새우.', detail: '중량: 500g\n인증: ASC', price: 14900, unit: 'pack', weight: '500g', stock: 30, images: [], tags: ['ASC', '지속가능'], isFeatured: true, isNew: false, isActive: true, sortOrder: 1 },
  { id: 'p15', categorySlug: 'sustainable', name: 'MSC 인증 명태필렛 1kg', slug: 'msc-pollock-1kg', description: 'MSC 인증 자연산 명태.', detail: '중량: 1kg\n인증: MSC', price: 17900, unit: 'pack', weight: '1kg', stock: 20, images: [], tags: ['MSC', '지속가능'], isFeatured: false, isNew: false, isActive: true, sortOrder: 2 },
];

const SEED_SETTINGS = {
  bankName: '농협',
  bankAccount: '301-0000-0000-00',
  accountHolder: '영어조합법인 서풍',
  shippingFee: 3000,
  freeShippingThreshold: 50000,
  paymentDeadlineHours: 24,
};

export default function SeedPage() {
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const addLog = (msg: string) => setLog(prev => [...prev, msg]);

  const runSeed = async () => {
    setRunning(true);
    setLog([]);

    try {
      // Categories
      addLog('카테고리 등록 중...');
      for (const cat of SEED_CATEGORIES) {
        const { id, ...data } = cat;
        await setDoc(doc(db, 'shop_categories', id), data);
      }
      addLog(`✅ 카테고리 ${SEED_CATEGORIES.length}개 등록 완료`);

      // Products
      addLog('상품 등록 중...');
      for (const prod of SEED_PRODUCTS) {
        const { id, ...data } = prod;
        await setDoc(doc(db, 'shop_products', id), data);
      }
      addLog(`✅ 상품 ${SEED_PRODUCTS.length}개 등록 완료`);

      // Settings
      addLog('매장 설정 등록 중...');
      await setDoc(doc(db, 'shop_settings', 'main'), SEED_SETTINGS);
      addLog('✅ 매장 설정 등록 완료');

      addLog('');
      addLog('🎉 초기 데이터 시딩 완료!');
    } catch (err) {
      addLog(`❌ 오류: ${err}`);
    }

    setRunning(false);
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">초기 데이터 시딩</h1>
      <p className="mb-6 text-gray-500">Firebase Firestore에 초기 상품/카테고리/설정 데이터를 등록합니다.</p>

      <button onClick={runSeed} disabled={running}
        className={`rounded-lg px-6 py-3 font-semibold text-white ${running ? 'bg-gray-400' : 'bg-ocean-500 hover:bg-ocean-600'}`}>
        {running ? '실행 중...' : '시딩 실행'}
      </button>

      {log.length > 0 && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
          {log.map((msg, i) => (
            <p key={i} className="py-1 font-mono text-sm text-gray-600">{msg}</p>
          ))}
        </div>
      )}
    </div>
  );
}
