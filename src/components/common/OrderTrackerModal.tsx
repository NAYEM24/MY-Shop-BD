import React, { useState } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  AlertCircle,
  Copy,
  Check,
  Download,
  FileText,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';
import { Order } from '../../types/index.ts';
import { buildWhatsAppUrl, getOrderWhatsAppMessage } from '../../utils/whatsapp.ts';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ isOpen, onClose }) => {
  const {
    orders,
    digitalEntitlements,
    setSelectedOrderId,
    setCurrentView,
    formatPrice,
    storeSettings,
    language,
    showToast,
  } = useShop();

  const [searchCode, setSearchCode] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);

  if (!isOpen) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchCode.trim().toUpperCase();
    if (!query) return;

    const matched = orders.find((o) => {
      const orderNumMatch = o.orderNumber.toUpperCase() === query;
      const idMatch = o.id.toUpperCase() === query;
      const trxMatch =
        o.paymentDetails?.transactionId &&
        o.paymentDetails.transactionId.toUpperCase() === query;
      const trackingMatch =
        o.tracking?.trackingNumber &&
        o.tracking.trackingNumber.toUpperCase() === query;
      const phoneMatch = o.userPhone.replace(/\D/g, '') === query.replace(/\D/g, '');

      return orderNumMatch || idMatch || trxMatch || trackingMatch || phoneMatch;
    });

    setSearchedOrder(matched || null);
    setHasSearched(true);
  };

  const handleCopyTracking = (trackingNum: string) => {
    navigator.clipboard.writeText(trackingNum);
    setCopiedTracking(true);
    showToast('Tracking number copied to clipboard!', 'info');
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const hasPhysical = searchedOrder?.items.some((i) => i.type === 'physical') ?? true;
  const hasDigital = searchedOrder?.items.some((i) => i.type === 'digital') ?? false;

  const orderEntitlements = searchedOrder
    ? digitalEntitlements.filter((e) => e.orderId === searchedOrder.id)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Truck className="w-5 h-5 text-teal-600" />
              <span>{language === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Track Your Order'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'bn'
                ? 'অর্ডার নম্বর, ট্র্যাকিং কোড (Pathao/Steadfast) বা TrxID লিখুন'
                : 'Enter Order Number, Courier Tracking ID, or bKash TrxID'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Order Tracker"
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleTrack} className="mt-5 space-y-3">
          <div className="relative">
            <input
              type="text"
              required
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="e.g. MSBD-2026-9812 or ST-9021844BD"
              className="w-full pl-10 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-mono text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              {language === 'bn' ? 'খুঁজুন' : 'Track'}
            </button>
          </div>

          {/* Quick chips from recent orders */}
          {orders.length > 0 && !hasSearched && (
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
              <span>{language === 'bn' ? 'নমুনা:' : 'Sample:'}</span>
              {orders.slice(0, 2).map((ord) => (
                <button
                  key={ord.id}
                  type="button"
                  onClick={() => {
                    setSearchCode(ord.tracking?.trackingNumber || ord.orderNumber);
                  }}
                  className="font-mono text-xs px-2 py-0.5 bg-slate-100 hover:bg-teal-50 text-teal-800 rounded-md border border-slate-200 font-medium"
                >
                  {ord.tracking?.trackingNumber || ord.orderNumber}
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Results Section */}
        {hasSearched && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            {searchedOrder ? (
              <div className="space-y-4">
                {/* Order Summary Card */}
                <div className="flex items-center justify-between bg-teal-50/70 p-3.5 rounded-2xl border border-teal-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider block">
                      {searchedOrder.orderNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {searchedOrder.shippingAddress.fullName} • {searchedOrder.shippingAddress.district || searchedOrder.shippingAddress.division}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-900 block">
                      {formatPrice(searchedOrder.totalAmount)}
                    </span>
                    <span className="text-[10px] text-teal-700 font-medium capitalize">
                      {searchedOrder.paymentMethod.toUpperCase()} ({searchedOrder.paymentStatus})
                    </span>
                  </div>
                </div>

                {/* Tracking Badge & Copy Code (if physical shipment exists) */}
                {searchedOrder.tracking?.trackingNumber && (
                  <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-teal-400 font-bold block">
                        Courier: {searchedOrder.tracking.carrier || 'Express'}
                      </span>
                      <span className="font-mono text-sm font-bold text-white">
                        {searchedOrder.tracking.trackingNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyTracking(searchedOrder.tracking!.trackingNumber!)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-lg text-xs font-semibold flex items-center space-x-1 border border-slate-700"
                    >
                      {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedTracking ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}

                {/* Progress Steps for Physical Deliveries */}
                {hasPhysical && (
                  <div className="space-y-3 py-2">
                    {/* Step 1: Confirmed */}
                    <div className="flex items-center space-x-3 text-xs">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">
                          {language === 'bn' ? 'অর্ডার নিশ্চিত হয়েছে' : 'Order Confirmed'}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {new Date(searchedOrder.createdAt).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                    </div>

                    {/* Step 2: Processing */}
                    <div className="flex items-center space-x-3 text-xs">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                          ['processing', 'shipped', 'delivered'].includes(searchedOrder.fulfillmentStatus)
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">
                          {language === 'bn' ? 'প্যাকেজিং ও ইনভেন্টরি প্রস্তুতি' : 'Processing & Packaging'}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {searchedOrder.fulfillmentStatus === 'pending_payment'
                            ? 'Awaiting payment verification'
                            : 'Items verified & parcel packed'}
                        </p>
                      </div>
                    </div>

                    {/* Step 3: Courier */}
                    <div className="flex items-center space-x-3 text-xs">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                          ['shipped', 'delivered'].includes(searchedOrder.fulfillmentStatus)
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">
                          {language === 'bn'
                            ? `কুরিয়ারে হস্তান্তর (${searchedOrder.tracking?.carrier || 'Pathao / Steadfast'})`
                            : `Handed to Courier (${searchedOrder.tracking?.carrier || 'Pathao / Steadfast'})`}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {searchedOrder.tracking?.trackingNumber
                            ? `Tracking Code: ${searchedOrder.tracking.trackingNumber}`
                            : 'Dispatched to local courier distribution center'}
                        </p>
                      </div>
                    </div>

                    {/* Step 4: Delivered */}
                    <div className="flex items-center space-x-3 text-xs">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                          searchedOrder.fulfillmentStatus === 'delivered'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">
                          {language === 'bn' ? 'সফলভাবে ডেলিভার্ড' : 'Delivered to Customer'}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {searchedOrder.fulfillmentStatus === 'delivered'
                            ? 'Parcel received & signed'
                            : searchedOrder.tracking?.estimatedDelivery || 'In transit across Bangladesh'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Digital Delivery Section (if digital items present) */}
                {hasDigital && (
                  <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-sky-900">
                      <span className="flex items-center space-x-1.5">
                        <FileText className="w-4 h-4 text-sky-700" />
                        <span>Instant Digital Vault Unlocked</span>
                      </span>
                      <span className="text-[10px] bg-sky-200/80 text-sky-800 px-2 py-0.5 rounded-full font-mono">
                        {orderEntitlements.length} Item(s)
                      </span>
                    </div>
                    <p className="text-[11px] text-sky-700">
                      Your purchased guides/PDFs are active and ready in your library with Google Drive backup.
                    </p>
                    {orderEntitlements.map((ent) => (
                      <div
                        key={ent.id}
                        className="bg-white p-2.5 rounded-xl border border-sky-100 flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-slate-800 truncate mr-2">
                          {ent.productName}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrderId(searchedOrder.id);
                            setCurrentView('account');
                            onClose();
                          }}
                          className="px-2 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-[10px] font-bold flex items-center space-x-1 flex-shrink-0"
                        >
                          <Download className="w-3 h-3" />
                          <span>Vault Access</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOrderId(searchedOrder.id);
                      setCurrentView('order-detail');
                      onClose();
                    }}
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center space-x-1"
                  >
                    <span>{language === 'bn' ? 'সম্পূর্ণ অর্ডারের বিস্তারিত দেখুন' : 'View Full Order Details'}</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </button>

                  {/* Ask Support via WhatsApp */}
                  <a
                    href={buildWhatsAppUrl(
                      storeSettings.whatsappNumber || '01940320627',
                      getOrderWhatsAppMessage(
                        searchedOrder.orderNumber,
                        language,
                        searchedOrder.tracking?.carrier,
                        searchedOrder.tracking?.trackingNumber
                      )
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-5 space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-sm font-bold text-slate-800">
                  {language === 'bn' ? 'কোনো অর্ডার পাওয়া যায়নি' : 'No Order Found'}
                </p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {language === 'bn'
                    ? 'দয়া করে আপনার অর্ডার নম্বর বা ট্র্যাকিং কোডটি যাচাই করে পুনরায় চেষ্টা করুন।'
                    : 'Please verify your Order Number, Steadfast/Pathao tracking code, or bKash TrxID.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
