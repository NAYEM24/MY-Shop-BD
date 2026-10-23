import React, { useState } from 'react';
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  FolderDown,
  Cloud,
  MapPin,
  MessageCircle,
  AlertCircle,
  FileText,
  Search,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';
import { Order, OrderItem } from '../../types/index.ts';
import { buildWhatsAppUrl, getOrderWhatsAppMessage } from '../../utils/whatsapp.ts';

interface RealTimeOrderTrackerProps {
  initialOrderId?: string;
}

export const RealTimeOrderTracker: React.FC<RealTimeOrderTrackerProps> = ({ initialOrderId }) => {
  const {
    orders,
    digitalEntitlements,
    formatPrice,
    language,
    storeSettings,
    showToast,
    markEntitlementDownloaded,
    markEntitlementDriveExported,
  } = useShop();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(() => {
    if (initialOrderId && orders.some((o) => o.id === initialOrderId)) {
      return initialOrderId;
    }
    return orders.length > 0 ? orders[0].id : '';
  });

  const [copiedTracking, setCopiedTracking] = useState(false);
  const [copiedOrderNumber, setCopiedOrderNumber] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [showAllLogs, setShowAllLogs] = useState(false);

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handleCopy = (text: string, type: 'tracking' | 'order') => {
    navigator.clipboard.writeText(text);
    if (type === 'tracking') {
      setCopiedTracking(true);
      showToast(language === 'bn' ? 'ট্র্যাকিং নম্বর কপি করা হয়েছে!' : 'Tracking number copied!', 'info');
      setTimeout(() => setCopiedTracking(false), 2500);
    } else {
      setCopiedOrderNumber(true);
      showToast(language === 'bn' ? 'অর্ডার নম্বর কপি করা হয়েছে!' : 'Order number copied!', 'info');
      setTimeout(() => setCopiedOrderNumber(false), 2500);
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Truck className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-900 text-base">
          {language === 'bn' ? 'কোনো সক্রিয় অর্ডার পাওয়া যায়নি' : 'No Active Shipments Yet'}
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {language === 'bn'
            ? 'আপনি অর্ডার করার সাথে সাথে এখানে রিয়েল-টাইম কুরিয়ার ও ডিজিটাল ডেলিভারি ট্র্যাকিং দেখতে পাবেন।'
            : 'Once you place an order, live courier transit checkpoints and instant digital downloads will be tracked here.'}
        </p>
      </div>
    );
  }

  // Filter orders by search if user is looking for a specific code
  const filteredOrders = orders.filter((o) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      (o.tracking?.trackingNumber && o.tracking.trackingNumber.toLowerCase().includes(q)) ||
      (o.paymentDetails?.transactionId && o.paymentDetails.transactionId.toLowerCase().includes(q))
    );
  });

  const hasPhysical = currentOrder.items.some((it) => it.type === 'physical');
  const hasDigital = currentOrder.items.some((it) => it.type === 'digital');

  // Related digital entitlements for this order
  const orderEntitlements = digitalEntitlements.filter((ent) => ent.orderId === currentOrder.id);

  // Status mapping
  const getPhysicalStepIndex = (status: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 1;
    }
  };

  const physicalStep = getPhysicalStepIndex(currentOrder.fulfillmentStatus);

  const physicalSteps = [
    {
      title: language === 'bn' ? 'অর্ডার কনফার্মড' : 'Order Confirmed',
      desc: language === 'bn' ? 'পেমেন্ট ও অর্ডার ভেরিফাইড' : 'Verified by MY SHOP BD',
    },
    {
      title: language === 'bn' ? 'প্যাকিং ও কোয়ালিটি চেক' : 'Packed & Inspected',
      desc: language === 'bn' ? 'হাব থেকে ডিসপ্যাচ প্রস্তুত' : 'Ready for courier dispatch',
    },
    {
      title: language === 'bn' ? 'কুরিয়ারে হস্তান্তর' : 'In Transit (Courier)',
      desc: currentOrder.tracking?.carrier
        ? `${currentOrder.tracking.carrier}`
        : language === 'bn'
        ? 'Steadfast / Pathao হাব'
        : 'Assigned to Courier',
    },
    {
      title: language === 'bn' ? 'ডেলিভারি সম্পন্ন' : 'Out for Delivery / Delivered',
      desc: language === 'bn' ? 'গ্রাহকের ঠিকানায় পৌঁছেছে' : 'Delivered to customer address',
    },
  ];

  const digitalStep = currentOrder.paymentStatus === 'paid' ? 2 : 0;
  const digitalSteps = [
    {
      title: language === 'bn' ? 'অর্ডার গ্রহণ' : 'Order Received',
      desc: language === 'bn' ? 'ডিজিটাল আইটেম যাচাই' : 'Digital entitlement created',
    },
    {
      title: language === 'bn' ? 'পেমেন্ট ভেরিফিকেশন' : 'Payment Clearance',
      desc: language === 'bn' ? 'বিকাশ/নগদ ক্লিয়ারেন্স' : 'bKash / Nagad confirmation',
    },
    {
      title: language === 'bn' ? 'লাইসেন্স প্রস্তুত ও আনলকড' : 'Vault Unlocked & Synced',
      desc: language === 'bn' ? 'ডাউনলোড ও গুগল ড্রাইভে প্রস্তুত' : 'Direct download & Drive active',
    },
  ];

  // WhatsApp chat link for this specific order
  const whatsappUrl = buildWhatsAppUrl(
    storeSettings.whatsappNumber || '01940320627',
    getOrderWhatsAppMessage(
      currentOrder.orderNumber,
      language,
      currentOrder.tracking?.carrier,
      currentOrder.tracking?.trackingNumber
    )
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden space-y-6">
      {/* Top Header & Order Selector Bar */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Truck className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
              {language === 'bn' ? 'রিয়েল-টাইম অর্ডার ও শিপমেন্ট ট্র্যাকিং' : 'Real-Time Order & Shipment Tracking'}
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {language === 'bn'
              ? 'আপনার ফিজিক্যাল পার্সেল ও ডিজিটাল ফাইল ডেলিভারির লাইভ স্ট্যাটাস পর্যবেক্ষণ করুন।'
              : 'Monitor real-time courier checkpoints for physical parcels and instant digital delivery.'}
          </p>
        </div>

        {/* WhatsApp Quick Inquire Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start md:self-auto inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 shrink-0"
          title={`Chat with Live Support on WhatsApp (${storeSettings.whatsappNumber || '01940320627'})`}
        >
          <MessageCircle className="w-4 h-4 fill-slate-950 text-[#25D366]" />
          <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে ট্র্যাকিং সহায়তা' : 'WhatsApp Shipment Help'}</span>
        </a>
      </div>

      <div className="p-5 sm:p-6 pt-0 space-y-6">
        {/* Order Selector (Horizontal Pills if multiple orders exist) */}
        {orders.length > 1 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>{language === 'bn' ? 'ট্র্যাক করার জন্য অর্ডার সিলেক্ট করুন:' : 'Select Shipment to Track:'}</span>
              {orders.length > 3 && (
                <div className="relative w-44">
                  <input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Search by MSBD..."
                    className="w-full pl-6 pr-2 py-1 text-[11px] bg-slate-50 border rounded-lg font-mono"
                  />
                  <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2" />
                </div>
              )}
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
              {filteredOrders.map((ord) => {
                const isSelected = ord.id === currentOrder.id;
                const hasP = ord.items.some((i) => i.type === 'physical');
                const hasD = ord.items.some((i) => i.type === 'digital');

                return (
                  <button
                    key={ord.id}
                    type="button"
                    onClick={() => setSelectedOrderId(ord.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center space-x-2 shrink-0 border ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="font-bold">{ord.orderNumber}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-md uppercase font-sans font-bold ${
                        isSelected
                          ? 'bg-teal-700 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {hasP && hasD ? 'Hybrid' : hasD ? 'Digital' : 'Physical'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Order Summary Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono font-black text-slate-900 text-base sm:text-lg">
                {currentOrder.orderNumber}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(currentOrder.orderNumber, 'order')}
                className="text-slate-400 hover:text-teal-700 p-1"
                title="Copy Order Number"
              >
                {copiedOrderNumber ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Shipment Type Badges */}
              {hasPhysical && (
                <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <Package className="w-3 h-3 text-teal-400" />
                  <span>{language === 'bn' ? 'ফিজিক্যাল পার্সেল' : 'Physical Parcel'}</span>
                </span>
              )}
              {hasDigital && (
                <span className="bg-sky-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <FolderDown className="w-3 h-3 text-sky-200" />
                  <span>{language === 'bn' ? 'ডিজিটাল ডাউনলোড' : 'Digital Files'}</span>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'অর্ডার সময়: ' : 'Placed: '}
              {new Date(currentOrder.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
              {' • '}
              <span className="font-semibold text-slate-700 font-mono">
                {formatPrice(currentOrder.totalAmount)}
              </span>
              {' • '}
              <span className="capitalize text-teal-700 font-bold">
                {currentOrder.paymentMethod}
              </span>
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Live Status indicator */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 ${
                currentOrder.fulfillmentStatus === 'delivered'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : currentOrder.fulfillmentStatus === 'shipped'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  currentOrder.fulfillmentStatus === 'delivered'
                    ? 'bg-emerald-500'
                    : currentOrder.fulfillmentStatus === 'shipped'
                    ? 'bg-blue-500 animate-pulse'
                    : 'bg-amber-500 animate-pulse'
                }`}
              />
              <span className="uppercase tracking-wide text-[11px]">
                {currentOrder.fulfillmentStatus === 'shipped'
                  ? language === 'bn'
                    ? 'কুরিয়ারে ট্রানজিটে আছে'
                    : 'In Transit'
                  : currentOrder.fulfillmentStatus}
              </span>
            </span>
          </div>
        </div>

        {/* SECTION A: PHYSICAL SHIPMENT TRACKING (IF PHYSICAL ITEMS PRESENT) */}
        {hasPhysical && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2 border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <Truck className="w-4 h-4 text-teal-600" />
                <span>
                  {language === 'bn'
                    ? 'পার্সেল কুরিয়ার ট্র্যাকিং (সারা বাংলাদেশ)'
                    : 'Physical Parcel Courier Tracking'}
                </span>
              </h3>
              {currentOrder.tracking?.carrier && (
                <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  {currentOrder.tracking.carrier}
                </span>
              )}
            </div>

            {/* Courier Tracking Info Box */}
            <div className="bg-gradient-to-br from-teal-50/70 via-white to-sky-50/60 p-4 sm:p-5 rounded-2xl border border-teal-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px] font-medium">
                  {language === 'bn' ? 'কুরিয়ার ট্র্যাকিং কোড' : 'Tracking Number'}
                </span>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className="font-mono font-extrabold text-slate-900 text-sm">
                    {currentOrder.tracking?.trackingNumber || 'Pending Dispatch'}
                  </span>
                  {currentOrder.tracking?.trackingNumber && (
                    <button
                      type="button"
                      onClick={() => handleCopy(currentOrder.tracking!.trackingNumber!, 'tracking')}
                      className="text-slate-400 hover:text-teal-700 p-0.5"
                      title="Copy Tracking Number"
                    >
                      {copiedTracking ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] font-medium">
                  {language === 'bn' ? 'সম্ভাব্য ডেলিভারি সময়' : 'Estimated Delivery'}
                </span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  {currentOrder.tracking?.estimatedDelivery ||
                    (language === 'bn' ? '২৪-৪৮ ঘণ্টার মধ্যে (ঢাকা ও অন্যান্য জেলা)' : 'Within 24-48 hours')}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] font-medium">
                  {language === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Destination'}
                </span>
                <span className="font-medium text-slate-800 mt-0.5 block truncate">
                  {currentOrder.shippingAddress.upazilaOrArea
                    ? `${currentOrder.shippingAddress.upazilaOrArea}, `
                    : ''}
                  {currentOrder.shippingAddress.district},{' '}
                  {currentOrder.shippingAddress.division}
                </span>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="py-2">
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-4 left-6 right-6 h-1 bg-slate-100 rounded-full hidden sm:block">
                  <div
                    className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-700"
                    style={{
                      width: `${(physicalStep / (physicalSteps.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2">
                  {physicalSteps.map((step, idx) => {
                    const isPassed = idx <= physicalStep;
                    const isCurrent = idx === physicalStep;

                    return (
                      <div
                        key={step.title}
                        className="flex sm:flex-col items-center sm:text-center space-x-3 sm:space-x-0 relative z-10"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                            isPassed
                              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 ring-4 ring-teal-50'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}
                        >
                          {isPassed ? <Check className="w-4 h-4 stroke-[2.5]" /> : idx + 1}
                        </div>

                        <div className="mt-0 sm:mt-2.5 min-w-0">
                          <p
                            className={`text-xs font-bold leading-tight ${
                              isCurrent
                                ? 'text-teal-700'
                                : isPassed
                                ? 'text-slate-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Physical Items in parcel */}
            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-600 block">
                {language === 'bn' ? 'পার্সেলের অন্তর্ভুক্ত পণ্যসমূহ:' : 'Parcel Items:'}
              </span>
              <div className="space-y-1.5">
                {currentOrder.items
                  .filter((it) => it.type === 'physical')
                  .map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs bg-white p-2 rounded-xl border border-slate-200/60"
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <img
                          src={it.image}
                          alt={it.productName}
                          className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-100"
                        />
                        <div className="truncate">
                          <p className="font-bold text-slate-800 truncate">{it.productName}</p>
                          <p className="text-[10px] text-slate-400">
                            Qty: {it.quantity} • {formatPrice(it.unitPrice)} each
                          </p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-slate-900 shrink-0 ml-2">
                        {formatPrice(it.totalPrice)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION B: DIGITAL SHIPMENT TRACKING (IF DIGITAL ITEMS PRESENT) */}
        {hasDigital && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b pb-2 border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <FolderDown className="w-4 h-4 text-sky-600" />
                <span>
                  {language === 'bn'
                    ? 'ডিজিটাল ডেলিভারি ভল্ট (তাৎক্ষণিক এক্সেস)'
                    : 'Instant Digital Delivery Vault'}
                </span>
              </h3>
              <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                100% Instant Delivery
              </span>
            </div>

            {/* Stepper for Digital */}
            <div className="py-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {digitalSteps.map((step, idx) => {
                  const isPassed = idx <= digitalStep;
                  return (
                    <div
                      key={step.title}
                      className={`p-3 rounded-2xl border transition-all flex items-start space-x-2.5 ${
                        isPassed
                          ? 'bg-sky-50/60 border-sky-200 text-sky-950'
                          : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 ${
                          isPassed ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isPassed ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold leading-tight">{step.title}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Unlocked Digital Files & Download Links */}
            <div className="space-y-2">
              {currentOrder.items
                .filter((it) => it.type === 'digital')
                .map((it, idx) => {
                  const ent = orderEntitlements.find((e) => e.productId === it.productId);

                  return (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 rounded-2xl bg-white border border-sky-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                            {it.productName}
                          </h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            PDF Format • Version 1.0 • Verified Digital License
                          </p>
                        </div>
                      </div>

                      {/* Download & Drive Actions */}
                      <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (ent) markEntitlementDownloaded(ent.id);
                            showToast(
                              language === 'bn'
                                ? 'ডাউনলোড শুরু হয়েছে...'
                                : 'Downloading digital publication...',
                              'success'
                            );
                            // Simulating direct download
                            const dummyBlob = new Blob(
                              [`MY SHOP BD Digital Publication - ${it.productName}\nOrder: ${currentOrder.orderNumber}`],
                              { type: 'application/pdf' }
                            );
                            const url = URL.createObjectURL(dummyBlob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${it.productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;
                            a.click();
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                          <FolderDown className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'ডাউনলোড' : 'Download PDF'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (ent) markEntitlementDriveExported(ent.id, 'DRIVE_SYNC_OK');
                            showToast(
                              language === 'bn'
                                ? 'গুগল ড্রাইভে সিঙ্ক সফল হয়েছে!'
                                : 'Successfully synced to Google Drive!',
                              'success'
                            );
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center space-x-1.5 border border-slate-200 transition-colors cursor-pointer"
                          title="Save directly to Google Drive"
                        >
                          <Cloud className="w-3.5 h-3.5 text-sky-600" />
                          <span className="hidden xs:inline">Drive Sync</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* SECTION C: REAL-TIME AUDIT LOGS & SHIPMENT TIMELINE */}
        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {language === 'bn' ? 'লাইভ টাইমলাইন ও শিপমেন্ট লগ' : 'Real-Time Checkpoints & Audit Trail'}
              </span>
            </span>

            {currentOrder.auditLogs && currentOrder.auditLogs.length > 2 && (
              <button
                type="button"
                onClick={() => setShowAllLogs(!showAllLogs)}
                className="text-[11px] text-teal-700 font-semibold hover:underline"
              >
                {showAllLogs
                  ? language === 'bn'
                    ? 'সংক্ষিপ্ত দেখুন'
                    : 'Show Less'
                  : language === 'bn'
                  ? `সবগুলো দেখুন (${currentOrder.auditLogs.length})`
                  : `View All (${currentOrder.auditLogs.length})`}
              </button>
            )}
          </div>

          <div className="space-y-2 border-l-2 border-teal-200 ml-2.5 pl-3">
            {(showAllLogs
              ? currentOrder.auditLogs
              : (currentOrder.auditLogs || []).slice(-3)
            ).map((log, idx) => (
              <div key={idx} className="relative text-xs space-y-0.5">
                <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-teal-500 ring-4 ring-white" />
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="font-bold text-slate-800 text-[11px] capitalize">
                    {log.action.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    • {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                </div>
                {log.notes && <p className="text-[11px] text-slate-600">{log.notes}</p>}
                <span className="text-[10px] text-slate-400 block font-medium">By: {log.actor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION D: DEDICATED WHATSAPP LIVE HELP BANNER */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
              <MessageCircle className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">
                {language === 'bn'
                  ? 'এই ডেলিভারি নিয়ে সরাসরি হোয়াটসঅ্যাপে কথা বলুন'
                  : 'Have questions regarding this shipment?'}
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {language === 'bn'
                  ? `আমাদের কাস্টমার কেয়ার টিম (${storeSettings.whatsappNumber || '01940320627'}) লাইভ রয়েছে।`
                  : `Chat directly with our Dhaka logistics team at ${storeSettings.whatsappNumber || '01940320627'}.`}
              </p>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-sm active:scale-95 transition-all self-end sm:self-center shrink-0"
          >
            <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে মেসেজ পাঠান' : 'Open WhatsApp'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
