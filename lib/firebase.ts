import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCnMM7eMXjZgjP-dovTJ-cfH7iO5RWQnno",
  authDomain: "seopung-website.firebaseapp.com",
  projectId: "seopung-website",
  storageBucket: "seopung-website.firebasestorage.app",
  messagingSenderId: "563395096680",
  appId: "1:563395096680:web:8f363c42f6833f65628bdd",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
