import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, Truck, Package, AlertCircle } from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';
import { Order } from '../../types/index.ts';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ isOpen, onClose }) => {
  const { orders, setSelectedOrderId, setCurrentView, formatPrice, t, language } = useShop();
  const [searchCode, setSearchCode] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchCode.trim().toUpperCase();
    if (!query) return;

    const matched = orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === query ||
        o.id.toUpperCase() === query ||
        (o.paymentDetails?.transactionId && o.paymentDetails.transactionId.toUpperCase() === query)
    );

    setSearchedOrder(matched || null);
    setHasSearched(true);
  };

  const getStepStatus = (step: 'confirmed' | 'processing' | 'shipped' | 'delivered') => {
    if (!searchedOrder) return 'pending';
    const status = searchedOrder.fulfillmentStatus;

    if (step === 'confirmed') return 'completed';
    if (step === 'processing') {
      if (['processing', 'shipped', 'delivered'].includes(status)) return 'completed';
      return 'active';
    }
    if (step === 'shipped') {
      if (['shipped', 'delivered'].includes(status)) return 'completed';
      if (status === 'processing') return 'active';
      return 'pending';
    }
    if (step === 'delivered') {
      if (status === 'delivered') return 'completed';
      return 'pending';
    }
    return 'pending';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Truck className="w-5 h-5 text-teal-600" />
              <span>{language === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Track Your Order'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'bn'
                ? 'আপনার অর্ডার নম্বর (যেমন: MSBD-2026-...) লিখুন'
                : 'Enter your order number or bKash TrxID to track delivery'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <form onSubmit={handleTrack} className="mt-5 space-y-4">
          <div className="relative">
            <input
              type="text"
              required
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="e.g. MSBD-2026-9812 or TrxID"
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

          {/* Quick chip demo for testing */}
          {orders.length > 0 && !hasSearched && (
            <div className="text-xs text-slate-500 flex items-center space-x-2">
              <span>{language === 'bn' ? 'সাম্প্রতিক অর্ডার:' : 'Recent Order:'}</span>
              <button
                type="button"
                onClick={() => setSearchCode(orders[0].orderNumber)}
                className="font-mono text-teal-700 underline font-semibold"
              >
                {orders[0].orderNumber}
              </button>
            </div>
          )}
        </form>

        {/* Results */}
        {hasSearched && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            {searchedOrder ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-teal-50/60 p-3.5 rounded-2xl border border-teal-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider block">
                      {searchedOrder.orderNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {searchedOrder.shippingAddress.fullName} • {searchedOrder.shippingAddress.division}
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

                {/* Progress Steps */}
                <div className="space-y-3 py-2">
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
                        {language === 'bn' ? 'প্যাকেজিং ও প্রসেসিং' : 'Processing & Packaging'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {searchedOrder.fulfillmentStatus === 'pending_payment'
                          ? 'Awaiting payment verification'
                          : 'Items verified and prepared for courier'}
                      </p>
                    </div>
                  </div>

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
                        {language === 'bn' ? 'কুরিয়ারে হস্তান্তর (Pathao / Steadfast)' : 'Handed to Courier (Pathao / Steadfast)'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {searchedOrder.tracking?.trackingNumber
                          ? `Tracking: ${searchedOrder.tracking.trackingNumber}`
                          : 'Dispatched to customer location'}
                      </p>
                    </div>
                  </div>

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
                          ? 'Package handed over successfully'
                          : 'Expected soon'}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedOrderId(searchedOrder.id);
                    setCurrentView('order-detail');
                    onClose();
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  {language === 'bn' ? 'সম্পূর্ণ অর্ডারের বিস্তারিত দেখুন' : 'View Full Order Details'}
                </button>
              </div>
            ) : (
              <div className="text-center py-4 space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-sm font-bold text-slate-800">
                  {language === 'bn' ? 'কোনো অর্ডার পাওয়া যায়নি' : 'No Order Found'}
                </p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {language === 'bn'
                    ? 'দয়া করে আপনার অর্ডার নম্বরটি সঠিক কিনা যাচাই করুন।'
                    : 'Please check your Order Number or bKash TrxID and try again.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
