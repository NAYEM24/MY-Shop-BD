import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Tag,
  Truck,
  ShieldCheck,
  CheckCircle2,
  X,
  ArrowLeft,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    orderSummary,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    formatPrice,
    setCurrentView,
    storeSettings,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCouponCode(couponInput.trim());
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Explore smart gadgets, traditional Bangladeshi cotton, or bioscience study books to add items to your cart.
        </p>
        <button
          type="button"
          onClick={() => setCurrentView('shop')}
          className="mt-4 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
        >
          Explore Catalog Now
        </button>
      </div>
    );
  }

  const freeShippingLeft = Math.max(0, storeSettings.freeShippingThreshold - orderSummary.subtotal);
  const freeShippingProgress = Math.min(
    100,
    Math.round((orderSummary.subtotal / storeSettings.freeShippingThreshold) * 100)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Shopping Cart</h1>
          <p className="text-xs text-slate-500 mt-1">{cart.length} unique items in your basket</p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-rose-600 hover:underline flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Entire Cart</span>
        </button>
      </div>

      {/* Free shipping progress */}
      {orderSummary.hasPhysicalItems && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-800 flex items-center space-x-1.5">
              <Truck className="w-4 h-4 text-teal-600" />
              {orderSummary.isFreeShipping ? (
                <span className="text-emerald-700 font-bold">
                  Congratulations! You unlocked FREE Bangladesh delivery!
                </span>
              ) : (
                <span>
                  Add <strong className="text-teal-700">{formatPrice(freeShippingLeft)}</strong> more to get Free Delivery!
                </span>
              )}
            </span>
            <span className="font-mono text-slate-500">{freeShippingProgress}%</span>
          </div>

          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-teal-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Cart Items & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.productId}_${item.variantId || 'def'}`}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      item.type === 'digital' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {item.type}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-1">{item.name}</h3>
                  <span className="text-xs font-mono font-bold text-slate-700 mt-1 block">
                    {formatPrice(item.price)} each
                  </span>
                </div>
              </div>

              {/* Quantity Stepper & Line Total */}
              <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-8">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 px-2 py-1">
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.productId, item.quantity - 1, item.variantId)}
                    className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-xs text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.productId, item.quantity + 1, item.variantId)}
                    className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 font-mono block">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId, item.variantId)}
                    className="text-[11px] text-rose-500 hover:underline flex items-center space-x-1 mt-0.5 ml-auto"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setCurrentView('shop')}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-teal-700 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h3>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({orderSummary.subtotal > 0 ? cart.length : 0} items)</span>
                <span className="font-mono font-semibold text-slate-900">
                  {formatPrice(orderSummary.subtotal)}
                </span>
              </div>

              {orderSummary.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span className="flex items-center space-x-1">
                    <Tag className="w-3 h-3" />
                    <span>Coupon Discount</span>
                  </span>
                  <span className="font-mono font-bold">
                    -{formatPrice(orderSummary.discountAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge</span>
                <span className="font-mono font-semibold text-slate-900">
                  {!orderSummary.hasPhysicalItems ? (
                    <span className="text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded text-[11px] border border-teal-200">
                      FREE (Digital Vault)
                    </span>
                  ) : orderSummary.shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatPrice(orderSummary.shippingFee)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Total Amount</span>
                  <span className="text-[10px] text-slate-400">All Bangladesh VAT included</span>
                </div>
                <span className="text-xl font-extrabold text-slate-900 font-mono">
                  {formatPrice(orderSummary.totalAmount)}
                </span>
              </div>
            </div>

            {/* Coupon Application Form */}
            <div className="pt-3 border-t border-slate-100">
              {appliedCoupon ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Coupon: <strong>{appliedCoupon.code}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="p-1 hover:bg-emerald-100 rounded text-emerald-700"
                    aria-label="Remove coupon"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. EID2026)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Checkout Action Button */}
            <button
              type="button"
              onClick={() => setCurrentView('checkout')}
              className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Official 100% Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
