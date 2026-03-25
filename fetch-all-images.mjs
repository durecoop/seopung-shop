/**
 * 두레생협 이미지 URL 변형(A/B/C × jpg/png)을 확인하여
 * Firebase shop_products의 images 배열을 업데이트하는 스크립트
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const app = initializeApp({
  apiKey: "AIzaSyCnMM7eMXjZgjP-dovTJ-cfH7iO5RWQnno",
  authDomain: "seopung-website.firebaseapp.com",
  projectId: "seopung-website",
  storageBucket: "seopung-website.firebasestorage.app",
  messagingSenderId: "563395096680",
  appId: "1:563395096680:web:8f363c42f6833f65628bdd",
});
const db = getFirestore(app);

const BASE_URL = 'https://dureimg.ecoop.or.kr:9091/Delsys/DLOG/Goods/GoodsMaster/GoodsImage/';
const SUFFIXES = ['A.jpg', 'B.jpg', 'C.jpg', 'A.png', 'B.png', 'C.png'];

/**
 * Extract the numeric product code from an existing image URL.
 * e.g. ".../20237C.jpg" → "20237"
 */
function extractCode(imageUrl) {
  // Match the last path segment: {code}{letter}.{ext}
  const match = imageUrl.match(/\/(\d+)[A-Z]\.\w+$/i);
  return match ? match[1] : null;
}

/**
 * Check if a URL returns 200 via HEAD request (with timeout)
 */
async function checkUrl(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log('=== 두레생협 이미지 변형 검색 & Firebase 업데이트 ===\n');

  // 1. Read all products
  const snap = await getDocs(collection(db, 'shop_products'));
  const products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log(`상품 수: ${products.length}개\n`);

  const summary = [];

  for (const product of products) {
    const existingImages = product.images || [];
    if (existingImages.length === 0) {
      console.log(`[${product.id}] ${product.name} — 기존 이미지 없음, 건너뜀`);
      summary.push({ id: product.id, name: product.name, count: 0 });
      continue;
    }

    // Extract code from the first existing image
    const code = extractCode(existingImages[0]);
    if (!code) {
      console.log(`[${product.id}] ${product.name} — 코드 추출 실패: ${existingImages[0]}`);
      summary.push({ id: product.id, name: product.name, count: existingImages.length });
      continue;
    }

    console.log(`[${product.id}] ${product.name} (code: ${code})`);

    // Check all variants in parallel
    const urls = SUFFIXES.map(s => `${BASE_URL}${code}${s}`);
    const results = await Promise.all(urls.map(async (url) => {
      const ok = await checkUrl(url);
      return { url, ok };
    }));

    const workingUrls = results.filter(r => r.ok).map(r => r.url);

    for (const r of results) {
      const status = r.ok ? '✓' : '✗';
      console.log(`  ${status} ${r.url.split('/').pop()}`);
    }

    if (workingUrls.length > 0) {
      // Update Firebase
      await updateDoc(doc(db, 'shop_products', product.id), { images: workingUrls });
      console.log(`  → 업데이트: ${workingUrls.length}개 이미지\n`);
    } else {
      console.log(`  → 유효한 이미지 없음 (기존 유지)\n`);
    }

    summary.push({ id: product.id, name: product.name, count: workingUrls.length || existingImages.length });
  }

  // Print summary
  console.log('\n=== 요약 ===');
  console.log('상품ID | 상품명 | 이미지 수');
  console.log('-------|--------|----------');
  let totalImages = 0;
  for (const s of summary) {
    console.log(`${s.id.padEnd(7)} | ${s.name.padEnd(20)} | ${s.count}`);
    totalImages += s.count;
  }
  console.log(`\n총 ${products.length}개 상품, ${totalImages}개 이미지`);

  process.exit(0);
}

main().catch(err => { console.error('오류:', err); process.exit(1); });
