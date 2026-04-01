/**
 * 기존 상품 전체 삭제 → 사진 있는 상품만 등록
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, setDoc, doc } from 'firebase/firestore';

const app = initializeApp({
  apiKey: "AIzaSyCnMM7eMXjZgjP-dovTJ-cfH7iO5RWQnno",
  authDomain: "seopung-website.firebaseapp.com",
  projectId: "seopung-website",
  storageBucket: "seopung-website.firebasestorage.app",
  messagingSenderId: "563395096680",
  appId: "1:563395096680:web:8f363c42f6833f65628bdd",
});
const db = getFirestore(app);

/* ── 카테고리 ── */
const CATEGORIES = [
  { id: 'frozen-fish', name: '냉동어류', slug: 'frozen-fish', description: '국내산 원료를 당일 손질·급속동결한 순살·손질 어류', imageUrl: '', sortOrder: 1, isActive: true },
  { id: 'seafood', name: '어패·갑각류', slug: 'seafood', description: '새우, 낙지, 바지락 등 냉동 해산물', imageUrl: '', sortOrder: 2, isActive: true },
  { id: 'dried', name: '건어물·해조류', slug: 'dried', description: '멸치, 다시마, 김, 미역 등 건강한 건어물', imageUrl: '', sortOrder: 3, isActive: true },
];

/* ── 사진 있는 상품만 ── */
const PRODUCTS = [
  // 냉동어류 (6)
  { id: 'sp01', categorySlug: 'frozen-fish', name: '순살고등어 1kg', slug: 'sunssal-mackerel-1kg',
    description: '머리·꼬리·뼈·내장 제거 후 소금간한 순살고등어. 반마리씩 진공포장.',
    detail: '원산지: 고등어(국산), 천일염(국산), 녹차(국산)\n중량: 1kg (7~9쪽)\n제조원: 바다마을\n보관: 냉동 -18°C 이하\n소비기한: 제조일로부터 12개월',
    price: 19900, originalPrice: 21890, unit: 'pack', weight: '1kg', stock: 50,
    images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/20237C.jpg'],
    tags: ['인기', '국산', 'HACCP'], isFeatured: true, isNew: false, isActive: true, sortOrder: 1 },

  { id: 'sp02', categorySlug: 'frozen-fish', name: '순살삼치 500g', slug: 'sunssal-samchi-500g',
    description: '부드러운 삼치살을 뼈 없이 손질. 구이·조림에 간편하게.',
    detail: '원산지: 삼치(국산)\n중량: 500g\n보관: 냉동 -18°C 이하\n소비기한: 12개월',
    price: 13500, unit: 'pack', weight: '500g', stock: 40,
    images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/20237A.jpg'],
    tags: ['국산', 'HACCP'], isFeatured: false, isNew: false, isActive: true, sortOrder: 2 },

  { id: 'sp03', categorySlug: 'frozen-fish', name: '손질갈치 800g', slug: 'cleaned-hairtail-800g',
    description: '은갈치를 토막 손질하여 급속동결. 조림·구이용.',
    detail: '원산지: 갈치(국산/제주)\n중량: 800g (5~6토막)\n보관: 냉동 -18°C 이하',
    price: 22900, originalPrice: 26900, unit: 'pack', weight: '800g', stock: 25,
    images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/49122C.jpg'],
    tags: ['인기', '국산'], isFeatured: true, isNew: false, isActive: true, sortOrder: 3 },

  { id: 'sp04', categorySlug: 'frozen-fish', name: '안동간고등어 250g', slug: 'andong-mackerel-250g',
    description: '전통 방식으로 간한 안동 간고등어. 1마리 진공포장.',
    detail: '원산지: 고등어(국산)\n중량: 250g (1마리)\n조리법: 해동 후 구이',
    price: 6000, unit: 'pack', weight: '250g', stock: 60,
    images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/2871C.jpg'],
    tags: ['국산', '전통'], isFeatured: false, isNew: false, isActive: true, sortOrder: 4 },

  { id: 'sp05', categorySlug: 'frozen-fish', name: '순살연어 300g', slug: 'salmon-fillet-300g',
    description: 'ASC 인증 양식 연어. 뼈 제거 순살 필렛.',
    detail: '원산지: 연어(노르웨이산, ASC 인증)\n중량: 300g\n보관: 냉동 -18°C 이하',
    price: 12900, unit: 'pack', weight: '300g', stock: 35,
    images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/20237B.jpg'],
    tags: ['ASC', '수입'], isFeatured: false, isNew: true, isActive: true, sortOrder: 5 },

  { id: 'sp06', categorySlug: 'frozen-fish', name: '손질오징어 1kg', slug: 'cleaned-squid-1kg',
    description: '국내산 오징어 내장 제거 후 급속동결. 볶음·찌개용.',
    detail: '원산지: 오징어(국산)\n중량: 1kg\n보관: 냉동 -18°C 이하',
    price: 18500, unit: 'pack', weight: '1kg', stock: 30,
    images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/54984C.jpg'],
    tags: ['국산', 'HACCP'], isFeatured: false, isNew: false, isActive: true, sortOrder: 6 },

  // 어패·갑각류 (4)
  { id: 'sp07', categorySlug: 'seafood', name: '냉동새우살 300g', slug: 'frozen-shrimp-300g',
    description: '껍질 제거한 냉동 새우살. 볶음·탕·샐러드용.',
    detail: '원산지: 새우(수입산)\n중량: 300g\n보관: 냉동 -18°C 이하',
    price: 17000, originalPrice: 18900, unit: 'pack', weight: '300g', stock: 45,
    images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/10906C.jpg'],
    tags: ['인기'], isFeatured: true, isNew: false, isActive: true, sortOrder: 1 },

  { id: 'sp08', categorySlug: 'seafood', name: '냉동바지락살 500g', slug: 'frozen-clam-500g',
    description: '깨끗이 손질한 바지락살. 찌개·된장국·파스타에.',
    detail: '원산지: 바지락(국산)\n중량: 500g\n보관: 냉동 -18°C 이하',
    price: 17500, originalPrice: 19500, unit: 'pack', weight: '500g', stock: 30,
    images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/32581C.jpg'],
    tags: ['국산'], isFeatured: false, isNew: false, isActive: true, sortOrder: 2 },

  { id: 'sp09', categorySlug: 'seafood', name: '냉동낙지 500g', slug: 'frozen-octopus-500g',
    description: '통통한 냉동낙지. 볶음·탕 요리에 최적.',
    detail: '원산지: 낙지(수입산)\n중량: 500g\n보관: 냉동 -18°C 이하',
    price: 26200, unit: 'pack', weight: '500g', stock: 20,
    images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/54984C.jpg'],
    tags: [], isFeatured: false, isNew: false, isActive: true, sortOrder: 3 },

  { id: 'sp10', categorySlug: 'seafood', name: '절단 암꽃게 700g', slug: 'cut-crab-700g',
    description: '절단 손질된 암꽃게. 찜·탕용으로 바로 조리 가능.',
    detail: '원산지: 꽃게(국산)\n중량: 700g\n보관: 냉동 -18°C 이하',
    price: 17200, originalPrice: 20200, unit: 'pack', weight: '700g', stock: 15,
    images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/54925C.jpg'],
    tags: ['국산', '인기'], isFeatured: true, isNew: false, isActive: true, sortOrder: 4 },

  // 건어물·해조류 (3 — 이미지 있는 것만)
  { id: 'sp11', categorySlug: 'dried', name: '국산멸치 (중멸) 200g', slug: 'dried-anchovy-200g',
    description: '국산 중멸치. 볶음·국물용 만능 멸치.',
    detail: '원산지: 멸치(국산/남해)\n중량: 200g\n보관: 냉장 또는 냉동',
    price: 11500, unit: 'pack', weight: '200g', stock: 50,
    images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/51467C.jpg'],
    tags: ['국산'], isFeatured: false, isNew: false, isActive: true, sortOrder: 1 },

  { id: 'sp12', categorySlug: 'dried', name: '구운김 전장 10매', slug: 'roasted-seaweed-10',
    description: '국산 원초로 만든 구운김. 참기름·소금 간.',
    detail: '원산지: 김(국산)\n매수: 10매\n보관: 실온 (습기 주의)',
    price: 5900, unit: 'pack', weight: '10매', stock: 80,
    images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/51232C.jpg'],
    tags: ['국산', '인기'], isFeatured: false, isNew: false, isActive: true, sortOrder: 2 },

  { id: 'sp13', categorySlug: 'dried', name: '다시마 200g', slug: 'kelp-200g',
    description: '완도산 자연산 다시마. 육수·조림·무침용.',
    detail: '원산지: 다시마(국산/완도)\n중량: 200g\n보관: 실온',
    price: 6500, unit: 'pack', weight: '200g', stock: 60,
    images: ['https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/51232A.jpg'],
    tags: ['국산'], isFeatured: false, isNew: false, isActive: true, sortOrder: 3 },
];

