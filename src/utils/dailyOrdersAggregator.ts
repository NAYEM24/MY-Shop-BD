import { Order } from '../types/index.ts';

export interface DailyOrderSummary {
  dateKey: string; // YYYY-MM-DD
  formattedDate: string; // e.g., 28 Oct 2026
  formattedDateBn: string; // e.g., ২৮ অক্টোবর ২০২৬
  orderCount: number;
  totalRevenue: number;
  paidCount: number;
  pendingCount: number;
  codCount: number;
  digitalCount: number;
  physicalCount: number;
  shippedCount: number;
  deliveredCount: number;
  orders: Order[];
}

export interface DailyAggregatorStats {
  todayOrders: number;
  todayRevenue: number;
  yesterdayOrders: number;
  yesterdayRevenue: number;
  last7DaysOrders: number;
  last7DaysRevenue: number;
  totalDaysWithOrders: number;
  averageOrdersPerDay: number;
  dailySummaries: DailyOrderSummary[];
}

/**
 * Extracts YYYY-MM-DD in local time from an ISO date string
 */
export function extractLocalDateKey(isoDateString: string): string {
  try {
    const d = new Date(isoDateString);
    if (isNaN(d.getTime())) {
      return 'Unknown Date';
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return 'Unknown Date';
  }
}

/**
 * Formats a YYYY-MM-DD date key into human-friendly format
 */
export function formatDisplayDate(dateKey: string, lang: 'en' | 'bn' = 'en'): string {
  if (dateKey === 'Unknown Date') return lang === 'bn' ? 'অজানা তারিখ' : 'Unknown Date';
  try {
    const [year, month, day] = dateKey.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (lang === 'bn') {
      return date.toLocaleDateString('bn-BD', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateKey;
  }
}

/**
 * Groups a list of orders day-by-day and computes daily metrics
 */
export function aggregateOrdersByDay(orders: Order[]): DailyOrderSummary[] {
  const map = new Map<string, Order[]>();

  // Group by date key
  for (const ord of orders) {
    const key = extractLocalDateKey(ord.createdAt);
    const existing = map.get(key) || [];
    existing.push(ord);
    map.set(key, existing);
  }

  // Sort dates descending (newest first)
  const sortedKeys = Array.from(map.keys()).sort((a, b) => b.localeCompare(a));

  return sortedKeys.map((dateKey) => {
    const dayOrders = map.get(dateKey) || [];
    let totalRevenue = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let codCount = 0;
    let digitalCount = 0;
    let physicalCount = 0;
    let shippedCount = 0;
    let deliveredCount = 0;

    for (const o of dayOrders) {
      totalRevenue += o.totalAmount;
      if (o.paymentStatus === 'paid') paidCount++;
      else pendingCount++;

      if (o.paymentMethod === 'cod') codCount++;

      const hasDigital = o.items.some((i) => i.type === 'digital');
      const hasPhysical = o.items.some((i) => i.type === 'physical');
      if (hasDigital) digitalCount++;
      if (hasPhysical) physicalCount++;

      if (o.fulfillmentStatus === 'shipped') shippedCount++;
      if (o.fulfillmentStatus === 'delivered') deliveredCount++;
    }

    return {
      dateKey,
      formattedDate: formatDisplayDate(dateKey, 'en'),
      formattedDateBn: formatDisplayDate(dateKey, 'bn'),
      orderCount: dayOrders.length,
      totalRevenue,
      paidCount,
      pendingCount,
      codCount,
      digitalCount,
      physicalCount,
      shippedCount,
      deliveredCount,
      orders: dayOrders.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    };
  });
}

/**
 * Calculates top-level metrics for today, yesterday, and past 7 days
 */
export function computeDailyAggregatorStats(orders: Order[]): DailyAggregatorStats {
  const summaries = aggregateOrdersByDay(orders);

  const now = new Date();
  const todayKey = extractLocalDateKey(now.toISOString());

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = extractLocalDateKey(yesterday.toISOString());

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  let todayOrders = 0;
  let todayRevenue = 0;
  let yesterdayOrders = 0;
  let yesterdayRevenue = 0;
  let last7DaysOrders = 0;
  let last7DaysRevenue = 0;

  for (const s of summaries) {
    if (s.dateKey === todayKey) {
      todayOrders += s.orderCount;
      todayRevenue += s.totalRevenue;
    }
    if (s.dateKey === yesterdayKey) {
      yesterdayOrders += s.orderCount;
      yesterdayRevenue += s.totalRevenue;
    }

    try {
      const summaryDate = new Date(s.dateKey);
      if (summaryDate >= sevenDaysAgo) {
        last7DaysOrders += s.orderCount;
        last7DaysRevenue += s.totalRevenue;
      }
    } catch {}
  }

  const totalDaysWithOrders = summaries.length;
  const totalOrders = orders.length;
  const averageOrdersPerDay =
    totalDaysWithOrders > 0 ? Math.round((totalOrders / totalDaysWithOrders) * 10) / 10 : 0;

  return {
    todayOrders,
    todayRevenue,
    yesterdayOrders,
    yesterdayRevenue,
    last7DaysOrders,
    last7DaysRevenue,
    totalDaysWithOrders,
    averageOrdersPerDay,
    dailySummaries: summaries,
  };
}

/**
 * Generates a clean CSV file string from daily summaries
 */
export function exportDailyOrdersToCsv(summaries: DailyOrderSummary[]): string {
  const headers = [
    'Date',
    'Total Orders',
    'Total Revenue (BDT)',
    'Paid Orders',
    'Pending Orders',
    'COD Orders',
    'Shipped Parcels',
    'Delivered Parcels',
  ];

  const rows = summaries.map((s) => [
    `"${s.dateKey} (${s.formattedDate})"`,
    s.orderCount,
    s.totalRevenue,
    s.paidCount,
    s.pendingCount,
    s.codCount,
    s.shippedCount,
    s.deliveredCount,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
