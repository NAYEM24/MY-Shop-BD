import React, { useState, useMemo } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  Printer,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  FileText,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Order, StoreSettings } from '../../types/index.ts';
import {
  aggregateOrdersByDay,
  computeDailyAggregatorStats,
  exportDailyOrdersToCsv,
  DailyOrderSummary,
} from '../../utils/dailyOrdersAggregator.ts';
import { printInvoicePdf, downloadInvoicePdf, downloadInvoiceHtmlFile } from '../../utils/invoiceGenerator.ts';

interface DailyOrdersLogProps {
  orders: Order[];
  formatPrice: (amount: number) => string;
  storeSettings: StoreSettings;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  language?: 'en' | 'bn';
}

export const DailyOrdersLog: React.FC<DailyOrdersLogProps> = ({
  orders,
  formatPrice,
  storeSettings,
  showToast,
  language = 'bn',
}) => {
  const [filterRange, setFilterRange] = useState<'all' | 'today' | 'yesterday' | '7days'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});

  const stats = useMemo(() => computeDailyAggregatorStats(orders), [orders]);

  // Filter summaries based on date range and search query
  const filteredSummaries = useMemo(() => {
    let list = stats.dailySummaries;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    if (filterRange === 'today') {
      list = list.filter((s) => s.dateKey === todayStr);
    } else if (filterRange === 'yesterday') {
      list = list.filter((s) => s.dateKey === yesterdayStr);
    } else if (filterRange === '7days') {
      list = list.filter((s) => {
        try {
          return new Date(s.dateKey) >= sevenDaysAgo;
        } catch {
          return true;
        }
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list
        .map((s) => {
          const matchingOrders = s.orders.filter(
            (o) =>
              o.orderNumber.toLowerCase().includes(q) ||
              o.shippingAddress.fullName.toLowerCase().includes(q) ||
              o.userPhone.includes(q) ||
              o.shippingAddress.district.toLowerCase().includes(q) ||
              o.items.some((i) => i.productName.toLowerCase().includes(q))
          );
          return {
            ...s,
            orders: matchingOrders,
            orderCount: matchingOrders.length,
            totalRevenue: matchingOrders.reduce((sum, o) => sum + o.totalAmount, 0),
          };
        })
        .filter((s) => s.orders.length > 0);
    }

    return list;
  }, [stats.dailySummaries, filterRange, searchQuery]);

  const toggleDate = (dateKey: string) => {
    setExpandedDates((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey] === undefined ? false : !prev[dateKey],
    }));
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    for (const s of filteredSummaries) {
      next[s.dateKey] = true;
    }
    setExpandedDates(next);
  };

  const collapseAll = () => {
    const next: Record<string, boolean> = {};
    for (const s of filteredSummaries) {
      next[s.dateKey] = false;
    }
    setExpandedDates(next);
  };

  const handleExportCsv = () => {
    const csvData = exportDailyOrdersToCsv(filteredSummaries);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `myshopbd-daily-orders-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Daily orders report successfully downloaded in CSV format!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-teal-100 text-teal-800 rounded-xl">
              <Calendar className="w-5 h-5 text-teal-700" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              {language === 'bn' ? 'দৈনিক অর্ডার লগ ও হিসাব' : 'Daily Orders Log & Breakdown'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn'
              ? 'কোন দিন কতটি অর্ডার এসেছে, দৈনিক বিক্রয় এবং প্রতি অর্ডারের ইনভয়েস এক ক্লিকে ডাউনলোড করুন।'
              : 'Track day-by-day order volumes, total revenue, and download 1-click PDF invoices.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
            title="Download CSV for Excel"
          >
            <Download className="w-4 h-4" />
            <span>{language === 'bn' ? 'এক্সেল / CSV রিপোর্ট' : 'Export CSV'}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'bn' ? 'প্রিন্ট রিপোর্ট' : 'Print Log'}</span>
          </button>
        </div>
      </div>

      {/* 2. Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Today */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-teal-200/80 shadow-xs bg-gradient-to-br from-white to-teal-50/30">
          <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">
            {language === 'bn' ? 'আজকের অর্ডার' : "Today's Orders"}
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {stats.todayOrders}
            </span>
            <span className="text-xs font-bold text-teal-600">
              ({formatPrice(stats.todayRevenue)})
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </span>
        </div>

        {/* Yesterday */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {language === 'bn' ? 'গতকালের অর্ডার' : "Yesterday's Orders"}
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {stats.yesterdayOrders}
            </span>
            <span className="text-xs font-bold text-slate-600">
              ({formatPrice(stats.yesterdayRevenue)})
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Previous 24 Hours</span>
        </div>

        {/* Last 7 Days */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {language === 'bn' ? 'গত ৭ দিন' : 'Past 7 Days'}
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {stats.last7DaysOrders}
            </span>
            <span className="text-xs font-bold text-emerald-600">
              ({formatPrice(stats.last7DaysRevenue)})
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Weekly Volume</span>
        </div>

        {/* Total Days & Average */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {language === 'bn' ? 'গড় অর্ডার / দিন' : 'Avg Orders / Day'}
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {stats.averageOrdersPerDay}
            </span>
            <span className="text-xs text-slate-500">
              / {stats.totalDaysWithOrders} {language === 'bn' ? 'দিন' : 'days'}
            </span>
          </div>
          <span className="text-[11px] text-teal-600 font-semibold block mt-1">
            {orders.length} {language === 'bn' ? 'মোট সফল অর্ডার' : 'Total Orders'}
          </span>
        </div>
      </div>

      {/* 3. Filter Pills and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 overflow-x-auto text-xs font-semibold no-scrollbar">
          {[
            { id: 'all', label: language === 'bn' ? 'সকল দিন' : 'All Dates' },
            { id: 'today', label: language === 'bn' ? 'আজকে' : 'Today' },
            { id: 'yesterday', label: language === 'bn' ? 'গতকাল' : 'Yesterday' },
            { id: '7days', label: language === 'bn' ? 'গত ৭ দিন' : 'Last 7 Days' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterRange(f.id as any)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                filterRange === f.id
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative w-full sm:w-60">
            <input
              type="text"
              placeholder={language === 'bn' ? 'অর্ডার#, নাম, ফোন দিয়ে খুঁজুন...' : 'Search in day log...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="button"
            onClick={expandAll}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl whitespace-nowrap"
          >
            {language === 'bn' ? 'সব খুলুন' : 'Expand All'}
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl whitespace-nowrap"
          >
            {language === 'bn' ? 'সব বন্ধ' : 'Collapse All'}
          </button>
        </div>
      </div>

      {/* 4. Day-by-Day Accordion Breakdown */}
      <div className="space-y-4">
        {filteredSummaries.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-xs space-y-2">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-600">
              {language === 'bn' ? 'নির্বাচিত ফিল্টারে কোনো অর্ডার পাওয়া যায়নি।' : 'No orders found for this date range.'}
            </p>
          </div>
        ) : (
          filteredSummaries.map((summary) => {
            const isExpanded = expandedDates[summary.dateKey] !== false; // expanded by default
            return (
              <div
                key={summary.dateKey}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-teal-500/30 transition-all"
              >
                {/* Date Summary Header */}
                <div
                  onClick={() => toggleDate(summary.dateKey)}
                  className="p-4 sm:p-5 bg-slate-50/80 hover:bg-slate-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer border-b border-slate-200/60 select-none"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-10 h-10 rounded-xl bg-teal-600 text-white font-extrabold flex items-center justify-center text-xs shadow-xs flex-shrink-0">
                      {summary.dateKey.split('-')[2] || 'BD'}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900">
                          {language === 'bn' ? summary.formattedDateBn : summary.formattedDate}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          ({summary.dateKey})
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                          {summary.orderCount} {language === 'bn' ? 'টি অর্ডার' : 'Orders'}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span>
                          {summary.paidCount} {language === 'bn' ? 'পরিশোধিত' : 'Paid'}
                        </span>
                        {summary.codCount > 0 && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span>{summary.codCount} COD</span>
                          </>
                        )}
                        {summary.shippedCount > 0 && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="text-sky-600 font-semibold">
                              {summary.shippedCount} {language === 'bn' ? 'শিপড' : 'Shipped'}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-4">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">
                        {language === 'bn' ? 'দৈনিক বিক্রয়' : 'Daily Sales'}
                      </span>
                      <span className="font-mono font-extrabold text-base text-slate-900">
                        {formatPrice(summary.totalRevenue)}
                      </span>
                    </div>

                    <div className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Date Orders Detail List */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 space-y-3 bg-white divide-y divide-slate-100">
                    {summary.orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="pt-3 first:pt-0 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                      >
                        {/* Order & Customer Info */}
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-extrabold text-slate-900 text-sm">
                              {ord.orderNumber}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                ord.paymentStatus === 'paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ord.paymentStatus}
                            </span>
                            <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full uppercase">
                              {ord.paymentMethod}
                            </span>
                            <span className="text-[10px] bg-sky-50 text-sky-700 font-bold px-2 py-0.5 rounded-full capitalize">
                              {ord.fulfillmentStatus.replace('_', ' ')}
                            </span>
                          </div>

                          <p className="text-slate-600">
                            <strong>{ord.shippingAddress.fullName || 'Customer'}</strong> • 📞{' '}
                            <strong>{ord.userPhone}</strong> • {ord.shippingAddress.streetAddress},{' '}
                            {ord.shippingAddress.district}
                          </p>

                          <div className="flex flex-wrap gap-1 text-[11px] text-slate-500 pt-0.5">
                            {ord.items.map((item, idx) => (
                              <span key={idx} className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                                {item.productName} × {item.quantity}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Amount & 1-Click PDF Actions */}
                        <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0">
                          <div className="text-left md:text-right">
                            <span className="font-mono font-extrabold text-sm text-slate-900 block">
                              {formatPrice(ord.totalAmount)}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {new Date(ord.createdAt).toLocaleTimeString('en-GB', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          {/* 1-Click PDF Invoice Download & Print Buttons */}
                          <div className="flex items-center space-x-1.5">
                            <button
                              type="button"
                              onClick={async () => {
                                showToast(
                                  language === 'bn'
                                    ? `${ord.orderNumber} এর জন্য PDF ডাউনলোড হচ্ছে...`
                                    : `Downloading PDF for ${ord.orderNumber}...`,
                                  'info'
                                );
                                try {
                                  const ok = await downloadInvoicePdf(ord, storeSettings);
                                  if (ok) {
                                    showToast(
                                      language === 'bn'
                                        ? `${ord.orderNumber} এর PDF ইনভয়েস সফলভাবে ডাউনলোড হয়েছে!`
                                        : `PDF invoice for ${ord.orderNumber} downloaded!`,
                                      'success'
                                    );
                                  } else {
                                    showToast(
                                      language === 'bn'
                                        ? `${ord.orderNumber} এর ইনভয়েস ফাইল ডাউনলোড সম্পন্ন!`
                                        : `Invoice file downloaded!`,
                                      'success'
                                    );
                                  }
                                } catch (err) {
                                  console.error('PDF download error:', err);
                                  printInvoicePdf(ord, storeSettings);
                                }
                              }}
                              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all active:scale-95"
                              title="Download PDF Invoice"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{language === 'bn' ? 'পিডিএফ ডাউনলোড' : 'PDF Download'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                printInvoicePdf(ord, storeSettings);
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                              title="Print Invoice"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
