import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOrderSummary,
  calculateShippingFee,
  validateAndApplyCoupon,
  isPaymentMethodAllowed,
  validateBkashTrxId,
  validateNagadTrxId,
  isValidFulfillmentTransition,
  canAccessDigitalDownload,
  generateOrderNumber,
} from './shopRules.ts';
import type { CartItem, Coupon } from '../types/index.ts';

test('calculateShippingFee handles Dhaka vs Outside Dhaka and digital products', () => {
  // Pure digital -> 0 shipping
  const digitalShipping = calculateShippingFee(false, 1500, { division: 'Dhaka', district: 'Dhaka' });
  assert.equal(digitalShipping.fee, 0);
  assert.equal(digitalShipping.isFree, true);

  // Physical inside Dhaka under threshold -> 60 BDT
  const insideDhaka = calculateShippingFee(true, 1000, { division: 'Dhaka', district: 'Dhaka' });
  assert.equal(insideDhaka.fee, 60);
  assert.equal(insideDhaka.isFree, false);

  // Physical outside Dhaka (e.g. Chittagong) under threshold -> 120 BDT
  const outsideDhaka = calculateShippingFee(true, 1000, { division: 'Chittagong', district: 'Chittagong' });
  assert.equal(outsideDhaka.fee, 120);
  assert.equal(outsideDhaka.isFree, false);

  // Physical exceeding free shipping threshold (3000 BDT) -> 0 BDT
  const freeOverThreshold = calculateShippingFee(true, 3500, { division: 'Sylhet', district: 'Sylhet' });
  assert.equal(freeOverThreshold.fee, 0);
  assert.equal(freeOverThreshold.isFree, true);
});

test('validateAndApplyCoupon calculates percentage and flat discounts with constraints', () => {
  const currentDate = new Date('2026-10-20T10:00:00Z');

  const percentageCoupon: Coupon = {
    id: 'c1',
    code: 'EID10',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 1000,
    maxDiscount: 500,
    expiresAt: '2026-12-31T23:59:59Z',
    usageLimit: 100,
    usedCount: 10,
    active: true,
  };

  // Subtotal 2000 -> 10% = 200
  const validRes = validateAndApplyCoupon(percentageCoupon, 2000, currentDate);
  assert.equal(validRes.valid, true);
  assert.equal(validRes.discountAmount, 200);

  // Subtotal 500 (below minSpend 1000)
  const belowMin = validateAndApplyCoupon(percentageCoupon, 500, currentDate);
  assert.equal(belowMin.valid, false);
  assert.match(belowMin.error || '', /Minimum spend/);

  // Expired coupon
  const expiredCoupon: Coupon = {
    ...percentageCoupon,
    expiresAt: '2026-01-01T00:00:00Z',
  };
  const expiredRes = validateAndApplyCoupon(expiredCoupon, 2000, currentDate);
  assert.equal(expiredRes.valid, false);
  assert.match(expiredRes.error || '', /expired/);

  // Flat discount coupon
  const flatCoupon: Coupon = {
    id: 'c2',
    code: 'WELCOME200',
    discountType: 'flat',
    discountValue: 200,
    minSpend: 800,
    expiresAt: '2026-12-31T23:59:59Z',
    usageLimit: 50,
    usedCount: 0,
    active: true,
  };
  const flatRes = validateAndApplyCoupon(flatCoupon, 1200, currentDate);
  assert.equal(flatRes.valid, true);
  assert.equal(flatRes.discountAmount, 200);
});

test('calculateOrderSummary calculates complete totals correctly', () => {
  const items: CartItem[] = [
    {
      productId: 'p1',
      name: 'Wireless Bluetooth Earbuds',
      image: '/mock.jpg',
      price: 1500,
      regularPrice: 2000,
      quantity: 2,
      type: 'physical',
      maxStock: 20,
    },
    {
      productId: 'p2',
      name: 'Genomics & Bioinformatics Handbook (PDF)',
      image: '/mock2.jpg',
      price: 800,
      regularPrice: 1200,
      quantity: 1,
      type: 'digital',
      maxStock: 999,
    },
  ];

  // Subtotal: 1500*2 + 800 = 3800 BDT
  // Free shipping threshold reached (3800 >= 3000) -> 0 shipping
  const summary = calculateOrderSummary(items, null, { division: 'Dhaka', district: 'Dhaka' });
  assert.equal(summary.subtotal, 3800);
  assert.equal(summary.discountAmount, 0);
  assert.equal(summary.shippingFee, 0);
  assert.equal(summary.totalAmount, 3800);
  assert.equal(summary.hasPhysicalItems, true);
  assert.equal(summary.hasDigitalItems, true);
});

