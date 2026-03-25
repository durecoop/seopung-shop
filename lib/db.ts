import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, setDoc, serverTimestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import type { Product, Category, Order, UserProfile } from './types';

/* ── Users ── */
export async function createUserProfile(uid: string, data: Omit<UserProfile, 'uid' | 'createdAt'>) {
  return setDoc(doc(db, 'shop_users', uid), {
    ...data,
    uid,
    createdAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const d = await getDoc(doc(db, 'shop_users', uid));
  if (!d.exists()) return null;
  return { uid: d.id, ...d.data() } as UserProfile;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  return updateDoc(doc(db, 'shop_users', uid), data);
}

/* ── Categories ── */
export async function getCategories(): Promise<Category[]> {
  const q = query(collection(db, 'shop_categories'), orderBy('sortOrder'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Category));
}

export async function addCategory(data: Omit<Category, 'id'>) {
  return addDoc(collection(db, 'shop_categories'), data);
}

export async function updateCategory(id: string, data: Partial<Category>) {
  return updateDoc(doc(db, 'shop_categories', id), data);
}

export async function deleteCategory(id: string) {
  return deleteDoc(doc(db, 'shop_categories', id));
}

/* ── Products ── */
export async function getProducts(categorySlug?: string): Promise<Product[]> {
  try {
    const q = query(collection(db, 'shop_products'), orderBy('sortOrder'));
    const snap = await getDocs(q);
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
    if (categorySlug) {
      return all.filter(p => p.categorySlug === categorySlug);
    }
    return all;
  } catch {
    // fallback: sortOrder 인덱스 없을 경우
    const snap = await getDocs(collection(db, 'shop_products'));
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
    if (categorySlug) {
      return all.filter(p => p.categorySlug === categorySlug);
    }
    return all;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const q = query(collection(db, 'shop_products'), where('slug', '==', slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Product;
}

export async function getProductById(id: string): Promise<Product | null> {
  const d = await getDoc(doc(db, 'shop_products', id));
  if (!d.exists()) return null;
  return { id: d.id, ...d.data() } as Product;
}

export async function addProduct(data: Omit<Product, 'id'>) {
  return addDoc(collection(db, 'shop_products'), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateProduct(id: string, data: Partial<Product>) {
  return updateDoc(doc(db, 'shop_products', id), data);
}

export async function deleteProduct(id: string) {
  return deleteDoc(doc(db, 'shop_products', id));
}

/* ── Orders ── */
export async function getOrders(status?: string): Promise<Order[]> {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
  if (status) {
    constraints.unshift(where('status', '==', status));
  }
  const q = query(collection(db, 'shop_orders'), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  try {
    const q = query(collection(db, 'shop_orders'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
  } catch {
    // fallback: index 미생성 시 클라이언트 필터링
    const snap = await getDocs(collection(db, 'shop_orders'));
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() } as Order))
      .filter(o => o.userId === userId)
      .sort((a, b) => {
        const ta = a.createdAt as any;
        const tb = b.createdAt as any;
        return (tb?.seconds || 0) - (ta?.seconds || 0);
      });
  }
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const q = query(collection(db, 'shop_orders'), where('orderNumber', '==', orderNumber));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Order;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const d = await getDoc(doc(db, 'shop_orders', id));
  if (!d.exists()) return null;
  return { id: d.id, ...d.data() } as Order;
}

export async function createOrder(data: Omit<Order, 'id'>) {
  return addDoc(collection(db, 'shop_orders'), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateOrder(id: string, data: Partial<Order>) {
  return updateDoc(doc(db, 'shop_orders', id), data);
}

/* ── Quotes ── */
export async function getQuotes() {
  const q = query(collection(db, 'shop_quotes'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addQuote(data: Record<string, unknown>) {
  return addDoc(collection(db, 'shop_quotes'), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}

export async function updateQuote(id: string, data: Record<string, unknown>) {
  return updateDoc(doc(db, 'shop_quotes', id), data);
}

/* ── Store Settings ── */
export async function getStoreSettings() {
  const d = await getDoc(doc(db, 'shop_settings', 'main'));
  if (!d.exists()) return null;
  return d.data();
}

export async function updateStoreSettings(data: Record<string, unknown>) {
  return setDoc(doc(db, 'shop_settings', 'main'), data, { merge: true });
}

/* ── Image Upload ── */
export async function uploadProductImage(file: File, productId: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `shop-products/${productId}/${Date.now()}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

/* ── Analytics (방문자 추적) ── */
export async function trackPageView(site: 'web' | 'shop') {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const docId = `${site}_${today}`;
  const ref = doc(db, 'analytics_daily', docId);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      await updateDoc(ref, { views: (data.views || 0) + 1 });
    } else {
      await setDoc(ref, { site, date: today, views: 1 });
    }
  } catch { /* 무시 — 추적 실패가 사용자 경험에 영향 없도록 */ }
}

export interface DailyStats { date: string; views: number; }

export async function getAnalytics(site: 'web' | 'shop', days = 30): Promise<{ daily: DailyStats[]; total: number; today: number }> {
  const snap = await getDocs(collection(db, 'analytics_daily'));
  const all = snap.docs
    .map(d => ({ id: d.id, ...d.data() } as { id: string; site: string; date: string; views: number }))
    .filter(d => d.site === site)
    .sort((a, b) => b.date.localeCompare(a.date));

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayData = all.find(d => d.date === todayStr);
  const total = all.reduce((s, d) => s + (d.views || 0), 0);
  const daily = all.slice(0, days).map(d => ({ date: d.date, views: d.views }));

  return { daily, total, today: todayData?.views || 0 };
}

/* ── Order Number Generation ── */
export async function generateOrderNumber(): Promise<string> {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const prefix = `SP-${today}`;
  const q = query(
    collection(db, 'shop_orders'),
    where('orderNumber', '>=', prefix),
    where('orderNumber', '<=', prefix + '\uf8ff'),
  );
  const snap = await getDocs(q);
  const seq = snap.size + 1;
  return `${prefix}-${String(seq).padStart(3, '0')}`;
}
