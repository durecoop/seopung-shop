'use client';

import { useState } from 'react';
import { collection, setDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/* ── 두레생협 기반 실제 카테고리 ── */
const SEED_CATEGORIES = [
  { id: 'frozen-fish', name: '냉동어류', slug: 'frozen-fish', description: '국내산 원료를 당일 손질·급속동결한 순살·손질 어류', imageUrl: '', sortOrder: 1, isActive: true },
  { id: 'seafood', name: '어패·갑각류', slug: 'seafood', description: '새우, 낙지, 바지락 등 냉동 해산물', imageUrl: '', sortOrder: 2, isActive: true },
  { id: 'dried', name: '건어물·해조류', slug: 'dried', description: '멸치, 다시마, 김, 미역 등 건강한 건어물', imageUrl: '', sortOrder: 3, isActive: true },
  { id: 'easy-cook', name: '간편식·반찬', slug: 'easy-cook', description: '간편하게 조리하는 수산 가공식품과 밀키트', imageUrl: '', sortOrder: 4, isActive: true },
  { id: 'gulbi-gift', name: '굴비·선물세트', slug: 'gulbi-gift', description: '영광굴비, 명절 선물세트, 프리미엄 수산 선물', imageUrl: '', sortOrder: 5, isActive: true },
];

/* ── 두레생협 장보기 기반 실제 상품 ── */
const SEED_PRODUCTS = [
  // ── 냉동어류 ──
  { id: 'sp01', categorySlug: 'frozen-fish', name: '순살고등어 1kg', slug: 'sunssal-mackerel-1kg',
    description: '머리·꼬리·뼈·내장 제거 후 소금간한 순살고등어. 반마리씩 진공포장.',
    detail: '원산지: 고등어(국산), 천일염(국산), 녹차(국산)\n중량: 1kg (7~9쪽)\n제조원: 바다마을\n보관: 냉동 -18°C 이하\n소비기한: 제조일로부터 12개월',
    price: 19900, originalPrice: 21890, unit: 'pack', weight: '1kg', stock: 50, images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/20237C.jpg'], tags: ['인기', '국산', 'HACCP'], isFeatured: true, isNew: false, isActive: true, sortOrder: 1 },

  { id: 'sp02', categorySlug: 'frozen-fish', name: '순살삼치 500g', slug: 'sunssal-samchi-500g',
    description: '부드러운 삼치살을 뼈 없이 손질. 구이·조림에 간편하게.',
    detail: '원산지: 삼치(국산)\n중량: 500g\n보관: 냉동 -18°C 이하\n소비기한: 12개월',
    price: 13500, unit: 'pack', weight: '500g', stock: 40, images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/20237A.jpg'], tags: ['국산', 'HACCP'], isFeatured: false, isNew: false, isActive: true, sortOrder: 2 },

  { id: 'sp03', categorySlug: 'frozen-fish', name: '손질갈치 800g', slug: 'cleaned-hairtail-800g',
    description: '은갈치를 토막 손질하여 급속동결. 조림·구이용.',
    detail: '원산지: 갈치(국산/제주)\n중량: 800g (5~6토막)\n보관: 냉동 -18°C 이하',
    price: 22900, originalPrice: 26900, unit: 'pack', weight: '800g', stock: 25, images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/49122C.jpg'], tags: ['인기', '국산'], isFeatured: true, isNew: false, isActive: true, sortOrder: 3 },

  { id: 'sp04', categorySlug: 'frozen-fish', name: '안동간고등어 250g', slug: 'andong-mackerel-250g',
    description: '전통 방식으로 간한 안동 간고등어. 1마리 진공포장.',
    detail: '원산지: 고등어(국산)\n중량: 250g (1마리)\n조리법: 해동 후 구이',
    price: 6000, unit: 'pack', weight: '250g', stock: 60, images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/2871C.jpg'], tags: ['국산', '전통'], isFeatured: false, isNew: false, isActive: true, sortOrder: 4 },

  { id: 'sp05', categorySlug: 'frozen-fish', name: '순살연어 300g', slug: 'salmon-fillet-300g',
    description: 'ASC 인증 양식 연어. 뼈 제거 순살 필렛.',
    detail: '원산지: 연어(노르웨이산, ASC 인증)\n중량: 300g\n보관: 냉동 -18°C 이하',
    price: 12900, unit: 'pack', weight: '300g', stock: 35, images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/20237B.jpg'], tags: ['ASC', '수입'], isFeatured: false, isNew: true, isActive: true, sortOrder: 5 },

  { id: 'sp06', categorySlug: 'frozen-fish', name: '손질오징어 1kg', slug: 'cleaned-squid-1kg',
    description: '국내산 오징어 내장 제거 후 급속동결. 볶음·찌개용.',
    detail: '원산지: 오징어(국산)\n중량: 1kg\n보관: 냉동 -18°C 이하',
    price: 18500, unit: 'pack', weight: '1kg', stock: 30, images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/54984C.jpg'], tags: ['국산', 'HACCP'], isFeatured: false, isNew: false, isActive: true, sortOrder: 6 },

  // ── 어패·갑각류 ──
  { id: 'sp07', categorySlug: 'seafood', name: '냉동새우살 300g', slug: 'frozen-shrimp-300g',
    description: '껍질 제거한 냉동 새우살. 볶음·탕·샐러드용.',
    detail: '원산지: 새우(수입산)\n중량: 300g\n보관: 냉동 -18°C 이하',
    price: 17000, originalPrice: 18900, unit: 'pack', weight: '300g', stock: 45, images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/10906C.jpg'], tags: ['인기'], isFeatured: true, isNew: false, isActive: true, sortOrder: 1 },

  { id: 'sp08', categorySlug: 'seafood', name: '냉동바지락살 500g', slug: 'frozen-clam-500g',
    description: '깨끗이 손질한 바지락살. 찌개·된장국·파스타에.',
    detail: '원산지: 바지락(국산)\n중량: 500g\n보관: 냉동 -18°C 이하',
    price: 17500, originalPrice: 19500, unit: 'pack', weight: '500g', stock: 30, images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/32581C.jpg'], tags: ['국산'], isFeatured: false, isNew: false, isActive: true, sortOrder: 2 },

  { id: 'sp09', categorySlug: 'seafood', name: '냉동낙지 500g', slug: 'frozen-octopus-500g',
    description: '통통한 냉동낙지. 볶음·탕 요리에 최적.',
    detail: '원산지: 낙지(수입산)\n중량: 500g\n보관: 냉동 -18°C 이하',
    price: 26200, unit: 'pack', weight: '500g', stock: 20, images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/54984C.jpg'], tags: [], isFeatured: false, isNew: false, isActive: true, sortOrder: 3 },

  { id: 'sp10', categorySlug: 'seafood', name: '절단 암꽃게 700g', slug: 'cut-crab-700g',
    description: '절단 손질된 암꽃게. 찜·탕용으로 바로 조리 가능.',
    detail: '원산지: 꽃게(국산)\n중량: 700g\n보관: 냉동 -18°C 이하',
    price: 17200, originalPrice: 20200, unit: 'pack', weight: '700g', stock: 15, images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/54925C.jpg'], tags: ['국산', '인기'], isFeatured: true, isNew: false, isActive: true, sortOrder: 4 },

  // ── 건어물·해조류 ──
  { id: 'sp11', categorySlug: 'dried', name: '국산멸치 (중멸) 200g', slug: 'dried-anchovy-200g',
    description: '국산 중멸치. 볶음·국물용 만능 멸치.',
    detail: '원산지: 멸치(국산/남해)\n중량: 200g\n보관: 냉장 또는 냉동',
    price: 11500, unit: 'pack', weight: '200g', stock: 50, images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/51467C.jpg'], tags: ['국산'], isFeatured: false, isNew: false, isActive: true, sortOrder: 1 },

  { id: 'sp12', categorySlug: 'dried', name: '구운김 전장 10매', slug: 'roasted-seaweed-10',
    description: '국산 원초로 만든 구운김. 참기름·소금 간.',
    detail: '원산지: 김(국산)\n매수: 10매\n보관: 실온 (습기 주의)',
    price: 5900, unit: 'pack', weight: '10매', stock: 80, images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/51232C.jpg'], tags: ['국산', '인기'], isFeatured: false, isNew: false, isActive: true, sortOrder: 2 },

  { id: 'sp13', categorySlug: 'dried', name: '다시마 200g', slug: 'kelp-200g',
    description: '완도산 자연산 다시마. 육수·조림·무침용.',
    detail: '원산지: 다시마(국산/완도)\n중량: 200g\n보관: 실온',
    price: 6500, unit: 'pack', weight: '200g', stock: 60, images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/51232A.jpg'], tags: ['국산'], isFeatured: false, isNew: false, isActive: true, sortOrder: 3 },

  { id: 'sp14', categorySlug: 'dried', name: '건미역 100g', slug: 'dried-seaweed-100g',
    description: '완도산 건미역. 미역국·초무침에.',
    detail: '원산지: 미역(국산/완도)\n중량: 100g\n보관: 실온',
    price: 4800, unit: 'pack', weight: '100g', stock: 70, images: [''], tags: ['국산'], isFeatured: false, isNew: false, isActive: true, sortOrder: 4 },

  // ── 간편식·반찬 ──
  { id: 'sp15', categorySlug: 'easy-cook', name: '해물탕 밀키트 2인분', slug: 'seafood-stew-kit-2',
    description: '싱싱한 해물과 야채가 한 팩에. 10분이면 완성.',
    detail: '구성: 해물모듬, 야채, 양념장, 당면\n중량: 850g\n인분: 2인분\n보관: 냉동',
    price: 19900, unit: 'kit', weight: '850g', stock: 25, images: [''], tags: ['인기', '간편식'], isFeatured: true, isNew: true, isActive: true, sortOrder: 1 },

  { id: 'sp16', categorySlug: 'easy-cook', name: '고등어 양념구이 (2팩)', slug: 'seasoned-mackerel-2pack',
    description: '특제 양념에 재운 고등어구이. 전자레인지 3분.',
    detail: '구성: 양념고등어 2팩\n중량: 400g\n조리: 전자레인지 3분 또는 프라이팬',
    price: 11900, unit: 'set', weight: '400g', stock: 35, images: [''], tags: ['간편식', 'HACCP'], isFeatured: false, isNew: true, isActive: true, sortOrder: 2 },

  { id: 'sp17', categorySlug: 'easy-cook', name: '오징어볶음 밀키트 2인분', slug: 'squid-stir-fry-kit',
    description: '매콤한 양념의 오징어볶음. 야채 손질 완료.',
    detail: '구성: 오징어, 양념장, 야채\n중량: 600g\n인분: 2인분',
    price: 15900, unit: 'kit', weight: '600g', stock: 20, images: [''], tags: ['간편식'], isFeatured: false, isNew: true, isActive: true, sortOrder: 3 },

  { id: 'sp18', categorySlug: 'easy-cook', name: '고등어무조림 간편팩', slug: 'mackerel-radish-stew',
    description: '전자레인지로 간편하게. 고등어무조림 완조리 반찬.',
    detail: '중량: 300g\n조리: 전자레인지 4분\n보관: 냉동',
    price: 8900, unit: 'pack', weight: '300g', stock: 40, images: [''], tags: ['간편식', '반찬'], isFeatured: false, isNew: false, isActive: true, sortOrder: 4 },

  { id: 'sp19', categorySlug: 'easy-cook', name: '갈치조림 간편팩', slug: 'hairtail-braised-pack',
    description: '부드러운 갈치조림. 밥 위에 올려 간편하게.',
    detail: '중량: 300g\n조리: 전자레인지 4분\n보관: 냉동',
    price: 9900, unit: 'pack', weight: '300g', stock: 30, images: [''], tags: ['간편식', '반찬'], isFeatured: false, isNew: false, isActive: true, sortOrder: 5 },

  // ── 굴비·선물세트 ──
  { id: 'sp20', categorySlug: 'gulbi-gift', name: '참조기 굴비세트 10미', slug: 'gulbi-set-10',
    description: '여수 직송 참조기를 전통 아가미 섭간으로 숙성. 장인 수작업 굴비.',
    detail: '원산지: 참조기(국산/여수→영광)\n마리수: 10미\n크기: 중(28~30cm)\n보관: 냉동\n제조: 영어조합법인 서풍',
    price: 89000, originalPrice: 110000, unit: 'set', weight: '약 2kg', stock: 15, images: [''], tags: ['인기', '선물', '프리미엄'], isFeatured: true, isNew: false, isActive: true, sortOrder: 1 },

  { id: 'sp21', categorySlug: 'gulbi-gift', name: '참조기 굴비세트 20미', slug: 'gulbi-set-20',
    description: '대용량 프리미엄 굴비세트. 명절·가족모임 선물.',
    detail: '마리수: 20미\n크기: 중(28~30cm)\n보관: 냉동',
    price: 159000, originalPrice: 199000, unit: 'set', weight: '약 4kg', stock: 8, images: [''], tags: ['선물', '프리미엄'], isFeatured: false, isNew: false, isActive: true, sortOrder: 2 },

  { id: 'sp22', categorySlug: 'gulbi-gift', name: '보리굴비 10미', slug: 'bori-gulbi-10',
    description: '보리와 함께 숙성시킨 전통 보리굴비. 깊은 감칠맛.',
    detail: '마리수: 10미\n숙성: 보리 숙성\n보관: 냉동',
    price: 69000, unit: 'set', weight: '약 1.8kg', stock: 12, images: [''], tags: ['전통'], isFeatured: false, isNew: false, isActive: true, sortOrder: 3 },

  { id: 'sp23', categorySlug: 'gulbi-gift', name: '프리미엄 수산 선물세트 A', slug: 'premium-gift-set-a',
    description: '굴비 10미 + 순살고등어 1kg + 순살삼치 500g 고급 박스 구성.',
    detail: '구성: 참조기굴비 10미 + 순살고등어 1kg + 순살삼치 500g\n포장: 고급 선물 박스\n보관: 냉동',
    price: 129000, originalPrice: 152400, unit: 'set', weight: '약 3.5kg', stock: 10, images: [''], tags: ['명절', '프리미엄', '인기'], isFeatured: true, isNew: false, isActive: true, sortOrder: 4 },

  { id: 'sp24', categorySlug: 'gulbi-gift', name: '감사 수산 선물세트', slug: 'thanks-seafood-gift',
    description: '순살고등어 + 손질갈치 + 새우살 실속 구성.',
    detail: '구성: 순살고등어 1kg + 손질갈치 800g + 새우살 300g\n포장: 감사 리본 박스',
    price: 59000, unit: 'set', weight: '약 2kg', stock: 20, images: [''], tags: ['선물'], isFeatured: false, isNew: true, isActive: true, sortOrder: 5 },
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
      // 기존 데이터 삭제
      addLog('🗑️ 기존 상품 데이터 삭제 중...');
      const oldProducts = await getDocs(collection(db, 'shop_products'));
      for (const d of oldProducts.docs) { await deleteDoc(d.ref); }
      addLog(`  삭제: 기존 상품 ${oldProducts.size}개`);

      const oldCategories = await getDocs(collection(db, 'shop_categories'));
      for (const d of oldCategories.docs) { await deleteDoc(d.ref); }
      addLog(`  삭제: 기존 카테고리 ${oldCategories.size}개`);

      // 카테고리 등록
      addLog('📁 카테고리 등록 중...');
      for (const cat of SEED_CATEGORIES) {
        const { id, ...data } = cat;
        await setDoc(doc(db, 'shop_categories', id), data);
      }
      addLog(`✅ 카테고리 ${SEED_CATEGORIES.length}개 등록 완료`);

      // 상품 등록
      addLog('📦 상품 등록 중...');
      for (const prod of SEED_PRODUCTS) {
        const { id, ...data } = prod;
        await setDoc(doc(db, 'shop_products', id), data);
      }
      addLog(`✅ 상품 ${SEED_PRODUCTS.length}개 등록 완료`);

      // 설정 등록
      addLog('⚙️ 매장 설정 등록 중...');
      await setDoc(doc(db, 'shop_settings', 'main'), SEED_SETTINGS);
      addLog('✅ 매장 설정 등록 완료');

      addLog('');
      addLog('🎉 두레생협 기반 초기 데이터 시딩 완료!');
      addLog('');
      addLog('등록된 카테고리:');
      SEED_CATEGORIES.forEach(c => addLog(`  • ${c.name} (${c.slug})`));
      addLog('');
      addLog(`등록된 상품: 총 ${SEED_PRODUCTS.length}개`);
      addLog(`  냉동어류: ${SEED_PRODUCTS.filter(p => p.categorySlug === 'frozen-fish').length}개`);
      addLog(`  어패·갑각류: ${SEED_PRODUCTS.filter(p => p.categorySlug === 'seafood').length}개`);
      addLog(`  건어물·해조류: ${SEED_PRODUCTS.filter(p => p.categorySlug === 'dried').length}개`);
      addLog(`  간편식·반찬: ${SEED_PRODUCTS.filter(p => p.categorySlug === 'easy-cook').length}개`);
      addLog(`  굴비·선물세트: ${SEED_PRODUCTS.filter(p => p.categorySlug === 'gulbi-gift').length}개`);
    } catch (err) {
      addLog(`❌ 오류: ${err}`);
    }

    setRunning(false);
  };

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">초기 데이터 시딩</h1>
      <p className="mb-2 text-gray-500">두레생협 장보기 기반으로 구성한 수산물 상품을 Firebase에 등록합니다.</p>
      <p className="mb-6 text-sm text-red-500">* 기존 상품/카테고리를 모두 삭제하고 새로 등록합니다.</p>

      <button onClick={runSeed} disabled={running}
        className={`rounded-lg px-6 py-3 font-semibold text-white ${running ? 'bg-gray-400' : 'bg-ocean-500 hover:bg-ocean-600'}`}>
        {running ? '실행 중...' : '시딩 실행 (기존 삭제 + 새로 등록)'}
      </button>

      {log.length > 0 && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 max-h-[600px] overflow-y-auto">
          {log.map((msg, i) => (
            <p key={i} className="py-0.5 font-mono text-sm text-gray-600">{msg}</p>
          ))}
        </div>
      )}
    </div>
  );
}
