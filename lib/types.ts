export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
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
  isActive: boolean;
  sortOrder: number;
  createdAt?: unknown;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending_payment' | 'payment_confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  recipientName: string;
  recipientPhone: string;
  address: string;
  addressDetail: string;
  postalCode: string;
  deliveryMemo: string;
  depositorName: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  adminNote?: string;
  createdAt?: unknown;
}

export interface Quote {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  message: string;
  status: 'pending' | 'reviewed' | 'quoted';
  adminNote?: string;
  createdAt?: unknown;
}

export interface StoreSettings {
  bankName: string;
  bankAccount: string;
  accountHolder: string;
  shippingFee: number;
  freeShippingThreshold: number;
  paymentDeadlineHours: number;
}

export const ORDER_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending_payment: { label: '입금대기', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  payment_confirmed: { label: '입금확인', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  preparing: { label: '상품준비', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  shipped: { label: '발송완료', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  delivered: { label: '배송완료', color: 'text-gray-600 bg-gray-100 border-gray-200' },
  cancelled: { label: '주문취소', color: 'text-red-600 bg-red-50 border-red-200' },
};

export function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR');
}
