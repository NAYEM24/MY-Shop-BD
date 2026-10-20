import type { CartItem, Coupon, FulfillmentStatus, Order, PaymentMethod, ShippingAddress } from '../types/index.ts';

export interface CalculationResult {
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  isFreeShipping: boolean;
  hasPhysicalItems: boolean;
  hasDigitalItems: boolean;
  couponError?: string;
}

export const DEFAULT_SHIPPING_CONFIG = {
  insideDhakaFee: 60,
  outsideDhakaFee: 120,
  freeShippingThreshold: 3000,
};

/**
 * Determine whether a shipping address is Inside Dhaka
 */
export function isInsideDhaka(address?: Partial<ShippingAddress> | null): boolean {
  if (!address || !address.division) return true; // Default assumption for quote
  const division = address.division.trim().toLowerCase();
  const district = (address.district || '').trim().toLowerCase();
  return division === 'dhaka' && (district === 'dhaka' || district === '');
}

/**
 * Calculate shipping fee for order
 */
export function calculateShippingFee(
  hasPhysicalItems: boolean,
  subtotalAfterDiscount: number,
  address?: Partial<ShippingAddress> | null,
  config = DEFAULT_SHIPPING_CONFIG
): { fee: number; isFree: boolean } {
  // If order contains only digital products, delivery is completely free (instant download)
  if (!hasPhysicalItems) {
    return { fee: 0, isFree: true };
  }

  // Free shipping threshold
  if (subtotalAfterDiscount >= config.freeShippingThreshold) {
    return { fee: 0, isFree: true };
  }

  const inside = isInsideDhaka(address);
  return {
    fee: inside ? config.insideDhakaFee : config.outsideDhakaFee,
    isFree: false,
  };
}

/**
 * Validate and calculate discount for a coupon
 */
export function validateAndApplyCoupon(
  coupon: Coupon | null | undefined,
  subtotal: number,
  currentDate = new Date()
): { valid: boolean; discountAmount: number; error?: string } {
  if (!coupon) {
    return { valid: false, discountAmount: 0 };
  }

  if (!coupon.active) {
    return { valid: false, discountAmount: 0, error: 'Coupon is inactive.' };
  }

  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, discountAmount: 0, error: 'Coupon usage limit has been reached.' };
  }

  const expiry = new Date(coupon.expiresAt);
  if (currentDate.getTime() > expiry.getTime()) {
    return { valid: false, discountAmount: 0, error: 'Coupon has expired.' };
  }

  if (subtotal < coupon.minSpend) {
    return {
      valid: false,
      discountAmount: 0,
      error: `Minimum spend of ৳${coupon.minSpend.toLocaleString()} is required for this coupon.`,
    };
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && coupon.maxDiscount > 0) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else {
    discount = coupon.discountValue;
  }

  discount = Math.min(discount, subtotal);

  return { valid: true, discountAmount: discount };
}

/**
 * Calculate full order summary given items, coupon, and address
 */
export function calculateOrderSummary(
  items: CartItem[],
  coupon?: Coupon | null,
  address?: Partial<ShippingAddress> | null,
  shippingConfig = DEFAULT_SHIPPING_CONFIG,
  currentDate = new Date()
): CalculationResult {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const hasPhysicalItems = items.some((item) => item.type === 'physical');
  const hasDigitalItems = items.some((item) => item.type === 'digital');

  let discountAmount = 0;
  let couponError: string | undefined;

  if (coupon) {
    const couponResult = validateAndApplyCoupon(coupon, subtotal, currentDate);
    if (couponResult.valid) {
      discountAmount = couponResult.discountAmount;
    } else {
      couponError = couponResult.error;
    }
  }

  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const { fee: shippingFee, isFree: isFreeShipping } = calculateShippingFee(
    hasPhysicalItems,
    subtotalAfterDiscount,
    address,
    shippingConfig
  );

  const totalAmount = subtotalAfterDiscount + shippingFee;

  return {
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    isFreeShipping,
    hasPhysicalItems,
    hasDigitalItems,
    couponError,
  };
}

/**
 * Validate payment method eligibility
 * COD is strictly not allowed if the order consists ONLY of digital items.
 */
export function isPaymentMethodAllowed(
  method: PaymentMethod,
  hasPhysicalItems: boolean,
  _totalAmount: number
): { allowed: boolean; reason?: string } {
  if (method === 'cod' && !hasPhysicalItems) {
    return {
      allowed: false,
      reason: 'Cash on Delivery is not available for digital-only orders. Please choose bKash or Nagad.',
    };
  }
  return { allowed: true };
}

/**
 * Validate Bangladeshi bKash Transaction ID (10 alphanumeric chars, e.g., 9G7K2L8X10)
 */
export function validateBkashTrxId(trxId: string): boolean {
  if (!trxId) return false;
  const cleaned = trxId.trim().toUpperCase();
  const bkashRegex = /^[A-Z0-9]{8,12}$/;
  return bkashRegex.test(cleaned);
}

/**
 * Validate Bangladeshi Nagad Transaction ID (8 to 12 alphanumeric chars)
 */
export function validateNagadTrxId(trxId: string): boolean {
  if (!trxId) return false;
  const cleaned = trxId.trim().toUpperCase();
  const nagadRegex = /^[A-Z0-9]{7,12}$/;
  return nagadRegex.test(cleaned);
}

/**
 * State machine for fulfillment status transitions
 */
const VALID_TRANSITIONS: Record<FulfillmentStatus, FulfillmentStatus[]> = {
  pending_payment: ['paid', 'cancelled'],
  paid: ['processing', 'refunded', 'cancelled'],
  processing: ['shipped', 'cancelled', 'refunded'],
  shipped: ['delivered', 'refunded'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
};

export function isValidFulfillmentTransition(
  current: FulfillmentStatus,
  target: FulfillmentStatus
): boolean {
  if (current === target) return true;
  const allowed = VALID_TRANSITIONS[current] || [];
  return allowed.includes(target);
}

/**
 * Security rule: Check if a customer has authorized access to download a digital product
 */
export function canAccessDigitalDownload(
  order: Pick<Order, 'userId' | 'paymentStatus' | 'fulfillmentStatus'>,
  requestingUserId: string,
  downloadCount: number,
  downloadLimit: number
): { canDownload: boolean; reason?: string } {
  if (order.userId !== requestingUserId) {
    return { canDownload: false, reason: 'Unauthorized: Order belongs to another customer.' };
  }

  if (order.paymentStatus !== 'paid') {
    return { canDownload: false, reason: 'Payment is not verified for this order.' };
  }

  if (order.fulfillmentStatus === 'cancelled' || order.fulfillmentStatus === 'refunded') {
    return { canDownload: false, reason: 'Access revoked due to cancellation or refund.' };
  }

  if (downloadLimit > 0 && downloadCount >= downloadLimit) {
    return { canDownload: false, reason: `Download limit (${downloadLimit}) reached for this file.` };
  }

  return { canDownload: true };
}

/**
 * Generate a unique human-friendly Bangladeshi order number
 */
export function generateOrderNumber(year = new Date().getFullYear()): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `MSBD-${year}-${randomChars}${randomDigits}`;
}
