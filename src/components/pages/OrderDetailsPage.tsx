import React, { useState } from 'react';
import {
  ArrowLeft,
  Printer,
  CloudUpload,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  ShieldCheck,
  AlertCircle,
  FileText,
  Download,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';
import { saveOrderToGoogleDrive } from '../../services/driveService.ts';
import { FulfillmentStatus } from '../../types/index.ts';
import { printInvoicePdf, downloadInvoicePdf, downloadInvoiceHtmlFile } from '../../utils/invoiceGenerator.ts';

export const OrderDetailsPage: React.FC = () => {
  const {
    orders,
    selectedOrderId,
    setCurrentView,
    formatPrice,
    googleAccessToken,
    loginWithGoogle,
    showToast,
    storeSettings,
    language,
  } = useShop();

  const [isExporting, setIsExporting] = useState(false);
  const [showDriveModal, setShowDriveModal] = useState(false);

  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Order not found</h2>
        <button
          type="button"
          onClick={() => setCurrentView('orders')}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold"
        >
          View All Orders
        </button>
      </div>
    );
  }

  const steps: { key: FulfillmentStatus; label: string }[] = [
    { key: 'pending_payment', label: 'Order Placed' },
    { key: 'paid', label: 'Payment Verified' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Dispatched' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const getStepStatus = (stepKey: FulfillmentStatus) => {
    if (order.fulfillmentStatus === 'cancelled' || order.fulfillmentStatus === 'refunded') {
      return 'cancelled';
    }
    const orderIndex = steps.findIndex((s) => s.key === order.fulfillmentStatus);
    const stepIndex = steps.findIndex((s) => s.key === stepKey);
    if (stepIndex <= orderIndex) return 'completed';
    return 'pending';
  };

  const handleDriveBackup = async () => {
    setShowDriveModal(false);

    if (!googleAccessToken) {
      try {
        await loginWithGoogle();
      } catch {
        return;
      }
    }

    const token = googleAccessToken;
    if (!token) {
      showToast('Please sign in with Google to enable Drive backup.', 'error');
      return;
    }

    setIsExporting(true);
    try {
      await saveOrderToGoogleDrive(order, token);
      showToast('Order invoice successfully backed up to your Google Drive!', 'success');
    } catch (err: any) {
      showToast(`Drive export failed: ${err?.message}`, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => setCurrentView('orders')}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-teal-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Orders List</span>
        </button>
      </div>

      {/* Header bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] text-slate-400 font-medium block">Order Reference:</span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-mono">{order.orderNumber}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Placed on: {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={async () => {
              showToast(
                language === 'bn' ? 'PDF ইনভয়েস ডাউনলোড হচ্ছে...' : 'Downloading PDF invoice...',
                'info'
              );
              try {
                const ok = await downloadInvoicePdf(order, storeSettings);
                if (ok) {
                  showToast(
                    language === 'bn' ? 'ইনভয়েস PDF সফলভাবে ডাউনলোড হয়েছে!' : 'Invoice PDF downloaded successfully!',
                    'success'
                  );
                }
              } catch (err) {
                console.error('PDF error:', err);
                printInvoicePdf(order, storeSettings);
              }
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
            title="Download PDF invoice file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? '১-ক্লিকে PDF ডাউনলোড' : '1-Click PDF Download'}</span>
          </button>

          <button
            type="button"
            onClick={() => printInvoicePdf(order, storeSettings)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            title="Print invoice preview"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDriveModal(true)}
            disabled={isExporting}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <CloudUpload className="w-3.5 h-3.5 text-sky-400" />
            <span>{isExporting ? 'Saving...' : 'Drive'}</span>
          </button>
        </div>
      </div>

      {/* Visual Timeline Tracker */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 mb-6">Fulfillment Lifecycle</h3>

        {order.fulfillmentStatus === 'cancelled' || order.fulfillmentStatus === 'refunded' ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3 text-rose-800 text-xs">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <div>
              <span className="font-bold block capitalize">Order {order.fulfillmentStatus}</span>
              <span>This order was cancelled or refunded. Digital product downloads have been revoked.</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {steps.map((step, idx) => {
              const status = getStepStatus(step.key);
              return (
                <div key={step.key} className="text-center relative">
                  <div
                    className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-colors ${
                      status === 'completed'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-xs block ${
                      status === 'completed' ? 'font-bold text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Carrier Tracking Badge if Shipped */}
        {order.tracking?.trackingNumber && (
          <div className="mt-6 p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-center justify-between text-xs text-sky-900">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-sky-600" />
              <span>
                Carrier: <strong>{order.tracking.carrier || 'Standard Courier'}</strong> • Tracking No:{' '}
                <strong className="font-mono">{order.tracking.trackingNumber}</strong>
              </span>
            </div>
            <span className="text-[11px] font-bold text-sky-700 bg-white px-2.5 py-1 rounded-lg border border-sky-300">
              Live Transit
            </span>
          </div>
        )}
      </div>

      {/* Items List & Cost Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
          Ordered Products ({order.items.length})
        </h3>

        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 text-xs">
              <div className="flex items-center space-x-3">
                <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover bg-slate-50" />
                <div>
                  <span className="font-bold text-slate-900 block">{item.productName}</span>
                  <span className="text-slate-500">
                    {item.quantity} x {formatPrice(item.unitPrice)}
                  </span>
                  <span className="ml-2 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono uppercase">
                    {item.type}
                  </span>
                </div>
              </div>
              <span className="font-mono font-bold text-slate-900">
                {formatPrice(item.totalPrice)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-mono font-semibold text-slate-900">{formatPrice(order.subtotal)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Discount ({order.couponCode}):</span>
              <span className="font-mono font-bold">-{formatPrice(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Delivery Fee:</span>
            <span className="font-mono font-semibold text-slate-900">{formatPrice(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-100">
            <span>Total:</span>
            <span className="font-mono">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Google Workspace Operation */}
      {showDriveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <CloudUpload className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Save Invoice to Google Drive?
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Save <strong>MY_SHOP_BD_Invoice_{order.orderNumber}.txt</strong> to your <strong>"MY SHOP BD Downloads"</strong> folder in Google Drive.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDriveModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDriveBackup}
                disabled={isExporting}
                className="px-5 py-2.5 bg-teal-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                {isExporting ? 'Saving...' : 'Confirm & Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
