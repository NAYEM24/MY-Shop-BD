import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  MapPin,
  Phone,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedCategorySlug, showToast } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    if (!newsletterConsent) {
      showToast('Please accept the newsletter consent to continue.', 'error');
      return;
    }

    setNewsletterSubscribed(true);
    showToast('Subscribed! Thank you for joining MY SHOP BD updates.', 'success');
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      {/* 1. Value Propositions Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <Truck className="w-6 h-6 text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white">All-Bangladesh Delivery</h4>
              <p className="text-xs text-slate-400 mt-1">
                Dhaka 24-48 hours, all 64 districts nationwide within 3-5 days.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <Lock className="w-6 h-6 text-sky-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white">bKash & Nagad Verified</h4>
              <p className="text-xs text-slate-400 mt-1">
                Official merchant checkout with server-side transaction verification.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white">100% Authentic Guarantee</h4>
              <p className="text-xs text-slate-400 mt-1">
                Direct authorized imports and verified Bangladeshi heritage goods.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <Headphones className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white">Live Customer Support</h4>
              <p className="text-xs text-slate-400 mt-1">
                Direct hotline & email assistance 7 days a week from 9 AM to 10 PM.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation & Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500 text-slate-950 font-extrabold flex items-center justify-center text-base">
                BD
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">MY SHOP BD</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              MY SHOP BD is a premier Bangladeshi retail & digital commerce platform delivering high-fidelity smart devices, genuine heritage textiles, scientific laboratory instruments, and instant digital study bundles to customers across Bangladesh.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>Level 8, Concord Tower, Gulshan-2, Dhaka 1212, Bangladesh</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>+880 1711-000999 (Toll-free inside BD)</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>support@myshopbd.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Categories</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategorySlug('electronics');
                    setCurrentView('category');
                  }}
                  className="hover:text-teal-400 transition-colors"
                >
                  Smart Electronics
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategorySlug('science-lab');
                    setCurrentView('category');
                  }}
                  className="hover:text-teal-400 transition-colors"
                >
                  Bioscience & Lab Gear
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategorySlug('heritage-fashion');
                    setCurrentView('category');
                  }}
                  className="hover:text-teal-400 transition-colors"
                >
                  Heritage Fashion
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategorySlug('digital-products');
                    setCurrentView('category');
                  }}
                  className="hover:text-teal-400 transition-colors"
                >
                  Digital E-Books & PDFs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategorySlug('organic-living');
                    setCurrentView('category');
                  }}
                  className="hover:text-teal-400 transition-colors"
                >
                  Sylhet Tea & Organic
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Customer Support</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button type="button" onClick={() => setCurrentView('orders')} className="hover:text-teal-400">
                  Track My Order
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setCurrentView('digital-library')} className="hover:text-teal-400 font-medium text-teal-300">
                  My Digital Library
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setCurrentView('policy-shipping')} className="hover:text-teal-400">
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setCurrentView('policy-return')} className="hover:text-teal-400">
                  Return & Refund Policy
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setCurrentView('policy-privacy')} className="hover:text-teal-400">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setCurrentView('policy-terms')} className="hover:text-teal-400">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setCurrentView('faq')} className="hover:text-teal-400">
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Newsletter & Offers</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe to get exclusive discount coupon codes, seasonal sales, and science updates.
            </p>

            {newsletterSubscribed ? (
              <div className="p-3 bg-teal-950/80 border border-teal-800 rounded-xl flex items-center space-x-2 text-teal-300 text-xs">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>You are subscribed to MY SHOP BD updates!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2.5">
                <div className="flex">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-l-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-500 text-white px-3.5 py-2 rounded-r-xl text-xs font-semibold flex items-center justify-center transition-colors"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <label className="flex items-start space-x-2 text-[11px] text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newsletterConsent}
                    onChange={(e) => setNewsletterConsent(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-900 text-teal-500 focus:ring-teal-500"
                  />
                  <span>I agree to receive promotional updates and store announcements.</span>
                </label>
              </form>
            )}

            {/* Payment Logos Pill */}
            <div className="pt-3">
              <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider mb-2">
                Supported Payments:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                <span className="bg-pink-900/40 text-pink-300 border border-pink-700/60 px-2 py-0.5 rounded">
                  bKash
                </span>
                <span className="bg-orange-900/40 text-orange-300 border border-orange-700/60 px-2 py-0.5 rounded">
                  Nagad
                </span>
                <span className="bg-emerald-900/40 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded">
                  Cash on Delivery
                </span>
                <span className="bg-blue-900/40 text-blue-300 border border-blue-700/60 px-2 py-0.5 rounded">
                  Cards
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal & Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 MY SHOP BD Ltd. All rights reserved. Built with pride for Bangladesh.</p>
        <div className="flex items-center space-x-4">
          <button type="button" onClick={() => setCurrentView('policy-privacy')} className="hover:text-slate-400">
            Privacy
          </button>
          <span>•</span>
          <button type="button" onClick={() => setCurrentView('policy-terms')} className="hover:text-slate-400">
            Terms
          </button>
          <span>•</span>
          <button type="button" onClick={() => setCurrentView('admin-login')} className="hover:text-amber-400 font-mono">
            Admin Access
          </button>
        </div>
      </div>
    </footer>
  );
};
