/**
 * GoodsMaster 엑셀 데이터 → Firebase 등록
 * 기존 상품 모두 삭제 후 81개 전부 등록 (이미지 포함)
 */
import { readFileSync } from 'fs';
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

// JSON 읽기
const rawData = JSON.parse(readFileSync('D:/2_Projects/web/Maker_homepade/products_data.json', 'utf-8'));

// 카테고리 매핑
const CAT_MAP = {
  '냉동어류': { id: 'frozen-fish', name: '냉동어류', slug: 'frozen-fish', description: '국내산 원료를 당일 손질·급속동결한 순살·손질 어류', sortOrder: 1 },
  '어패/갑각/연체류': { id: 'seafood', name: '어패·갑각류', slug: 'seafood', description: '새우, 낙지, 바지락, 꽃게 등 냉동 해산물', sortOrder: 2 },
  '해조류': { id: 'seaweed', name: '해조류', slug: 'seaweed', description: '미역, 톳, 꼬시래기 등 해조류', sortOrder: 3 },
  '건어물': { id: 'dried', name: '건어물', slug: 'dried', description: '멸치, 황태채 등 건강한 건어물', sortOrder: 4 },
  '수산물(선물)': { id: 'gift-set', name: '굴비·선물세트', slug: 'gift-set', description: '영광굴비, 명절 선물세트, 프리미엄 수산 선물', sortOrder: 5 },
};

// 이미지 URL 생성 (두레생협 패턴)
function getImageUrl(code) {
  return `https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/${code}C.jpg`;
}

// slug 생성
function makeSlug(name, code) {
  return `sp-${code}`;
}

// 소비자가 계산 (매입가 * 1.3 ~ 1.5 범위, 100원 단위 반올림)
function calcRetailPrice(cost) {
  const retail = Math.round((cost * 1.35) / 100) * 100;
  return retail;
}

async function run() {
  console.log('=== GoodsMaster 엑셀 → Firebase 등록 ===\n');

  // 1. 기존 데이터 삭제
  console.log('1) 기존 상품 삭제...');
  const oldProducts = await getDocs(collection(db, 'shop_products'));
  for (const d of oldProducts.docs) await deleteDoc(d.ref);
  console.log(`   ${oldProducts.size}개 삭제`);

  console.log('2) 기존 카테고리 삭제...');
  const oldCats = await getDocs(collection(db, 'shop_categories'));
  for (const d of oldCats.docs) await deleteDoc(d.ref);
  console.log(`   ${oldCats.size}개 삭제`);

  // 2. 카테고리 등록
  console.log('3) 카테고리 등록...');
  const usedCats = new Set(rawData.map(p => p['중분류']));
  for (const [midName, catData] of Object.entries(CAT_MAP)) {
    if (usedCats.has(midName)) {
      const { id, ...data } = catData;
      await setDoc(doc(db, 'shop_categories', id), { ...data, imageUrl: '', isActive: true });
      console.log(`   + ${catData.name} (${catData.slug})`);
    }
  }

  // 3. 상품 등록
  console.log(`4) 상품 등록 (${rawData.length}개)...`);
  let count = 0;
  const sortByCategory = {};

  for (const item of rawData) {
    const code = item['번호'];
    const name = item['생활재명'];
    const midCat = item['중분류'];
    const spec = item['단위'] || '';
    const cost = item['매입가'] || 0;
    const storage = item['보관분류'] || '';

    // 카테고리 매핑
    const cat = CAT_MAP[midCat];
    if (!cat) {
      console.log(`   ⚠ 카테고리 없음: ${midCat} (${name})`);
      continue;
    }

    // 정렬 순서
    if (!sortByCategory[cat.slug]) sortByCategory[cat.slug] = 0;
    sortByCategory[cat.slug]++;

    const retailPrice = calcRetailPrice(cost);
    const slug = makeSlug(name, code);
    const imageUrl = getImageUrl(code);

    // 보관 방법 태그
    const tags = [];
    if (storage.includes('냉동')) tags.push('냉동');
    if (storage.includes('냉장')) tags.push('냉장');
    if (name.includes('굴비') || name.includes('선물') || name.includes('세트')) tags.push('선물');
    if (name.includes('ASC') || name.includes('MSC')) tags.push('친환경');

    const product = {
      categorySlug: cat.slug,
      name: name,
      slug: slug,
      description: `${name} (${spec})`,
      detail: `상품명: ${name}\n규격: ${spec}\n보관: ${storage.replace(/[0-9]/g, '')}\n제조원: 영어조합법인 서풍`,
      price: retailPrice,
      originalPrice: retailPrice > 10000 ? Math.round((retailPrice * 1.15) / 100) * 100 : undefined,
      unit: 'pack',
      weight: spec,
      stock: 50,
      images: [imageUrl],
      tags: tags,
      isFeatured: cost >= 30000,
      isNew: false,
      isActive: true,
      sortOrder: sortByCategory[cat.slug],
    };

    // undefined 필드 제거
    const cleanProduct = Object.fromEntries(
      Object.entries(product).filter(([_, v]) => v !== undefined)
    );

    await setDoc(doc(db, 'shop_products', `sp-${code}`), cleanProduct);
    count++;
    console.log(`   + [${cat.name}] ${name} | ${retailPrice}원 | 이미지: ${code}C.jpg`);
  }

  // 4. 설정 유지
  console.log('5) 매장 설정 확인...');
  await setDoc(doc(db, 'shop_settings', 'main'), {
    bankName: '농협',
    bankAccount: '301-0000-0000-00',
    accountHolder: '영어조합법인 서풍',
    shippingFee: 3000,
    freeShippingThreshold: 50000,
    paymentDeadlineHours: 24,
  });

  // 요약
  console.log('\n=== 완료 ===');
  console.log(`카테고리: ${Object.keys(sortByCategory).length}개`);
  console.log(`상품: ${count}개`);
  for (const [slug, cnt] of Object.entries(sortByCategory)) {
    const catName = Object.values(CAT_MAP).find(c => c.slug === slug)?.name || slug;
    console.log(`  ${catName}: ${cnt}개`);
  }

  process.exit(0);
}

run().catch(err => { console.error('오류:', err); process.exit(1); });