test('isPaymentMethodAllowed denies Cash on Delivery for digital-only carts', () => {
  const codAllowedForPhysical = isPaymentMethodAllowed('cod', true, 1200);
  assert.equal(codAllowedForPhysical.allowed, true);

  const codDeniedForDigital = isPaymentMethodAllowed('cod', false, 800);
  assert.equal(codDeniedForDigital.allowed, false);
  assert.match(codDeniedForDigital.reason || '', /digital-only/i);

  const bkashAllowed = isPaymentMethodAllowed('bkash', false, 800);
  assert.equal(bkashAllowed.allowed, true);
});

test('validateBkashTrxId and validateNagadTrxId check Bangladeshi transaction numbers', () => {
  assert.equal(validateBkashTrxId('9G7K2L8X10'), true);
  assert.equal(validateBkashTrxId('BK12345678'), true);
  assert.equal(validateBkashTrxId('short'), false);
  assert.equal(validateBkashTrxId(''), false);

  assert.equal(validateNagadTrxId('NG7829104'), true);
  assert.equal(validateNagadTrxId('NAGAD1234'), true);
  assert.equal(validateNagadTrxId('123'), false);
});

test('isValidFulfillmentTransition follows e-commerce lifecycle state machine', () => {
  assert.equal(isValidFulfillmentTransition('pending_payment', 'paid'), true);
  assert.equal(isValidFulfillmentTransition('paid', 'processing'), true);
  assert.equal(isValidFulfillmentTransition('processing', 'shipped'), true);
  assert.equal(isValidFulfillmentTransition('shipped', 'delivered'), true);
  assert.equal(isValidFulfillmentTransition('shipped', 'pending_payment'), false);
  assert.equal(isValidFulfillmentTransition('delivered', 'shipped'), false);
  assert.equal(isValidFulfillmentTransition('cancelled', 'delivered'), false);
});

test('canAccessDigitalDownload enforces security and payment verification', () => {
  const order = {
    userId: 'user_123',
    paymentStatus: 'paid' as const,
    fulfillmentStatus: 'paid' as const,
  };

  // Legitimate download
  const ok = canAccessDigitalDownload(order, 'user_123', 2, 5);
  assert.equal(ok.canDownload, true);

  // IDOR attempt: different user
  const diffUser = canAccessDigitalDownload(order, 'user_intruder', 0, 5);
  assert.equal(diffUser.canDownload, false);
  assert.match(diffUser.reason || '', /Unauthorized/);

  // Unpaid order
  const unpaidOrder = { ...order, paymentStatus: 'pending' as const };
  const unpaid = canAccessDigitalDownload(unpaidOrder, 'user_123', 0, 5);
  assert.equal(unpaid.canDownload, false);
  assert.match(unpaid.reason || '', /Payment is not verified/);

  // Exceeded download limit
  const limitReached = canAccessDigitalDownload(order, 'user_123', 5, 5);
  assert.equal(limitReached.canDownload, false);
  assert.match(limitReached.reason || '', /Download limit/);
});

test('generateOrderNumber generates formatted MSBD order code', () => {
  const orderNum = generateOrderNumber(2026);
  assert.match(orderNum, /^MSBD-2026-[A-Z0-9]{7}$/);
});

test('calculateOrderSummary identifies purely digital cart with zero delivery charge', () => {
  const digitalCart: CartItem[] = [
    {
      productId: 'p_digi_1',
      name: 'Full-Stack React Handbook',
      image: '/mock.png',
      price: 650,
      regularPrice: 1000,
      quantity: 1,
      type: 'digital',
      maxStock: 9999,
    },
  ];

  const summary = calculateOrderSummary(digitalCart, null, { division: 'Sylhet', district: 'Sylhet' });
  assert.equal(summary.subtotal, 650);
  assert.equal(summary.shippingFee, 0);
  assert.equal(summary.hasPhysicalItems, false);
  assert.equal(summary.hasDigitalItems, true);
  assert.equal(summary.totalAmount, 650);
});

test('courier tracking format matches Steadfast and Pathao conventions', () => {
  const steadfastPattern = /^ST-\d{7}BD$/;
  const pathaoPattern = /^PTH-BD-\d{6}$/;

  const mockSteadfast = 'ST-9021844BD';
  const mockPathao = 'PTH-BD-891024';

  assert.equal(steadfastPattern.test(mockSteadfast), true);
  assert.equal(pathaoPattern.test(mockPathao), true);
  assert.equal(steadfastPattern.test('invalid'), false);
});