const SETTINGS = {
  bankName: '농협',
  bankAccount: '301-0000-0000-00',
  accountHolder: '영어조합법인 서풍',
  shippingFee: 3000,
  freeShippingThreshold: 50000,
  paymentDeadlineHours: 24,
};

async function run() {
  console.log('=== 서풍몰 데이터 초기화 (사진 있는 상품만) ===\n');

  // 1. 기존 데이터 삭제
  console.log('1) 기존 상품 삭제...');
  const oldProducts = await getDocs(collection(db, 'shop_products'));
  for (const d of oldProducts.docs) await deleteDoc(d.ref);
  console.log(`   삭제 완료: ${oldProducts.size}개`);

  console.log('2) 기존 카테고리 삭제...');
  const oldCats = await getDocs(collection(db, 'shop_categories'));
  for (const d of oldCats.docs) await deleteDoc(d.ref);
  console.log(`   삭제 완료: ${oldCats.size}개`);

  // 2. 카테고리 등록
  console.log('3) 카테고리 등록...');
  for (const cat of CATEGORIES) {
    const { id, ...data } = cat;
    await setDoc(doc(db, 'shop_categories', id), data);
    console.log(`   + ${cat.name} (${cat.slug})`);
  }

  // 3. 상품 등록
  console.log(`4) 상품 등록 (${PRODUCTS.length}개)...`);
  for (const prod of PRODUCTS) {
    const { id, ...data } = prod;
    await setDoc(doc(db, 'shop_products', id), data);
    console.log(`   + ${prod.name} (${prod.categorySlug})`);
  }

  // 4. 설정 등록
  console.log('5) 매장 설정 등록...');
  await setDoc(doc(db, 'shop_settings', 'main'), SETTINGS);

  // 요약
  console.log('\n=== 완료 ===');
  console.log(`카테고리: ${CATEGORIES.length}개`);
  console.log(`상품: ${PRODUCTS.length}개 (전부 이미지 있음)`);
  console.log(`  냉동어류: ${PRODUCTS.filter(p => p.categorySlug === 'frozen-fish').length}개`);
  console.log(`  어패·갑각류: ${PRODUCTS.filter(p => p.categorySlug === 'seafood').length}개`);
  console.log(`  건어물·해조류: ${PRODUCTS.filter(p => p.categorySlug === 'dried').length}개`);

  process.exit(0);
}

run().catch(err => { console.error('오류:', err); process.exit(1); });
