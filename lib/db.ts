import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, setDoc, serverTimestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import type { Product, Category, Order } from './types';

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
  const constraints: QueryConstraint[] = [orderBy('sortOrder')];
  if (categorySlug) {
    constraints.unshift(where('categorySlug', '==', categorySlug));
  }
  const q = query(collection(db, 'shop_products'), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
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
