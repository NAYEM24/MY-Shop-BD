import React, { useState } from 'react';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Phone,
  MapPin,
  Lock,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';
import { BANGLADESH_DIVISIONS } from '../../data/mockDatabase.ts';
import { PaymentMethod, ShippingAddress } from '../../types/index.ts';
import { validateBkashTrxId, validateNagadTrxId } from '../../utils/shopRules.ts';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    shippingAddress,
    setShippingAddress,
    orderSummary,
    formatPrice,
    placeOrder,
    setCurrentView,
    storeSettings,
    showToast,
  } = useShop();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [transactionId, setTransactionId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  const availableDistricts = BANGLADESH_DIVISIONS[shippingAddress.division] || [];

  const handleDivisionChange = (newDivision: string) => {
    const districts = BANGLADESH_DIVISIONS[newDivision] || [];
    setShippingAddress((prev) => ({
      ...prev,
      division: newDivision,
      district: districts[0] || '',
    }));
  };

  const handleTestAutofill = () => {
    if (paymentMethod === 'bkash') {
      setTransactionId('9G7K2L8X10');
      setSenderNumber('01711234567');
      showToast('Autofilled verified test bKash transaction details.', 'info');
    } else if (paymentMethod === 'nagad') {
      setTransactionId('NG8829104');
      setSenderNumber('01819876543');
      showToast('Autofilled verified test Nagad transaction details.', 'info');
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!shippingAddress.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    const cleanPhone = shippingAddress.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 11 || (!cleanPhone.startsWith('01') && !cleanPhone.startsWith('8801'))) {
      errors.phone = 'Valid 11-digit Bangladeshi phone number required (e.g. 01711000000)';
    }

    if (!shippingAddress.streetAddress.trim()) {
      errors.streetAddress = 'Street address / House / Area is required';
    }

    // Payment validation
    if (paymentMethod === 'bkash') {
      if (!validateBkashTrxId(transactionId)) {
        errors.trxId = 'Please enter a valid bKash Transaction ID (8-12 alphanumeric characters, e.g. 9G7K2L8X10)';
      }
    } else if (paymentMethod === 'nagad') {
      if (!validateNagadTrxId(transactionId)) {
        errors.trxId = 'Please enter a valid Nagad Transaction ID (8-12 alphanumeric characters)';
      }
    }

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the highlighted form errors before proceeding.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await placeOrder(paymentMethod, {
        transactionId: paymentMethod === 'cod' ? undefined : transactionId.trim().toUpperCase(),
        senderNumber: paymentMethod === 'cod' ? undefined : senderNumber.trim(),
        isTestMode: storeSettings.isPaymentTestMode,
      });
    } catch (err: any) {
      showToast(err?.message || 'Could not place order.', 'error');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <button
          type="button"
          onClick={() => setCurrentView('shop')}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Steps */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <button
            type="button"
            onClick={() => setCurrentView('cart')}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Cart</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Secure Checkout
          </h1>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span className="font-bold text-teal-700">1. Cart</span>
          <span>→</span>
          <span className="font-extrabold text-slate-900 bg-teal-50 text-teal-800 px-2.5 py-1 rounded-lg border border-teal-200">
            2. Shipping & Payment
          </span>
          <span>→</span>
          <span>3. Confirmation</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Bangladesh Address & Payment Method */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Shipping Address */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>Customer & Delivery Details in Bangladesh</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  placeholder="e.g. Nayem Hosan"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {addressErrors.fullName && (
                  <span className="text-[10px] text-rose-500 mt-1 block">{addressErrors.fullName}</span>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Mobile Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  placeholder="01711-XXXXXX"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {addressErrors.phone && (
                  <span className="text-[10px] text-rose-500 mt-1 block">{addressErrors.phone}</span>
                )}
              </div>

              {/* Division Select */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Division <span className="text-slate-400 font-normal text-xs">(Bibhag)</span> <span className="text-rose-500">*</span>
                </label>
                <select
                  value={shippingAddress.division}
                  onChange={(e) => handleDivisionChange(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer font-medium"
                >
                  {Object.keys(BANGLADESH_DIVISIONS).map((div) => (
                    <option key={div} value={div}>
                      {div} Division
                    </option>
                  ))}
                </select>
              </div>

              {/* District Select */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  District <span className="text-slate-400 font-normal text-xs">(Zila)</span> <span className="text-rose-500">*</span>
                </label>
                <select
                  value={shippingAddress.district}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, district: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer font-medium"
                >
                  {availableDistricts.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upazila / Area */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Upazila / Thana / Area
                </label>
                <input
                  type="text"
                  value={shippingAddress.upazilaOrArea}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, upazilaOrArea: e.target.value })}
                  placeholder="e.g. Dhanmondi / Gulshan / Mirpur"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Detailed Street Address */}
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">
                  Street Address / House / Flat <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.streetAddress}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, streetAddress: e.target.value })}
                  placeholder="House 12, Road 5, Sector 3, Uttara, Dhaka"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {addressErrors.streetAddress && (
                  <span className="text-[10px] text-rose-500 mt-1 block">{addressErrors.streetAddress}</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Payment Gateway Selection */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-teal-600" />
                <span>Select Payment Method (Bangladesh)</span>
              </h2>

              {storeSettings.isPaymentTestMode && (
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                  Test Mode Active
                </span>
              )}
            </div>

            {/* Methods options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* bKash */}
              <div
                onClick={() => setPaymentMethod('bkash')}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'bkash'
                    ? 'border-pink-600 bg-pink-50/40 text-slate-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-pink-600">bKash</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bkash'}
                    onChange={() => setPaymentMethod('bkash')}
                    className="accent-pink-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Instant merchant payment via bKash App or dial *247#.
                </p>
              </div>

              {/* Nagad */}
              <div
                onClick={() => setPaymentMethod('nagad')}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'nagad'
                    ? 'border-orange-600 bg-orange-50/40 text-slate-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-orange-600">Nagad</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'nagad'}
                    onChange={() => setPaymentMethod('nagad')}
                    className="accent-orange-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Post office digital financial service. Dial *167#.
                </p>
              </div>

              {/* Cash on Delivery (COD) */}
              <div
                onClick={() => {
                  if (orderSummary.hasPhysicalItems) setPaymentMethod('cod');
                }}
                className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                  !orderSummary.hasPhysicalItems
                    ? 'opacity-50 cursor-not-allowed bg-slate-100 border-slate-200'
                    : paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50/40 text-slate-900 cursor-pointer'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-800">Cash on Delivery</span>
                  <input
                    type="radio"
                    name="payment"
                    disabled={!orderSummary.hasPhysicalItems}
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-emerald-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  {orderSummary.hasPhysicalItems
                    ? 'Pay cash directly upon receiving physical delivery at your door.'
                    : 'Not available for digital-only orders.'}
                </p>
              </div>

              {/* Manual Bank / Wire */}
              <div
                onClick={() => setPaymentMethod('manual')}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  paymentMethod === 'manual'
                    ? 'border-teal-600 bg-teal-50/40 text-slate-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Manual / Bank Transfer</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'manual'}
                    onChange={() => setPaymentMethod('manual')}
                    className="accent-teal-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  City Bank or Dutch-Bangla Bank branch / online transfer.
                </p>
              </div>
            </div>

            {/* bKash Payment Instructions & Transaction ID Box */}
            {paymentMethod === 'bkash' && (
              <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-pink-900">bKash Merchant Payment Guide</span>
                  {storeSettings.isPaymentTestMode && (
                    <button
                      type="button"
                      onClick={handleTestAutofill}
                      className="px-2.5 py-1 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-[10px] font-bold"
                    >
                      Autofill Test TRX ID
                    </button>
                  )}
                </div>

                <ol className="list-decimal list-inside space-y-1 text-slate-700 text-[11px]">
                  <li>Open bKash App or Dial *247# and select "Make Payment".</li>
                  <li>
                    Merchant Number:{' '}
                    <strong className="font-mono text-pink-900 font-bold">
                      {storeSettings.bkashMerchantNumber}
                    </strong>
                  </li>
                  <li>
                    Amount:{' '}
                    <strong className="font-mono text-pink-900 font-bold">
                      {formatPrice(orderSummary.totalAmount)}
                    </strong>
                  </li>
                  <li>Reference: <strong>MYSHOPBD</strong></li>
                  <li>Copy the 10-character Transaction ID received in SMS.</li>
                </ol>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      bKash Transaction ID (TrxID) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9G7K2L8X10"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full p-2 bg-white border border-pink-300 rounded-xl font-mono uppercase text-xs focus:ring-2 focus:ring-pink-500"
                    />
                    {addressErrors.trxId && (
                      <span className="text-[10px] text-rose-500 mt-1 block">{addressErrors.trxId}</span>
                    )}
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Your bKash Wallet Number
                    </label>
                    <input
                      type="tel"
                      placeholder="017XXXXXXXX"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      className="w-full p-2 bg-white border border-pink-300 rounded-xl text-xs focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Nagad Payment Instructions & Transaction ID Box */}
            {paymentMethod === 'nagad' && (
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-orange-900">Nagad Merchant Payment Guide</span>
                  {storeSettings.isPaymentTestMode && (
                    <button
                      type="button"
                      onClick={handleTestAutofill}
                      className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-[10px] font-bold"
                    >
                      Autofill Test TRX ID
                    </button>
                  )}
                </div>

                <ol className="list-decimal list-inside space-y-1 text-slate-700 text-[11px]">
                  <li>Open Nagad App or Dial *167# and choose "Merchant Pay".</li>
                  <li>
                    Merchant Number:{' '}
                    <strong className="font-mono text-orange-900 font-bold">
                      {storeSettings.nagadMerchantNumber}
                    </strong>
                  </li>
                  <li>
                    Amount:{' '}
                    <strong className="font-mono text-orange-900 font-bold">
                      {formatPrice(orderSummary.totalAmount)}
                    </strong>
                  </li>
                  <li>Enter PIN and copy the Transaction ID.</li>
                </ol>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Nagad Transaction ID (TrxID) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NG8829104"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full p-2 bg-white border border-orange-300 rounded-xl font-mono uppercase text-xs focus:ring-2 focus:ring-orange-500"
                    />
                    {addressErrors.trxId && (
                      <span className="text-[10px] text-rose-500 mt-1 block">{addressErrors.trxId}</span>
                    )}
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Your Nagad Wallet Number
                    </label>
                    <input
                      type="tel"
                      placeholder="018XXXXXXXX"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      className="w-full p-2 bg-white border border-orange-300 rounded-xl text-xs focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review & Complete Button */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Review Items in Order
            </h3>

            {/* List of items */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={`${item.productId}_${item.variantId || 'def'}`}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0"
                >
                  <div className="flex items-center space-x-2.5">
                    <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-50" />
                    <div>
                      <span className="font-bold text-slate-900 line-clamp-1">{item.name}</span>
                      <span className="text-slate-400">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-slate-900">
                  {formatPrice(orderSummary.subtotal)}
                </span>
              </div>

              {orderSummary.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount</span>
                  <span className="font-mono font-bold">
                    -{formatPrice(orderSummary.discountAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>
                  Delivery Charge ({shippingAddress.division === 'Dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})
                </span>
                <span className="font-mono font-semibold text-slate-900">
                  {orderSummary.shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatPrice(orderSummary.shippingFee)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Final Total</span>
                  <span className="text-[10px] text-slate-400">Bangladeshi Taka (BDT)</span>
                </div>
                <span className="text-2xl font-extrabold text-slate-900 font-mono">
                  {formatPrice(orderSummary.totalAmount)}
                </span>
              </div>
            </div>

            {/* Submit Order Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:bg-slate-300 text-white font-extrabold text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying & Confirming...' : 'Confirm Order & Pay'}</span>
            </button>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              By confirming, you agree to the MY SHOP BD terms of service and verified return policy.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
