export type ProductType = 'physical' | 'digital';
export type ProductStatus = 'draft' | 'active' | 'archived';

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  priceDelta: number;
  stock: number;
  attributes: Record<string, string>; // e.g., { Color: 'Deep Navy', Size: 'M' }
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  verifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'hidden';
  createdAt: string;
}

export interface DigitalFileMetadata {
  fileId: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  version: string;
  downloadLimit: number;
  storagePath: string; // Internal storage path, never exposed raw
  description?: string;
  samplePreviewUrl?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameBn?: string;
  description: string;
  descriptionBn?: string;
  type: ProductType;
  category: string;
  subcategory: string;
  images: string[];
  regularPrice: number; // in BDT
  salePrice?: number; // in BDT
  sku: string;
  stock: number; // for physical products
  status: ProductStatus;
  featured: boolean;
  tags: string[];
  rating: number;
  reviewCount: number;
  variants?: ProductVariant[];
  digitalMetadata?: DigitalFileMetadata;
  specifications?: Record<string, string>;
  scienceMetadata?: {
    scientificDomain?: string;
    doiReference?: string;
    uniprotOrPdbId?: string;
    authorOrPublisher?: string;
  };
  has3DModel?: boolean;
  model3DType?: 'spectrometer' | 'earbuds' | 'smartwatch';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameBn: string;
  description: string;
  iconName: string;
  image: string;
  subcategories: string[];
  productCount: number;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number; // unit price in BDT
  regularPrice: number;
  quantity: number;
  type: ProductType;
  maxStock: number;
  selectedAttributes?: Record<string, string>;
}

export type PaymentMethod = 'bkash' | 'nagad' | 'cod' | 'manual';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type FulfillmentStatus = 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  division: string; // Dhaka, Chittagong, Rajshahi, Khulna, Barisal, Sylhet, Rangpur, Mymensingh
  district: string;
  upazilaOrArea: string;
  streetAddress: string;
  deliveryNotes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  type: ProductType;
  image: string;
  digitalFileId?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g., MSBD-2026-8921
  userId: string;
  userEmail: string;
  userPhone: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingFee: number;
  totalAmount: number;
  currency: 'BDT';
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  paymentDetails?: {
    transactionId?: string;
    providerTrxId?: string;
    senderNumber?: string;
    paidAt?: string;
    verifiedByServer?: boolean;
    isTestMode?: boolean;
  };
  tracking?: {
    carrier?: string; // Pathao, RedX, eCourier, Steadfast
    trackingNumber?: string;
    shippedAt?: string;
    estimatedDelivery?: string;
  };
  auditLogs: {
    timestamp: string;
    action: string;
    actor: string;
    notes?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number; // e.g. 10 for 10% or 200 for 200 BDT
  minSpend: number;
  maxDiscount?: number;
  expiresAt: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  role: 'customer' | 'admin';
  savedAddresses: ShippingAddress[];
  createdAt: string;
}

export interface DigitalEntitlement {
  id: string;
  userId: string;
  orderId: string;
  productId: string;
  productName: string;
  fileName: string;
  mimeType: string;
  downloadCount: number;
  downloadLimit: number;
  unlockedAt: string;
  isRevoked: boolean;
  driveExported?: boolean;
  driveFileId?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  insideDhakaShippingFee: number;
  outsideDhakaShippingFee: number;
  freeShippingThreshold: number;
  bkashMerchantNumber: string;
  nagadMerchantNumber: string;
  isPaymentTestMode: boolean;
  googleDriveEnabled: boolean;
  googleDriveFolder: string;
}
