import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractLocalDateKey,
  formatDisplayDate,
  aggregateOrdersByDay,
  computeDailyAggregatorStats,
  exportDailyOrdersToCsv,
} from './dailyOrdersAggregator.ts';
import { generateInvoiceHtml } from './invoiceGenerator.ts';
import { Order } from '../types/index.ts';

const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord_1',
    orderNumber: 'MSBD-2026-0001',
    userId: 'u1',
    userEmail: 'cust1@gmail.com',
    userPhone: '01711223344',
    currency: 'BDT',
    items: [
      {
        productId: 'p1',
        productName: 'ANC Earbuds',
        quantity: 2,
        unitPrice: 2000,
        totalPrice: 4000,
        type: 'physical',
        image: '',
      },
    ],
    shippingAddress: {
      fullName: 'Tanvir Hasan',
      phone: '01711223344',
      division: 'Dhaka',
      district: 'Dhaka',
      upazilaOrArea: 'Uttara',
      streetAddress: 'Road 5, Sector 3',
    },
    subtotal: 4000,
    shippingFee: 60,
    discountAmount: 0,
    totalAmount: 4060,
    paymentMethod: 'bkash',
    paymentStatus: 'paid',
    fulfillmentStatus: 'shipped',
    createdAt: '2026-10-28T10:00:00Z',
    updatedAt: '2026-10-28T10:00:00Z',
    auditLogs: [],
  },
  {
    id: 'ord_2',
    orderNumber: 'MSBD-2026-0002',
    userId: 'u2',
    userEmail: 'cust2@gmail.com',
    userPhone: '01899112233',
    currency: 'BDT',
    items: [
      {
        productId: 'p2',
        productName: 'Genomics E-Book',
        quantity: 1,
        unitPrice: 950,
        totalPrice: 950,
        type: 'digital',
        image: '',
      },
    ],
    shippingAddress: {
      fullName: 'Nusrat Jahan',
      phone: '01899112233',
      division: 'Chattogram',
      district: 'Chattogram',
      upazilaOrArea: 'Agrabad',
      streetAddress: 'CDA Avenue',
    },
    subtotal: 950,
    shippingFee: 0,
    discountAmount: 100,
    totalAmount: 850,
    paymentMethod: 'nagad',
    paymentStatus: 'paid',
    fulfillmentStatus: 'delivered',
    createdAt: '2026-10-28T14:30:00Z',
    updatedAt: '2026-10-28T14:30:00Z',
    auditLogs: [],
  },
  {
    id: 'ord_3',
    orderNumber: 'MSBD-2026-0003',
    userId: 'u3',
    userEmail: 'cust3@gmail.com',
    userPhone: '01911445566',
    currency: 'BDT',
    items: [
      {
        productId: 'p3',
        productName: 'Tangail Panjabi',
        quantity: 1,
        unitPrice: 2200,
        totalPrice: 2200,
        type: 'physical',
        image: '',
      },
    ],
    shippingAddress: {
      fullName: 'Kamal Hossain',
      phone: '01911445566',
      division: 'Dhaka',
      district: 'Gazipur',
      upazilaOrArea: 'Tongi',
      streetAddress: 'Station Road',
    },
    subtotal: 2200,
    shippingFee: 120,
    discountAmount: 0,
    totalAmount: 2320,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    fulfillmentStatus: 'processing',
    createdAt: '2026-10-27T08:15:00Z',
    updatedAt: '2026-10-27T08:15:00Z',
    auditLogs: [],
  },
];

test('extractLocalDateKey extracts YYYY-MM-DD correctly', () => {
  const key = extractLocalDateKey('2026-10-28T12:00:00Z');
  assert.equal(typeof key, 'string');
  assert.match(key, /^\d{4}-\d{2}-\d{2}$/);
});

test('aggregateOrdersByDay groups orders date by date with accurate counts and revenue', () => {
  const summaries = aggregateOrdersByDay(SAMPLE_ORDERS);
  assert.ok(summaries.length >= 2, 'Should have at least 2 distinct days');

  const totalAggregatedOrders = summaries.reduce((acc, s) => acc + s.orderCount, 0);
  assert.equal(totalAggregatedOrders, 3, 'All 3 sample orders must be accounted for');

  const totalAggregatedRevenue = summaries.reduce((acc, s) => acc + s.totalRevenue, 0);
  assert.equal(totalAggregatedRevenue, 4060 + 850 + 2320);
});

test('computeDailyAggregatorStats calculates aggregate metrics and averages', () => {
  const stats = computeDailyAggregatorStats(SAMPLE_ORDERS);
  assert.ok(stats.totalDaysWithOrders >= 2);
  assert.ok(stats.averageOrdersPerDay > 0);
  assert.equal(stats.dailySummaries.length, stats.totalDaysWithOrders);
});

test('exportDailyOrdersToCsv returns valid CSV formatted string with headers', () => {
  const summaries = aggregateOrdersByDay(SAMPLE_ORDERS);
  const csv = exportDailyOrdersToCsv(summaries);
  assert.ok(csv.includes('Date,Total Orders,Total Revenue (BDT)'));
  assert.ok(csv.split('\n').length >= 3);
});

test('generateInvoiceHtml includes customer details, order number, and itemized rows', () => {
  const html = generateInvoiceHtml(SAMPLE_ORDERS[0], { storeName: 'MY SHOP BD' });
  assert.ok(html.includes('MSBD-2026-0001'));
  assert.ok(html.includes('Tanvir Hasan'));
  assert.ok(html.includes('01711223344'));
  assert.ok(html.includes('ANC Earbuds'));
  assert.ok(html.includes('Tk 4,060'));
  assert.ok(html.includes('INVOICE'));
  assert.ok(html.includes('window.print()'));
});

test('downloadInvoicePdf and generateDirectVectorPdf are exported and callable', async () => {
  const { downloadInvoicePdf, generateDirectVectorPdf } = await import('./invoiceGenerator.ts');
  assert.equal(typeof downloadInvoicePdf, 'function');
  assert.equal(typeof generateDirectVectorPdf, 'function');
});

