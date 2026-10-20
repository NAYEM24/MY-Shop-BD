import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  FolderDown,
  ShoppingBag,
  Clock,
  Printer,
  CloudUpload,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';
import { saveOrderToGoogleDrive } from '../../services/driveService.ts';

export const OrderSuccessPage: React.FC = () => {
  const {
    orders,
    selectedOrderId,
    setCurrentView,
    formatPrice,
    googleAccessToken,
    loginWithGoogle,
    showToast,
  } = useShop();

  const [isExportingToDrive, setIsExportingToDrive] = useState(false);
  const [driveSavedLink, setDriveSavedLink] = useState<string | null>(null);
  const [showDriveConfirmModal, setShowDriveConfirmModal] = useState(false);

  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  useEffect(() => {
    // Launch celebratory confetti on initial load
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0d9488', '#0284c7', '#10b981', '#f59e0b'],
    });
  }, []);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">No recent order found</h2>
        <button
          type="button"
          onClick={() => setCurrentView('home')}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const hasDigitalItems = order.items.some((item) => item.type === 'digital');

  const executeGoogleDriveSave = async () => {
    setShowDriveConfirmModal(false);

    if (!googleAccessToken) {
      showToast('Connecting to your Google Drive account...', 'info');
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

    setIsExportingToDrive(true);
    try {
      const driveFile = await saveOrderToGoogleDrive(order, token);
      setDriveSavedLink(driveFile.webViewLink || '#');
      showToast('Official order invoice successfully backed up to your Google Drive!', 'success');
    } catch (err: any) {
      showToast(`Drive export error: ${err?.message || 'Failed to save file'}`, 'error');
    } finally {
      setIsExportingToDrive(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Confirmation Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="inline-block bg-teal-100 text-teal-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          Order Successfully Placed
        </span>

        <h1 className="text-3xl font-extrabold text-slate-900">
          Thank You for Shopping with MY SHOP BD!
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          We have registered your order. A confirmation SMS & email have been dispatched to{' '}
          <strong>{order.userPhone}</strong>.
        </p>

        <div className="inline-block bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-2">
          <span className="text-[11px] text-slate-400 block font-medium">Order Number:</span>
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tracking-wide">
            {order.orderNumber}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          {hasDigitalItems && (
            <button
              type="button"
              onClick={() => setCurrentView('digital-library')}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md transition-all active:scale-95"
            >
              <FolderDown className="w-4 h-4" />
              <span>Access My Digital Library</span>
            </button>
          )}

          {/* Google Drive Backup Button (Google Workspace Integration) */}
          <button
            type="button"
            onClick={() => setShowDriveConfirmModal(true)}
            disabled={isExportingToDrive}
            className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm transition-all"
          >
            <CloudUpload className="w-4 h-4 text-sky-400" />
            <span>
              {isExportingToDrive
                ? 'Backing up to Google Drive...'
                : driveSavedLink
                ? 'Saved to Drive ✓'
                : 'Save Invoice to Google Drive'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
        </div>

        {driveSavedLink && (
          <p className="text-xs text-emerald-700 font-medium pt-2">
            Invoice saved to Google Drive!{' '}
            <a href={driveSavedLink} target="_blank" rel="noreferrer" className="underline font-bold">
              Open in Drive
            </a>
          </p>
        )}
      </div>

      {/* Order Details & Address Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Items Summary */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Ordered Items ({order.items.length})
          </h3>

          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{item.productName}</span>
                  <span className="text-[11px] text-slate-500">
                    Qty: {item.quantity} x {formatPrice(item.unitPrice)}
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-900">
                  {formatPrice(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({order.couponCode}):</span>
                <span className="font-mono">-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee:</span>
              <span className="font-mono">{formatPrice(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-slate-900 font-bold pt-2 border-t border-slate-100">
              <span>Total Paid / Due:</span>
              <span className="font-mono text-sm">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Meta */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Delivery & Payment Summary
          </h3>

          <div className="space-y-3 text-xs text-slate-700">
            <div>
              <span className="text-slate-400 block text-[11px]">Recipient Address:</span>
              <span className="font-bold text-slate-900">{order.shippingAddress.fullName}</span>
              <p className="mt-0.5">{order.shippingAddress.streetAddress}</p>
              <p>
                {order.shippingAddress.upazilaOrArea}, {order.shippingAddress.district},{' '}
                {order.shippingAddress.division}
              </p>
              <p className="font-mono text-slate-600 mt-0.5">Phone: {order.userPhone}</p>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-slate-400 block text-[11px]">Payment Method:</span>
              <span className="font-bold text-slate-900 uppercase">
                {order.paymentMethod}
              </span>
              <span className="ml-2 inline-block bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded">
                Status: {order.paymentStatus.toUpperCase()}
              </span>
              {order.paymentDetails?.transactionId && (
                <p className="font-mono text-[11px] text-slate-500 mt-1">
                  TrxID: {order.paymentDetails.transactionId}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-slate-400 block text-[11px]">Fulfillment Status:</span>
              <span className="font-bold text-slate-900 capitalize">
                {order.fulfillmentStatus.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory User Confirmation Modal for Google Workspace Operation */}
      {showDriveConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <CloudUpload className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Save Invoice to Your Google Drive?
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                This operation will create a folder named <strong>"MY SHOP BD Downloads"</strong> in your Google Drive and upload a copy of your verified order receipt (<code>MY_SHOP_BD_Invoice_{order.orderNumber}.txt</code>).
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span>Permission is requested for your specific app files only (least privilege).</span>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDriveConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeGoogleDriveSave}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                Confirm & Save to Drive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
